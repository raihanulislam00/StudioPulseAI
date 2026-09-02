"use client";

import React from "react";
import { TrendingUp, Activity, Server, AlertCircle, Clock } from "lucide-react";
import { BroadcastState } from "@/types";
import { formatNumber } from "@/lib/utils";

interface TelemetryKPIsProps {
  state: BroadcastState;
}

export function TelemetryKPIs({ state }: TelemetryKPIsProps) {
  const isCritical = state.broadcastStatus === "CRITICAL";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Playback Error Rate */}
      <div className="p-4 rounded-xl bg-surface-card/70 border border-surface-border backdrop-blur-sm relative overflow-hidden transition-all hover:border-surface-border/80">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-mono font-medium tracking-wide">
            PLAYBACK ERROR RATE
          </span>
          <AlertCircle
            className={`w-4 h-4 ${
              isCritical ? "text-brand-red animate-pulse" : "text-brand-green"
            }`}
          />
        </div>
        <div className="flex items-baseline space-x-2">
          <span
            className={`text-2xl font-mono font-bold ${
              isCritical ? "text-brand-red" : "text-white"
            }`}
          >
            {state.errorRate.toFixed(1)}%
          </span>
          <span className="text-xs font-mono text-brand-red flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +31%
          </span>
        </div>
        <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-surface-border/60 pt-2">
          <span>Threshold: 15.0%</span>
          <span className="text-brand-red font-semibold">BREACHED</span>
        </div>
        {isCritical && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        )}
      </div>

      {/* KPI 2: Egress Latency (p95) */}
      <div className="p-4 rounded-xl bg-surface-card/70 border border-surface-border backdrop-blur-sm relative overflow-hidden transition-all hover:border-surface-border/80">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-mono font-medium tracking-wide">
            EGRESS LATENCY (p95)
          </span>
          <Clock className="w-4 h-4 text-brand-amber" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span
            className={`text-2xl font-mono font-bold ${
              state.latencyMs > 500 ? "text-brand-amber" : "text-white"
            }`}
          >
            {state.latencyMs}ms
          </span>
          <span className="text-xs font-mono text-brand-amber flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +220%
          </span>
        </div>
        <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-surface-border/60 pt-2">
          <span>Baseline: 180ms</span>
          <span className="text-brand-amber font-semibold">DEGRADED</span>
        </div>
        {state.latencyMs > 500 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-amber shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
        )}
      </div>

      {/* KPI 3: Viewer Retention Impact */}
      <div className="p-4 rounded-xl bg-surface-card/70 border border-surface-border backdrop-blur-sm relative overflow-hidden transition-all hover:border-surface-border/80">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-mono font-medium tracking-wide">
            VIEWER IMPACT (APAC)
          </span>
          <Activity className="w-4 h-4 text-brand-cyan" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-mono font-bold text-white">
            ~218K
          </span>
          <span className="text-xs font-mono text-brand-red">
            -12.3% dropoff
          </span>
        </div>
        <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-surface-border/60 pt-2">
          <span>Total Stream: {formatNumber(state.concurrentViewers)}</span>
          <span className="text-slate-300">SG, MY, ID</span>
        </div>
      </div>

      {/* KPI 4: Transcoding Cluster Health */}
      <div className="p-4 rounded-xl bg-surface-card/70 border border-surface-border backdrop-blur-sm relative overflow-hidden transition-all hover:border-surface-border/80">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-mono font-medium tracking-wide">
            TRANSCODER CLUSTER
          </span>
          <Server className="w-4 h-4 text-brand-purple" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span
            className={`text-2xl font-mono font-bold ${
              state.cdnHealth < 70 ? "text-brand-red" : "text-brand-green"
            }`}
          >
            {state.cdnHealth}%
          </span>
          <span className="text-xs font-mono text-brand-red">
            v4.8.0 CrashLoop
          </span>
        </div>
        <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-surface-border/60 pt-2">
          <span>Cluster: prod-apac-01</span>
          <span className="text-brand-red font-semibold">FAILING</span>
        </div>
        {state.cdnHealth < 70 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
        )}
      </div>
    </div>
  );
}
