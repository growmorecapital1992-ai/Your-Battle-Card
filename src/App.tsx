import { useState, useRef } from 'react';
import { EsportsProfile } from './types/esports';
import { DEFAULT_PROFILE } from './data/esportsData';
import { EsportsCard } from './components/EsportsCard';
import { StudioControls } from './components/StudioControls';
import { ExportModal } from './components/ExportModal';
import { CardShowcaseModal } from './components/CardShowcaseModal';
import { DualPromptSection } from './components/DualPromptSection';
import { soundFx } from './utils/audio';
import { Sparkles, Flame, RotateCcw, Zap, Terminal } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<EsportsProfile>(DEFAULT_PROFILE);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const cardElementRef = useRef<HTMLDivElement>(null);

  // Quick reset to reference screenshot layout
  const handleResetToPreset = () => {
    soundFx.playEquip();
    setProfile(DEFAULT_PROFILE);
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white flex flex-col">
      {/* Top Bar (Strict 3-Zone Contract) */}
      <header className="flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 bg-[#0b0c12]/90 border-b border-red-900/40 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <Flame className="w-6 h-6 text-red-500 fill-red-500" />
          <span className="font-display text-xl sm:text-2xl font-black tracking-wider uppercase italic text-white whitespace-nowrap">
            Apex<span className="text-red-500">Forge</span>
          </span>
        </div>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <a href="#studio" className="hover:text-red-400 transition-colors whitespace-nowrap">
            Studio Forge
          </a>
          <a href="#ai-prompts" className="text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap flex items-center gap-1 font-bold">
            <Terminal className="w-3.5 h-3.5" />
            AI Prompts (Gemini/ChatGPT)
          </a>
          <button
            type="button"
            onClick={() => {
              soundFx.playAwaken();
              setIsShowcaseOpen(true);
            }}
            className="hover:text-red-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Ultimate Showcase
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#ai-prompts"
            onClick={() => soundFx.playClick()}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-red-500 via-red-600 to-amber-500 hover:brightness-110 rounded-md font-display transition-all whitespace-nowrap flex items-center gap-1.5 shadow-lg shadow-red-950/60 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 fill-black" />
            <span>Copy AI Prompts</span>
          </a>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main id="studio" className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Banner / Hero Context */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-900">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-wide uppercase italic text-white flex items-center gap-2">
              <Terminal className="w-7 h-7 text-red-500" />
              Esports Profile & AI Prompt Generator
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Input your competitive credentials, select your game, and generate two master-level AI image prompts for ChatGPT (DALL-E) or Gemini.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResetToPreset}
              className="px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white bg-[#141520] hover:bg-zinc-800 border border-zinc-800 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset "Boss Empire" Preset</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Controls Studio (Left) & Master Holographic Card Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Tactical Control Panel (7 cols on desktop) */}
          <div className="lg:col-span-7 order-2 lg:order-1 w-full">
            <StudioControls
              profile={profile}
              onChange={setProfile}
              onOpenExport={() => setIsExportOpen(true)}
              onGenerateCard={() => setIsShowcaseOpen(true)}
            />
          </div>

          {/* Right Column: Master 3D Card Stage (5 cols on desktop, sticky on scroll) */}
          <div className="lg:col-span-5 order-1 lg:order-2 w-full flex flex-col items-center justify-center lg:sticky lg:top-20">
            <div className="w-full flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Live 3D Holographic Card
              </span>
              <span className="text-[10px] text-zinc-500 font-mono-stat">
                Click or Drop Photo · Gyro Tilt
              </span>
            </div>

            {/* The Physical Card Canvas with direct photo drop support */}
            <div className="w-full flex justify-center">
              <EsportsCard
                profile={profile}
                cardRef={cardElementRef}
                interactiveTilt={true}
                onPhotoChange={(newPhotoUrl) => {
                  setProfile((prev) => ({ ...prev, avatarUrl: newPhotoUrl }));
                }}
              />
            </div>

            <p className="text-[11px] text-zinc-500 text-center mt-3">
              Click anywhere on the portrait or drop an image file to insert your photo. Move mouse/touch for 3D holographic sheen.
            </p>
          </div>
        </div>

        {/* Dual Output AI Prompt Generators (Standard Card & Ultimate Titan Prompts) */}
        <DualPromptSection profile={profile} />
      </main>

      {/* Cinematic Loading & Card Showcase Pop-Up Modal */}
      <CardShowcaseModal
        isOpen={isShowcaseOpen}
        onClose={() => setIsShowcaseOpen(false)}
        profile={profile}
      />

      {/* High-Resolution PNG Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        cardElementRef={cardElementRef}
        playerName={profile.playerName}
      />
    </div>
  );
}
