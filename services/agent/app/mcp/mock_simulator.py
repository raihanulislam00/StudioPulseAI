import json
import os
from pathlib import Path
from typing import Dict, Any, List


class MockGrafanaSimulator:
    def __init__(self, scenario_path: str = None):
        if not scenario_path:
            candidates = [
                Path.cwd() / "demo" / "scenarios" / "apac_playback_outage.json",
                Path(__file__).resolve().parents[4] / "demo" / "scenarios" / "apac_playback_outage.json" if len(Path(__file__).resolve().parents) > 4 else None,
                Path(__file__).resolve().parents[3] / "demo" / "scenarios" / "apac_playback_outage.json" if len(Path(__file__).resolve().parents) > 3 else None,
            ]
            for p in candidates:
                if p and p.exists():
                    scenario_path = str(p)
                    break

        self.scenario_data: Dict[str, Any] = {}
        if scenario_path and os.path.exists(scenario_path):
            with open(scenario_path, "r", encoding="utf-8") as f:
                self.scenario_data = json.load(f)

    def list_firing_alerts(self, region: str = "apac") -> List[Dict[str, Any]]:
        alert = self.scenario_data.get("alert", {})
        if alert:
            return [alert]
        return [
            {
                "alert_name": "APAC-Playback-Failure-Critical",
                "status": "firing",
                "severity": "critical",
                "labels": {"region": "apac", "service": "transcoding-service"},
            }
        ]

    def query_prometheus(self, query: str) -> Dict[str, Any]:
        prom = self.scenario_data.get("telemetry", {}).get("prometheus", {})
        if "playback_error" in query.lower():
            return prom.get("playback_error_rate", {"current_value": 18.7, "unit": "%"})
        elif "latency" in query.lower() or "duration" in query.lower():
            return prom.get("egress_latency_p95", {"current_value": 842, "unit": "ms"})
        elif "viewers" in query.lower():
            return prom.get("active_viewers", {"current_value": 412000})
        return {"status": "success", "data": {"result": [{"value": [1725312000, "18.7"]}]}}

    def query_loki(self, query: str) -> List[Dict[str, Any]]:
        loki = self.scenario_data.get("telemetry", {}).get("loki", {})
        return loki.get("entries", [])

    def query_tempo(self, query: str) -> Dict[str, Any]:
        tempo = self.scenario_data.get("telemetry", {}).get("tempo", {})
        return tempo

    def search_dashboards(self, query: str) -> List[Dict[str, Any]]:
        return [
            {
                "id": 401,
                "uid": "live-apac-stream",
                "title": "Live Stream APAC Core Delivery",
                "url": "https://studiopulse.grafana.net/d/live-apac-stream/live-stream-apac-core-delivery",
            }
        ]

    def create_incident(self, title: str, severity: str, labels: Dict[str, str]) -> Dict[str, Any]:
        return {
            "incident_id": "1042",
            "title": title,
            "severity": severity,
            "status": "active",
            "url": "https://studiopulse.grafana.net/a/grafana-incident-app/incidents/1042",
            "labels": labels,
        }

    def attach_incident_evidence(self, incident_id: str, evidence: Any) -> Dict[str, Any]:
        return {
            "status": "attached",
            "incident_id": incident_id,
            "evidence_count": len(evidence) if isinstance(evidence, list) else 1,
        }

    def get_deployment_info(self, service: str = "transcoding-service") -> Dict[str, Any]:
        return self.scenario_data.get("deployment", {})
