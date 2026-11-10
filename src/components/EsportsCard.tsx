import React, { useRef, useState } from 'react';
import { EsportsProfile } from '../types/esports';
import { ULTIMATE_ENTITIES } from '../data/esportsData';
import { FaceUpgradesOverlay } from './FaceUpgradesOverlay';
import { Crown, Crosshair, Swords, Trophy, Shield, Flame, Skull, Zap, ShieldAlert, Camera, Upload } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface EsportsCardProps {
  profile: EsportsProfile;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  interactiveTilt?: boolean;
  onPhotoChange?: (dataUrl: string) => void;
}

export const EsportsCard: React.FC<EsportsCardProps> = ({
  profile,
  cardRef,
  interactiveTilt = true,
  onPhotoChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });
  const [isDragOver, setIsDragOver] = useState(false);

  // Find active ultimate entity
  const currentEntity = ULTIMATE_ENTITIES.find((e) => e.id === profile.ultimateEntityId) || ULTIMATE_ENTITIES[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveTilt || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  // Drag and Drop Handling
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      soundFx.playEquip();
      try {
        const objUrl = URL.createObjectURL(file);
        onPhotoChange?.(objUrl);
      } catch {}

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && onPhotoChange) {
          onPhotoChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      soundFx.playEquip();
      try {
        const objUrl = URL.createObjectURL(file);
        onPhotoChange?.(objUrl);
      } catch {}

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && onPhotoChange) {
          onPhotoChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  // Helper for rendering stat icons
  const renderStatIcon = (iconName: string) => {
    const props = { className: 'w-4 h-4 text-red-500' };
    switch (iconName) {
      case 'Crosshair': return <Crosshair {...props} />;
      case 'Swords': return <Swords {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      case 'Shield': return <Shield {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Skull': return <Skull {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      default: return <Zap {...props} />;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative flex items-center justify-center p-2 sm:p-4 select-none perspective-[1200px]"
    >
      {/* Hidden file input for direct photo pick */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* 3D Transform Wrapper */}
      <div
        ref={cardRef}
        style={{
          transform: interactiveTilt && tilt.isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: tilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className={`relative w-full max-w-[460px] aspect-[4/5] sm:aspect-[9/12] bg-[#0c0d12] rounded-xl overflow-hidden shadow-2xl border-2 transition-all clip-chamfer-lg ${
          isDragOver ? 'border-amber-400 ring-4 ring-amber-500/50 scale-105' : 'border-red-700/60 box-glow-crimson'
        }`}
      >
        {/* Drag Over Overlay */}
        {isDragOver && (
          <div className="absolute inset-0 z-50 bg-black/85 flex flex-col items-center justify-center text-amber-400 gap-2 backdrop-blur-sm">
            <Upload className="w-12 h-12 animate-bounce text-amber-400" />
            <span className="font-display text-lg font-bold uppercase tracking-wider">
              Drop Photo to Insert
            </span>
          </div>
        )}

        {/* Layer 1: Atmospheric Background (Blood Moon & Gothic Fog) */}
        <div className="absolute inset-0 bg-[#08080c] z-0">
          {/* Crimson Red Cloud Mist */}
          <div
            className="absolute inset-0 bg-radial from-red-900/50 via-black/80 to-[#060608]"
            style={{ opacity: profile.redAuraDensity / 100 }}
          />

          {/* Blood Moon */}
          {profile.showBloodMoon && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-br from-red-600 via-red-900 to-black shadow-[0_0_80px_rgba(239,68,68,0.7)] opacity-85 pointer-events-none">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_30%_30%,rgba(255,100,100,0.8),transparent_60%)]" />
              <div className="absolute inset-1 rounded-full border border-red-500/30" />
            </div>
          )}

          {/* Gothic Castle Spires Silhouette */}
          {profile.showGothicCastle && (
            <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none opacity-45 mix-blend-multiply">
              <svg viewBox="0 0 500 200" className="w-full h-full text-black fill-current" preserveAspectRatio="none">
                <polygon points="0,200 0,80 30,50 60,80 60,200" />
                <polygon points="50,200 50,110 75,85 100,110 100,200" />
                <polygon points="120,200 120,130 140,100 160,130 160,200" />
                <polygon points="340,200 340,120 365,90 390,120 390,200" />
                <polygon points="400,200 400,70 430,40 460,70 460,200" />
                <polygon points="450,200 450,100 480,75 500,100 500,200" />
              </svg>
            </div>
          )}
        </div>

        {/* Layer 2: The Towering Awakened Shadow Titan (Looming Evolution Power) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-[75%] -top-6">
            <img
              src={currentEntity.imagePath}
              alt={currentEntity.title}
              className="w-full h-full object-cover object-top mix-blend-screen opacity-90 scale-105 filter contrast-125"
            />
            {/* Glowing Demon Eyes Overlay */}
            <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-32 flex justify-between px-6 pointer-events-none">
              <div
                className="w-4 h-1.5 rounded-full blur-[1.5px] animate-pulse"
                style={{
                  backgroundColor: currentEntity.eyeGlowColor,
                  boxShadow: `0 0 16px ${currentEntity.eyeGlowColor}, 0 0 32px ${currentEntity.eyeGlowColor}`,
                }}
              />
              <div
                className="w-4 h-1.5 rounded-full blur-[1.5px] animate-pulse"
                style={{
                  backgroundColor: currentEntity.eyeGlowColor,
                  boxShadow: `0 0 16px ${currentEntity.eyeGlowColor}, 0 0 32px ${currentEntity.eyeGlowColor}`,
                }}
              />
            </div>
            {/* Dark Energy Smoke Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-black/40" />
          </div>
        </div>

        {/* Layer 3: Broken Iron Chains Crossing the Screen */}
        {profile.showBrokenChains && (
          <div className="absolute inset-0 z-15 pointer-events-none opacity-60">
            <svg viewBox="0 0 460 580" className="w-full h-full">
              {/* Left Top-to-Center Broken Chain */}
              <path
                d="M -10 180 C 80 190, 140 230, 200 280"
                stroke="#2a2c38"
                strokeWidth="10"
                strokeDasharray="14,10"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M -10 180 C 80 190, 140 230, 200 280"
                stroke="#ff3344"
                strokeWidth="2"
                strokeDasharray="6,18"
                fill="none"
                className="drop-shadow-[0_0_8px_#ff0033]"
              />
              {/* Right Top-to-Center Broken Chain */}
              <path
                d="M 470 200 C 390 220, 320 260, 260 300"
                stroke="#2a2c38"
                strokeWidth="10"
                strokeDasharray="14,10"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 470 200 C 390 220, 320 260, 260 300"
                stroke="#ff3344"
                strokeWidth="2"
                strokeDasharray="6,18"
                fill="none"
                className="drop-shadow-[0_0_8px_#ff0033]"
              />
            </svg>
          </div>
        )}

        {/* Layer 4: Foreground Player Portrait with 7 Modular Face Upgrades */}
        <div className="absolute inset-x-0 bottom-12 z-20 flex flex-col items-center justify-end">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 group">
            {/* Click to Upload Button Overlay on Hover */}
            {onPhotoChange && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  fileInputRef.current?.click();
                }}
                className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 hover:bg-red-600 border border-zinc-700 hover:border-red-500 text-white rounded-full p-2 shadow-lg flex items-center gap-1.5 text-[10px] font-bold uppercase cursor-pointer"
                title="Click to insert or change photo"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Change Photo</span>
              </button>
            )}

            {/* Player Photo with Tough-Guy Contrast & Filters */}
            <div
              className="w-full h-full overflow-hidden rounded-full border-2 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.35)] cursor-pointer"
              onClick={() => onPhotoChange && fileInputRef.current?.click()}
              style={{
                filter: `contrast(${profile.faceUpgrades.contrast}%) brightness(95%) drop-shadow(0 15px 25px rgba(0,0,0,0.9))`,
              }}
            >
              <img
                src={profile.avatarUrl}
                alt={profile.playerName}
                style={{
                  transform: `scale(${profile.avatarScale}) translate(${profile.avatarOffsetX}px, ${profile.avatarOffsetY}px)`,
                }}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* The 7 Face Upgrades Overlay (Shades, Eye Glow, Scars, Rim, Mask, Horns) */}
            <FaceUpgradesOverlay upgrades={profile.faceUpgrades} />

            {/* Shoulder Dark Cape / Jersey Dark Scrim */}
            <div className="absolute -bottom-4 inset-x-0 h-16 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/90 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Layer 5: Slogan & Guild HUD Overlay (Matching Reference Image) */}
        <div className="absolute inset-0 z-30 p-4 sm:p-5 flex flex-col justify-between pointer-events-none">
          {/* Top Row: Guild Title (Left) + Team Creed (Right) */}
          <div className="flex items-start justify-between gap-2">
            {/* Top-Left: Guild Badge & Level */}
            <div className="flex flex-col items-start drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              <div className="flex items-center gap-1.5 text-amber-400 font-display">
                <Crown className="w-5 h-5 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                <span className="text-xl sm:text-2xl font-black tracking-wider uppercase italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                  {profile.guildName || 'BOSS EMPIRE'}
                </span>
              </div>
              <div className="bg-amber-500 text-black text-[10px] font-bold tracking-widest px-2 py-0.5 uppercase italic rounded -skew-x-12 mt-0.5 shadow-md">
                {profile.guildLevel || 'LEVEL 5 GUILD'}
              </div>
            </div>

            {/* Top-Right: Team Creed Slogan */}
            <div className="text-right flex flex-col items-end drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              <span className="font-stencil text-xs sm:text-sm font-extrabold tracking-wide uppercase italic text-red-500 leading-tight text-glow-crimson">
                {profile.guildCreed.split('·')[0] || 'ONE TEAM'}
              </span>
              <span className="font-stencil text-xs sm:text-sm font-extrabold tracking-wide uppercase italic text-red-400 leading-tight">
                {profile.guildCreed.split('·')[1] || 'ONE FAMILY'}
              </span>
              <span className="font-stencil text-sm sm:text-base font-black tracking-wider uppercase italic text-red-500 text-glow-crimson leading-tight">
                {profile.guildCreed.split('·')[2] || 'ONE EMPIRE'}
              </span>
            </div>
          </div>

          {/* Center-Left & Center-Right Slogans */}
          <div className="flex items-end justify-between w-full my-auto pb-4">
            {/* Center-Left: Name Display (Clean or with custom prefix/suffix) */}
            <div className="flex flex-col drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              <div className="flex items-center gap-1 text-amber-400">
                <Crown className="w-4 h-4 fill-amber-400" />
                <span className="text-[11px] font-mono-stat tracking-widest text-zinc-400">
                  {profile.playerUID}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white uppercase italic leading-none mt-1">
                {profile.aliasPrefix && <span className="text-zinc-300 mr-1.5">{profile.aliasPrefix}</span>}
                <span className="text-red-500 underline decoration-red-600 decoration-2 underline-offset-4 text-glow-crimson">
                  {profile.playerName}
                </span>
                {profile.aliasSuffix && (
                  <span className="text-zinc-200 ml-1.5 text-xl sm:text-2xl font-bold font-stencil">
                    {profile.aliasSuffix}
                  </span>
                )}
              </div>
              {profile.customRoleTitle ? (
                <div className="text-[11px] font-semibold tracking-wider text-red-400 uppercase mt-1">
                  {profile.customRoleTitle}
                </div>
              ) : null}
            </div>

            {/* Center-Right: Awakening Status Callout */}
            <div className="text-right flex flex-col items-end drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              <span className="font-stencil text-xs font-bold tracking-widest uppercase italic text-zinc-300">
                STATUS //
              </span>
              <span className="font-stencil text-xl sm:text-2xl font-black tracking-wider uppercase italic text-red-500 text-glow-crimson leading-tight -skew-x-6">
                {profile.awakeningStatus}
              </span>
            </div>
          </div>

          {/* Bottom Section: Combat Stats HUD & Role Quote */}
          <div className="flex flex-col gap-2 mt-auto">
            {/* Top 3 Selected Stats Strip */}
            <div className="grid grid-cols-3 gap-1.5 p-2 bg-[#12141c]/95 border border-red-700/50 rounded-lg backdrop-blur-md shadow-lg">
              {profile.stats.slice(0, 3).map((stat) => (
                <div
                  key={stat.id}
                  className="flex flex-col items-center justify-center p-1.5 bg-[#0a0a0f] border border-zinc-800 rounded text-center relative overflow-hidden"
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {renderStatIcon(stat.iconName)}
                    <span className="truncate">{stat.label}</span>
                  </div>
                  <div className="text-base sm:text-lg font-mono-stat font-extrabold text-white tracking-tight mt-0.5">
                    {stat.value}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-red-600" />
                </div>
              ))}
            </div>

            {/* Badass Quote Banner */}
            <div className="px-3 py-1.5 bg-black/85 border-l-2 border-red-600 rounded text-[11px] font-medium text-zinc-300 italic tracking-wide truncate">
              "{profile.quote}"
            </div>
          </div>
        </div>

        {/* Industrial Armor Frame Highlights & Chamfers */}
        <div className="absolute inset-0 border border-red-500/30 rounded-xl pointer-events-none z-40">
          {/* Corner Armor Bolts */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_4px_#ef4444]" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_4px_#ef4444]" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_4px_#ef4444]" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_4px_#ef4444]" />

          {/* Top Center Armor Hazard Tab */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-24 bg-red-600 rounded-b shadow-[0_0_10px_#ef4444]" />
        </div>

        {/* Dynamic Holographic Foil Sheen on Hover */}
        {interactiveTilt && tilt.isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-50 holographic-sheen mix-blend-color-dodge transition-opacity duration-200"
            style={{
              backgroundPosition: `${tilt.glareX}% ${tilt.glareY}%`,
              opacity: 0.45,
            }}
          />
        )}
      </div>
    </div>
  );
};
