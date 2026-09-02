"use client";

import React from "react";
import {
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCircle,
  Database,
} from "lucide-react";

interface ControlToolbarProps {
  isInvestigating: boolean;
  onStartInvestigation: () => void;
  onReset: () => void;
  onInjectAnomaly: () => void;
  isAnomalyActive: boolean;
  telemetryMode: "live" | "simulated";
  onToggleTelemetryMode: () => void;
  investigationComplete: boolean;
}

export function ControlToolbar({
  isInvestigating,
  onStartInvestigation,
  onReset,
  onInjectAnomaly,
  isAnomalyActive,
  telemetryMode,
  onToggleTelemetryMode,
  investigationComplete,
}: ControlToolbarProps) {
  return (
    <div className="p-4 rounded-xl bg-surface-card border border-surface-border flex flex-wrap items-center justify-between gap-3 shadow-md">
      {/* Primary Actions */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onStartInvestigation}
          disabled={isInvestigating}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-mono text-xs font-bold transition-all shadow-md ${
            isInvestigating
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple/90 hover:to-brand-blue/90 text-white shadow-brand-purple/20 active:scale-95"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {isInvestigating
              ? "INVESTIGATION IN PROGRESS..."
              : "START AI INCIDENT INVESTIGATION"}
          </span>
        </button>

        <button
          onClick={onInjectAnomaly}
          disabled={isInvestigating || isAnomalyActive}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-mono text-xs transition-all ${
            isAnomalyActive
              ? "bg-brand-red/20 text-brand-red border border-brand-red/40"
              : "bg-surface hover:bg-surface-border text-slate-300 border border-surface-border"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-brand-red" />
          <span>{isAnomalyActive ? "Anomaly Active" : "Simulate Anomaly"}</span>
        </button>

        <button
          onClick={onReset}
          disabled={isInvestigating}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-surface hover:bg-surface-border text-slate-300 border border-surface-border font-mono text-xs transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset</span>
        </button>
      </div>

      {/* Mode Toggle & Timing Comparison Badge */}
      <div className="flex items-center space-x-3 text-xs font-mono">
        {/* Mode Selector */}
        <button
          onClick={onToggleTelemetryMode}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface border border-surface-border hover:border-slate-600 text-slate-300 transition-all"
          title="Toggle between live Grafana Cloud MCP and the embedded high-fidelity simulator"
        >
          <Database className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Provider:</span>
          <span
            className={`font-bold ${
              telemetryMode === "live" ? "text-brand-green" : "text-brand-cyan"
            }`}
          >
            {telemetryMode === "live" ? "Live Grafana MCP" : "Simulator (APAC Demo)"}
          </span>
        </button>

        {/* Impact Comparison Pill */}
        {investigationComplete && (
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-brand-green/10 border border-brand-green/30 text-brand-green font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Resolution: 47s (vs 30m manual)</span>
          </div>
        )}
      </div>
    </div>
  );
}
