# StudioPulse AI — Architecture Documentation
**The Autonomous AI Incident Commander for Live Media & Entertainment Platforms**

Built for **Google's Agentic Cinema Summer Blockbuster Hackathon — Grafana Track**.

---

## 1. Executive Summary

StudioPulse AI is an enterprise-grade autonomous incident-response platform designed for high-stakes live media streaming events (e.g., world premieres, live sports, concert streams). 

When playback degradation occurs during a multi-million-viewer broadcast, traditional SRE workflows require engineers to navigate dozens of dashboards, search millions of log lines, and manually piece together traces across distributed microservices.

StudioPulse AI replaces this slow, high-stress, error-prone manual triage with a deterministic multi-agent incident response system powered by **Google Gemini (via Google ADK)** and **Grafana Cloud via the Model Context Protocol (MCP)**.

---

## 2. System Architecture

```
                                  +-------------------------------------------------------+
                                  |                    STUDIOPULSE AI                     |
                                  |            Live Production Control Room               |
                                  |           (Next.js 15 / Tailwind / Framer)            |
                                  +---------------------------+---------------------------+
                                                              |
                                               Server-Sent Events (SSE) Stream
                                                              |
                                                              v
                                  +-------------------------------------------------------+
                                  |               FASTAPI AGENT SERVER                     |
                                  |       (Python 3.11+ / Google ADK Framework)           |
                                  +---------------------------+---------------------------+
                                                              |
                                                              v
                                  +-------------------------------------------------------+
                                  |                🎬 DIRECTOR AGENT                      |
                                  |         Deterministic Workflow Orchestrator           |
                                  +-------+-------------------+-------------------+-------+
                                          |                   |                   |
                     +--------------------+                   |                   +--------------------+
                     v                                        v                                        v
+-----------------------------------------+  +---------------------------------+  +-----------------------------------------+
|           🔎 DETECTIVE AGENT            |  |      🛠 RELIABILITY AGENT       |  |           📝 PRODUCER AGENT             |
|    Observability & Telemetry Search     |  | Root Cause & Confidence Engine  |  |    Incident Declaration & Reporting     |
+--------------------+--------------------+  +----------------+----------------+  +--------------------+--------------------+
                     |                                        |                                        |
                     +----------------------------------------+----------------------------------------+
                                                              |
                                                              v
                                  +-------------------------------------------------------+
                                  |               GRAFANA MCP CLIENT ADAPTER              |
                                  |      (Supports Live MCP & High-Fidelity Simulator)    |
                                  +---------------------------+---------------------------+
                                                              |
                                                    JSON-RPC / MCP Protocol
                                                              |
                                                              v
                                  +-------------------------------------------------------+
                                  |                GRAFANA CLOUD PLATFORM                 |
                                  |   Prometheus (PromQL) | Loki (LogQL) | Tempo (TraceQL)|
                                  |   Alertmanager        | Grafana Incident Management   |
                                  +-------------------------------------------------------+
```

---

## 3. Multi-Agent Crew Roles & Responsibilities

### 🎬 1. Director Agent (Workflow Supervisor)
- **Model**: `gemini-2.5-flash`
- **Role**: Coordinates the entire lifecycle of the investigation. Enforces the deterministic 6-phase state machine: Alert Ingestion $\rightarrow$ Telemetry Collection $\rightarrow$ Correlation $\rightarrow$ Root Cause Diagnosis $\rightarrow$ Incident Declaration $\rightarrow$ Executive Briefing.
- **Output**: Real-time structured streaming events to the frontend UI.

### 🔎 2. Detective Agent (Observability Specialist)
- **Role**: Dispatched by the Director to probe Grafana Cloud using MCP tools:
  - `list_firing_alerts`: Isolate active alert definitions and threshold violations.
  - `query_prometheus`: Retrieve time-series metrics (5xx error rates, p95 latency, CDN bandwidth).
  - `query_loki`: Search application logs from transcoding pods, edge packaging, and CDN origin.
  - `query_tempo`: Trace distributed requests across microservices to isolate downstream latency bottlenecks.

### 🛠 3. Reliability Agent (Root Cause & Blast Radius)
- **Role**: Synthesizes the telemetry gathered by the Detective Agent against deployment markers and infrastructure topologies.
  - Correlates error spikes with recent canary deployments (e.g., Transcoder v4.8 rollout).
  - Calculates viewer blast radius (percentage of total audience affected and geographic distribution).
  - Computes empirical confidence score ($0-100\%$) based on evidence weight.

### 📝 4. Producer Agent (Incident Commander & Executive Comms)
- **Role**: Executes external synchronization:
  - Calls Grafana MCP `create_incident` to declare a P1 incident in Grafana Cloud with severity tags.
  - Calls `attach_incident_evidence` to embed PromQL charts and LogQL snippets into the Grafana Incident room.
  - Generates the executive debrief and automated rollback runbook commands.

---

## 4. Dual-Mode Telemetry Architecture

To ensure flawless judging and seamless local development, StudioPulse AI features a **Dual-Mode Telemetry Adapter**:

1. **Live Mode (`GRAFANA_MCP_MODE=live`)**:
   Connects directly to your Grafana Cloud instance via the `mcp-grafana` server using your Service Account token.
2. **Simulated Mode (`GRAFANA_MCP_MODE=simulated`)**:
   Runs a high-fidelity live streaming incident simulator (*"The Last Signal" APAC premiere outage*). Generates realistic PromQL time-series, Loki log streams with H.265 codec faults, and Tempo trace spans. Ideal for zero-dependency hackathon demonstrations.

---

## 5. Security & Secret Management

- **Least-Privilege Grafana Access**: The Service Account token only has access to read alerts, datasources, and write incidents.
- **Zero Secrets Committed**: All environment variables are strictly managed through `.env` files protected by `.gitignore`.
- **Google Cloud Run Identity**: Cloud Run backend authenticates using Workload Identity or Service Account credentials securely mounted via Google Cloud Secret Manager.
