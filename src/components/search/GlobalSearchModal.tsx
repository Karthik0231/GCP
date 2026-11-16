import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Terminal, 
  Activity, 
  FolderKanban, 
  Layers, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { useLearningStore } from '../../store/useLearningStore';
import { TOPIC_NODES } from '../../data/curriculum';
import { COMMAND_LIBRARY } from '../../data/commands';
import { HANDS_ON_LABS } from '../../data/labsSprint21';
import { REAL_WORLD_PROJECTS } from '../../data/projects';
import { ARCHITECTURE_CATALOG } from '../../data/architectures';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    setActiveTopicId, 
    setActiveView 
  } = useLearningStore();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K & Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  // Matched categories
  const matchedTopics = q 
    ? TOPIC_NODES.filter(t => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q) || t.branch.toLowerCase().includes(q)).slice(0, 5)
    : TOPIC_NODES.slice(0, 3);

  const matchedCommands = q
    ? COMMAND_LIBRARY.filter(c => c.command.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)).slice(0, 4)
    : COMMAND_LIBRARY.slice(0, 2);

  const matchedLabs = q
    ? HANDS_ON_LABS.filter(l => l.title.toLowerCase().includes(q) || l.objective.toLowerCase().includes(q) || l.category.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchedProjects = q
    ? REAL_WORLD_PROJECTS.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const handleSelectTopic = (id: string) => {
    setIsSearchOpen(false);
    setActiveTopicId(id);
  };

  const handleSelectTab = (view: 'commands' | 'labs' | 'projects' | 'architecture') => {
    setIsSearchOpen(false);
    setActiveView(view);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex justify-center p-4 pt-16 sm:pt-24 animate-fadeIn" role="presentation">
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
        className="w-full max-w-2xl bg-[#0b0f19] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-[#0d1424]">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, CLI commands, labs, projects (e.g. VPC, Cloud Run, GKE)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-5 text-xs">
          
          {/* Matched Topics */}
          {matchedTopics.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                Curriculum Topics
              </div>
              <div className="space-y-1">
                {matchedTopics.map(topic => (
                  <button
                    type="button"
                    key={topic.id}
                    aria-label={`Open topic ${topic.title}`}
                    onClick={() => handleSelectTopic(topic.id)}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 flex items-center justify-between transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <span>
                      <span className="block font-semibold text-slate-200">{topic.title}</span>
                      <span className="block text-[11px] text-slate-400 line-clamp-1">{topic.subtitle}</span>
                    </span>
                    <span className="text-cyan-400 font-mono text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {topic.level}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Commands */}
          {matchedCommands.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                Google Cloud Commands
              </div>
              <div className="space-y-1">
                {matchedCommands.map(cmd => (
                  <button
                    type="button"
                    key={cmd.id}
                    aria-label={`Open command ${cmd.command}`}
                    onClick={() => handleSelectTab('commands')}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-blue-500/40 flex items-center justify-between transition-colors font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <span>
                      <code className="text-cyan-300 font-bold">{cmd.command}</code>
                      <span className="block text-[11px] text-slate-400 line-clamp-1 font-sans">{cmd.description}</span>
                    </span>
                    <span className="text-slate-400 text-[10px] px-1.5 py-0.5 bg-slate-950 rounded">
                      {cmd.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Labs */}
          {matchedLabs.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Hands-on Labs
              </div>
              <div className="space-y-1">
                {matchedLabs.map(lab => (
                  <button
                    type="button"
                    key={lab.id}
                    aria-label={`Open lab ${lab.title}`}
                    onClick={() => handleSelectTab('labs')}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/40 flex items-center justify-between transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <span>
                      <span className="block font-semibold text-slate-200">{lab.title}</span>
                      <span className="block text-[11px] text-slate-400 line-clamp-1">{lab.objective}</span>
                    </span>
                    <span className="text-emerald-400 font-mono text-[10px]">
                      {lab.estimatedCost}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Projects */}
          {matchedProjects.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-amber-400" />
                Real-World Projects
              </div>
              <div className="space-y-1">
                {matchedProjects.map(proj => (
                  <button
                    type="button"
                    key={proj.id}
                    aria-label={`Open project ${proj.title}`}
                    onClick={() => handleSelectTab('projects')}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-amber-500/40 flex items-center justify-between transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <span>
                      <span className="block font-semibold text-slate-200">{proj.title}</span>
                      <span className="block text-[11px] text-slate-400 line-clamp-1">{proj.description}</span>
                    </span>
                    <span className="text-amber-400 font-mono text-[10px]">
                      Project #{proj.number}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#0d1424] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Navigate with click or Enter</span>
          <span>Esc to exit</span>
        </div>

      </div>
    </div>
  );
};

