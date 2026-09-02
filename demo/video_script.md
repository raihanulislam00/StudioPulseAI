# 🎬 StudioPulse AI — 3-Minute Hackathon Demo Script
**Google's Agentic Cinema Summer Blockbuster Hackathon — Grafana Track**

---

### **Video Overview (Total Run Time: 3:00)**
- **0:00 – 0:25**: Hook & Live Premiere Crisis (*"The Last Signal" Outage*)
- **0:25 – 1:15**: Autonomous Multi-Agent Investigation via Grafana MCP
- **1:15 – 1:50**: Root Cause Pinpointing & Automated Grafana Incident Creation
- **1:50 – 2:30**: Business & Viewer Impact (47 Seconds vs 30 Minutes Manual)
- **2:30 – 3:00**: Architecture, Google Cloud & Grafana Synthesis, Conclusion

---

### **Segment Breakdown**

#### **0:00 – 0:25 | Act I: The Crisis (Live Premiere)**
- **Visual**: StudioPulse AI Live Production Control Room UI. High-energy broadcast HUD showing *“The Last Signal - Live Premiere | 1.8M Viewers”*.
- **Speaker**:  
  > *"Welcome to StudioPulse AI. Right now, our media platform is streaming the live world premiere of 'The Last Signal' to 1.8 million concurrent viewers worldwide.*  
  > *(Sudden visual alert flashes red on HUD)*  
  > *Suddenly, disaster strikes. Playback errors in the APAC region spike to 18.7%, latency surges past 800ms, and 200,000 viewers are dropping off. Normally, this means panic: 10 open Grafana dashboards, frantic Slack calls, and 30 minutes of lost viewership.*  
  > *Instead, we activate StudioPulse AI."*

---

#### **0:25 – 1:15 | Act II: Autonomous Multi-Agent Investigation**
- **Visual**: The user clicks **“Investigate Incident”** or types *“Investigate APAC playback failures”*. The multi-agent workflow activates with real-time SSE streaming cards:
  - 🎬 **Director Agent** coordinates stages.
  - 🔎 **Detective Agent** calls Grafana MCP tools.
  - Telemetry graphs render live PromQL error curves and Loki log snippets.
- **Speaker**:  
  > *"Watch our multi-agent crew take command. The Director Agent initializes a deterministic investigation.  
  > The Detective Agent immediately calls Grafana Cloud MCP:  
  > 1. It queries `list_firing_alerts` and captures the `APAC-Playback-Failure-Critical` alert.  
  > 2. It queries Prometheus via `query_prometheus` using PromQL, isolating the error surge to the Singapore cluster.  
  > 3. Next, it queries Loki logs via `query_loki` and catches a critical SIGSEGV buffer overflow in the transcoding worker.  
  > 4. It queries Tempo traces via `query_tempo` to confirm 504 gateway timeouts at the edge packager."*

---

#### **1:15 – 1:50 | Act III: Root Cause & Incident Creation**
- **Visual**: 🛠 **Reliability Agent** card lights up with **91% Confidence**. 📝 **Producer Agent** executes `create_incident` and renders the clickable Grafana Incident link `#1042`.
- **Speaker**:  
  > *"Within seconds, the Reliability Agent correlates this telemetry with deployment logs. Just 12 minutes ago, Transcoder Service v4.8 was deployed with experimental 10-bit H.265 encoding.  
  > The diagnosis is unequivocal: Root Cause identified with 91% confidence.  
  > The Producer Agent now autonomously calls Grafana Incident MCP to declare a P1 Critical Incident, attaching the PromQL graphs and LogQL trace evidence directly into Grafana Cloud."*

---

#### **1:50 – 2:30 | Act IV: The Impact (47s vs 30 Minutes)**
- **Visual**: The HUD displays the **Executive Debrief & Mitigation Deck**:
  - Rollback Command ready: `kubectl rollout undo deployment/transcoding-service`
  - Split-screen comparison card: **Before StudioPulse (30 mins, 400K lost viewers)** vs **After StudioPulse (47 seconds, zero lost revenue)**.
- **Speaker**:  
  > *"StudioPulse doesn't just diagnose; it arms the Incident Commander with an immediate rollback runbook and one-click traffic diversion.  
  > Let's look at the numbers:  
  > A traditional manual investigation takes 30 minutes and costs millions in churn.  
  > StudioPulse AI completed the entire cycle in 47 seconds across 8 precise MCP tool calls."*

---

#### **2:30 – 3:00 | Act V: Architecture & Google Cloud Integration**
- **Visual**: Architecture slide highlighting Google Gemini 2.5 Flash, Google ADK, Google Cloud Run, and Grafana Cloud MCP.
- **Speaker**:  
  > *"StudioPulse AI is powered by Google Gemini and the Google Agent Development Kit (ADK), containerized on Google Cloud Run, and driven by the official Grafana Cloud MCP server.  
  > By combining Google Cloud's agent platform with Grafana's industry-standard observability, we bring true autonomous reliability to live entertainment.  
  > From alert to action in seconds. Thank you."*
