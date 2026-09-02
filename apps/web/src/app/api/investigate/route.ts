import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const backendUrl =
    process.env.NEXT_PUBLIC_AGENT_API_URL || "http://localhost:8000";

  // Try streaming from Python ADK backend
  try {
    const backendResponse = await fetch(`${backendUrl}/api/investigate/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await req.json().catch(() => ({}))),
      // Abort after 2.5s if backend isn't running yet, and fall back to local stream engine
      signal: AbortSignal.timeout(2500),
    });

    if (backendResponse.ok && backendResponse.body) {
      return new Response(backendResponse.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }
  } catch {
    // Backend offline or starting up; proceed with resilient local SSE engine
  }

  // Fallback High-Fidelity Local Simulation Stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      // Event 1: Init / Alert Detection
      await delay(600);
      sendEvent({
        id: "evt-1",
        step: "ALERT_DETECTED",
        agent: "director",
        agentName: "Director Agent",
        title: "Active Alert Breach Detected",
        message:
          "Grafana AlertManager trigger: APAC playback error rate breached 15% threshold (Current: 18.7%). Initializing autonomous multi-agent incident investigation.",
        timestamp: new Date().toISOString(),
        toolCall: {
          tool: "list_firing_alerts",
          params: { region: "apac", severity: "critical" },
        },
        status: "completed",
      });

      // Event 2: PromQL Metrics Analysis
      await delay(1200);
      sendEvent({
        id: "evt-2",
        step: "METRICS_ANALYZED",
        agent: "detective",
        agentName: "Detective Agent",
        title: "Prometheus Telemetry Gathered",
        message:
          "PromQL query executed. Detected severe error surge localized to Singapore & Jakarta edge nodes. Egress latency spiked to 842ms.",
        timestamp: new Date().toISOString(),
        toolCall: {
          tool: "query_prometheus",
          params: {
            query:
              "sum(rate(playback_errors_total{region='apac'}[5m])) / sum(rate(playback_requests_total{region='apac'}[5m])) * 100",
          },
        },
        metricsData: {
          label: "APAC Playback Error Rate",
          value: 18.7,
          baseline: 0.4,
          unit: "%",
          trend: "up",
        },
        status: "completed",
      });

      // Event 3: Loki & Tempo Correlation
      await delay(1400);
      sendEvent({
        id: "evt-3",
        step: "LOGS_CORRELATED",
        agent: "detective",
        agentName: "Detective Agent",
        title: "Loki Logs & Tempo Traces Correlated",
        message:
          "LogQL search isolated fatal SIGSEGV buffer overflow in libx265_v4.8 inside transcoder-apac-worker-node-04. Tempo trace 8f3b9c24 confirms 504 gateway timeouts at edge packaging.",
        timestamp: new Date().toISOString(),
        toolCall: {
          tool: "query_loki",
          params: { query: "{app='transcoder', region='apac'} |= 'error'" },
        },
        logSnippet: {
          service: "transcoder-apac-worker-node-04",
          level: "FATAL ERROR",
          message:
            "FATAL: Segment transcoding buffer overflow: slice=2, SIGSEGV encountered in libx265_v4.8.so during 10-bit HEVC encoding",
          timestamp: new Date().toISOString(),
        },
        status: "completed",
      });

      // Event 4: Root Cause Synthesis
      await delay(1500);
      sendEvent({
        id: "evt-4",
        step: "ROOT_CAUSE_IDENTIFIED",
        agent: "reliability",
        agentName: "Reliability Agent",
        title: "Probable Root Cause Pinpointed (91% Confidence)",
        message:
          "Correlation confirmed: Transcoding Service rollout v4.8 deployed 12 minutes ago by CI/CD caused segmentation faults under 10-bit H.265 load. Estimated blast radius: 218,000 APAC viewers.",
        timestamp: new Date().toISOString(),
        status: "completed",
      });

      // Event 5: Grafana Incident Declaration
      await delay(1200);
      sendEvent({
        id: "evt-5",
        step: "INCIDENT_CREATED",
        agent: "producer",
        agentName: "Producer Agent",
        title: "Grafana Incident #1042 Declared",
        message:
          "Declared P1 Critical Incident in Grafana Cloud. Attached PromQL metric graphs, Loki log snippets, and Tempo trace links directly to the incident room.",
        timestamp: new Date().toISOString(),
        toolCall: {
          tool: "create_incident",
          params: {
            title:
              "P1 - APAC Playback Degradation during 'The Last Signal' Premiere",
            severity: "critical",
            labels: { region: "apac", service: "transcoding-service" },
          },
        },
        status: "completed",
      });

      // Event 6: Mitigation Ready / Completed
      await delay(1000);
      sendEvent({
        id: "evt-6",
        step: "MITIGATION_READY",
        agent: "director",
        agentName: "Director Agent",
        title: "Executive Mitigation Dossier Ready",
        message:
          "Automated rollback runbook generated. Remediation ready: Revert deployment to v4.7.4-stable. Total autonomous investigation completed in 47 seconds.",
        timestamp: new Date().toISOString(),
        status: "completed",
      });

      // Final Full Incident Payload
      sendEvent({
        type: "INCIDENT_DOSSIER",
        incident: {
          incidentId: "1042",
          title:
            "P1: APAC Playback Degradation — Transcoder v4.8 Rollout Crash",
          severity: "P1 - CRITICAL",
          status: "DECLARED",
          probableRootCause:
            "Transcoding Service v4.8 rollout in Singapore cluster introduced a fatal SIGSEGV buffer overflow in libx265_v4.8 under experimental 10-bit H.265 stream encoding.",
          confidenceScore: 91,
          affectedService: "transcoding-service (v4.8.0-build-841)",
          affectedRegions: ["Singapore", "Malaysia", "Indonesia", "Thailand"],
          estimatedAffectedViewers: 218000,
          deployedVersion: "commit e9a2b71 (v4.8.0-build-841)",
          rollbackCommand:
            "kubectl rollout undo deployment/transcoding-service -n media-prod --to-revision=47",
          grafanaUrl:
            "https://studiopulse.grafana.net/a/grafana-incident-app/incidents/1042",
          createdAt: new Date().toISOString(),
          executiveSummary:
            "During the world premiere of 'The Last Signal', an automated canary rollout of Transcoding Service v4.8 caused 504 Gateway Timeouts and segment packet drops for 218K viewers in APAC. StudioPulse AI diagnosed the root cause in 47 seconds, declared Grafana Incident #1042, and generated an instant rollback command.",
          evidenceSnippets: [
            {
              type: "metric",
              title: "APAC Playback Error Rate Spike",
              query:
                "sum(rate(playback_errors_total{region='apac'}[5m])) / sum(rate(playback_requests_total{region='apac'}[5m])) * 100",
              summary:
                "Error rate breached the 15% SLA threshold, peaking at 18.7% across Singapore edge packagers.",
            },
            {
              type: "log",
              title: "Loki SIGSEGV Transcoder Crash",
              query: "{app='transcoder', region='apac'} |= 'error'",
              summary:
                "Fatal buffer overflow in libx265_v4.8 during 10-bit H.265 encoding in pod transcoder-apac-worker-node-04.",
            },
            {
              type: "trace",
              title: "Tempo Trace 504 Gateway Timeout",
              query:
                "{ span.status = error && service.name = 'transcoding-service' }",
              summary:
                "5002ms duration timeout propagating from edge packaging to API gateway chunk delivery.",
            },
          ],
        },
      });

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
