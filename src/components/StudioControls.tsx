import React, { useState, useEffect, useRef } from 'react';
import { EsportsProfile } from '../types/esports';
import {
  ALL_AVAILABLE_STATS,
  INITIAL_COMBAT_ROLES,
  GUILD_BADGES,
  SUPPORTED_GAMES,
  AVAILABLE_QUICK_TRAITS,
} from '../data/esportsData';
import { soundFx } from '../utils/audio';
import {
  Gamepad2,
  User,
  Shield,
  Crosshair,
  Quote,
  Sparkles,
  Upload,
  Volume2,
  VolumeX,
  Crown,
  Link,
  Clipboard,
  Check,
  Plus,
  Trash2,
  Terminal,
  Ratio,
  Zap,
} from 'lucide-react';

interface StudioControlsProps {
  profile: EsportsProfile;
  onChange: (updated: EsportsProfile) => void;
  onOpenExport?: () => void;
  onGenerateCard?: () => void;
}

export const StudioControls: React.FC<StudioControlsProps> = ({
  profile,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<'game-identity' | 'roles' | 'stats' | 'weapon-traits' | 'quotes'>('game-identity');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [urlSuccess, setUrlSuccess] = useState(false);
  const [customTraitInput, setCustomTraitInput] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const guildLogoInputRef = useRef<HTMLInputElement>(null);

  // Update helper
  const updateProfile = (patch: Partial<EsportsProfile>) => {
    onChange({ ...profile, ...patch });
  };

  // Sound toggle
  const toggleSound = () => {
    const next = !profile.soundEnabled;
    soundFx.setEnabled(next);
    updateProfile({ soundEnabled: next });
    if (next) soundFx.playClick();
  };

  // Direct Photo Upload (Instant & Unrestricted)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFx.playEquip();
    setUploadedFileName(file.name);

    try {
      const objUrl = URL.createObjectURL(file);
      updateProfile({ avatarUrl: objUrl });
    } catch (err) {
      console.warn('URL.createObjectURL fallback', err);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateProfile({ avatarUrl: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Guild Logo Upload
  const handleGuildLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    soundFx.playEquip();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateProfile({ guildLogoUrl: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Image URL Inserter
  const handleApplyImageUrl = () => {
    if (imageUrlInput.trim()) {
      soundFx.playEquip();
      updateProfile({ avatarUrl: imageUrlInput.trim() });
      setUrlSuccess(true);
      setTimeout(() => setUrlSuccess(false), 2000);
    }
  };

  // Clipboard Paste Listener (Ctrl+V with image)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            soundFx.playEquip();
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                updateProfile({ avatarUrl: event.target.result as string });
              }
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [profile]);

  // Handle Stat Swap
  const handleStatSwap = (index: number, newStatId: string) => {
    soundFx.playStatBlip();
    const statDef = ALL_AVAILABLE_STATS.find((s) => s.id === newStatId);
    if (!statDef) return;

    const newStats = [...profile.stats];
    newStats[index] = {
      ...statDef,
      value: newStats[index]?.value || (statDef.unit === '%' ? '75%' : '8.5'),
    };
    updateProfile({ stats: newStats });
  };

  const handleStatValueChange = (index: number, value: string) => {
    const newStats = [...profile.stats];
    newStats[index] = { ...newStats[index], value };
    updateProfile({ stats: newStats });
  };

  // Quick Traits toggle helper
  const handleToggleTrait = (trait: string) => {
    soundFx.playClick();
    const current = profile.quickTraits || [];
    if (current.includes(trait)) {
      updateProfile({ quickTraits: current.filter((t) => t !== trait) });
    } else {
      updateProfile({ quickTraits: [...current, trait] });
    }
  };

  const handleAddCustomTrait = () => {
    if (!customTraitInput.trim()) return;
    soundFx.playEquip();
    const trait = customTraitInput.trim();
    const current = profile.quickTraits || [];
    if (!current.includes(trait)) {
      updateProfile({ quickTraits: [...current, trait] });
    }
    setCustomTraitInput('');
  };

  const scrollToPrompts = () => {
    soundFx.playClick();
    const el = document.getElementById('ai-prompts');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const WEAPON_SUGGESTIONS = [
    'MP40 Predatory Cobra',
    'M1887 Shotgun',
    'AWM Sniper Rifle',
    'Woodpecker Marksman',
    'AK47 Blue Flame Draco',
    'SCAR Megalodon Alpha',
    'M4A1 Infernal Draco',
    'Desert Eagle CQC',
  ];

  return (
    <div className="w-full bg-[#0d0e14] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[780px] lg:h-[860px]">
      {/* Studio Header Bar */}
      <div className="px-4 py-3 bg-[#13151f] border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
          <h2 className="font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            Esports Spec & Data Input Form
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Link to AI Prompts */}
          <button
            type="button"
            onClick={scrollToPrompts}
            className="px-3 py-1.5 text-xs font-bold text-amber-300 hover:text-white bg-amber-950/70 hover:bg-amber-900 border border-amber-600/70 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-mono-stat shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>View 2 AI Prompts</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={profile.soundEnabled ? 'Mute Battle SFX' : 'Enable Battle SFX'}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            {profile.soundEnabled ? <Volume2 className="w-4 h-4 text-red-500" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>
        </div>
      </div>

      {/* TOP ESSENTIAL: PHOTO UPLOAD FOR AI REFERENCE */}
      <div className="p-3 bg-[#151722] border-b border-zinc-800 space-y-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-red-500" />
            Reference Portrait Photo (Required for AI Input)
          </span>
          <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono-stat">
            <Clipboard className="w-3 h-3 text-red-400" />
            Paste (Ctrl+V) Supported
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            id="reference-photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <label
            htmlFor="reference-photo-upload"
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-display text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-red-900 transition-all flex items-center gap-2 cursor-pointer select-none active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Portrait Photo</span>
          </label>

          <div className="flex items-center gap-1 bg-[#0d0e14] p-1 rounded-lg border border-zinc-800 text-[11px]">
            <span className="text-zinc-500 px-1.5 text-[10px] uppercase font-bold">Samples:</span>
            <button
              type="button"
              onClick={() => {
                soundFx.playEquip();
                setUploadedFileName(null);
                updateProfile({
                  avatarUrl: '/src/assets/images/default_player_portrait_1794298191819.jpg',
                });
              }}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-semibold transition-colors cursor-pointer"
            >
              Pro Gamer
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playEquip();
                setUploadedFileName(null);
                updateProfile({
                  avatarUrl: '/public/assets/aistudio/Screenshot_2026-11-10_132936_2d50b6da.png',
                });
              }}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded font-semibold transition-colors cursor-pointer"
            >
              Boss Warrior
            </button>
          </div>
        </div>

        {/* Live Photo Status Bar */}
        <div className="flex items-center justify-between p-2 bg-[#0e1017] border border-zinc-800 rounded-lg">
          <div className="flex items-center gap-2.5">
            <img
              src={profile.avatarUrl}
              alt="Active Reference Portrait"
              className="w-8 h-8 rounded-full object-cover border border-red-500/80 shadow"
            />
            <div>
              <span className="text-xs font-bold text-white block leading-tight">
                {uploadedFileName ? `Loaded: ${uploadedFileName}` : 'Active Reference Portrait'}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">✓ Embedded as facial reference in AI prompts</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 hidden sm:inline">Attach photo alongside prompt in Gemini/ChatGPT</span>
          </div>
        </div>

        {/* Image URL fallback */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Link className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="Or paste direct image URL here..."
              className="w-full bg-[#0d0e14] border border-zinc-700 rounded pl-8 pr-3 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyImageUrl}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 rounded transition-colors flex items-center gap-1 cursor-pointer"
          >
            {urlSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : 'Load URL'}
          </button>
        </div>
      </div>

      {/* Form Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar px-2 pt-2 bg-[#0a0a0f] border-b border-zinc-800 gap-1 text-xs font-bold uppercase tracking-wider shrink-0">
        {[
          { id: 'game-identity', label: '1. Game & Identity', icon: Gamepad2 },
          { id: 'roles', label: '2. Tactical Roles', icon: Crosshair },
          { id: 'stats', label: '3. Top 3 Stats', icon: Shield },
          { id: 'weapon-traits', label: '4. Weapons & Traits', icon: Zap },
          { id: 'quotes', label: '5. Quotes & Bio', icon: Quote },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFx.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 border-t-2 cursor-pointer ${
                isActive
                  ? 'bg-[#13151f] text-red-400 border-red-500 font-extrabold shadow-sm'
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels Content */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5">
        {/* TAB 1: GAME & IDENTITY */}
        {activeTab === 'game-identity' && (
          <div className="space-y-4">
            {/* Target Competitive Game Question (Requested by User) */}
            <div className="p-3.5 bg-gradient-to-r from-[#171520] to-[#12131e] border-2 border-red-600/60 rounded-xl space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
                  <Gamepad2 className="w-4 h-4 text-amber-400" />
                  Which Game are you creating this card for?
                </span>
                <span className="text-[10px] text-zinc-400 font-mono-stat">Customizes AI Terminology</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUPPORTED_GAMES.map((game) => {
                  const isSelected = profile.targetGame === game;
                  return (
                    <button
                      key={game}
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        updateProfile({ targetGame: game });
                      }}
                      className={`p-2 rounded-lg border text-xs font-bold transition-all text-center truncate cursor-pointer ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950 font-black'
                          : 'bg-[#0f1017] text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {game}
                    </button>
                  );
                })}
              </div>

              {profile.targetGame === 'Custom Game' && (
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Enter your custom game name (e.g. Fortnite, Rainbow Six)..."
                    onChange={(e) => updateProfile({ targetGame: e.target.value })}
                    className="w-full bg-[#0d0e14] border border-red-600 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
              )}

              {/* Target Aspect Ratio */}
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                  <Ratio className="w-3.5 h-3.5 text-red-400" />
                  Target Aspect Ratio:
                </span>
                <div className="flex items-center gap-1.5">
                  {(['4:5 (Esports Card / IG)', '9:16 (Story / Phone Wallpaper)', '1:1 (Square Profile)'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        updateProfile({ aspectRatio: ratio });
                      }}
                      className={`px-2 py-1 text-[10px] font-bold rounded border transition-colors cursor-pointer ${
                        profile.aspectRatio === ratio
                          ? 'bg-red-950 border-red-500 text-white'
                          : 'bg-[#101118] border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {ratio.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Player Identity Details */}
            <div className="p-3 bg-[#111219] border border-zinc-800 rounded-lg space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Player Credentials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Player In-Game Name</label>
                  <input
                    type="text"
                    value={profile.playerName}
                    onChange={(e) => updateProfile({ playerName: e.target.value })}
                    placeholder="e.g. Ak, Ayush, Immortal"
                    className="w-full bg-[#151722] border border-red-600 rounded px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Player UID</label>
                  <input
                    type="text"
                    value={profile.playerUID}
                    onChange={(e) => updateProfile({ playerUID: e.target.value })}
                    placeholder="UID: 9842105471"
                    className="w-full bg-[#151722] border border-zinc-700 rounded px-3 py-2 text-sm font-mono-stat text-zinc-300 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Clan Tags / Prefix / Suffix */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/80">
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 block mb-0.5">Prefix / Title (e.g. Mr., Ultimate, 亗)</label>
                  <input
                    type="text"
                    value={profile.aliasPrefix}
                    onChange={(e) => updateProfile({ aliasPrefix: e.target.value })}
                    placeholder="e.g. Mr., Ultimate"
                    className="w-full bg-[#151722] border border-zinc-700 rounded px-2.5 py-1 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 block mb-0.5">Suffix / Clan Slogan (e.g. "boss", 亗)</label>
                  <input
                    type="text"
                    value={profile.aliasSuffix}
                    onChange={(e) => updateProfile({ aliasSuffix: e.target.value })}
                    placeholder='e.g. "boss", 亗'
                    className="w-full bg-[#151722] border border-zinc-700 rounded px-2.5 py-1 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Guild & Logo Details */}
            <div className="p-3 bg-[#111219] border border-zinc-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-amber-400 font-bold text-xs uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4" />
                  Guild / Team Information
                </span>
                <span className="text-[10px] text-zinc-400">Emblazoned on Card & Chest Armor</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Guild / Team Name</label>
                  <input
                    type="text"
                    value={profile.guildName}
                    onChange={(e) => updateProfile({ guildName: e.target.value })}
                    placeholder="BOSS EMPIRE"
                    className="w-full bg-[#151722] border border-zinc-700 rounded px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Guild Rank / Level</label>
                  <input
                    type="text"
                    value={profile.guildLevel}
                    onChange={(e) => updateProfile({ guildLevel: e.target.value })}
                    placeholder="LEVEL 5 GUILD"
                    className="w-full bg-[#151722] border border-zinc-700 rounded px-3 py-1.5 text-sm text-amber-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Guild Logo Upload / Badge Select */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400 block">
                  Guild Logo Upload (Optional) or Select Crest Badge
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={guildLogoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleGuildLogoUpload}
                    className="hidden"
                    id="guild-logo-input"
                  />
                  <label
                    htmlFor="guild-logo-input"
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-bold rounded border border-zinc-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Custom Guild Logo</span>
                  </label>

                  {profile.guildLogoUrl && (
                    <div className="flex items-center gap-2">
                      <img
                        src={profile.guildLogoUrl}
                        alt="Guild Logo"
                        className="w-7 h-7 rounded object-cover border border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => updateProfile({ guildLogoUrl: '' })}
                        className="text-zinc-500 hover:text-red-400 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Pre-built Crest Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {GUILD_BADGES.map((b) => {
                    const isSelected = profile.guildBadgeId === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          updateProfile({ guildBadgeId: b.id });
                        }}
                        className={`p-2 rounded border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-bold'
                            : 'bg-[#151722] border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Crown className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        <span className="truncate">{b.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  Team Creed Motto
                </label>
                <input
                  type="text"
                  value={profile.guildCreed}
                  onChange={(e) => updateProfile({ guildCreed: e.target.value })}
                  placeholder="ONE TEAM · ONE FAMILY · ONE EMPIRE"
                  className="w-full bg-[#151722] border border-zinc-700 rounded px-3 py-1.5 text-sm text-red-400 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPANDED TACTICAL ROLES */}
        {activeTab === 'roles' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Select Your Tactical Combat Role
              </h3>
              <p className="text-xs text-zinc-400">
                The role dictates your combat style, recommended tournament metrics, and terrifying AI prompt dialogue.
              </p>
            </div>

            {/* Custom Role Override */}
            <div className="p-3 bg-[#111219] border border-zinc-800 rounded-lg space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
                Custom Role Name (Optional)
              </label>
              <input
                type="text"
                value={profile.customRoleTitle || ''}
                onChange={(e) => updateProfile({ customRoleTitle: e.target.value })}
                placeholder="e.g. Apex Rusher, Godlike Sniper, Shadow Infiltrator"
                className="w-full bg-[#151722] border border-zinc-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Primary Tournament Roles Specified by User */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-red-400 block uppercase tracking-wider">
                Official Tournament Roles (Select 1)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {INITIAL_COMBAT_ROLES.slice(0, 7).map((role) => {
                  const isSelected = profile.roleId === role.id && !profile.customRoleTitle;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        soundFx.playEquip();
                        updateProfile({
                          roleId: role.id,
                          customRoleTitle: role.title,
                          quote: role.quote,
                        });
                      }}
                      className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#181a26] border-red-500 shadow-md shadow-red-950/60 ring-1 ring-red-500'
                          : 'bg-[#111219] border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Crosshair className="w-3.5 h-3.5 text-red-500" />
                            {role.title}
                          </span>
                          {isSelected && <span className="text-[10px] text-red-500 font-bold">SELECTED</span>}
                        </div>
                        <span className="text-[10px] text-zinc-400 block leading-tight">
                          {role.description}
                        </span>
                      </div>
                      <div className="mt-2 text-[10px] font-mono-stat text-red-400/90 italic truncate">
                        "{role.quote}"
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auto-suggested 5+ Unique Roles */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <span className="text-xs font-bold text-zinc-400 block uppercase tracking-wider">
                Auto-Suggested Tactical Archetypes (5+ Unique Extra Roles)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INITIAL_COMBAT_ROLES.slice(7).map((role) => {
                  const isSelected = profile.roleId === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        soundFx.playEquip();
                        updateProfile({
                          roleId: role.id,
                          customRoleTitle: role.title,
                          quote: role.quote,
                        });
                      }}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#181a26] border-red-500 text-white font-bold'
                          : 'bg-[#101118] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{role.title}</span>
                        <span className="text-[10px] text-zinc-500">{role.category}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1 truncate">{role.quote}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CORE STATS (SELECT TOP 3) */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Core Tournament Stats (Select Top 3)
              </h3>
              <p className="text-xs text-zinc-400">
                Choose exactly 3 metrics from Headshot Rate, KDA Ratio, Win Rate, Top 10 Rate, Average Damage, Highest Kills, and Booyah Streak.
              </p>
            </div>

            <div className="space-y-3">
              {profile.stats.slice(0, 3).map((stat, idx) => (
                <div key={idx} className="p-3 bg-[#111219] border border-zinc-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                      Stat Slot #{idx + 1}
                    </span>
                    <select
                      value={stat.id}
                      onChange={(e) => handleStatSwap(idx, e.target.value)}
                      className="bg-[#181924] border border-zinc-700 text-xs text-white rounded px-2 py-1 focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      {ALL_AVAILABLE_STATS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label} ({s.unit || 'Ratio'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatValueChange(idx, e.target.value)}
                      placeholder="e.g. 74.8%"
                      className="w-full bg-[#151722] border border-zinc-700 rounded px-3 py-1.5 text-sm font-mono-stat font-bold text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: WEAPONS & QUICK TRAITS */}
        {activeTab === 'weapon-traits' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Signature Weapon & Quick Character Traits
              </h3>
              <p className="text-xs text-zinc-400">
                Specify your primary signature firearm (e.g., MP40 Cobra, M1887, AWM) and select quick combat traits.
              </p>
            </div>

            {/* Signature Weapon Input */}
            <div className="p-3 bg-[#111219] border border-red-600/60 rounded-lg space-y-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Primary Signature Weapon
              </label>
              <input
                type="text"
                value={profile.signatureWeapon || ''}
                onChange={(e) => updateProfile({ signatureWeapon: e.target.value })}
                placeholder="e.g. MP40 Predatory Cobra, M1887 Shotgun, AWM Sniper"
                className="w-full bg-[#151722] border border-zinc-700 rounded px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-red-500"
              />

              {/* Quick suggestions */}
              <div className="pt-1">
                <span className="text-[10px] text-zinc-400 block mb-1">Quick Select:</span>
                <div className="flex flex-wrap gap-1.5">
                  {WEAPON_SUGGESTIONS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => {
                        soundFx.playEquip();
                        updateProfile({ signatureWeapon: w });
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                        profile.signatureWeapon === w
                          ? 'bg-red-600 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Character Traits */}
            <div className="p-3 bg-[#111219] border border-zinc-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Quick Character Traits
                </span>
                <span className="text-[10px] text-amber-400 font-mono-stat">
                  {(profile.quickTraits || []).length} active
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_QUICK_TRAITS.map((trait, idx) => {
                  const isSelected = (profile.quickTraits || []).includes(trait);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleTrait(trait)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow'
                          : 'bg-[#181a24] text-zinc-400 border border-zinc-800 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{trait}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Trait Input */}
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                <input
                  type="text"
                  value={customTraitInput}
                  onChange={(e) => setCustomTraitInput(e.target.value)}
                  placeholder="Add custom trait (e.g. Solo Squad Wiping God)..."
                  className="flex-1 bg-[#151722] border border-zinc-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTrait}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: QUOTES & BIO */}
        {activeTab === 'quotes' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                "What People Say About Them" & Custom Bio
              </h3>
              <p className="text-xs text-zinc-400">
                Role-specific terrifying quote and personalized tagline included in the prompt.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                "What People Say About Them" (Intimidating One-Liner)
              </label>
              <textarea
                value={profile.quote}
                onChange={(e) => updateProfile({ quote: e.target.value })}
                rows={2}
                className="w-full bg-[#151722] border border-red-600/60 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-red-500 italic"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                Personalized Tagline / Bio
              </label>
              <input
                type="text"
                value={profile.customBio}
                onChange={(e) => updateProfile({ customBio: e.target.value })}
                placeholder="e.g. Tournament Finalist · Unbeatable CQC Specialist"
                className="w-full bg-[#151722] border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Terrifying Preset Quotes */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">
                Terrifying Role Quotes (Click to apply)
              </label>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {[
                  "When he rushes, even Gloo Walls beg for mercy.",
                  "If he catches you in his scope, your squad is already back in the lobby.",
                  "He is the wall standing between his team and defeat. If he's alive, the Booyah is guaranteed.",
                  "He doesn't fight the zone; the zone moves on his command.",
                  "Surrounding him only guarantees that none of you will make it out alive.",
                  "You won't hear his footsteps; you'll only hear your squadmate's death crate drop.",
                  "First knock in 2 seconds. The round is over before your team even reloads.",
                  "High ground belongs to him. Anyone looking up is looking directly at their demise.",
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      updateProfile({ quote: q });
                    }}
                    className={`w-full p-2 text-left rounded text-xs transition-colors border cursor-pointer ${
                      profile.quote === q
                        ? 'bg-red-950/60 border-red-500 text-white'
                        : 'bg-[#101118] border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Permanent Bottom Action Bar */}
      <div className="p-3 bg-[#11131c] border-t border-zinc-800 flex items-center justify-between gap-3 shrink-0">
        <div className="text-xs text-zinc-400">
          Form updates live in both prompts below.
        </div>

        <button
          type="button"
          onClick={scrollToPrompts}
          className="px-6 py-2.5 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:brightness-110 active:scale-95 text-black font-display font-black text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-red-950 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Terminal className="w-4 h-4 fill-black" />
          <span>Copy Master AI Prompts Below</span>
        </button>
      </div>
    </div>
  );
};
