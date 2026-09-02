import pytest
import asyncio
from app.mcp.grafana_mcp import GrafanaMCPClient
from app.agents.detective import DetectiveAgent
from app.agents.reliability import ReliabilityAgent
from app.agents.producer import ProducerAgent
from app.agents.director import DirectorAgent


@pytest.mark.asyncio
async def test_detective_agent():
    client = GrafanaMCPClient(mode="simulated")
    detective = DetectiveAgent(client)

    alerts = await detective.ingest_active_alerts(region="apac")
    assert len(alerts) > 0
    assert alerts[0]["alert_name"] == "APAC-Playback-Failure-Critical"

    metrics = await detective.collect_playback_metrics(region="apac")
    assert metrics["current_value"] == 18.7

    logs = await detective.collect_error_logs(service="transcoder", region="apac")
    assert len(logs) > 0
    assert any("SIGSEGV" in log["message"] for log in logs)


def test_reliability_agent():
    reliability = ReliabilityAgent()
    diagnosis = reliability.analyze_root_cause(
        alert={"severity": "critical"},
        metrics={"current_value": 18.7},
        logs=[{"message": "FATAL: buffer overflow SIGSEGV in libx265_v4.8"}],
        trace={"duration_ms": 5012},
        deployment={"deployed_version": "v4.8.0", "service": "transcoding-service"},
    )

    assert diagnosis["confidence_score"] >= 90
    assert "transcoding-service" in diagnosis["rollback_command"]
    assert diagnosis["incident_severity"] == "P1 - CRITICAL"


@pytest.mark.asyncio
async def test_director_agent_stream():
    director = DirectorAgent(mode="simulated")
    events = []

    async for event in director.run_investigation_stream():
        events.append(event)

    # 6 stages + 1 final dossier = 7 events
    assert len(events) == 7
    steps = [e.get("step") for e in events if "step" in e]
    assert steps == [
        "ALERT_DETECTED",
        "METRICS_ANALYZED",
        "LOGS_CORRELATED",
        "ROOT_CAUSE_IDENTIFIED",
        "INCIDENT_CREATED",
        "MITIGATION_READY",
    ]

    last_event = events[-1]
    assert last_event["type"] == "INCIDENT_DOSSIER"
    assert last_event["incident"]["confidenceScore"] == 91
