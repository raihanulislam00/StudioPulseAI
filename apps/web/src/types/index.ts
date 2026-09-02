export type AgentType = "director" | "detective" | "reliability" | "producer";

export type InvestigationStepType =
  | "INIT"
  | "ALERT_DETECTED"
  | "METRICS_ANALYZED"
  | "LOGS_CORRELATED"
  | "TRACES_INVESTIGATED"
  | "ROOT_CAUSE_IDENTIFIED"
  | "INCIDENT_CREATED"
  | "MITIGATION_READY"
  | "COMPLETED";

export interface AgentEvent {
  id: string;
  step: InvestigationStepType;
  agent: AgentType;
  agentName: string;
  title: string;
  message: string;
  timestamp: string;
  toolCall?: {
    tool: string;
    params: Record<string, unknown>;
    result?: unknown;
  };
  metricsData?: {
    label: string;
    value: number;
    baseline: number;
    unit: string;
    trend: "up" | "down" | "flat";
  };
  logSnippet?: {
    service: string;
    level: string;
    message: string;
    timestamp: string;
  };
  status: "running" | "completed" | "error";
}

export interface BroadcastState {
  eventName: string;
  broadcastStatus: "STABLE" | "DEGRADED" | "CRITICAL";
  concurrentViewers: number;
  errorRate: number;
  latencyMs: number;
  cdnHealth: number;
  activeAlertsCount: number;
  region: string;
}

export interface IncidentDetails {
  incidentId: string;
  title: string;
  severity: "P1 - CRITICAL" | "P2 - HIGH" | "P3 - MODERATE";
  status: "DECLARED" | "INVESTIGATING" | "MITIGATING" | "RESOLVED";
  probableRootCause: string;
  confidenceScore: number;
  affectedService: string;
  affectedRegions: string[];
  estimatedAffectedViewers: number;
  deployedVersion: string;
  rollbackCommand: string;
  grafanaUrl: string;
  createdAt: string;
  executiveSummary: string;
  evidenceSnippets: {
    type: "metric" | "log" | "trace";
    title: string;
    query: string;
    summary: string;
  }[];
}
