import React from 'react';
import { FaceUpgradesState } from '../types/esports';

interface FaceUpgradesOverlayProps {
  upgrades: FaceUpgradesState;
}

export const FaceUpgradesOverlay: React.FC<FaceUpgradesOverlayProps> = ({ upgrades }) => {
  const getEyeFlareColor = () => {
    switch (upgrades.eyeColor) {
      case 'cyan': return { flare: '#00f7ff', glow: 'rgba(0, 247, 255, 0.9)' };
      case 'gold': return { flare: '#ffb700', glow: 'rgba(255, 183, 0, 0.9)' };
      case 'purple': return { flare: '#d946ef', glow: 'rgba(217, 70, 239, 0.9)' };
      case 'crimson':
      default:
        return { flare: '#ff0033', glow: 'rgba(255, 0, 51, 0.9)' };
    }
  };

  const getRimGlowColor = () => {
    switch (upgrades.rimColor) {
      case 'red-gold': return 'rgba(245, 158, 11, 0.8)';
      case 'neon-cyan': return 'rgba(6, 182, 212, 0.8)';
      case 'void-purple': return 'rgba(168, 85, 247, 0.8)';
      case 'crimson':
      default:
        return 'rgba(239, 68, 68, 0.85)';
    }
  };

  const eye = getEyeFlareColor();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* 1. Neon Rim Lighting & Silhouette Burn */}
      {upgrades.neonRimLight && (
        <div 
          className="absolute inset-0 mix-blend-screen transition-opacity duration-300"
          style={{
            opacity: upgrades.rimGlowIntensity / 100,
            background: `radial-gradient(ellipse at 50% 90%, ${getRimGlowColor()} 0%, rgba(0,0,0,0) 65%),
                         linear-gradient(to right, ${getRimGlowColor()} 0%, transparent 18%, transparent 82%, ${getRimGlowColor()} 100%)`,
          }}
        />
      )}

      {/* 2. Aggressive Dark Anime Shadow & Chiaroscuro */}
      {upgrades.animeShadow && (
        <div className="absolute inset-0 mix-blend-multiply opacity-85">
          {/* Deep vignette + harsh bottom angle shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <filter id="screengrain">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 1 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#screengrain)" />
          </svg>
        </div>
      )}

      {/* Vector Overlays: Sunglasses, Eyes, Scars, Horns, Mask */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Neon Eye Glow Filters */}
          <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="15" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Aviator Lens Reflection Gradient */}
          <linearGradient id="aviatorReflection" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e2029" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#0d0e12" stopOpacity="0.98" />
            <stop offset="48%" stopColor="rgba(255,255,255,0.4)" stopOpacity="0.7" />
            <stop offset="52%" stopColor="#0a0a0d" stopOpacity="0.95" />
            <stop offset="85%" stopColor="#15171e" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#2a0808" stopOpacity="0.9" />
          </linearGradient>

          {/* Cyber Visor Gradient */}
          <linearGradient id="cyberVisor" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff0033" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#990000" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ff3366" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* 3. Demon Horns & Dark Crown */}
        {upgrades.demonHorns && (
          <g className="animate-pulse" style={{ animationDuration: '3s' }}>
            {/* Left Horn */}
            <path
              d="M 145 110 C 130 70, 95 45, 75 35 C 90 60, 115 105, 138 122 Z"
              fill="#0d0e12"
              stroke="#ef4444"
              strokeWidth="2"
              className="drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]"
            />
            {/* Right Horn */}
            <path
              d="M 255 110 C 270 70, 305 45, 325 35 C 310 60, 285 105, 262 122 Z"
              fill="#0d0e12"
              stroke="#ef4444"
              strokeWidth="2"
              className="drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]"
            />
            {/* Center Dark Crown Spikes */}
            <polygon
              points="200,60 215,95 200,90 185,95"
              fill="#181922"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* 4. War Scars & Battle Gashes */}
        {upgrades.battleScars && (
          <g>
            {/* Left Cheek Cross-Slash */}
            <path
              d="M 125 195 L 155 240 M 120 225 L 150 210"
              stroke="#991b1b"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 125 195 L 155 240 M 120 225 L 150 210"
              stroke="#fca5a5"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Right Brow Battle Notch */}
            <path
              d="M 250 135 L 260 155"
              stroke="#7f1d1d"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 250 135 L 260 155"
              stroke="#f87171"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 5. Tactical Cyber Shades / Aviators */}
        {upgrades.shades && (
          <g className="drop-shadow-[0_8px_16px_rgba(0,0,0,0.95)]">
            {upgrades.shadesStyle === 'tactical-aviators' && (
              <>
                {/* Double Top Brow Bar */}
                <path
                  d="M 130 155 Q 200 150 270 155"
                  stroke="#1c1d24"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M 185 160 L 215 160"
                  stroke="#383a48"
                  strokeWidth="2.5"
                />
                {/* Left Aviator Tear-Drop Lens */}
                <path
                  d="M 132 158 C 175 158, 188 165, 188 190 C 188 215, 160 220, 138 210 C 122 202, 122 175, 132 158 Z"
                  fill="url(#aviatorReflection)"
                  stroke="#474a5e"
                  strokeWidth="2"
                />
                {/* Right Aviator Tear-Drop Lens */}
                <path
                  d="M 268 158 C 225 158, 212 165, 212 190 C 212 215, 240 220, 262 210 C 278 202, 278 175, 268 158 Z"
                  fill="url(#aviatorReflection)"
                  stroke="#474a5e"
                  strokeWidth="2"
                />
                {/* Sleek metallic bridge & rim highlights */}
                <ellipse cx="145" cy="180" rx="10" ry="16" fill="rgba(255,255,255,0.15)" transform="rotate(-25 145 180)" />
                <ellipse cx="255" cy="180" rx="10" ry="16" fill="rgba(255,255,255,0.15)" transform="rotate(-25 255 180)" />
              </>
            )}

            {upgrades.shadesStyle === 'cyber-visor' && (
              <>
                {/* Angular wrap-around cyber visor */}
                <polygon
                  points="110,160 290,160 275,200 200,208 125,200"
                  fill="url(#cyberVisor)"
                  stroke="#ff1e56"
                  strokeWidth="2"
                  className="drop-shadow-[0_0_15px_rgba(255,30,86,0.6)]"
                />
                {/* Cyber HUD line grid inside visor */}
                <line x1="130" y1="180" x2="270" y2="180" stroke="#ffffff" strokeWidth="1" strokeDasharray="6,4" opacity="0.6" />
                <line x1="140" y1="190" x2="260" y2="190" stroke="#ffffff" strokeWidth="0.8" opacity="0.4" />
              </>
            )}

            {upgrades.shadesStyle === 'matrix-dark' && (
              <>
                {/* Ultra narrow stealth oval shades */}
                <ellipse cx="150" cy="175" rx="36" ry="18" fill="#050608" stroke="#333" strokeWidth="2" />
                <ellipse cx="250" cy="175" rx="36" ry="18" fill="#050608" stroke="#333" strokeWidth="2" />
                <line x1="186" y1="175" x2="214" y2="175" stroke="#111" strokeWidth="3" />
                <path d="M 130 170 L 170 178" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <path d="M 230 170 L 270 178" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              </>
            )}
          </g>
        )}

        {/* 6. Demon / Sharingan Eye Flare */}
        {upgrades.eyeFlare && (
          <g filter="url(#eyeGlow)">
            {/* Left Eye Flare */}
            <circle cx="160" cy="175" r="4.5" fill="#ffffff" />
            <circle cx="160" cy="175" r="9" fill={eye.flare} opacity="0.8" />
            <line x1="160" y1="175" x2="60" y2="165" stroke={eye.flare} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="160" y1="175" x2="20" y2="160" stroke="#ffffff" strokeWidth="1" opacity="0.7" />

            {/* Right Eye Flare */}
            <circle cx="240" cy="175" r="4.5" fill="#ffffff" />
            <circle cx="240" cy="175" r="9" fill={eye.flare} opacity="0.8" />
            <line x1="240" y1="175" x2="340" y2="165" stroke={eye.flare} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="240" y1="175" x2="380" y2="160" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
          </g>
        )}

        {/* 7. Combat Mask / Tactical Cowl */}
        {upgrades.combatMask && (
          <g className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)]">
            {/* Carbon-fiber jaw respirator */}
            <polygon
              points="140,230 200,215 260,230 245,290 200,310 155,290"
              fill="#12131a"
              stroke="#2e303d"
              strokeWidth="2.5"
            />
            {/* Center air intake grille */}
            <rect x="188" y="240" width="24" height="40" rx="3" fill="#090a0d" stroke="#ef4444" strokeWidth="1" />
            <line x1="192" y1="248" x2="208" y2="248" stroke="#ef4444" strokeWidth="1.5" />
            <line x1="192" y1="256" x2="208" y2="256" stroke="#ef4444" strokeWidth="1.5" />
            <line x1="192" y1="264" x2="208" y2="264" stroke="#ef4444" strokeWidth="1.5" />
            <line x1="192" y1="272" x2="208" y2="272" stroke="#ef4444" strokeWidth="1.5" />
            {/* Side strap bolts */}
            <circle cx="148" cy="245" r="4" fill="#3b3d4d" />
            <circle cx="252" cy="245" r="4" fill="#3b3d4d" />
          </g>
        )}
      </svg>
    </div>
  );
};
