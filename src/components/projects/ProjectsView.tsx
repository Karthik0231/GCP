import React, { useState } from 'react';
import { 
  FolderKanban, 
  Layers, 
  CheckCircle2, 
  DollarSign, 
  FileCode, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';
import { REAL_WORLD_PROJECTS } from '../../data/projects';
import { RealWorldProject } from '../../types';

export const ProjectsView: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(REAL_WORLD_PROJECTS[0].id);
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);

  const activeProject = REAL_WORLD_PROJECTS.find(p => p.id === selectedProjectId) || REAL_WORLD_PROJECTS[0];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetIndex(idx);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FolderKanban className="w-7 h-7 text-amber-400" />
          Real-World Production Projects
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Complete production-grade applications with full repository architecture, infrastructure manifests, and automated CI/CD deployment pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Project Navigation List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 tracking-wider font-semibold mb-2">
            Project Index ({REAL_WORLD_PROJECTS.length})
          </div>
          {REAL_WORLD_PROJECTS.map(proj => {
            const isSelected = proj.id === activeProject.id;
            return (
              <div
                key={proj.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedProjectId(proj.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedProjectId(proj.id);
                  }
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-amber-950/30 border-amber-500/60 shadow-md shadow-amber-950/20' 
                    : 'bg-[#0b101d] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span className="text-amber-400">Project #{proj.number.toString().padStart(2, '0')}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    {proj.difficulty}
                  </span>
                </div>

                <div className="text-xs font-bold text-white mb-2 leading-snug">
                  {proj.title}
                </div>

                <div className="flex flex-wrap gap-1">
                  {proj.servicesUsed.slice(0, 3).map((svc, si) => (
                    <span key={si} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {svc}
                    </span>
                  ))}
                  {proj.servicesUsed.length > 3 && (
                    <span className="text-[10px] font-mono px-1 py-0.5 text-slate-400">
                      +{proj.servicesUsed.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Detailed Spec */}
        <div className="lg:col-span-8 bg-[#0b101d] border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6">
          
          {/* Project Title Block */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 font-semibold">
              <span>PROJECT {activeProject.number.toString().padStart(2, '0')}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300">{activeProject.difficulty} LEVEL</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{activeProject.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{activeProject.description}</p>
          </div>

          {/* Architecture Summary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Target Architecture Flow
            </span>
            <p className="text-xs font-mono text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              {activeProject.architectureSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ['Prerequisites', activeProject.prerequisites],
              ['Console path', activeProject.consoleImplementation],
              ['CLI path', activeProject.cliImplementation],
              ['Terraform path', activeProject.terraformImplementation],
              ['Secrets', activeProject.secretsManagement],
              ['Networking', activeProject.networking],
              ['Deployment', activeProject.deployment],
              ['Verification', activeProject.testing],
              ['Operations', [...(activeProject.logging || []), ...(activeProject.monitoring || [])]],
            ].filter(([, items]) => items?.length).map(([label, items]) => (
              <div key={label} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <h4 className="mb-2 text-[11px] font-mono uppercase font-bold tracking-wider text-cyan-400">{label}</h4>
                <ul className="space-y-1 text-xs text-slate-300">{items?.map(item => <li key={item}>• {item}</li>)}</ul>
              </div>
            ))}
          </div>

          {/* Production Requirements Checklist */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Production Engineering Requirements
            </span>
            <div className="space-y-1.5">
              {activeProject.productionRequirements.map((req, rIdx) => (
                <div key={rIdx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Repository Structure */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-slate-400" />
              Recommended Repository Structure
            </span>
            <pre className="p-3.5 rounded-xl bg-black/80 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
              <code>{activeProject.folderStructure}</code>
            </pre>
          </div>

          {/* Implementation Steps with Code Snippets */}
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider block">
              Step-by-Step Implementation Guide
            </span>
            <div className="space-y-4">
              {activeProject.implementationSteps.map((step, sIdx) => (
                <div key={sIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono text-[10px] border border-slate-700">
                        {step.step}
                      </span>
                      <span>{step.title}</span>
                    </div>

                    {step.snippet && (
                      <button
                        onClick={() => handleCopy(step.snippet || '', sIdx)}
                        className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700"
                      >
                        {copiedSnippetIndex === sIdx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSnippetIndex === sIdx ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{step.detail}</p>

                  {step.snippet && (
                    <pre className="p-3 rounded-lg bg-slate-900/90 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                      <code>{step.snippet}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cost Estimation */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
            <strong className="text-amber-400 font-mono text-[11px] uppercase block">
              Cost & Resource Estimation:
            </strong>
            <p className="text-slate-400">{activeProject.costEstimation}</p>
          </div>

          {/* Safe Cleanup */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold font-mono uppercase tracking-wider">
              <Trash2 className="w-4 h-4" />
              Project Teardown Command
            </div>
            <pre className="p-2.5 rounded bg-black/70 text-rose-300 font-mono text-xs overflow-x-auto border border-rose-900/30">
              <code>{activeProject.cleanupCommand}</code>
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};

