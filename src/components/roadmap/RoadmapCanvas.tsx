import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Filter, 
  ArrowRight,
  Shield, 
  Cpu, 
  Network, 
  Database, 
  Boxes, 
  Terminal, 
  ChevronDown,
  Layers,
  Lock,
  Compass
} from 'lucide-react';
import { useLearningStore, calculateProgression } from '../../store/useLearningStore';
import { ROADMAP_STAGES, TOPIC_NODES } from '../../data/curriculum';
import { BranchId, DifficultyLevel, TopicNode } from '../../types';

export const RoadmapCanvas: React.FC = () => {
  const { 
    completedTopics, 
    inProgressTopics, 
    setActiveTopicId, 
    selectedBranch, 
    setSelectedBranch,
    roadmapZoom,
    setRoadmapZoom
  } = useLearningStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalTopics = TOPIC_NODES.length;
  const progression = calculateProgression(completedTopics.length, totalTopics);

  // Find first non-completed topic as recommended next
  const recommendedNextTopic = TOPIC_NODES.find(t => !completedTopics.includes(t.id)) || TOPIC_NODES[0];

  const branchFilters: { id: BranchId; label: string; icon: any }[] = [
    { id: 'all', label: 'All Branches', icon: Compass },
    { id: 'core', label: 'Core & Hierarchy', icon: Layers },
    { id: 'networking', label: 'Networking & VPC', icon: Network },
    { id: 'compute', label: 'Compute Engine', icon: Cpu },
    { id: 'storage-db', label: 'Storage & DBs', icon: Database },
    { id: 'containers', label: 'Containers & GKE', icon: Boxes },
    { id: 'devops', label: 'DevOps & Terraform', icon: Terminal },
    { id: 'security', label: 'Security & IAM', icon: Shield },
    { id: 'ai-advanced', label: 'Vertex AI & RAG', icon: Sparkles }
  ];

  const handleZoom = (delta: number) => {
    setRoadmapZoom(roadmapZoom + delta);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full min-h-[calc(100vh-4rem)] bg-[#080c14] relative bg-tech-grid flex flex-col items-center">
      
      {/* Hero Section */}
      <div className="w-full max-w-5xl px-4 pt-10 pb-6 text-center relative z-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Master Google Cloud. <br />
          <span className="text-cyan-400 font-bold">
            Build Production-Ready Systems.
          </span>
        </h1>

        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-6">
          Step-by-step interactive roadmap from cloud zero to production architect. 
          Every node contains dual Google Cloud Console & gcloud CLI workflows, architecture flowcharts, and verified safe labs.
        </p>

        {/* Action & Stats Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTopicId(recommendedNextTopic.id)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 text-sm transition-all transform active:scale-95"
          >
            <span>Resume: {recommendedNextTopic.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-slate-300">
            <span className="text-slate-400">Mastery:</span>
            <span className="text-cyan-400 font-bold">{completedTopics.length} / {totalTopics}</span>
            <span className="text-slate-400">({progression.percent}%)</span>
          </div>
        </div>

        {/* Branch Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 max-w-4xl mx-auto">
          {branchFilters.map(bf => {
            const Icon = bf.icon;
            const isSelected = selectedBranch === bf.id;
            return (
              <button
                key={bf.id}
                onClick={() => setSelectedBranch(bf.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{bf.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Canvas Floating Controls */}
      <div className="sticky top-20 z-30 self-end mr-6 sm:mr-12 mb-2 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
        <button
          onClick={() => handleZoom(0.1)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setRoadmapZoom(1)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-mono px-2"
          title="Reset Zoom"
        >
          {Math.round(roadmapZoom * 100)}%
        </button>
        <div className="w-[1px] h-4 bg-slate-800" />
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Interactive Visual Roadmap Stream */}
      <div 
        className="w-full max-w-4xl px-4 pb-24 transition-transform duration-150 origin-top"
        style={{ transform: `scale(${roadmapZoom})` }}
      >
        <div className="relative">
          {/* Vertical central connection spine */}
          <div className="absolute left-1/2 -ml-[1px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500/50 via-blue-500/30 to-purple-500/40 hidden md:block" />

          {ROADMAP_STAGES.map((stage, stageIndex) => {
            // Filter topics in stage by selected branch if not 'all'
            const visibleTopics = stage.topics.filter(t => selectedBranch === 'all' || t.branch === selectedBranch);

            if (visibleTopics.length === 0 && selectedBranch !== 'all') {
              return null;
            }

            const stageCompletedCount = stage.topics.filter(t => completedTopics.includes(t.id)).length;
            const stagePercent = stage.topics.length > 0 ? Math.round((stageCompletedCount / stage.topics.length) * 100) : 0;

            return (
              <div key={stage.stage} className="mb-14 relative z-10">
                
                {/* Stage Header Block */}
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-slate-900/95 border border-slate-700/80 px-4 py-1.5 rounded-full shadow-lg shadow-black/40 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-cyan-300 font-bold tracking-wide uppercase">{stage.name}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400 font-medium">{stagePercent}% Complete</span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-md text-center mt-2 px-4">{stage.description}</p>
                </div>

                {/* Topic Nodes Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {visibleTopics.map((topic, topicIdx) => {
                    const isCompleted = completedTopics.includes(topic.id);
                    const isInProgress = inProgressTopics.includes(topic.id);
                    const isRecommended = topic.id === recommendedNextTopic.id;
                    
                    // Node card styling based on state
                    let statusClasses = 'border-slate-800 bg-[#0d1424]/90 hover:border-slate-600';
                    let badgeLabel = 'Not Started';
                    let badgeClasses = 'bg-slate-800/80 text-slate-400 border-slate-700';

                    if (isCompleted) {
                      statusClasses = 'border-emerald-500/50 bg-[#091b19]/90 hover:border-emerald-400 shadow-md shadow-emerald-950/20';
                      badgeLabel = 'Completed';
                      badgeClasses = 'bg-emerald-950 text-emerald-400 border-emerald-800/60';
                    } else if (isRecommended) {
                      statusClasses = 'border-cyan-400/80 bg-[#0d1e38]/95 ring-1 ring-cyan-400/40 shadow-lg shadow-cyan-950/30';
                      badgeLabel = 'Next Recommended';
                      badgeClasses = 'bg-cyan-950 text-cyan-300 border-cyan-800 font-semibold';
                    } else if (isInProgress) {
                      statusClasses = 'border-blue-500/50 bg-[#0d1b33]/90';
                      badgeLabel = 'In Progress';
                      badgeClasses = 'bg-blue-950 text-blue-300 border-blue-800';
                    }

                    return (
                      <div
                        key={topic.id}
                        onClick={() => setActiveTopicId(topic.id)}
                        className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${statusClasses} hover:translate-y-[-2px]`}
                      >
                        {/* Status & Meta Header */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${badgeClasses}`}>
                            {badgeLabel}
                          </span>
                          
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{topic.estimatedTime}</span>
                          </div>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                          <span>{topic.title}</span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                          )}
                        </h3>

                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {topic.subtitle}
                        </p>

                        {/* Badges footer */}
                        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                          <span className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-300">
                            {topic.level}
                          </span>
                          {topic.freeTierEligible && (
                            <span className="px-1.5 py-0.5 bg-emerald-950/60 text-emerald-400 rounded border border-emerald-800/40">
                              Free Tier
                            </span>
                          )}
                          {topic.costWarning && (
                            <span className="px-1.5 py-0.5 bg-amber-950/60 text-amber-400 rounded border border-amber-800/40">
                              Cost Alert
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stage connector line to next stage */}
                {stageIndex < ROADMAP_STAGES.length - 1 && (
                  <div className="flex justify-center my-4">
                    <div className="w-[2px] h-8 bg-gradient-to-b from-blue-500/40 to-cyan-500/40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
