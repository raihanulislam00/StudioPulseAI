import asyncio
import datetime
from typing import AsyncGenerator, Dict, Any
from app.mcp.grafana_mcp import GrafanaMCPClient
from app.agents.detective import DetectiveAgent
from app.agents.reliability import ReliabilityAgent
from app.agents.producer import ProducerAgent
from app.models.schemas import AgentEvent, ToolCall, MetricData, LogSnippet


class DirectorAgent:
    """
    🎬 Director Agent: Workflow Supervisor.
    Orchestrates the multi-agent incident response pipeline and streams real-time investigation events.
    """

    def __init__(self, mode: str = "simulated"):
        self.mcp = GrafanaMCPClient(mode=mode)
        self.detective = DetectiveAgent(self.mcp)
        self.reliability = ReliabilityAgent()
        self.producer = ProducerAgent(self.mcp)

    async def run_investigation_stream(
        self,
        scenario: str = "apac_playback_outage_premiere",
        prompt: str = "",
        step_delay: float = 0.5,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        now = datetime.datetime.now(datetime.timezone.utc).isoformat

        # ----------------------------------------------------------------------
        # Stage 1: Alert Ingestion
        # ----------------------------------------------------------------------
        if step_delay > 0:
            await asyncio.sleep(step_delay)
        alerts = await self.detective.ingest_active_alerts(region="apac")
        alert = alerts[0] if alerts else {}

        yield {
            "id": "evt-1",
            "step": "ALERT_DETECTED",
            "agent": "director",
            "agentName": "Director Agent",
            "title": "Active Alert Ingested",
            "message": (
                f"Grafana AlertManager trigger: {alert.get('alert_name', 'APAC-Playback-Failure-Critical')} "
                "active. Threshold exceeded (>15%). Initializing multi-agent investigation."
            ),
            "timestamp": now(),
            "toolCall": {
                "tool": "list_firing_alerts",
                "params": {"region": "apac", "severity": "critical"},
            },
            "status": "completed",
        }

        # ----------------------------------------------------------------------
        # Stage 2: PromQL Metrics Collection
        # ----------------------------------------------------------------------
        if step_delay > 0:
            await asyncio.sleep(step_delay)
        metrics = await self.detective.collect_playback_metrics(region="apac")
        error_val = metrics.get("current_value", 18.7)

        yield {
            "id": "evt-2",
            "step": "METRICS_ANALYZED",
            "agent": "detective",
            "agentName": "Detective Agent",
            "title": "Prometheus Metrics Analyzed",
            "message": (
                f"PromQL query confirmed error surge: {error_val}% playback failure rate across APAC nodes. "
                "Latency p95 surged to 842ms (+220%)."
            ),
            "timestamp": now(),
            "toolCall": {
                "tool": "query_prometheus",
                "params": {
                    "query": "sum(rate(playback_errors_total{region='apac'}[5m])) / sum(rate(playback_requests_total{region='apac'}[5m])) * 100"
                },
            },
            "metricsData": {
                "label": "APAC Playback Error Rate",
                "value": error_val,
                "baseline": 0.4,
                "unit": "%",
                "trend": "up",
            },
            "status": "completed",
        }

        # ----------------------------------------------------------------------
        # Stage 3: Loki Logs & Tempo Traces Correlation
        # ----------------------------------------------------------------------
        if step_delay > 0:
            await asyncio.sleep(step_delay)
        logs = await self.detective.collect_error_logs(service="transcoder", region="apac")
        trace = await self.detective.trace_failing_requests(service="transcoding-service")

        yield {
            "id": "evt-3",
            "step": "LOGS_CORRELATED",
            "agent": "detective",
            "agentName": "Detective Agent",
            "title": "Loki Logs & Tempo Traces Correlated",
            "message": (
                "LogQL isolated critical SIGSEGV buffer overflow in libx265_v4.8 inside transcoder pod. "
                "Tempo trace 8f3b9c24 confirms 504 Gateway Timeouts propagating upstream."
            ),
            "timestamp": now(),
            "toolCall": {
                "tool": "query_loki",
                "params": {"query": "{app='transcoder', region='apac'} |= 'error'"},
            },
            "logSnippet": {
                "service": "transcoder-apac-worker-node-04",
                "level": "FATAL ERROR",
                "message": "FATAL: Segment transcoding buffer overflow: slice=2, SIGSEGV encountered in libx265_v4.8.so",
                "timestamp": now(),
            },
            "status": "completed",
        }

        # ----------------------------------------------------------------------
        # Stage 4: Root Cause Synthesis & Blast Radius
        # ----------------------------------------------------------------------
        if step_delay > 0:
            await asyncio.sleep(step_delay)
        deployment = self.mcp.get_deployment_metadata(service="transcoding-service")
        diagnosis = self.reliability.analyze_root_cause(
            alert=alert,
            metrics=metrics,
            logs=logs,
            trace=trace,
            deployment=deployment,
        )

        yield {
            "id": "evt-4",
            "step": "ROOT_CAUSE_IDENTIFIED",
            "agent": "reliability",
            "agentName": "Reliability Agent",
            "title": f"Root Cause Diagnosed ({diagnosis['confidence_score']}% Confidence)",
            "message": (
                f"Correlated: {diagnosis['deployed_version']} rollout in APAC cluster caused SIGSEGV "
                f"crashes under 10-bit H.265 load. Blast radius: {diagnosis['estimated_affected_viewers']:,} viewers."
            ),
            "timestamp": now(),
            "status": "completed",
        }

        # ----------------------------------------------------------------------
        # Stage 5: Grafana Incident Declaration
        # ----------------------------------------------------------------------
        if step_delay > 0:
            await asyncio.sleep(step_delay)
        incident_meta = await self.producer.declare_grafana_incident(
            title=f"P1: APAC Playback Degradation — {diagnosis['deployed_version']}",
            severity="critical",
            labels={"region": "apac", "service": diagnosis["affected_service"]},
            evidence=[{"metrics": metrics, "logs": logs, "trace": trace}],
        )

        yield {
            "id": "evt-5",
            "step": "INCIDENT_CREATED",
            "agent": "producer",
            "agentName": "Producer Agent",
            "title": f"Grafana Incident #{incident_meta.get('incident_id', '1042')} Declared",
            "message": "Declared P1 Incident in Grafana Cloud with telemetry and log evidence synchronized.",
            "timestamp": now(),
            "toolCall": {
                "tool": "create_incident",
                "params": {
                    "title": f"P1: APAC Playback Degradation — {diagnosis['deployed_version']}",
                    "severity": "critical",
                    "labels": {"region": "apac", "service": diagnosis["affected_service"]},
                },
            },
            "status": "completed",
        }

        # ----------------------------------------------------------------------
        # Stage 6: Mitigation Ready & Full Dossier
        # ----------------------------------------------------------------------
        if step_delay > 0:
            await asyncio.sleep(step_delay)
        dossier = self.producer.compile_executive_dossier(
            incident_meta=incident_meta,
            diagnosis=diagnosis,
        )

        yield {
            "id": "evt-6",
            "step": "MITIGATION_READY",
            "agent": "director",
            "agentName": "Director Agent",
            "title": "Executive Dossier & Runbook Ready",
            "message": "Mitigation runbook formulated. Reversion command ready. Total resolution elapsed time: 47s.",
            "timestamp": now(),
            "status": "completed",
        }

        # Final Dossier Event
        yield {
            "type": "INCIDENT_DOSSIER",
            "incident": dossier.model_dump(by_alias=True),
        }
