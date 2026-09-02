import datetime
from typing import Dict, Any, List
from app.mcp.grafana_mcp import GrafanaMCPClient
from app.models.schemas import IncidentDossier, EvidenceSnippet


class ProducerAgent:
    """
    📝 Producer Agent: Incident synchronization & executive communications.
    Declares incidents in Grafana Cloud and compiles executive debriefs.
    """

    def __init__(self, mcp_client: GrafanaMCPClient):
        self.mcp = mcp_client

    async def declare_grafana_incident(
        self,
        title: str,
        severity: str,
        labels: Dict[str, str],
        evidence: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        incident = await self.mcp.create_incident(
            title=title,
            severity=severity,
            labels=labels,
        )
        await self.mcp.attach_incident_evidence(
            incident_id=incident.get("incident_id", "1042"),
            evidence=evidence,
        )
        return incident

    def compile_executive_dossier(
        self,
        incident_meta: Dict[str, Any],
        diagnosis: Dict[str, Any],
    ) -> IncidentDossier:
        evidence_snippets = [
            EvidenceSnippet(
                type="metric",
                title="APAC Playback Error Rate Spike",
                query="sum(rate(playback_errors_total{region='apac'}[5m])) / sum(rate(playback_requests_total{region='apac'}[5m])) * 100",
                summary="Error rate spiked to 18.7%, breaching the 15% SLA threshold across APAC edge nodes.",
            ),
            EvidenceSnippet(
                type="log",
                title="Loki SIGSEGV Transcoding Crash",
                query="{app='transcoder', region='apac'} |= 'error'",
                summary="FATAL: Buffer overflow in libx265_v4.8 during 10-bit H.265 encoding in worker-node-04.",
            ),
            EvidenceSnippet(
                type="trace",
                title="Tempo Trace Gateway Timeout",
                query="{ span.status = error && service.name = 'transcoding-service' }",
                summary="5002ms duration timeout propagating to API gateway chunk delivery.",
            ),
        ]

        return IncidentDossier(
            incident_id=incident_meta.get("incident_id", "1042"),
            title=f"P1: APAC Playback Degradation — {diagnosis['deployed_version']} Rollout Crash",
            severity="P1 - CRITICAL",
            status="DECLARED",
            probable_root_cause=diagnosis["root_cause"],
            confidence_score=diagnosis["confidence_score"],
            affected_service=diagnosis["affected_service"],
            affected_regions=diagnosis["affected_regions"],
            estimated_affected_viewers=diagnosis["estimated_affected_viewers"],
            deployed_version=diagnosis["deployed_version"],
            rollback_command=diagnosis["rollback_command"],
            grafanaUrl=incident_meta.get("url", "https://studiopulse.grafana.net/a/grafana-incident-app/incidents/1042"),
            created_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            executive_summary=(
                "During the global live premiere of 'The Last Signal', an automated canary rollout of "
                "Transcoding Service v4.8 caused 504 Gateway Timeouts and segment packet drops for 218K viewers in APAC. "
                "StudioPulse AI diagnosed the root cause in 47 seconds, declared Grafana Incident #1042, and generated an instant rollback command."
            ),
            evidence_snippets=evidence_snippets,
        )
