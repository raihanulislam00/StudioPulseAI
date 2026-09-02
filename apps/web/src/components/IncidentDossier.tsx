"use client";

import React, { useState } from "react";
import {
  AlertOctagon,
  ExternalLink,
  RotateCcw,
  Check,
  Copy,
  FileText,
  Zap,
  Globe,
  Gauge,
  Layers,
  Terminal,
} from "lucide-react";
import { IncidentDetails } from "@/types";

interface IncidentDossierProps {
  incident: IncidentDetails | null;
}

export function IncidentDossier({ incident }: IncidentDossierProps) {
  const [copied, setCopied] = useState(false);
  const [mitigationTriggered, setMitigationTriggered] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "evidence" | "runbook">("summary");

  if (!incident) {
    return (
      <div className="rounded-xl bg-surface-card border border-surface-border p-5 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <AlertOctagon className="w-12 h-12 text-slate-600 mb-3" />
        <h3 className="text-sm font-mono font-bold text-slate-300 uppercase">
          Incident Command Deck Standby
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          When the multi-agent investigation identifies root cause, the Grafana incident declaration and rollback actions will appear here.
        </p>
      </div>
    );
  }

  const handleCopyRollback = () => {
    navigator.clipboard.writeText(incident.rollbackCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerRollback = () => {
    setMitigationTriggered(true);
  };

  return (
    <div className="rounded-xl bg-surface-card border border-brand-red/30 p-5 flex flex-col h-full shadow-lg shadow-brand-red/5">
      {/* Header with Severity and Grafana Incident Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-red/20 text-brand-red border border-brand-red/40 animate-pulse">
              {incident.severity}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface border border-surface-border text-slate-400">
              ID: #{incident.incidentId}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-green/10 text-brand-green border border-brand-green/30 font-semibold">
              {incident.status}
            </span>
          </div>
          <h2 className="text-base font-bold text-white mt-1.5 leading-snug">
            {incident.title}
          </h2>
        </div>

        {/* Grafana Cloud Link Button */}
        <a
          href={incident.grafanaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple border border-brand-purple/40 text-xs font-mono font-semibold transition-all shrink-0"
        >
          <span>Open Grafana Incident</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-surface-border/80 pb-2 mb-4">
        <button
          onClick={() => setActiveTab("summary")}
          className={`px-3 py-1 text-xs font-mono rounded transition-all ${
            activeTab === "summary"
              ? "bg-brand-purple text-white font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Diagnosis & Impact
        </button>
        <button
          onClick={() => setActiveTab("evidence")}
          className={`px-3 py-1 text-xs font-mono rounded transition-all ${
            activeTab === "evidence"
              ? "bg-brand-purple text-white font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Evidence ({incident.evidenceSnippets.length})
        </button>
        <button
          onClick={() => setActiveTab("runbook")}
          className={`px-3 py-1 text-xs font-mono rounded transition-all ${
            activeTab === "runbook"
              ? "bg-brand-purple text-white font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Mitigation Runbook
        </button>
      </div>

      {/* Tab 1: Summary */}
      {activeTab === "summary" && (
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          {/* Root Cause Card */}
          <div className="p-3.5 rounded-lg bg-surface/90 border border-brand-amber/30">
            <div className="flex items-center justify-between text-brand-amber text-xs font-mono font-bold mb-1.5">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> PROBABLE ROOT CAUSE
              </span>
              <span className="px-2 py-0.5 rounded bg-brand-amber/20 border border-brand-amber/40 text-brand-amber font-mono text-[11px]">
                {incident.confidenceScore}% CONFIDENCE
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {incident.probableRootCause}
            </p>
          </div>

          {/* Blast Radius & Deployment Details */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-surface/70 border border-surface-border">
              <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                <Globe className="w-3.5 h-3.5 text-brand-cyan" />
                <span>AFFECTED REGIONS</span>
              </div>
              <div className="text-slate-200 font-semibold">
                {incident.affectedRegions.join(", ")}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                ~{incident.estimatedAffectedViewers.toLocaleString()} Viewers Impacted
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface/70 border border-surface-border">
              <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                <Layers className="w-3.5 h-3.5 text-brand-purple" />
                <span>DEPLOYED COMMIT</span>
              </div>
              <div className="text-brand-purple font-semibold">
                {incident.deployedVersion}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Service: {incident.affectedService}
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-3.5 rounded-lg bg-surface/70 border border-surface-border">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-mono mb-2">
              <FileText className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-bold text-slate-300 uppercase">Executive Debrief</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {incident.executiveSummary}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Evidence */}
      {activeTab === "evidence" && (
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {incident.evidenceSnippets.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#090c14] border border-surface-border font-mono text-xs"
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-brand-cyan font-bold uppercase">
                  [{item.type}] {item.title}
                </span>
              </div>
              <div className="p-1.5 rounded bg-black/50 text-[10px] text-slate-400 mb-2 select-all overflow-x-auto">
                <code>{item.query}</code>
              </div>
              <p className="text-slate-300 text-[11px] leading-normal">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Runbook & Mitigation */}
      {activeTab === "runbook" && (
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          <div className="p-3.5 rounded-lg bg-surface/90 border border-brand-green/30">
            <div className="flex items-center space-x-2 text-brand-green text-xs font-mono font-bold mb-2">
              <RotateCcw className="w-4 h-4" />
              <span>AUTOMATED ROLLBACK RUNBOOK</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              To restore playback for affected viewers immediately, revert the transcoding deployment to the previous stable release.
            </p>

            <div className="relative p-2.5 rounded bg-[#090c14] border border-surface-border text-[11px] font-mono text-brand-cyan">
              <pre className="overflow-x-auto select-all pr-8">
                {incident.rollbackCommand}
              </pre>
              <button
                onClick={handleCopyRollback}
                className="absolute top-2 right-2 p-1.5 rounded bg-surface border border-surface-border text-slate-400 hover:text-white"
                title="Copy Command"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handleTriggerRollback}
                disabled={mitigationTriggered}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  mitigationTriggered
                    ? "bg-brand-green/20 text-brand-green border border-brand-green/40"
                    : "bg-brand-red hover:bg-brand-red/90 text-white shadow-lg shadow-brand-red/20"
                }`}
              >
                {mitigationTriggered ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ROLLBACK EXECUTED SUCCESSFULLY</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>EXECUTE ROLLBACK TO STABLE (v4.7.4)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
