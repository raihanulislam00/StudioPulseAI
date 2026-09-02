"use client";

import React, { useState } from "react";
import { BroadcastHeader } from "@/components/BroadcastHeader";
import { TelemetryKPIs } from "@/components/TelemetryKPIs";
import { AgentTimeline } from "@/components/AgentTimeline";
import { IncidentDossier } from "@/components/IncidentDossier";
import { ControlToolbar } from "@/components/ControlToolbar";
import { BroadcastState, AgentEvent, IncidentDetails } from "@/types";

const INITIAL_BROADCAST_STATE: BroadcastState = {
  eventName: "Premiere: 'The Last Signal'",
  broadcastStatus: "CRITICAL",
  concurrentViewers: 1845200,
  errorRate: 18.7,
  latencyMs: 842,
  cdnHealth: 64,
  activeAlertsCount: 1,
  region: "APAC",
};

const NOMINAL_BROADCAST_STATE: BroadcastState = {
  eventName: "Premiere: 'The Last Signal'",
  broadcastStatus: "STABLE",
  concurrentViewers: 1845200,
  errorRate: 0.4,
  latencyMs: 180,
  cdnHealth: 99,
  activeAlertsCount: 0,
  region: "APAC",
};

export default function Home() {
  const [broadcastState, setBroadcastState] = useState<BroadcastState>(
    INITIAL_BROADCAST_STATE
  );
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [incident, setIncident] = useState<IncidentDetails | null>(null);
  const [telemetryMode, setTelemetryMode] = useState<"live" | "simulated">(
    "simulated"
  );
  const [isAnomalyActive, setIsAnomalyActive] = useState(true);
  const [investigationComplete, setInvestigationComplete] = useState(false);

  const startInvestigation = async () => {
    setIsInvestigating(true);
    setEvents([]);
    setIncident(null);
    setCurrentStepIndex(0);
    setInvestigationComplete(false);

    try {
      const response = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: telemetryMode,
          scenario: "apac_playback_outage_premiere",
        }),
      });

      if (!response.body) {
        throw new Error("No response body received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.replace("data: ", ""));
              if (data.type === "INCIDENT_DOSSIER" && data.incident) {
                setIncident(data.incident);
              } else if (data.step) {
                setEvents((prev) => [...prev, data as AgentEvent]);
                setCurrentStepIndex((prev) => Math.min(prev + 1, 5));
              }
            } catch (err) {
              console.error("Error parsing event chunk", err);
            }
          }
        }
      }

      setInvestigationComplete(true);
    } catch (err) {
      console.error("Investigation failed", err);
    } finally {
      setIsInvestigating(false);
    }
  };

  const handleReset = () => {
    setBroadcastState(NOMINAL_BROADCAST_STATE);
    setEvents([]);
    setIncident(null);
    setCurrentStepIndex(0);
    setIsAnomalyActive(false);
    setInvestigationComplete(false);
  };

  const handleInjectAnomaly = () => {
    setBroadcastState(INITIAL_BROADCAST_STATE);
    setIsAnomalyActive(true);
    setEvents([]);
    setIncident(null);
    setCurrentStepIndex(0);
    setInvestigationComplete(false);
  };

  const handleToggleMode = () => {
    setTelemetryMode((prev) => (prev === "live" ? "simulated" : "live"));
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Broadcast HUD Header */}
      <BroadcastHeader state={broadcastState} />

      {/* Main Control Room Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Interactive Action Bar */}
        <ControlToolbar
          isInvestigating={isInvestigating}
          onStartInvestigation={startInvestigation}
          onReset={handleReset}
          onInjectAnomaly={handleInjectAnomaly}
          isAnomalyActive={isAnomalyActive}
          telemetryMode={telemetryMode}
          onToggleTelemetryMode={handleToggleMode}
          investigationComplete={investigationComplete}
        />

        {/* Real-time Telemetry Tiles */}
        <TelemetryKPIs state={broadcastState} />

        {/* 2-Column Responsive Layout: Agent Investigation vs Incident Command Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[580px]">
          {/* Left Panel: Autonomous Multi-Agent Timeline */}
          <div className="lg:col-span-7 h-full">
            <AgentTimeline
              events={events}
              isInvestigating={isInvestigating}
              currentStepIndex={currentStepIndex}
            />
          </div>

          {/* Right Panel: Incident Resolution & Runbook Deck */}
          <div className="lg:col-span-5 h-full">
            <IncidentDossier incident={incident} />
          </div>
        </div>
      </div>

      {/* Broadcast Ops Footer */}
      <footer className="border-t border-surface-border/60 py-3 px-6 bg-surface/50 text-center text-xs font-mono text-slate-500">
        StudioPulse AI • Google Agentic Cinema Hackathon • Built with Google Gemini, ADK & Grafana Cloud MCP
      </footer>
    </main>
  );
}
