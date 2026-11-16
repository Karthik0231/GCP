import React from 'react';
import { 
  Compass, 
  Layers, 
  Terminal, 
  FolderKanban, 
  Activity, 
  Sparkles, 
  Search, 
  Flame, 
  Award, 
  BookOpen, 
  Sun, 
  Moon,
  Bookmark
} from 'lucide-react';
import { useLearningStore, calculateProgression } from '../../store/useLearningStore';
import { TOPIC_NODES } from '../../data/curriculum';

export const Header: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    setIsSearchOpen, 
    completedTopics, 
    streak, 
    theme, 
    toggleTheme 
  } = useLearningStore();

  const totalTopics = TOPIC_NODES.length;
  const progression = calculateProgression(completedTopics.length, totalTopics);

  return (
    <header className="forge-header sticky top-0 z-40 w-full border-b border-slate-800 bg-[#080c14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <button type="button" aria-label="Open roadmap" className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg" onClick={() => setActiveView('roadmap')}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Compass className="w-5 h-5 text-white animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-base">GCP FORGE</span>
              <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-1.5 py-0.5 rounded font-semibold">Academy</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Google Cloud Engineering</p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav aria-label="Primary navigation" className="forge-nav hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          <button type="button"
            onClick={() => setActiveView('roadmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'roadmap'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            Roadmap
          </button>

          <button type="button"
            onClick={() => setActiveView('topics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'topics'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Explore Topics
          </button>

          <button type="button"
            onClick={() => setActiveView('labs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'labs'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            Labs
          </button>

          <button type="button"
            onClick={() => setActiveView('projects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'projects'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
            Projects
          </button>

          <button type="button"
            onClick={() => setActiveView('commands')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'commands'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            Commands
          </button>

          <button type="button"
            onClick={() => setActiveView('architecture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'architecture'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Architectures
          </button>

          <button type="button"
            onClick={() => setActiveView('interview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'interview'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            Revision
          </button>
        </nav>

        {/* Right Actions: Search, Streak, Level Progress, Theme */}
        <div className="flex items-center gap-2.5">
          {/* Search Trigger button */}
          <button type="button"
            onClick={() => setIsSearchOpen(true)}
            className="forge-control flex items-center gap-2 px-2.5 py-1.5 text-xs transition-colors shadow-inner"
            title="Search curriculum, commands, labs (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block bg-slate-800 text-slate-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700">⌘K</kbd>
          </button>

          {/* Streak Indicator */}
          <div className="hidden sm:flex items-center gap-1 bg-amber-950/40 border border-amber-800/50 px-2 py-1 rounded-lg text-xs font-mono text-amber-300" title={`${streak} Day Streak!`}>
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{streak}d</span>
          </div>

          {/* User Level Progression Badge */}
          <button type="button"
            aria-label="Open roadmap progress"
            onClick={() => setActiveView('roadmap')}
            className="forge-control flex items-center gap-2 px-2.5 py-1 transition-all"
            title={`${completedTopics.length} of ${totalTopics} topics mastered (${progression.percent}%)`}
          >
            <Award className="w-4 h-4 text-cyan-400" />
            <div className="text-left hidden md:block">
              <div className="text-[10px] text-slate-400 font-mono leading-none">Lvl {progression.levelNumber}</div>
              <div className="text-xs font-semibold text-slate-200 leading-tight">{progression.levelName}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[11px] font-mono font-bold text-cyan-400 border border-cyan-500/30">
              {progression.percent}%
            </div>
          </button>

          {/* Theme switcher */}
          <button type="button"
            aria-label="Toggle color theme"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-colors"
            title="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 bg-slate-950/80 border-t border-slate-900 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveView('roadmap')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeView === 'roadmap' ? 'bg-cyan-900/40 text-cyan-300 font-semibold' : 'text-slate-400'}`}
        >
          Roadmap
        </button>
        <button
          onClick={() => setActiveView('topics')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeView === 'topics' ? 'bg-cyan-900/40 text-cyan-300 font-semibold' : 'text-slate-400'}`}
        >
          Topics
        </button>
        <button
          onClick={() => setActiveView('labs')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeView === 'labs' ? 'bg-cyan-900/40 text-cyan-300 font-semibold' : 'text-slate-400'}`}
        >
          Labs
        </button>
        <button
          onClick={() => setActiveView('projects')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeView === 'projects' ? 'bg-cyan-900/40 text-cyan-300 font-semibold' : 'text-slate-400'}`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveView('commands')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeView === 'commands' ? 'bg-cyan-900/40 text-cyan-300 font-semibold' : 'text-slate-400'}`}
        >
          Commands
        </button>
        <button
          onClick={() => setActiveView('architecture')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeView === 'architecture' ? 'bg-cyan-900/40 text-cyan-300 font-semibold' : 'text-slate-400'}`}
        >
          Architectures
        </button>
        <button
          onClick={() => setActiveView('interview')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeView === 'interview' ? 'bg-cyan-900/40 text-cyan-300 font-semibold' : 'text-slate-400'}`}
        >
          Revision
        </button>
      </div>
    </header>
  );
};

