from typing import Dict, Any, List
from app.mcp.grafana_mcp import GrafanaMCPClient


class DetectiveAgent:
    """
    🔎 Detective Agent: Observability specialist.
    Queries Grafana Cloud MCP for alerts, Prometheus metrics, Loki logs, and Tempo traces.
    """

    def __init__(self, mcp_client: GrafanaMCPClient):
        self.mcp = mcp_client

    async def ingest_active_alerts(self, region: str = "apac") -> List[Dict[str, Any]]:
        return await self.mcp.list_firing_alerts(region=region)

    async def collect_playback_metrics(self, region: str = "apac") -> Dict[str, Any]:
        promql = f"sum(rate(playback_errors_total{{region='{region}'}}[5m])) / sum(rate(playback_requests_total{{region='{region}'}}[5m])) * 100"
        return await self.mcp.query_prometheus(promql)

    async def collect_error_logs(self, service: str = "transcoder", region: str = "apac") -> List[Dict[str, Any]]:
        logql = f"{{app='{service}', region='{region}'}} |= 'error'"
        return await self.mcp.query_loki(logql)

    async def trace_failing_requests(self, service: str = "transcoding-service") -> Dict[str, Any]:
        traceql = f"{{ span.status = error && service.name = '{service}' }}"
        return await self.mcp.query_tempo(traceql)
