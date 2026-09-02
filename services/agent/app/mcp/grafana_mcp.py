import logging
try:
    import httpx
except ImportError:
    httpx = None
from typing import Dict, Any, List, Optional
from app.config import settings
from app.mcp.mock_simulator import MockGrafanaSimulator

logger = logging.getLogger("studiopulse.mcp")


class GrafanaMCPClient:
    """
    Unified client for Grafana Cloud MCP integration.
    Supports live Grafana Cloud instance or the embedded live media telemetry simulator.
    """

    def __init__(self, mode: Optional[str] = None):
        self.mode = mode or settings.grafana_mcp_mode
        self.grafana_url = settings.grafana_url.rstrip("/")
        self.token = settings.grafana_service_account_token
        self.simulator = MockGrafanaSimulator()

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

    async def list_firing_alerts(self, region: str = "apac") -> List[Dict[str, Any]]:
        if self.mode == "live" and self.token:
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.get(
                        f"{self.grafana_url}/api/alertmanager/grafana/api/v2/alerts",
                        headers=self._headers(),
                    )
                    if resp.status_code == 200:
                        alerts = resp.json()
                        return [a for a in alerts if a.get("status", {}).get("state") == "active"]
            except Exception as e:
                logger.warning(f"Live Grafana alert query failed: {e}. Falling back to simulator.")

        return self.simulator.list_firing_alerts(region=region)

    async def query_prometheus(self, query: str) -> Dict[str, Any]:
        if self.mode == "live" and self.token:
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.get(
                        f"{self.grafana_url}/api/datasources/proxy/uid/prometheus/api/v1/query",
                        headers=self._headers(),
                        params={"query": query},
                    )
                    if resp.status_code == 200:
                        return resp.json()
            except Exception as e:
                logger.warning(f"Live PromQL query failed: {e}. Falling back to simulator.")

        return self.simulator.query_prometheus(query=query)

    async def query_loki(self, query: str) -> List[Dict[str, Any]]:
        if self.mode == "live" and self.token:
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.get(
                        f"{self.grafana_url}/api/datasources/proxy/uid/loki/loki/api/v1/query_range",
                        headers=self._headers(),
                        params={"query": query, "limit": 10},
                    )
                    if resp.status_code == 200:
                        return resp.json().get("data", {}).get("result", [])
            except Exception as e:
                logger.warning(f"Live LogQL query failed: {e}. Falling back to simulator.")

        return self.simulator.query_loki(query=query)

    async def query_tempo(self, query: str) -> Dict[str, Any]:
        if self.mode == "live" and self.token:
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.get(
                        f"{self.grafana_url}/api/datasources/proxy/uid/tempo/api/search",
                        headers=self._headers(),
                        params={"q": query, "limit": 5},
                    )
                    if resp.status_code == 200:
                        return resp.json()
            except Exception as e:
                logger.warning(f"Live Tempo query failed: {e}. Falling back to simulator.")

        return self.simulator.query_tempo(query=query)

    async def create_incident(self, title: str, severity: str, labels: Dict[str, str]) -> Dict[str, Any]:
        if self.mode == "live" and self.token:
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(
                        f"{self.grafana_url}/api/plugins/grafana-incident-app/resources/api/v1/incidents",
                        headers=self._headers(),
                        json={"title": title, "severity": severity, "labels": labels},
                    )
                    if resp.status_code in [200, 201]:
                        return resp.json()
            except Exception as e:
                logger.warning(f"Live incident creation failed: {e}. Falling back to simulator.")

        return self.simulator.create_incident(title=title, severity=severity, labels=labels)

    async def attach_incident_evidence(self, incident_id: str, evidence: Any) -> Dict[str, Any]:
        return self.simulator.attach_incident_evidence(incident_id=incident_id, evidence=evidence)

    def get_deployment_metadata(self, service: str = "transcoding-service") -> Dict[str, Any]:
        return self.simulator.get_deployment_info(service=service)
