export interface CombatRole {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  quote: string;
  recommendedStats: string[];
  isCustomAi?: boolean;
}

export interface PlayerStat {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  iconName: string;
  maxValue?: number;
  color?: string;
}

export interface FaceUpgradesState {
  shades: boolean;
  shadesStyle: 'tactical-aviators' | 'cyber-visor' | 'matrix-dark';
  battleScars: boolean;
  eyeFlare: boolean;
  eyeColor: 'crimson' | 'cyan' | 'gold' | 'purple';
  animeShadow: boolean;
  neonRimLight: boolean;
  rimColor: 'crimson' | 'red-gold' | 'neon-cyan' | 'void-purple';
  demonHorns: boolean;
  combatMask: boolean;
  // Intensity controls
  contrast: number; // 100 - 200%
  rimGlowIntensity: number; // 0 - 100%
  grain: number; // 0 - 100%
}

export interface UltimateEntity {
  id: string;
  title: string;
  subtitle: string;
  imagePath: string;
  eyeGlowColor: string;
  auraGradient: string;
  defaultSlogan: string;
  hasChains: boolean;
  hasBloodMoon: boolean;
  description: string;
}

export interface GuildBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface EsportsProfile {
  // Target Game
  targetGame: string;
  aspectRatio: '4:5 (Esports Card / IG)' | '9:16 (Story / Phone Wallpaper)' | '1:1 (Square Profile)';

  // Identity
  playerName: string;
  playerUID: string;
  aliasPrefix: string;
  aliasSuffix: string;
  styledAliasOverride?: string;
  
  // Guild & Creed
  guildName: string;
  guildLevel: string;
  guildCreed: string;
  guildBadgeId: string;
  guildLogoUrl?: string;
  awakeningStatus: string;
  
  // Combat Role
  roleId: string;
  customRoleTitle?: string;
  customRoleQuote?: string;

  // Selected Stats (Exactly 3)
  stats: PlayerStat[];

  // Signature Weapon & Quick Traits
  signatureWeapon: string;
  equippedLoadout: string[];
  quickTraits: string[];

  // Quote & Bio ("What People Say About Them")
  quote: string;
  customBio: string;

  // Visual & Avatar
  avatarUrl: string;
  avatarScale: number;
  avatarOffsetX: number;
  avatarOffsetY: number;
  
  // Modular Upgrades
  faceUpgrades: FaceUpgradesState;
  
  // Awakened Ultimate Look
  ultimateEntityId: string;
  showBrokenChains: boolean;
  showBloodMoon: boolean;
  showGothicCastle: boolean;
  redAuraDensity: number; // 0 - 100%

  // Global Card Theme
  themeColor: 'crimson' | 'cyber-red' | 'molten-gold' | 'void-purple' | 'toxic-green';
  soundEnabled: boolean;
}

