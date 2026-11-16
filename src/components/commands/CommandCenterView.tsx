import React, { useState } from 'react';
import { 
  Terminal, 
  Search, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Tag, 
  Filter,
  Info
} from 'lucide-react';
import { COMMAND_LIBRARY } from '../../data/commands';
import { CommandLineItem } from '../../types';

export const CommandCenterView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(COMMAND_LIBRARY.map(c => c.category)))];

  const filteredCommands = COMMAND_LIBRARY.filter(cmd => {
    if (selectedCategory !== 'All' && cmd.category !== selectedCategory) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        cmd.command.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q) ||
        cmd.syntax.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Terminal className="w-7 h-7 text-cyan-400" />
          Command Center & CLI Reference
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Searchable, verified Google Cloud CLI commands with syntax parameters, real-world examples, and expected outputs.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0b101d] border border-slate-800 p-4 rounded-xl space-y-3 mb-6 shadow-lg">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands by name, flag, or service (e.g. gcloud run deploy, storage cp, iam binding)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Commands List */}
      <div className="space-y-4">
        {filteredCommands.map(cmd => (
          <div
            key={cmd.id}
            className={`p-5 rounded-xl border transition-all ${
              cmd.isDestructive 
                ? 'bg-[#150d12] border-rose-900/50 hover:border-rose-700' 
                : 'bg-[#0b101d] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 uppercase">
                  {cmd.category}
                </span>
                {cmd.isDestructive && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/60 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Destructive Action
                  </span>
                )}
              </div>

              <button
                onClick={() => handleCopy(cmd.command, cmd.id)}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-700 transition-colors"
              >
                {copiedId === cmd.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === cmd.id ? 'Copied' : 'Copy Command'}</span>
              </button>
            </div>

            {/* Primary Command Code Block */}
            <pre className="p-3 rounded-lg bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800 mb-3">
              <code>{cmd.command}</code>
            </pre>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              {cmd.description}
            </p>

            {/* Syntax and Example Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Syntax:</span>
                <div className="p-2 rounded bg-slate-950 text-slate-300 overflow-x-auto border border-slate-800/60 text-[11px]">
                  <code>{cmd.syntax}</code>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Practical Example:</span>
                <div className="p-2 rounded bg-slate-950 text-emerald-300 overflow-x-auto border border-slate-800/60 text-[11px]">
                  <code>{cmd.example}</code>
                </div>
              </div>
            </div>

            {/* Expected Output */}
            {cmd.expectedOutput && (
              <div className="mt-3 pt-2 border-t border-slate-800/60">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Expected CLI Output:</span>
                <pre className="p-2.5 rounded bg-black/60 text-slate-400 font-mono text-[11px] overflow-x-auto border border-slate-900">
                  <code>{cmd.expectedOutput}</code>
                </pre>
              </div>
            )}

            {/* Destructive Warning */}
            {cmd.warning && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{cmd.warning}</span>
              </div>
            )}
          </div>
        ))}

        {filteredCommands.length === 0 && (
          <div className="text-center py-16 bg-[#0b101d] rounded-xl border border-slate-800 text-slate-400 text-xs">
            No commands matched your query.
          </div>
        )}
      </div>
    </div>
  );
};

