import React from 'react';
import { CheckCircle2, ChevronRight, Circle, Compass, Lock, PlayCircle } from 'lucide-react';
import { RoadmapCanvas } from './RoadmapCanvas';
import { ROADMAP_STAGES, TOPIC_NODES } from '../../data/curriculum';
import { useLearningStore } from '../../store/useLearningStore';
import { BranchId } from '../../types';

const branches: { id: BranchId; label: string }[] = [
  { id: 'all', label: 'All branches' },
  { id: 'core', label: 'Core' },
  { id: 'networking', label: 'Networking' },
  { id: 'compute', label: 'Compute' },
  { id: 'storage-db', label: 'Storage & DB' },
  { id: 'containers', label: 'Containers' },
  { id: 'hosting', label: 'Hosting' },
  { id: 'devops', label: 'DevOps' },
  { id: 'security', label: 'Security' },
  { id: 'observability', label: 'Observability' },
  { id: 'ai-advanced', label: 'AI' },
  { id: 'finops', label: 'FinOps' }
];

export const ResponsiveRoadmap: React.FC = () => {
  const { completedTopics, inProgressTopics, selectedBranch, setSelectedBranch, setActiveTopicId } = useLearningStore();
  const nextTopic = TOPIC_NODES.find(topic => !completedTopics.includes(topic.id));

  return (
    <>
      <div className="hidden lg:block">
        <RoadmapCanvas />
      </div>

      <div className="min-h-[calc(100vh-4rem)] bg-[#080c14] px-4 py-5 lg:hidden">
        <div className="mx-auto max-w-xl">
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2 text-cyan-300">
              <Compass className="h-5 w-5" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em]">Learning map</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Build your cloud path</h1>
            <p className="mt-1 text-sm leading-6 text-slate-400">Follow stages in order. Open any topic when its prerequisites make sense.</p>
          </div>

          <label className="mb-4 block text-xs font-medium text-slate-400">
            Branch
            <select
              value={selectedBranch}
              onChange={event => setSelectedBranch(event.target.value as BranchId)}
              className="mt-2 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 outline-none focus:border-cyan-400"
            >
              {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.label}</option>)}
            </select>
          </label>

          {nextTopic && (
            <button
              type="button"
              onClick={() => setActiveTopicId(nextTopic.id)}
              className="mb-6 flex min-h-16 w-full items-center gap-3 rounded-2xl border border-cyan-500/40 bg-cyan-950/30 p-4 text-left transition-colors hover:bg-cyan-950/50"
            >
              <PlayCircle className="h-6 w-6 shrink-0 text-cyan-300" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-cyan-300">Recommended next</span>
                <span className="mt-1 block truncate text-sm font-semibold text-white">{nextTopic.title}</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-cyan-300" aria-hidden="true" />
            </button>
          )}

          <div className="space-y-5">
            {ROADMAP_STAGES.map(stage => {
              const topics = stage.topics.filter(topic => selectedBranch === 'all' || topic.branch === selectedBranch);
              if (!topics.length) return null;
              return (
                <section key={stage.stage} aria-labelledby={`mobile-stage-${stage.stage}`}>
                  <div className="mb-2 flex items-start gap-3">
                    <div className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-cyan-400 bg-[#080c14]" />
                    <div>
                      <h2 id={`mobile-stage-${stage.stage}`} className="text-sm font-bold text-white">{stage.name}</h2>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{stage.description}</p>
                    </div>
                  </div>
                  <div className="ml-1.5 space-y-2 border-l border-slate-700 pl-5">
                    {topics.map(topic => {
                      const completed = completedTopics.includes(topic.id);
                      const inProgress = inProgressTopics.includes(topic.id);
                      return (
                        <button
                          type="button"
                          key={topic.id}
                          onClick={() => setActiveTopicId(topic.id)}
                          className={`flex min-h-16 w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${completed ? 'border-emerald-500/40 bg-emerald-950/20' : inProgress ? 'border-cyan-500/40 bg-cyan-950/20' : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'}`}
                        >
                          {completed ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" aria-label="Completed" /> : inProgress ? <PlayCircle className="h-5 w-5 shrink-0 text-cyan-300" aria-label="In progress" /> : topic.prerequisites.length ? <Lock className="h-4 w-4 shrink-0 text-slate-500" aria-label="Has prerequisites" /> : <Circle className="h-4 w-4 shrink-0 text-slate-600" aria-hidden="true" />}
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-slate-200">{topic.title}</span>
                            <span className="mt-1 block truncate text-xs text-slate-500">{topic.subtitle}</span>
                          </span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
