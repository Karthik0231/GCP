import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Check, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Table, 
  Award,
  Layers,
  BookOpen
} from 'lucide-react';
import { INTERVIEW_PREP_DATA } from '../../data/interviews';
import { InterviewPrepItem } from '../../types';

export const InterviewView: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [INTERVIEW_PREP_DATA[0].id]: true
  });

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Architect'];

  const filteredItems = INTERVIEW_PREP_DATA.filter(item => {
    if (selectedLevel !== 'All' && item.level !== selectedLevel) {
      return false;
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="forge-page w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="forge-page-header mb-6">
        <h2 className="forge-page-title text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-yellow-400" />
          Revision & Cloud Architect Interview Prep
        </h2>
        <p className="forge-page-lede text-slate-400 text-sm mt-1">
          Architectural trade-offs, concept comparison matrices, and scenario-based interview questions explaining WHY decisions are made in production systems.
        </p>
      </div>

      {/* Level Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-mono text-slate-400">Target Role:</span>
        {levels.map(lvl => (
          <button
            type="button"
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedLevel === lvl
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 shadow-sm'
                : 'bg-[#0b101d] text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Interview Question Cards */}
      <div className="space-y-4">
        {filteredItems.map(item => {
          const isExpanded = !!expandedIds[item.id];
          return (
            <div
              key={item.id}
              className="bg-[#0b101d] border border-slate-800 rounded-xl overflow-hidden transition-all shadow-md"
            >
              {/* Question Header Accordion Trigger */}
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={`interview-answer-${item.id}`}
                onClick={() => toggleExpand(item.id)}
                className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-900/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-yellow-400 border border-slate-800 font-semibold">
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {item.level}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {item.question}
                  </h3>
                </div>

                <span aria-hidden="true" className="p-1 rounded-lg text-slate-400 flex-shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>

              {/* Accordion Body */}
              {isExpanded && (
                <div id={`interview-answer-${item.id}`} className="px-5 pb-5 pt-1 space-y-4 text-xs leading-relaxed border-t border-slate-800/80">
                  
                  {/* Short Answer (Elevator Pitch) */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-yellow-400 font-mono text-[11px] uppercase block mb-1">
                      Direct Executive Answer:
                    </strong>
                    <p className="text-slate-200 text-xs sm:text-sm font-medium">{item.shortAnswer}</p>
                  </div>

                  {/* Deep Dive Breakdown */}
                  <div className="space-y-1.5">
                    <strong className="text-slate-300 font-mono text-[11px] uppercase block">
                      Architectural Deep Dive:
                    </strong>
                    <p className="text-slate-400 whitespace-pre-line leading-relaxed">{item.deepDive}</p>
                  </div>

                  {/* Comparison Matrix Table if present */}
                  {item.comparisonTable && (
                    <div className="space-y-2 pt-2">
                      <strong className="text-cyan-400 font-mono text-[11px] uppercase block flex items-center gap-1.5">
                        <Table className="w-3.5 h-3.5" />
                        Comparison Matrix: {item.comparisonTable.title}
                      </strong>

                      <div className="overflow-x-auto rounded-xl border border-slate-800">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            <tr>
                              <th className="p-3 font-semibold">Evaluation Criteria</th>
                              <th className="p-3 text-cyan-400 font-semibold">{item.comparisonTable.colA}</th>
                              <th className="p-3 text-purple-400 font-semibold">{item.comparisonTable.colB}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 bg-[#080d1a]">
                            {item.comparisonTable.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-900/40">
                                <td className="p-3 font-medium text-slate-300">{row.feature}</td>
                                <td className="p-3 text-slate-400">{row.valA}</td>
                                <td className="p-3 text-slate-400">{row.valB}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Common Interview Trap / Mistake */}
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs space-y-1">
                    <span className="text-rose-400 font-mono font-semibold block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Candidate Pitfall / Anti-Pattern:
                    </span>
                    <p className="text-slate-300">{item.commonMistake}</p>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

