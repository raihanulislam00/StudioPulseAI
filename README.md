# 🎬 StudioPulse AI
> **The Autonomous AI Incident Commander for Live Media & Entertainment Platforms**  
> *Built for Google's Agentic Cinema Summer Blockbuster Hackathon — Grafana Track*

[![Google Cloud Run](https://img.shields.io/badge/Google_Cloud-Cloud_Run-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![Google Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-8E75B2?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Grafana MCP](https://img.shields.io/badge/Grafana-Cloud_MCP-F46800?logo=grafana&logoColor=white)](https://grafana.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15_App_Router-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

---

## 🌟 The Scenario: "Premiere: The Last Signal"

Imagine a global entertainment platform streaming the live world premiere of **"The Last Signal"** to **1.8 million concurrent viewers**.

Suddenly:
- 🔴 Playback error rates spike to **18.7%** (+31%) across the APAC region (Singapore, Malaysia, Indonesia).
- ⏱️ Egress latency surges to **842ms** (+220%).
- 📉 Viewer drop-off spikes by **12%**.

Instead of an engineer manually juggling 10 dashboards, millions of log lines, and fragmented Slack channels for 30+ minutes, **StudioPulse AI** takes over as autonomous Incident Commander.

---

## ⚡ The 47-Second Autonomous Investigation

In **47 seconds**, StudioPulse AI executes a deterministic multi-agent investigation:

```
[ALERT DETECTED]   APAC-Playback-Failure-Critical
       │
       ▼
[COLLECT]          Queries Prometheus metrics (error rate 18.7%, APAC blast radius)
       │
       ▼
[CORRELATE]        Searches Loki logs (H.265 transcoding profile segfault) + Tempo traces (worker node-apac-04)
       │
       ▼
[DIAGNOSE]         Correlates with Transcoding Service v4.8 deployment (Confidence: 91%, Severity: P1)
       │
       ▼
[CREATE INCIDENT]  Declares P1 Incident #1042 in Grafana Cloud with evidence attached
       │
       ▼
[REPORT & MITIGATE]Dispatches executive debrief + one-click traffic rollback runbook
```

---

## 🏗️ Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │               STUDIOPULSE AI                 │
                    │         Live Production Control Room         │
                    │        (Next.js 15 / Tailwind / HUD)         │
                    └──────────────────────┬───────────────────────┘
                                           │ SSE Stream
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │          FASTAPI ADK AGENT SERVER            │
                    │            (Python / Google ADK)             │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                                 🎬 DIRECTOR AGENT
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
             🔎 DETECTIVE            🛠 RELIABILITY           📝 PRODUCER
                AGENT                   AGENT                   AGENT
             (Grafana MCP)          (Root Cause)            (Incidents)
                    │                      │                      │
                    └──────────────────────┼──────────────────────┘
                                           │
                                           ▼
                                    GRAFANA CLOUD
                            (Metrics, Logs, Traces, Alerts, Incidents)
```

---

## 🛠️ Multi-Agent Crew

| Agent | Icon | Role & Responsibility |
| :--- | :---: | :--- |
| **Director Agent** | 🎬 | Orchestrates the multi-step investigation pipeline and streams progress to the UI. |
| **Detective Agent** | 🔎 | Interfaces with Grafana MCP to query PromQL metrics, LogQL logs, and TraceQL spans. |
| **Reliability Agent** | 🛠 | Correlates telemetry against deployment markers and computes root cause confidence. |
| **Producer Agent** | 📝 | Creates the official Grafana Incident, attaches evidence, and generates the executive report. |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ & npm
- Python 3.11+
- (Optional) Grafana Cloud account with Service Account token (or run in built-in **Simulator Mode**)
- Google Gemini API Key

### 1. Clone & Configure
```bash
git clone https://github.com/your-username/studiopulse.git
cd studiopulse

# Copy environment template
cp .env.example .env
```

### 2. Launch Agent Backend (Python ADK)
```bash
cd services/agent
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Start agent service
uvicorn app.main:app --reload --port 8000
```

### 3. Launch Frontend Control Room (Next.js)
```bash
cd apps/web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to enter the **Live Production Control Room**.

---

## 🌐 Dual-Mode Telemetry Adapter
StudioPulse AI features a seamless dual-mode telemetry engine:
- **Live Mode**: Interacts in real time with your Grafana Cloud instance via the Model Context Protocol.
- **Simulated Mode**: High-fidelity live media streaming simulator (*"The Last Signal" APAC outage*) for zero-dependency judging evaluations.

---

## ☁️ Google Cloud Deployment
Both the frontend and agent backend are fully containerized and deployable to **Google Cloud Run** using Google Cloud Secret Manager for credentials.

```bash
# Deploy Backend to Cloud Run
gcloud run deploy studiopulse-agent \
  --source ./services/agent \
  --region us-central1 \
  --allow-unauthenticated

# Deploy Frontend to Cloud Run
gcloud run deploy studiopulse-web \
  --source ./apps/web \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 📜 License
Apache-2.0. Built for the Google Agentic Cinema Hackathon.
