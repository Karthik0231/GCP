import React, { useState } from 'react';
import { 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Info, 
  Server, 
  Globe, 
  Database, 
  Cpu, 
  Radio, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ARCHITECTURE_CATALOG } from '../../data/architectures';
import { ArchitectureItem } from '../../types';

export const ArchitectureView: React.FC = () => {
  const [selectedArchId, setSelectedArchId] = useState<string>(ARCHITECTURE_CATALOG[0].id);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(ARCHITECTURE_CATALOG[0].nodes[0].id);

  const activeArch = ARCHITECTURE_CATALOG.find(a => a.id === selectedArchId) || ARCHITECTURE_CATALOG[0];
  const activeNode = activeArch.nodes.find(n => n.id === selectedNodeId) || activeArch.nodes[0];

  return (
    <div className="forge-page w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="forge-page-header mb-6">
        <h2 className="forge-page-title text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Layers className="w-7 h-7 text-purple-400" />
          Interactive Architecture Explorer
        </h2>
        <p className="forge-page-lede text-slate-400 text-sm mt-1">
          Explore real-world Google Cloud production topologies. Click components in the diagram to inspect their network responsibilities, security boundaries, and protocol handoffs.
        </p>
      </div>

      {/* Architecture Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ARCHITECTURE_CATALOG.map(arch => (
          <button
            type="button"
            aria-pressed={arch.id === activeArch.id}
            key={arch.id}
            onClick={() => {
              setSelectedArchId(arch.id);
              setSelectedNodeId(arch.nodes[0].id);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              arch.id === activeArch.id
                ? 'bg-purple-950/60 text-purple-300 border border-purple-500/50 shadow-md shadow-purple-950/30'
                : 'bg-[#0b101d] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{arch.title.split(':')[0]}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Diagram Stream */}
        <div className="forge-panel lg:col-span-8 bg-[#0b101d] border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <span className="text-xs font-mono uppercase text-purple-400 font-bold tracking-wider">
              {activeArch.category}
            </span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">{activeArch.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{activeArch.summary}</p>
          </div>

          {/* Interactive Topology Stream */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider block">
              System Topology Nodes (Click to Inspect)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activeArch.nodes.map((node, nIdx) => {
                const isSelected = node.id === activeNode.id;
                return (
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`Inspect ${node.label}, ${node.service}`}
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                      <span className="text-purple-400 uppercase font-semibold">{node.tier}</span>
                      <span className="text-slate-400">Node {nIdx + 1}</span>
                    </div>

                    <div className="text-xs font-bold text-white mb-1">{node.label}</div>
                    <div className="text-[11px] text-cyan-400 font-mono line-clamp-1">{node.service}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Traffic Flows Sequence */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider block">
              Data Flow Sequence
            </span>
            <div className="space-y-2">
              {activeArch.flows.map((flow, fIdx) => (
                <div key={fIdx} className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="text-cyan-400 font-semibold">{flow.label}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[11px]">
                    Protocol: {flow.protocol}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Architectural Key Principles */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Core Architecture Principles Applied
            </span>
            <div className="space-y-1.5">
              {activeArch.keyPrinciples.map((principle, pIdx) => (
                <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{principle}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Selected Node Deep Dive Inspector */}
        <div className="forge-panel lg:col-span-4 bg-[#0b101d] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono uppercase text-purple-400 font-bold tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              Node Inspector
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              {activeNode.tier}
            </span>
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-0.5">{activeNode.label}</h4>
            <div className="text-xs text-cyan-400 font-mono mb-3">{activeNode.service}</div>
          </div>

          <div className="space-y-1.5">
            <span className="text-slate-400 text-[11px] font-mono uppercase font-semibold">Architectural Role:</span>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              {activeNode.role}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-slate-400 text-[11px] font-mono uppercase font-semibold">Technical & Protocol Details:</span>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              {activeNode.techNotes}
            </p>
          </div>

          <div className="pt-2 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80">
            💡 <em>Tip: In production environments, place Cloud Armor security policies at the HTTPS Load Balancer edge to reject Layer 7 attacks before hitting serverless containers.</em>
          </div>
        </div>

      </div>
    </div>
  );
};

