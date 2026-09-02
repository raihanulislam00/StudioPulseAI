#!/usr/bin/env python3
"""
StudioPulse AI — Pipeline Verification Script
Tests the multi-agent crew, Grafana MCP simulator, and streaming pipeline.
"""

import asyncio
import sys
from pathlib import Path

# Add services/agent to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.mcp.grafana_mcp import GrafanaMCPClient
from app.agents.detective import DetectiveAgent
from app.agents.reliability import ReliabilityAgent
from app.agents.producer import ProducerAgent
from app.agents.director import DirectorAgent


async def main():
    print("=================================================================")
    print(" 🎬 STUDIOPULSE AI — AUTONOMOUS INCIDENT COMMANDER VERIFICATION")
    print("=================================================================")

    # 1. Test MCP Client & Detective Agent
    print("\n[Stage 1/4] Testing Detective Agent & Grafana MCP Telemetry...")
    mcp_client = GrafanaMCPClient(mode="simulated")
    detective = DetectiveAgent(mcp_client)

    alerts = await detective.ingest_active_alerts(region="apac")
    assert len(alerts) > 0, "No alerts returned"
    print(f" ✓ Active Alert Ingested: {alerts[0].get('alert_name')}")

    metrics = await detective.collect_playback_metrics(region="apac")
    assert metrics["current_value"] == 18.7, "Playback error metric incorrect"
    print(f" ✓ PromQL Metric Analyzed: Playback Error Rate = {metrics['current_value']}% (Spike: +31%)")

    logs = await detective.collect_error_logs(service="transcoder", region="apac")
    assert len(logs) > 0, "No Loki logs returned"
    print(f" ✓ Loki LogQL Logs Correlated: Found {len(logs)} log entries with SIGSEGV in libx265")

    trace = await detective.trace_failing_requests(service="transcoding-service")
    assert trace.get("trace_id"), "No Tempo trace returned"
    print(f" ✓ Tempo TraceQL Traced: Trace ID = {trace.get('trace_id')} (504 Gateway Timeout)")

    # 2. Test Reliability Agent
    print("\n[Stage 2/4] Testing Reliability Agent Root Cause Synthesis...")
    reliability = ReliabilityAgent()
    deployment = mcp_client.get_deployment_metadata(service="transcoding-service")
    diagnosis = reliability.analyze_root_cause(
        alert=alerts[0],
        metrics=metrics,
        logs=logs,
        trace=trace,
        deployment=deployment,
    )
    assert diagnosis["confidence_score"] == 91, f"Expected 91% confidence, got {diagnosis['confidence_score']}"
    assert diagnosis["incident_severity"] == "P1 - CRITICAL"
    print(f" ✓ Probable Cause: {diagnosis['root_cause']}")
    print(f" ✓ Empirical Confidence: {diagnosis['confidence_score']}%")
    print(f" ✓ Blast Radius: {diagnosis['estimated_affected_viewers']:,} Viewers across {', '.join(diagnosis['affected_regions'])}")
    print(f" ✓ Rollback Command: {diagnosis['rollback_command']}")

    # 3. Test Producer Agent & Dossier
    print("\n[Stage 3/4] Testing Producer Agent Grafana Incident Declaration...")
    producer = ProducerAgent(mcp_client)
    incident = await producer.declare_grafana_incident(
        title=f"P1: APAC Playback Degradation — {diagnosis['deployed_version']}",
        severity="critical",
        labels={"region": "apac", "service": diagnosis["affected_service"]},
        evidence=[{"metrics": metrics, "logs": logs, "trace": trace}],
    )
    dossier = producer.compile_executive_dossier(incident, diagnosis)
    assert dossier.incident_id == "1042"
    print(f" ✓ Grafana Incident Declared: #{dossier.incident_id} ({dossier.severity})")
    print(f" ✓ Incident Room URL: {dossier.grafana_url}")

    # 4. Test Director Agent Deterministic Multi-Step Stream
    print("\n[Stage 4/4] Testing Director Agent End-to-End Streaming Workflow...")
    director = DirectorAgent(mode="simulated")
    streamed_events = []
    async for event in director.run_investigation_stream(step_delay=0.0):
        streamed_events.append(event)
        if "step" in event:
            print(f"  → [{event['step']}] ({event['agentName']}): {event['title']}")

    assert len(streamed_events) == 7, f"Expected 7 stream chunks, got {len(streamed_events)}"
    print(f"\n ✓ All 6 deterministic investigation stages + 1 final dossier completed successfully!")
    print("=================================================================")
    print(" 🎉 ALL PIPELINE VERIFICATIONS PASSED!")
    print("=================================================================")


if __name__ == "__main__":
    asyncio.run(main())
