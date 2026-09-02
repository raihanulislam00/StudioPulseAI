"use client";

import React from "react";
import {
  CheckCircle2,
  Loader2,
  Terminal,
  Search,
  Sparkles,
  Bot,
  Activity,
  Layers,
} from "lucide-react";
import { AgentEvent, AgentType } from "@/types";
import { formatTimestamp } from "@/lib/utils";

interface AgentTimelineProps {
  events: AgentEvent[];
  isInvestigating: boolean;
  currentStepIndex: number;
}

const STAGES = [
  { id: "ALERT_DETECTED", label: "Alert Ingest" },
  { id: "METRICS_ANALYZED", label: "PromQL Metrics" },
  { id: "LOGS_CORRELATED", label: "Loki & Tempo" },
  { id: "ROOT_CAUSE_IDENTIFIED", label: "Root Cause" },
  { id: "INCIDENT_CREATED", label: "Grafana Incident" },
  { id: "MITIGATION_READY", label: "Runbook Action" },
];

export function AgentTimeline({
  events,
  isInvestigating,
  currentStepIndex,
}: AgentTimelineProps) {
  const getAgentBadge = (agent: AgentType) => {
    switch (agent) {
      case "director":
        return {
          label: "🎬 Director Agent",
          color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        };
      case "detective":
        return {
          label: "🔎 Detective Agent",
          color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        };
      case "reliability":
        return {
          label: "🛠 Reliability Agent",
          color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        };
      case "producer":
        return {
          label: "📝 Producer Agent",
          color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        };
      default:
        return {
          label: "🤖 Agent",
          color: "bg-slate-500/10 text-slate-400 border-slate-500/30",
        };
    }
  };

  return (
    <div className="rounded-xl bg-surface-card border border-surface-border p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              Autonomous Investigation Engine
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic Multi-Agent Workflow via Grafana MCP
            </p>
          </div>
        </div>

        {isInvestigating && (
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-cyan px-2.5 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>AGENT CREW ACTIVE</span>
          </div>
        )}
      </div>

      {/* Workflow Stage Progress Bar */}
      <div className="grid grid-cols-6 gap-1 mb-5 p-2 rounded-lg bg-surface/60 border border-surface-border/60">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex && isInvestigating;
          return (
            <div
              key={stage.id}
              className={`flex flex-col items-center justify-center p-2 rounded text-center transition-all ${
                isDone
                  ? "bg-brand-green/10 text-brand-green border border-brand-green/30"
                  : isCurrent
                  ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/40 animate-pulse"
                  : "text-slate-500 bg-surface-card/40"
              }`}
            >
              <div className="flex items-center space-x-1 mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : isCurrent ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <span className="w-3 h-3 rounded-full bg-slate-700 text-[9px] font-mono flex items-center justify-center text-slate-300">
                    {idx + 1}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono font-medium leading-tight">
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stream Events Log */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[520px]">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-center px-4">
            <Search className="w-10 h-10 mb-3 text-slate-600" />
            <p className="text-sm font-mono text-slate-400">
              System standing by on live broadcast telemetry.
            </p>
            <p className="text-xs text-slate-600 mt-1 max-w-sm">
              Click &quot;Investigate Incident&quot; or activate autonomous commander to begin the 6-stage Grafana MCP investigation.
            </p>
          </div>
        ) : (
          events.map((event) => {
            const badge = getAgentBadge(event.agent);
            return (
              <div
                key={event.id}
                className="p-3.5 rounded-lg bg-surface/80 border border-surface-border hover:border-slate-700 transition-all text-xs font-mono"
              >
                {/* Event Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                    <span className="font-bold text-slate-200">
                      {event.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>

                {/* Event Message */}
                <p className="text-slate-300 mb-2 leading-relaxed">
                  {event.message}
                </p>

                {/* Tool Call Box */}
                {event.toolCall && (
                  <div className="mt-2 p-2.5 rounded bg-[#090c14] border border-surface-border/80 text-[11px] text-slate-300">
                    <div className="flex items-center space-x-1.5 text-brand-cyan font-bold mb-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Grafana MCP Tool Call:</span>
                      <code className="text-white px-1.5 py-0.5 rounded bg-surface-card border border-surface-border">
                        {event.toolCall.tool}()
                      </code>
                    </div>
                    <pre className="text-slate-400 overflow-x-auto text-[10px] p-1.5 rounded bg-black/40">
                      {JSON.stringify(event.toolCall.params, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Metric Data Pill */}
                {event.metricsData && (
                  <div className="mt-2 p-2 rounded bg-brand-cyan/5 border border-brand-cyan/20 flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-3.5 h-3.5 text-brand-cyan" />
                      <span className="text-slate-300">
                        {event.metricsData.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 font-bold">
                      <span className="text-brand-red">
                        {event.metricsData.value}
                        {event.metricsData.unit}
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        (Baseline: {event.metricsData.baseline}
                        {event.metricsData.unit})
                      </span>
                    </div>
                  </div>
                )}

                {/* Log Snippet */}
                {event.logSnippet && (
                  <div className="mt-2 p-2 rounded bg-brand-red/5 border border-brand-red/20 font-mono text-[10px]">
                    <div className="flex items-center justify-between text-brand-red font-semibold mb-1">
                      <span>[{event.logSnippet.service}]</span>
                      <span>{event.logSnippet.level}</span>
                    </div>
                    <p className="text-slate-300 select-all">
                      {event.logSnippet.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
