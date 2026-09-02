"use client";

import React from "react";
import { Radio, Users, AlertTriangle, ShieldCheck, Film } from "lucide-react";
import { BroadcastState } from "@/types";
import { formatNumber } from "@/lib/utils";

interface BroadcastHeaderProps {
  state: BroadcastState;
}

export function BroadcastHeader({ state }: BroadcastHeaderProps) {
  const isCritical = state.broadcastStatus === "CRITICAL";

  return (
    <header className="border-b border-surface-border bg-surface/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Event Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-red/20 to-brand-purple/30 border border-brand-purple/40 text-white shadow-lg shadow-brand-purple/10">
            <Film className="w-5 h-5 text-brand-purple" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                STUDIOPULSE AI • LIVE MEDIA OPS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                GRAFANA MCP
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              {state.eventName}
              <span className="text-xs font-mono font-normal text-slate-400 px-2 py-0.5 rounded bg-surface-border">
                {state.region} Cluster
              </span>
            </h1>
          </div>
        </div>

        {/* Live Broadcast Telemetry Status Badges */}
        <div className="flex items-center space-x-3 overflow-x-auto">
          {/* Status Indicator */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-mono font-semibold transition-all ${
              isCritical
                ? "bg-brand-red/10 border-brand-red/40 text-brand-red animate-pulse"
                : "bg-brand-green/10 border-brand-green/40 text-brand-green"
            }`}
          >
            {isCritical ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>CRITICAL INCIDENT DETECTED</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>BROADCAST NOMINAL</span>
              </>
            )}
          </div>

          {/* On-Air Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-surface-card border border-surface-border text-xs font-mono text-slate-300">
            <Radio className="w-3 h-3 text-brand-red animate-pulse" />
            <span className="font-bold text-white tracking-wider">LIVE</span>
          </div>

          {/* Concurrent Viewers */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-xs font-mono text-slate-300">
            <Users className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="font-semibold text-white">
              {formatNumber(state.concurrentViewers)}
            </span>
            <span className="text-[11px] text-slate-400">Viewers</span>
          </div>
        </div>
      </div>
    </header>
  );
}
