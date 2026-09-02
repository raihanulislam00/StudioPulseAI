from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class InvestigationRequest(BaseModel):
    scenario: str = "apac_playback_outage_premiere"
    mode: str = "simulated"  # 'live' or 'simulated'
    prompt: Optional[str] = "Investigate APAC playback failures during 'The Last Signal' premiere"


class ToolCall(BaseModel):
    tool: str
    params: Dict[str, Any] = Field(default_factory=dict)
    result: Optional[Any] = None


class MetricData(BaseModel):
    label: str
    value: float
    baseline: float
    unit: str
    trend: str = "up"


class LogSnippet(BaseModel):
    service: str
    level: str
    message: str
    timestamp: str


class AgentEvent(BaseModel):
    id: str
    step: str
    agent: str  # director, detective, reliability, producer
    agent_name: str
    title: str
    message: str
    timestamp: str
    tool_call: Optional[ToolCall] = None
    metrics_data: Optional[MetricData] = None
    log_snippet: Optional[LogSnippet] = None
    status: str = "completed"


class EvidenceSnippet(BaseModel):
    type: str  # metric, log, trace
    title: str
    query: str
    summary: str


class IncidentDossier(BaseModel):
    incident_id: str = Field(..., alias="incidentId")
    title: str
    severity: str
    status: str
    probable_root_cause: str = Field(..., alias="probableRootCause")
    confidence_score: int = Field(..., alias="confidenceScore")
    affected_service: str = Field(..., alias="affectedService")
    affected_regions: List[str] = Field(..., alias="affectedRegions")
    estimated_affected_viewers: int = Field(..., alias="estimatedAffectedViewers")
    deployed_version: str = Field(..., alias="deployedVersion")
    rollback_command: str = Field(..., alias="rollbackCommand")
    grafana_url: str = Field(..., alias="grafanaUrl")
    created_at: str = Field(..., alias="createdAt")
    executive_summary: str = Field(..., alias="executiveSummary")
    evidence_snippets: List[EvidenceSnippet] = Field(..., alias="evidenceSnippets")

    model_config = {
        "populate_by_name": True,
        "serialize_by_alias": True,
    }
