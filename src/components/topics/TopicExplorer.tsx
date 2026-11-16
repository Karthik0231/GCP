import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  ArrowRight,
  Shield, 
  Cpu, 
  Network, 
  Database, 
  Boxes, 
  Terminal, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useLearningStore } from '../../store/useLearningStore';
import { TOPIC_NODES } from '../../data/curriculum';
import { BranchId, DifficultyLevel } from '../../types';

export const TopicExplorer: React.FC = () => {
  const { 
    completedTopics, 
    inProgressTopics, 
    setActiveTopicId,
    selectedBranch,
    setSelectedBranch,
    selectedDifficulty,
    setSelectedDifficulty
  } = useLearningStore();

  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  const filteredTopics = TOPIC_NODES.filter(topic => {
    // Search query match
    if (localSearch) {
      const q = localSearch.toLowerCase();
      const match = topic.title.toLowerCase().includes(q) ||
        topic.subtitle.toLowerCase().includes(q) ||
        topic.simpleExplanation.toLowerCase().includes(q) ||
        topic.branch.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Branch filter
    if (selectedBranch !== 'all' && topic.branch !== selectedBranch) {
      return false;
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all' && topic.level !== selectedDifficulty) {
      return false;
    }

    // Status filter
    const isCompleted = completedTopics.includes(topic.id);
    if (statusFilter === 'completed' && !isCompleted) return false;
    if (statusFilter === 'incomplete' && isCompleted) return false;

    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-cyan-400" />
          Curriculum Topic Explorer
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Search and filter the complete Google Cloud engineering syllabus across all 20 curriculum phases.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0b101d] border border-slate-800 p-4 rounded-xl space-y-3 mb-6 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search topics (e.g., VPC, Cloud Run, IAM, GKE, Terraform)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded ${statusFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'}`}
            >
              All ({TOPIC_NODES.length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded ${statusFilter === 'completed' ? 'bg-emerald-950 text-emerald-300 font-semibold' : 'text-slate-400'}`}
            >
              Completed ({completedTopics.length})
            </button>
            <button
              onClick={() => setStatusFilter('incomplete')}
              className={`px-3 py-1 rounded ${statusFilter === 'incomplete' ? 'bg-cyan-900/40 text-cyan-300 font-semibold' : 'text-slate-400'}`}
            >
              Remaining ({TOPIC_NODES.length - completedTopics.length})
            </button>
          </div>
        </div>

        {/* Difficulty and Branch filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Level:</span>
          {(['all', 'Beginner', 'Intermediate', 'Advanced', 'Architect'] as (DifficultyLevel | 'all')[]).map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedDifficulty(lvl)}
              className={`px-2.5 py-1 rounded border text-[11px] capitalize ${
                selectedDifficulty === lvl
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map(topic => {
          const isCompleted = completedTopics.includes(topic.id);
          const isInProgress = inProgressTopics.includes(topic.id);

          return (
            <button
              type="button"
              key={topic.id}
              onClick={() => setActiveTopicId(topic.id)}
              className={`w-full text-left p-4 rounded-xl border cursor-pointer transition-all hover:translate-y-[-2px] flex flex-col justify-between ${
                isCompleted 
                  ? 'bg-[#091b19]/80 border-emerald-500/40 hover:border-emerald-400' 
                  : 'bg-[#0b101d] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-cyan-400 capitalize">{topic.branch}</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {topic.estimatedTime}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300">
                  {topic.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {topic.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[10px] border border-slate-800">
                  {topic.level}
                </span>

                <div className="flex items-center gap-1.5 font-medium">
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  ) : (
                    <span className="text-cyan-400 flex items-center gap-1 text-xs">
                      Learn <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="text-center py-16 bg-[#0b101d] rounded-xl border border-slate-800 text-slate-400 text-xs">
          No topics matched your search criteria. Try clearing the filters.
        </div>
      )}
    </div>
  );
};

