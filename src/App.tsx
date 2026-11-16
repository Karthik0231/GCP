import React from 'react';
import { Header } from './components/layout/Header';
import { ResponsiveRoadmap } from './components/roadmap/ResponsiveRoadmap';
import { TopicExplorer } from './components/topics/TopicExplorer';
import { LabsView } from './components/labs/LabsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { CommandCenterView } from './components/commands/CommandCenterView';
import { ArchitectureView } from './components/architecture/ArchitectureView';
import { InterviewView } from './components/interview/InterviewView';
import { TopicReaderModal } from './components/learning/TopicReaderModal';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { MobileNav } from './components/layout/MobileNav';
import { useLearningStore } from './store/useLearningStore';
import { TOPIC_NODES } from './data/curriculum';
import { ExternalLink, Compass, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const { activeView, activeTopicId, setActiveTopicId } = useLearningStore();

  const activeTopic = activeTopicId ? TOPIC_NODES.find(t => t.id === activeTopicId) : null;

  return (
    <div className="min-h-screen bg-[#080c14] pb-14 text-slate-100 flex flex-col font-sans lg:pb-0">
      {/* Top Application Header */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {activeView === 'roadmap' && <ResponsiveRoadmap />}
        {activeView === 'topics' && <TopicExplorer />}
        {activeView === 'labs' && <LabsView />}
        {activeView === 'projects' && <ProjectsView />}
        {activeView === 'commands' && <CommandCenterView />}
        {activeView === 'architecture' && <ArchitectureView />}
        {activeView === 'interview' && <InterviewView />}
      </main>

      {/* Dedicated Topic Reader Modal / Interface */}
      {activeTopic && (
        <TopicReaderModal 
          topic={activeTopic} 
          onClose={() => setActiveTopicId(null)} 
        />
      )}

      {/* Global Command/Search Dialog (Cmd+K) */}
      <GlobalSearchModal />
      <MobileNav />

      {/* Application Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#060910] py-8 px-4 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">GCP Forge</span>
            <span>—</span>
            <span>Interactive Google Cloud Engineering Academy</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a 
              href="https://cloud.google.com/docs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <span>Official GCP Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://cloud.google.com/free" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <span>Always Free Tier</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://cloud.google.com/architecture" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <span>Architecture Center</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
