import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Terminal, 
  Monitor, 
  AlertTriangle, 
  Trash2, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  ShieldAlert
} from 'lucide-react';
import { HANDS_ON_LABS } from '../../data/labsSprint21';
import { useLearningStore } from '../../store/useLearningStore';

export const LabsView: React.FC = () => {
  const [selectedLabId, setSelectedLabId] = useState<string>(HANDS_ON_LABS[0].id);
  const [activeStepTab, setActiveStepTab] = useState<'cli' | 'console'>('cli');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const { labProgress, setLabProgress, resetLabProgress, recordActivity } = useLearningStore();

  const activeLab = HANDS_ON_LABS.find(l => l.id === selectedLabId) || HANDS_ON_LABS[0];
  const storedProgress = labProgress[activeLab.id];
  const guideSteps = ['Overview', 'Prepare', 'Console', 'CLI', 'Verify', 'Troubleshoot', 'Cleanup'] as const;
  const normalizePhase = (phase: unknown) => typeof phase === 'number' && Number.isInteger(phase)
    ? Math.max(0, Math.min(phase, guideSteps.length - 1))
    : 0;
  const savedProgress = {
    activePhase: normalizePhase(storedProgress?.activePhase),
    completedPhases: Array.isArray(storedProgress?.completedPhases) ? storedProgress.completedPhases : [],
    completedVerificationItems: Array.isArray(storedProgress?.completedVerificationItems) ? storedProgress.completedVerificationItems : [],
    updatedAt: storedProgress?.updatedAt || '',
  };
  const guideStep = guideSteps[savedProgress.activePhase] || guideSteps[0];
  const hasLabProgress = savedProgress.activePhase > 0 || savedProgress.completedPhases.length > 0 || savedProgress.completedVerificationItems.length > 0;
  const verificationItemId = (item: string) => `verification:${item}`;

  const setGuideStep = (step: number) => setLabProgress(activeLab.id, { activePhase: step });
  const moveExecutionTab = (direction: 1 | -1) => {
    setActiveStepTab(activeStepTab === 'cli' && direction === 1 ? 'console' : activeStepTab === 'console' && direction === -1 ? 'cli' : activeStepTab);
  };
  const toggleVerificationItem = (itemId: string) => {
    const completedVerificationItems = savedProgress.completedVerificationItems.includes(itemId)
      ? savedProgress.completedVerificationItems.filter(value => value !== itemId)
      : [...savedProgress.completedVerificationItems, itemId];
    setLabProgress(activeLab.id, { completedVerificationItems });
    recordActivity();
  };
  const togglePhaseComplete = () => {
    const completedPhases = savedProgress.completedPhases.includes(savedProgress.activePhase)
      ? savedProgress.completedPhases.filter(value => value !== savedProgress.activePhase)
      : [...savedProgress.completedPhases, savedProgress.activePhase];
    setLabProgress(activeLab.id, { completedPhases });
    recordActivity();
  };
  const restartLab = () => {
    if (!hasLabProgress || window.confirm('Restart this lab? Only this lab progress will be cleared. Other labs, topics, and bookmarks stay unchanged.')) {
      resetLabProgress(activeLab.id);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(text);
      setCopyError(null);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setCopiedIndex(null);
      setCopyError('Copy failed. Select the command and copy it manually.');
      setTimeout(() => setCopyError(null), 4000);
    }
  };


  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <p className="sr-only" aria-live="polite">{copyError || (copiedIndex !== null ? 'Copied to clipboard.' : '')}</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-7 h-7 text-emerald-400" />
          Hands-on Lab System
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Perform production-grade operations in your own Google Cloud account with exact gcloud CLI and Console guidance, verification checklists, and cleanup commands.
        </p>
      </div>

      {/* Main Grid: Left Lab Picker, Right Active Lab Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Lab Selector Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 tracking-wider font-semibold mb-2">
            Available Practice Labs
          </div>
          {HANDS_ON_LABS.map(lab => {
            const isSelected = lab.id === activeLab.id;
            return (
              <button
                type="button"
                key={lab.id}
                aria-pressed={isSelected}
                aria-label={`Open ${lab.title}`}
                onClick={() => setSelectedLabId(lab.id)}
                className={`w-full text-left p-3.5 rounded-xl border cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isSelected 
                    ? 'bg-emerald-950/30 border-emerald-500/60 shadow-md shadow-emerald-950/20' 
                    : 'bg-[#0b101d] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span className="text-emerald-400">{lab.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lab.estimatedTime}
                  </span>
                </div>

                <div className="text-xs font-bold text-white mb-2">
                  {lab.title}
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    {lab.difficulty}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
                    {lab.estimatedCost}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Lab Detail Panel */}
        <div className="lg:col-span-8 bg-[#0b101d] border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6">
          
          {/* Lab Top Banner */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-2">
              <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800 font-semibold">
                {activeLab.category}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                Difficulty: {activeLab.difficulty}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {activeLab.estimatedTime}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                Estimated Cost: {activeLab.estimatedCost}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{activeLab.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{activeLab.objective}</p>
          </div>

          <section aria-labelledby="guided-lab-heading" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 id="guided-lab-heading" className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">Guided workflow</h4>
                <p className="text-xs text-slate-400 mt-1">Follow each phase. Checking a verification item records your learner evidence; it does not prove Google Cloud execution.</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-slate-300">
                  <p><span className="text-slate-500">Objective:</span> {activeLab.objective}</p>
                  <p><span className="text-slate-500">Difficulty / time:</span> {activeLab.difficulty} · {activeLab.estimatedTime}</p>
                  <p><span className="text-slate-500">Prerequisites:</span> {activeLab.prerequisites.join(', ') || 'None listed'}</p>
                  <p><span className="text-slate-500">Required APIs:</span> {activeLab.requiredApis.join(', ') || 'None listed'}</p>
                  <p className="text-amber-300"><span className="text-slate-500">Billing:</span> {activeLab.billingRequired ? 'Billing required.' : 'Billing may still apply.'} {activeLab.estimatedCost} Charges depend on account, region, quota, and usage.</p>
                  {activeLab.freeTier && <p className="text-amber-300">May qualify for Free Tier; account, product, region, quota, and usage limits apply.</p>}
                  {activeLab.billingCaveats?.map(caveat => <p key={caveat} className="text-amber-300"><span className="text-slate-500">Billing caveat:</span> {caveat}</p>)}
                  {activeLab.possibleCharges?.map(charge => <p key={charge} className="text-amber-300"><span className="text-slate-500">Possible charge:</span> {charge}</p>)}
                </div>
              </div>
              <button type="button" onClick={restartLab} className="text-xs text-slate-400 hover:text-white underline">Restart lab</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5" role="tablist" aria-label="Lab phases">
              {guideSteps.map((step, index) => (
                <button
                  key={step}
                  type="button"
                  role="tab"
                  id={`lab-phase-tab-${index}`}
                  aria-controls="lab-phase-panel"
                  aria-selected={savedProgress.activePhase === index}
                  onClick={() => setGuideStep(index)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); setGuideStep(Math.min(index + 1, guideSteps.length - 1)); }
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); setGuideStep(Math.max(index - 1, 0)); }
                    if (event.key === 'Home') { event.preventDefault(); setGuideStep(0); }
                    if (event.key === 'End') { event.preventDefault(); setGuideStep(guideSteps.length - 1); }
                  }}
                  className={`min-h-10 rounded-lg border px-2 py-1.5 text-[11px] font-medium ${savedProgress.activePhase === index ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-200' : savedProgress.completedPhases.includes(index) ? 'border-emerald-800/60 bg-emerald-950/20 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'}`}
                >{index + 1}. {step}</button>
              ))}
            </div>
            <div id="lab-phase-panel" role="tabpanel" aria-labelledby={`lab-phase-tab-${savedProgress.activePhase}`} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
              {guideStep === 'Overview' && <div className="space-y-2"><p className="text-slate-200">{activeLab.objective}</p><p className="text-xs text-slate-400">Prerequisites: {activeLab.prerequisites.join(', ') || 'None listed'}</p><p className="text-xs text-slate-400">Required APIs: {activeLab.requiredApis.join(', ') || 'None listed'}</p></div>}
              {guideStep === 'Prepare' && <div className="space-y-2"><p className="text-slate-300">Prepare identity, APIs, quota, and billing before creating resources.</p><p className="text-xs text-slate-400">Role boundary: an administrator may need to enable APIs or grant project IAM. Learner permissions: {activeLab.requiredPermissions?.join(', ') || 'See provider documentation and project IAM.'}</p>{activeLab.setupSteps?.map(step => <p key={step} className="text-xs text-slate-400">• {step}</p>)}</div>}
              {guideStep === 'Console' && (activeLab.consoleGuide?.length ? <ol className="list-decimal pl-5 space-y-3">{activeLab.consoleGuide.map(step => <li key={step.navigation} className="pl-1 text-slate-300"><span className="font-semibold text-cyan-200">{step.navigation}</span><br />{step.action}{step.setting && <><br /><span className="text-xs text-slate-400">Setting: {step.setting}{step.exampleValue ? ` — ${step.exampleValue}` : ''}</span></>}<br /><span className="text-xs text-slate-400">Why: {step.why}</span><br /><span className="text-xs text-emerald-300">Expected: {step.expectedResult}</span>{step.verification && <><br /><span className="text-xs text-cyan-300">Verify: {step.verification}</span></>}{step.warning && <><br /><span className="text-xs text-amber-300">Warning: {step.warning}</span></>}</li>)}</ol> : <><p className="text-xs text-amber-300">Detailed Console walkthrough not yet verified for this lab. Basic guidance follows.</p><ol className="list-decimal pl-5 space-y-2">{activeLab.consoleSteps.map(step => <li key={step} className="text-slate-300">{step}</li>)}</ol></>)}
              {guideStep === 'CLI' && <p className="text-slate-300">Use the CLI alternative in Execution Steps below. Copy commands one at a time and verify output before continuing.</p>}
              {guideStep === 'Verify' && <div className="space-y-2">{activeLab.verificationSteps?.map(step => <p key={step} className="text-slate-300">• {step}</p>)}<p className="text-xs text-amber-300">Content status: {activeLab.verificationStatus === 'needs-review' ? 'Needs real-cloud review' : activeLab.verificationStatus || 'Not stated'}. Learner checklist is self-attested evidence only.</p>{activeLab.verificationChecklist.map(item => { const itemId = verificationItemId(item); return <label key={itemId} className="flex items-start gap-2 text-xs text-slate-300"><input type="checkbox" checked={savedProgress.completedVerificationItems.includes(itemId)} onChange={() => toggleVerificationItem(itemId)} />{item}</label>; })}</div>}
              {guideStep === 'Troubleshoot' && <div className="space-y-2">{activeLab.troubleshootingSteps?.map(step => <p key={step} className="text-slate-300">• {step}</p>)}</div>}
              {guideStep === 'Cleanup' && <div className="space-y-2"><p className="text-rose-300">Run cleanup after verifying the result. Cleanup can delete resources.</p>{activeLab.cleanupSteps.map(step => <code key={step} className="block overflow-x-auto text-xs text-rose-200">{step}</code>)}</div>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={togglePhaseComplete} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-emerald-500/60">{savedProgress.completedPhases.includes(savedProgress.activePhase) ? 'Phase complete' : 'Mark phase complete'}</button>
              {savedProgress.activePhase < guideSteps.length - 1 && (
                <button type="button" onClick={() => setGuideStep(savedProgress.activePhase + 1)} className="rounded-lg bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/25">Next phase: {guideSteps[savedProgress.activePhase + 1]}</button>
              )}
            </div>
          </section>

          {/* Safety Notice & Cost Warning */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-200 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block mb-0.5">Cloud Safety Notice & Verification:</strong>
              Execute commands inside your own authenticated Google Cloud Shell or workstation CLI. Remember to execute the cleanup section at the conclusion of the lab to prevent unexpected infrastructure billing.
            </div>
          </div>

          {/* Execution Steps: Switcher between CLI & Console */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                Execution Steps
              </span>

              <div role="tablist" aria-label="Lab execution paths" className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  role="tab"
                  id="lab-cli-tab"
                  aria-selected={activeStepTab === 'cli'}
                  aria-controls="lab-cli-panel"
                  onClick={() => setActiveStepTab('cli')}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveExecutionTab(1); }
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveExecutionTab(-1); }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    activeStepTab === 'cli' 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  gcloud CLI (Recommended)
                </button>
                <button
                  type="button"
                  role="tab"
                  id="lab-console-tab"
                  aria-selected={activeStepTab === 'console'}
                  aria-controls="lab-console-panel"
                  onClick={() => setActiveStepTab('console')}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveExecutionTab(1); }
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveExecutionTab(-1); }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    activeStepTab === 'console' 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Cloud Console
                </button>
              </div>
            </div>

            {/* CLI Commands List */}
            {activeStepTab === 'cli' && (
              <div id="lab-cli-panel" role="tabpanel" aria-labelledby="lab-cli-tab" className="space-y-3">
                {activeLab.cliSteps.map((cmd, idx) => (
                  <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">Step {idx + 1}</span>
                      <button
                        onClick={() => handleCopy(cmd, idx)}
                        className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="p-2.5 rounded bg-slate-900/90 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800">
                      <code>{cmd}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}

            {/* Console Steps List */}
            {activeStepTab === 'console' && (
              <div id="lab-console-panel" role="tabpanel" aria-labelledby="lab-console-tab" className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {activeLab.consoleSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-300 flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0 border border-slate-700">
                      {idx + 1}
                    </span>
                    <div className="text-slate-300">{step}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verification Checklist */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider block">
              Verification Checklist
            </span>
            <div className="space-y-2">
              {activeLab.verificationChecklist.map(item => {
                const itemId = verificationItemId(item);
                const isChecked = savedProgress.completedVerificationItems.includes(itemId);
                return (
                  <label
                    key={itemId}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs transition-colors ${
                      isChecked 
                        ? 'bg-emerald-950/30 border-emerald-600/40 text-emerald-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleVerificationItem(itemId)}
                      aria-label={`Self-attest verification item: ${item}`}
                      className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                    />
                    <span className={isChecked ? 'line-through text-slate-400' : ''}>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Safe Cleanup Section */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold font-mono uppercase tracking-wider">
              <Trash2 className="w-4 h-4" />
              Resource Cleanup Commands (Do Not Skip)
            </div>
            <p className="text-xs text-slate-400">
              Run these commands to immediately destroy test infrastructure and avoid lingering charges:
            </p>
            {activeLab.cleanupSteps.map((cleanup, cIdx) => (
              <pre key={cIdx} className="p-2.5 rounded bg-black/70 text-rose-300 font-mono text-xs overflow-x-auto border border-rose-900/30">
                <code>{cleanup}</code>
              </pre>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

