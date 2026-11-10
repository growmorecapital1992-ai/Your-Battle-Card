import React, { useState } from 'react';
import { EsportsProfile } from '../types/esports';
import { generateStandardCardPrompt, generateUltimateTitanPrompt } from '../utils/promptGenerator';
import { soundFx } from '../utils/audio';
import { Copy, Check, Download, Sparkles, Terminal, Shield, Flame, Cpu, ExternalLink } from 'lucide-react';

interface DualPromptSectionProps {
  profile: EsportsProfile;
}

export const DualPromptSection: React.FC<DualPromptSectionProps> = ({ profile }) => {
  const [copiedType, setCopiedType] = useState<'standard' | 'titan' | null>(null);

  const standardPrompt = generateStandardCardPrompt(profile);
  const titanPrompt = generateUltimateTitanPrompt(profile);

  const handleCopy = async (text: string, type: 'standard' | 'titan') => {
    soundFx.playClick();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleDownloadTxt = (text: string, filename: string) => {
    soundFx.playShutter();
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section id="ai-prompts" className="w-full mt-4 space-y-6">
      {/* Section Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#12131e] via-[#171520] to-[#12131e] border border-red-900/50 rounded-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-red-600 text-black rounded font-display">
                Engineered AI Outputs
              </span>
              <span className="text-xs text-zinc-400 font-mono-stat flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-red-400" />
                Live Reactive Generation
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-wide uppercase italic text-white flex items-center gap-2">
              <Terminal className="w-6 h-6 text-red-500" />
              AI Prompt & Card Spec Generator
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl">
              These two comprehensive instruction scripts dynamically reflect your player identity, combat role, top 3 stats, loadout slots, and quick traits. Copy either prompt and paste it directly into <strong className="text-white">Gemini</strong> or <strong className="text-white">ChatGPT</strong> along with your portrait photo!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Open Gemini</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>
            <a
              href="https://chatgpt.com"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Open ChatGPT</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Dual Prompt Output Grid: 2 Col on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OUTPUT 1: Standard Esports Portrait Card Prompt */}
        <div className="bg-[#0e0f17] border border-red-800/40 hover:border-red-600/70 rounded-xl overflow-hidden shadow-xl flex flex-col transition-all group">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#141624] to-[#10121d] border-b border-zinc-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-600/60 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block font-mono-stat">
                  OUTPUT 1 · ESPORTS TIER
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                  Standard Esports Portrait Card Prompt
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleDownloadTxt(standardPrompt, `${profile.playerName || 'player'}-standard-esports-prompt.txt`)}
                title="Download prompt as .txt"
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleCopy(standardPrompt, 'standard')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-display shadow ${
                  copiedType === 'standard'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950'
                }`}
              >
                {copiedType === 'standard' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Guidance Badge */}
          <div className="px-4 py-2 bg-[#12131c] border-b border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
              Target: Aggressive Cyberpunk / Rough Anime Card
            </span>
            <span className="font-mono-stat text-zinc-500">
              {standardPrompt.length} chars · ~{standardPrompt.split(/\s+/).length} words
            </span>
          </div>

          {/* Code/Prompt Content Box */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="relative">
              <pre className="w-full h-80 sm:h-96 p-3.5 bg-[#08090f] border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300 overflow-y-auto leading-relaxed whitespace-pre-wrap select-all font-mono-stat">
                {standardPrompt}
              </pre>
            </div>

            {/* Bottom Copy Bar */}
            <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-400">
                💡 Paste this text + upload your photo into Gemini / ChatGPT.
              </span>
              <button
                type="button"
                onClick={() => handleCopy(standardPrompt, 'standard')}
                className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedType === 'standard' ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* OUTPUT 2: Ultimate Titan Edition Card Prompt */}
        <div className="bg-[#0e0f17] border-2 border-amber-600/50 hover:border-amber-500 rounded-xl overflow-hidden shadow-2xl flex flex-col transition-all group relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#1c1815] via-[#1a141a] to-[#12131e] border-b border-amber-800/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/60 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-mono-stat flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  OUTPUT 2 · MYTHICAL GOD-TIER
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                  Ultimate Titan Edition Card Prompt
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleDownloadTxt(titanPrompt, `${profile.playerName || 'player'}-ultimate-titan-prompt.txt`)}
                title="Download prompt as .txt"
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playAwaken();
                  handleCopy(titanPrompt, 'titan');
                }}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-display shadow ${
                  copiedType === 'titan'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 hover:brightness-110 text-black font-black shadow-amber-950'
                }`}
              >
                {copiedType === 'titan' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">Copied!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Copy Titan Prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Guidance Badge */}
          <div className="px-4 py-2 bg-[#141215] border-b border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1 text-amber-300/90 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
              Target: Mythical Overdrive Titan with Shattered Chains & Blood Moon
            </span>
            <span className="font-mono-stat text-zinc-500">
              {titanPrompt.length} chars · ~{titanPrompt.split(/\s+/).length} words
            </span>
          </div>

          {/* Code/Prompt Content Box */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="relative">
              <pre className="w-full h-80 sm:h-96 p-3.5 bg-[#08090f] border border-amber-900/40 rounded-lg text-xs font-mono text-amber-100/90 overflow-y-auto leading-relaxed whitespace-pre-wrap select-all font-mono-stat">
                {titanPrompt}
              </pre>
            </div>

            {/* Bottom Copy Bar */}
            <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-amber-300/80">
                👑 Creates an oversized poster with your background shadow titan & defeated squad backdrop.
              </span>
              <button
                type="button"
                onClick={() => {
                  soundFx.playAwaken();
                  handleCopy(titanPrompt, 'titan');
                }}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedType === 'titan' ? 'Copied to Clipboard!' : 'Copy Titan Prompt'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
