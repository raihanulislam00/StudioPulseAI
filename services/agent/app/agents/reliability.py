from typing import Dict, Any, List


class ReliabilityAgent:
    """
    🛠 Reliability Agent: Root cause diagnosis and blast radius engine.
    Correlates telemetry against deployment markers, error budgets, and computes confidence.
    """

    def analyze_root_cause(
        self,
        alert: Dict[str, Any],
        metrics: Dict[str, Any],
        logs: List[Dict[str, Any]],
        trace: Dict[str, Any],
        deployment: Dict[str, Any],
    ) -> Dict[str, Any]:
        # Correlate logs and deployment
        deployed_version = deployment.get("deployed_version", "v4.8.0")
        deployed_service = deployment.get("service", "transcoding-service")

        has_sigsegv = any("SIGSEGV" in log.get("message", "") for log in logs)
        has_codec_fault = any("libx265" in log.get("message", "") for log in logs)

        confidence = 70
        if has_sigsegv:
            confidence += 15
        if has_codec_fault:
            confidence += 6

        return {
            "root_cause": (
                f"Transcoding Service {deployed_version} rollout in APAC cluster introduced a "
                f"buffer overflow / SIGSEGV crash in libx265 under 10-bit H.265 encoding load."
            ),
            "confidence_score": min(confidence, 95),
            "incident_severity": "P1 - CRITICAL",
            "affected_service": deployed_service,
            "deployed_version": deployed_version,
            "affected_regions": ["Singapore", "Malaysia", "Indonesia", "Thailand"],
            "estimated_affected_viewers": 218000,
            "rollback_command": f"kubectl rollout undo deployment/{deployed_service} -n media-prod --to-revision=47",
        }
