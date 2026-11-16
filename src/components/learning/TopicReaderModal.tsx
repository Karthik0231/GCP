import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Bookmark, 
  Copy, 
  Check, 
  AlertTriangle, 
  ExternalLink, 
  Terminal, 
  Monitor, 
  FileCode, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  HelpCircle, 
  CheckSquare, 
  Lightbulb,
  Sparkles,
  Info
} from 'lucide-react';
import { useLearningStore } from '../../store/useLearningStore';
import { TOPIC_NODES } from '../../data/curriculum';
import { TopicNode } from '../../types';

interface TopicReaderModalProps {
  topic: TopicNode;
  onClose: () => void;
}

export const TopicReaderModal: React.FC<TopicReaderModalProps> = ({ topic, onClose }) => {
  const { 
    completedTopics, 
    toggleTopicCompletion, 
    bookmarks, 
    toggleBookmark,
    setActiveTopicId,
    topicProgress,
    setTopicProgress,
    resetTopicProgress,
    recordActivity
  } = useLearningStore();

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const storedTopicProgress = topicProgress[topic.id];
  const savedTopicProgress = {
    activeSection: storedTopicProgress?.activeSection ?? 'console' as const,
    quizAnswers: storedTopicProgress?.quizAnswers || {},
    completedExerciseSteps: Array.isArray(storedTopicProgress?.completedExerciseSteps) ? storedTopicProgress.completedExerciseSteps : [],
    updatedAt: storedTopicProgress?.updatedAt || '',
  };
  const activeTab = savedTopicProgress.activeSection === 'terraform' && !topic.terraformSnippet
    ? 'console'
    : savedTopicProgress.activeSection;
  const selectedQuizAnswers = savedTopicProgress.quizAnswers;
  const completedLabSteps = Object.fromEntries(savedTopicProgress.completedExerciseSteps.map(step => [step, true]));

  const isCompleted = completedTopics.includes(topic.id);
  const isBookmarked = bookmarks.includes(topic.id);

  // Find previous and next topics in sequence
  const currentIndex = TOPIC_NODES.findIndex(t => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? TOPIC_NODES[currentIndex - 1] : null;
  const nextTopic = currentIndex < TOPIC_NODES.length - 1 ? TOPIC_NODES[currentIndex + 1] : null;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  const handleCopy = async (text: string, index: number) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(text);
      setCopyError(null);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setCopiedIndex(null);
      setCopyError('Copy failed. Select the command and copy it manually.');
      setTimeout(() => setCopyError(null), 4000);
    }
  };

  const handleSelectQuiz = (questionIdx: number, optionIdx: number) => {
    setTopicProgress(topic.id, { quizAnswers: { ...selectedQuizAnswers, [questionIdx]: optionIdx } });
    recordActivity();
  };

  const toggleLabStep = (stepIdx: number) => {
    const completedExerciseSteps = savedTopicProgress.completedExerciseSteps.includes(stepIdx)
      ? savedTopicProgress.completedExerciseSteps.filter(step => step !== stepIdx)
      : [...savedTopicProgress.completedExerciseSteps, stepIdx];
    setTopicProgress(topic.id, { completedExerciseSteps });
    recordActivity();
  };

  const resetTopicLearning = () => {
    if (window.confirm('Reset this topic learning progress? Quiz answers and exercise checks for this topic will be cleared. Bookmarks and other topics stay unchanged.')) {
      resetTopicProgress(topic.id);
    }
  };

  const selectImplementationTab = (tab: 'console' | 'cli' | 'terraform') => {
    setTopicProgress(topic.id, { activeSection: tab });
  };

  const moveImplementationTab = (tab: 'console' | 'cli' | 'terraform', direction: 1 | -1) => {
    const tabs = topic.terraformSnippet ? ['console', 'cli', 'terraform'] : ['console', 'cli'];
    const index = tabs.indexOf(tab);
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    selectImplementationTab(tabs[nextIndex] as 'console' | 'cli' | 'terraform');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center p-2 sm:p-4 md:p-6 animate-fadeIn" role="presentation">
      <div className="sr-only" aria-live="polite">Learning sequence: understand, explore architecture, implement, practise, verify, troubleshoot, revise, test yourself.</div>
      <div className="mx-auto mb-3 w-full max-w-5xl rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-[11px] text-slate-400">
        <span className="font-semibold text-cyan-300">Learning path:</span> understand · architecture · console · CLI/Terraform · practise · verify · troubleshoot · revise
      </div>
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="topic-reader-title" className="relative w-full max-w-4xl bg-[#0b0f19] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] focus:outline-none">
        
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-30 bg-[#0e1526]/95 backdrop-blur border-b border-slate-800 px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>{topic.stageName}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400 capitalize">{topic.branch}</span>
            </div>
            <h2 id="topic-reader-title" className="text-lg sm:text-xl font-bold text-white truncate">{topic.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Mark as Completed Button */}
            <button
              type="button"
              aria-pressed={isCompleted}
              aria-label={isCompleted ? 'Mark topic incomplete' : 'Mark topic complete'}
              onClick={() => toggleTopicCompletion(topic.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isCompleted
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60 shadow-sm shadow-emerald-950/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>

            {/* Bookmark button */}
            <button
              type="button"
              aria-pressed={isBookmarked}
              aria-label={isBookmarked ? 'Remove topic bookmark' : 'Bookmark topic'}
              onClick={() => toggleBookmark(topic.id)}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isBookmarked 
                  ? 'bg-amber-950/50 border-amber-600/50 text-amber-400' 
                  : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="Bookmark topic"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={resetTopicLearning}
              className="hidden sm:inline-flex px-2 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              Reset learning
            </button>

            {/* Close Button */}
            <button
              type="button"
              aria-label="Close topic reader"
              onClick={onClose}
              className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <span className="sr-only" aria-live="polite">{copyError || (copiedIndex !== null ? 'Copied to clipboard.' : '')}</span>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto px-5 sm:px-8 py-6 space-y-8 text-slate-200 text-sm">
          
          {/* Metadata pill row */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pb-4 border-b border-slate-800/80">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-semibold">
              Level: {topic.level}
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {topic.estimatedTime}
            </span>
            {topic.freeTierEligible && (
              <span className="px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-800/50 text-emerald-400">
                May qualify for Free Tier; eligibility, region, account, product, and usage limits apply
              </span>
            )}
            {topic.prerequisites.length > 0 && (
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                Prerequisites: {topic.prerequisites.join(', ')}
              </span>
            )}
          </div>

          <div aria-label="Implementation path preference" className="flex flex-wrap gap-2">
            {(['console', 'cli', 'terraform'] as const).filter(tab => tab !== 'terraform' || topic.terraformSnippet).map(tab => (
              <button
                type="button"
                key={tab}
                aria-pressed={activeTab === tab}
                onClick={() => selectImplementationTab(tab)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${activeTab === tab ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-200' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'}`}
              >
                {tab === 'cli' ? 'CLI' : tab}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-400 space-y-1">
            <p>Content status: <span className="text-cyan-300">{topic.verificationStatus || 'unverified'}</span></p>
            {(topic.lastVerifiedAt || topic.lastVerified) && <p>Documentation review: {topic.lastVerifiedAt || topic.lastVerified}</p>}
            {topic.costWarning && <p className="text-amber-300">Cost note: {topic.costWarning}</p>}
            <a href={topic.docUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1">
              Official documentation <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Section 1: Simple Explanation & Analogy */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-bold">
              <Lightbulb className="w-4 h-4" />
              1. Simple Explanation
            </div>
            <p className="text-base text-slate-100 font-medium leading-relaxed">
              {topic.simpleExplanation}
            </p>
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-xs leading-relaxed">
              <strong className="text-cyan-400 font-semibold block mb-1">Real-World Analogy:</strong>
              {topic.analogy}
            </div>
          </section>

          {/* Section 2: Why it exists */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-bold">
              <Sparkles className="w-4 h-4" />
              2. Why It Exists (The Problem Solved)
            </div>
            <p className="leading-relaxed text-slate-300">
              {topic.whyItExists}
            </p>
          </section>

          {/* Section 3: How it works internally */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-bold">
              <Info className="w-4 h-4" />
              3. How It Works Internally
            </div>
            <p className="leading-relaxed text-slate-300">
              {topic.howItWorks}
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400 leading-relaxed">
              <span className="text-slate-200 font-semibold block mb-1">Architecture Note:</span>
              {topic.internalDetails}
            </div>
          </section>

          {/* Section 4: Dual Learning System (Console / CLI / Terraform) */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="text-cyan-400 text-xs font-mono uppercase tracking-wider font-bold">
                4. Implementation Workflows
              </div>
              <div role="tablist" aria-label="Implementation workflows" className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  role="tab"
                  id="topic-implementation-tab-console"
                  aria-controls="topic-implementation-panel-console"
                  aria-selected={activeTab === 'console'}
                  onClick={() => selectImplementationTab('console')}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveImplementationTab('console', 1); }
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveImplementationTab('console', -1); }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                    activeTab === 'console' 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Console
                </button>
                <button
                  type="button"
                  role="tab"
                  id="topic-implementation-tab-cli"
                  aria-controls="topic-implementation-panel-cli"
                  aria-selected={activeTab === 'cli'}
                  onClick={() => selectImplementationTab('cli')}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveImplementationTab('cli', 1); }
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveImplementationTab('cli', -1); }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                    activeTab === 'cli' 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  gcloud CLI
                </button>
                {topic.terraformSnippet && (
                  <button
                    type="button"
                    role="tab"
                    id="topic-implementation-tab-terraform"
                    aria-controls="topic-implementation-panel-terraform"
                    aria-selected={activeTab === 'terraform'}
                    onClick={() => selectImplementationTab('terraform')}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveImplementationTab('terraform', 1); }
                      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveImplementationTab('terraform', -1); }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                      activeTab === 'terraform' 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    Terraform
                  </button>
                )}
              </div>
            </div>

            {/* Tab: Google Cloud Console */}
            {activeTab === 'console' && (
              <div id="topic-implementation-panel-console" role="tabpanel" aria-labelledby="topic-implementation-tab-console" className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs font-mono text-cyan-400 font-semibold mb-2">Google Cloud Console Walkthrough:</div>
                {topic.consoleSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-300 flex items-center justify-center font-mono font-bold flex-shrink-0 text-[11px] border border-slate-700">
                      {step.step}
                    </span>
                    <div>
                      <div className="font-semibold text-white mb-0.5">{step.title}</div>
                      <div className="text-slate-400">{step.instruction}</div>
                      {step.navigation && <div className="mt-1 text-slate-300"><span className="text-cyan-300">Navigate:</span> {step.navigation}</div>}
                      {step.setting && <div className="text-slate-300"><span className="text-cyan-300">Setting:</span> {step.setting}{step.exampleValue ? ` — ${step.exampleValue}` : ''}</div>}
                      {step.why && <div className="text-slate-400"><span className="text-slate-300">Why:</span> {step.why}</div>}
                      {step.expectedResult && <div className="text-emerald-300"><span className="text-emerald-400">Expected:</span> {step.expectedResult}</div>}
                      {step.verification && <div className="text-cyan-300"><span className="text-cyan-400">Verify:</span> {step.verification}</div>}
                      {step.warning && <div className="text-amber-300"><span className="text-amber-400">Warning:</span> {step.warning}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: gcloud CLI */}
            {activeTab === 'cli' && (
              <div id="topic-implementation-panel-cli" role="tabpanel" aria-labelledby="topic-implementation-tab-cli" className="space-y-4">
                {topic.cliCommands.map((cmd, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-400">{cmd.explanation}</span>
                      <button
                        onClick={() => handleCopy(cmd.command, idx)}
                        className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <pre className="p-3 rounded-lg bg-slate-900/90 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800">
                      <code>{cmd.command}</code>
                    </pre>

                    {cmd.flags && cmd.flags.length > 0 && (
                      <div className="text-[11px] space-y-1 pt-1">
                        <span className="text-slate-400 font-mono font-semibold">Key Flags:</span>
                        {cmd.flags.map((f, fi) => (
                          <div key={fi} className="text-slate-400 flex gap-2 font-mono">
                            <span className="text-slate-300 font-semibold">{f.flag}:</span>
                            <span className="text-slate-400">{f.purpose}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {cmd.output && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Expected Output:</span>
                        <pre className="p-2 rounded bg-black/60 text-slate-400 font-mono text-[11px] overflow-x-auto">
                          <code>{cmd.output}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Terraform */}
            {activeTab === 'terraform' && topic.terraformSnippet && (
              <div id="topic-implementation-panel-terraform" role="tabpanel" aria-labelledby="topic-implementation-tab-terraform" className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Declarative Infrastructure as Code (HCL):</span>
                  <button
                    onClick={() => handleCopy(topic.terraformSnippet || '', 999)}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700"
                  >
                    {copiedIndex === 999 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === 999 ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900/90 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                  <code>{topic.terraformSnippet}</code>
                </pre>
              </div>
            )}
          </section>

          {/* Section 5: Common Mistakes */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-wider font-bold">
              <AlertTriangle className="w-4 h-4" />
              5. Common Production Mistakes & Fixes
            </div>
            <div className="space-y-2">
              {topic.commonMistakes.map((cm, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs space-y-1">
                  <div className="text-rose-300 font-semibold">❌ Mistake: {cm.mistake}</div>
                  <div className="text-slate-300 pl-4 border-l border-rose-700/50">✅ <strong>Fix:</strong> {cm.fix}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Security & Cost Implications */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider font-bold">
              <ShieldCheck className="w-4 h-4" />
              6. Security & Cost Implications
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-slate-100 block mb-1">Security Best Practice:</strong>
              {topic.securityImplications}
            </div>

            {topic.costWarning && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-200 text-xs leading-relaxed">
                <strong className="text-amber-400 font-semibold block mb-1">⚠️ Cost Notice:</strong>
                {topic.costWarning}
              </div>
            )}
          </section>

          {/* Section 7: Quick Revision */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-bold">
              <CheckSquare className="w-4 h-4" />
              7. Quick Revision (5 Key Takeaways)
            </div>
            <ul className="space-y-1.5 list-none">
              {topic.quickRevision.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 8: Knowledge Check Quiz */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-bold">
              <HelpCircle className="w-4 h-4" />
              8. Knowledge Check Quiz
            </div>
            {topic.quiz.map((q, qIdx) => {
              const selected = selectedQuizAnswers[qIdx];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === q.answerIndex;

              return (
                <div key={qIdx} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-200">{q.question}</div>
                  <div className="space-y-1.5">
                    {q.options.map((opt, oIdx) => {
                      let btnStyle = 'border-slate-800 bg-slate-900/80 hover:border-slate-700 text-slate-300';
                      if (isAnswered) {
                        if (oIdx === q.answerIndex) {
                          btnStyle = 'border-emerald-600 bg-emerald-950/50 text-emerald-300 font-medium';
                        } else if (selected === oIdx) {
                          btnStyle = 'border-rose-600 bg-rose-950/50 text-rose-300';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuiz(qIdx, oIdx)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && oIdx === q.answerIndex && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className={`p-2.5 rounded text-xs ${isCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}>
                      <strong className="block mb-0.5">{isCorrect ? '✓ Correct!' : 'Explanation:'}</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* Section 9: Practical Lab Task */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider font-bold">
              <CheckCircle2 className="w-4 h-4" />
              9. Practical Lab Exercise
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-white">{topic.labTask.title}</div>
              <p className="text-xs text-slate-400">{topic.labTask.objective}</p>
              
              <div className="space-y-2 pt-1">
                {topic.labTask.tasks.map((task, idx) => {
                  const isDone = !!completedLabSteps[idx];
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                        isDone ? 'bg-emerald-950/30 text-emerald-300' : 'bg-slate-900/60 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleLabStep(idx)}
                        aria-label={`Complete exercise step ${idx + 1}`}
                        className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                      />
                      <span className={isDone ? 'line-through text-slate-400' : ''}>{task}</span>
                    </div>
                  );
                })}
              </div>

              {topic.labTask.cleanupCommand && (
                <div className="pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono text-[11px] block mb-1">Safe Cleanup Command:</span>
                  <pre className="p-2 rounded bg-black/70 text-slate-400 font-mono text-[11px] overflow-x-auto">
                    <code>{topic.labTask.cleanupCommand}</code>
                  </pre>
                </div>
              )}
            </div>
          </section>

          {/* Section 10: Official Documentation & Verification */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <a
              href={topic.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 underline"
            >
              <span>Official Google Cloud Documentation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span>Verified: {topic.lastVerified} (Latest GA)</span>
          </div>

        </div>

        {/* Footer Navigation Bar */}
        <div className="sticky bottom-0 z-30 bg-[#0e1526]/95 backdrop-blur border-t border-slate-800 px-5 py-3 flex items-center justify-between gap-3">
          {prevTopic ? (
            <button
              onClick={() => setActiveTopicId(prevTopic.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous: {prevTopic.title}</span>
              <span className="sm:hidden">Prev</span>
            </button>
          ) : <div />}

          {nextTopic ? (
            <button
              onClick={() => setActiveTopicId(nextTopic.id)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-semibold text-xs text-slate-950 transition-colors ml-auto"
            >
              <span className="hidden sm:inline">Next: {nextTopic.title}</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-slate-950 transition-colors ml-auto"
            >
              Back to Roadmap
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

