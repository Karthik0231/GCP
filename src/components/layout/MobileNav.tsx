import React, { useState } from 'react';
import { Activity, BookOpen, Compass, FolderKanban, Layers, Menu, Search, Sparkles, Terminal, X } from 'lucide-react';
import { useLearningStore } from '../../store/useLearningStore';

type MobileView = 'roadmap' | 'topics' | 'labs' | 'projects' | 'commands' | 'architecture' | 'interview';

const primaryItems: { view: MobileView; label: string; icon: React.ElementType }[] = [
  { view: 'roadmap', label: 'Map', icon: Compass },
  { view: 'topics', label: 'Topics', icon: BookOpen },
  { view: 'labs', label: 'Labs', icon: Activity },
  { view: 'projects', label: 'Build', icon: FolderKanban }
];

const moreItems: { view: 'commands' | 'architecture' | 'interview'; label: string; icon: React.ElementType }[] = [
  { view: 'commands', label: 'CLI commands', icon: Terminal },
  { view: 'architecture', label: 'Architectures', icon: Layers },
  { view: 'interview', label: 'Revision', icon: Sparkles }
];

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, setIsSearchOpen } = useLearningStore();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const chooseView = (view: MobileView) => {
    setActiveView(view);
    setIsMoreOpen(false);
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-[#080c14]/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {primaryItems.map(({ view, label, icon: Icon }) => (
          <button
            key={view}
            type="button"
            aria-current={activeView === view ? 'page' : undefined}
            aria-label={label}
            onClick={() => chooseView(view)}
            className={`flex min-h-14 min-w-12 flex-1 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium transition-colors ${
              activeView === view ? 'text-cyan-300' : 'text-slate-500'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
        <button
          type="button"
          aria-expanded={isMoreOpen}
          aria-label="More navigation"
          onClick={() => setIsMoreOpen(open => !open)}
          className={`flex min-h-14 min-w-12 flex-1 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium transition-colors ${isMoreOpen || ['commands', 'architecture', 'interview'].includes(activeView) ? 'text-cyan-300' : 'text-slate-500'}`}
        >
          {isMoreOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          <span>More</span>
        </button>
        <button
          type="button"
          aria-label="Open search"
          onClick={() => setIsSearchOpen(true)}
          className="flex min-h-14 min-w-12 flex-1 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium text-slate-500 transition-colors"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Search</span>
        </button>
      </div>
      {isMoreOpen && (
        <div className="absolute bottom-full left-2 right-2 mb-2 rounded-2xl border border-slate-700 bg-[#0b101d] p-2 shadow-2xl">
          {moreItems.map(({ view, label, icon: Icon }) => (
            <button
              type="button"
              key={view}
              onClick={() => chooseView(view)}
              className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-slate-200 hover:bg-slate-800"
            >
              <Icon className="h-4 w-4 text-cyan-300" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
