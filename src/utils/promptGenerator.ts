import { EsportsProfile } from '../types/esports';
import { INITIAL_COMBAT_ROLES, GUILD_BADGES } from '../data/esportsData';

/**
 * Generates OUTPUT 1: Standard Esports Portrait Card Prompt
 * Formatted cleanly as a master instruction script for Gemini or ChatGPT (DALL-E).
 */
export function generateStandardCardPrompt(profile: EsportsProfile): string {
  const roleObj = INITIAL_COMBAT_ROLES.find((r) => r.id === profile.roleId);
  const roleName = profile.customRoleTitle || roleObj?.title || 'Rusher (The Deadly Rusher / Gloo Wall Destroyer)';
  const roleQuote = profile.quote || roleObj?.quote || 'When he rushes, even Gloo Walls beg for mercy.';
  const badgeObj = GUILD_BADGES.find((b) => b.id === profile.guildBadgeId);
  const badgeName = badgeObj?.name || 'Imperial Gold Crown';
  const gameName = profile.targetGame || 'Free Fire';
  const ratio = profile.aspectRatio || '4:5 (Esports Card / IG)';

  const statsList = profile.stats
    .slice(0, 3)
    .map((s, idx) => `   - Slot ${idx + 1} [${s.label.toUpperCase()}]: ${s.value}${s.unit ? ' ' + s.unit : ''}`)
    .join('\n');

  const traitsList = profile.quickTraits && profile.quickTraits.length > 0
    ? profile.quickTraits.join(' · ')
    : 'Clutch King · Deadly Accuracy · Zone Controller';

  const signatureWeapon = profile.signatureWeapon || 'MP40 Predatory Cobra';

  const fullDisplayName = [profile.aliasPrefix, profile.playerName, profile.aliasSuffix]
    .filter(Boolean)
    .join(' ');

  return `### MASTER AI IMAGE INSTRUCTION: PROFESSIONAL ESPORTS TOURNAMENT CARD
Target Engine: ChatGPT (DALL-E 3) / Google Gemini 2.0 / Midjourney
Target Aspect Ratio: ${ratio}
Target Competitive Game: ${gameName}
Reference Image: Use the uploaded portrait photo as the direct facial foundation.

---

### [CORE DIRECTIVE FOR AI]
You are a lead concept illustrator and tournament graphics director for tier-1 competitive battle royale esports (${gameName}). 
Transform the attached user portrait photo into a hyper-realistic, dark tactical cinematic vector art tournament profile card. 
Preserve the user's authentic facial identity and eye structure while applying the strict aesthetic guidelines below.

---

### [MASTER DEFAULT STYLING RULES - STRICT PARAMETERS]
1. FACIAL ANATOMY & FEATURES:
   - Exceptionally handsome, razor-sharp jawline, high defined cheekbones, and an intense, dark focused gamer gaze.
   - Battle-tested ruggedness: Visible authentic battle scars (e.g., fine razor scar across the right eyebrow or high cheekbone), clean light tactical stubble, defined neck tendons and athletic facial structure.
   - Lighting: High-contrast dramatic chiaroscuro shadow mapping with rim highlights.
   - ABSOLUTE PROHIBITION: NO cute, soft, baby-face, anime-chibi, 3D Pixar, plastic skin, or cartoonish facial smoothing. The face must look rugged, mature, disciplined, and dangerously sharp.

2. OUTFIT & ES-PORTS STYLING:
   - Ultra-stylish futuristic esports tactical armor built from dark matte carbon-fiber chest plating.
   - High-collar structured tactical combat jacket, angular matte gunmetal shoulder plates with subtle crimson and gold edge trim.
   - Reinforced strapped tactical chest harness and holsters.
   - Guild Crest & Insignia: High-definition "${profile.guildName || 'BOSS EMPIRE'}" crest emblazoned on the upper left chest.

3. BACKGROUND & ATMOSPHERE:
   - Dark gothic-cyberpunk tournament arena ambiance with deep scorched obsidian tones.
   - Glowing neon red and molten amber rim lighting tracing the silhouette.
   - Subtle floating micro-embers, holographic polygon particles, and razor-sharp esports HUD stat overlays.

---

### [PLAYER IDENTITY & CARD SPECIFICATION OVERLAY]
Render the tournament card graphic border frame with clean, high-precision typography:
- Player Display Name: "${fullDisplayName || profile.playerName || 'WARRIOR'}"
- In-Game UID: "${profile.playerUID || 'UID: 9842105471'}"
- Guild / Clan: "${profile.guildName || 'BOSS EMPIRE'}" (${profile.guildLevel || 'LEVEL 5 GUILD'}) · Badge: [${badgeName}]
- Team Creed Motto: "${profile.guildCreed || 'ONE TEAM · ONE FAMILY · ONE EMPIRE'}"
- Combat Role: "${roleName}"
- Signature Weapon: "${signatureWeapon}"
- Quick Combat Traits: [${traitsList}]
- "What People Say About Them" (Terrifying Pro Quote):
  "${roleQuote}"
- Custom Bio / Slogan:
  "${profile.customBio || 'Tournament Finalist · Unbeatable CQC Specialist'}"

### TOP 3 VERIFIED COMPETITIVE METRICS (RENDER ON LOWER HUD):
${statsList}

---

### [COMPOSITION & OUTPUT QUALITY]
- Framing: Heroic waist-up portrait centered in an industrial carbon-fiber armor card frame.
- Art Style: High-detail cinematic graphic novel illustration meets Unreal Engine 8K ray-traced promotional poster.
- Color Grading: Scorched gunmetal grey, carbon black, aggressive blood crimson (#EF4444), and molten gold accents.
- Output Resolution: Flawless crisp typography, 8K ultra-detailed texturing on fabrics and carbon plates.`;
}

/**
 * Generates OUTPUT 2: Ultimate Titan Edition Card Prompt (Pure Power Focus)
 * Formatted cleanly as a master instruction script for Gemini or ChatGPT (DALL-E).
 */
export function generateUltimateTitanPrompt(profile: EsportsProfile): string {
  const roleObj = INITIAL_COMBAT_ROLES.find((r) => r.id === profile.roleId);
  const roleName = profile.customRoleTitle || roleObj?.title || 'Rusher (The Deadly Rusher / Gloo Wall Destroyer)';
  const gameName = profile.targetGame || 'Free Fire';
  const ratio = profile.aspectRatio || '4:5 (Esports Card / IG)';
  const signatureWeapon = profile.signatureWeapon || 'MP40 Predatory Cobra';

  const fullDisplayName = [profile.aliasPrefix, profile.playerName, profile.aliasSuffix]
    .filter(Boolean)
    .join(' ');

  const statsList = profile.stats
    .slice(0, 3)
    .map((s, idx) => `   ★ TITAN OVERDRIVE STAT ${idx + 1}: [${s.label.toUpperCase()}] -> ${s.value}${s.unit ? ' ' + s.unit : ''} (God-Tier Overclock)`)
    .join('\n');

  const traitsList = profile.quickTraits && profile.quickTraits.length > 0
    ? profile.quickTraits.map((t) => `[${t.toUpperCase()} OVERLORD]`).join(' · ')
    : '[CLUTCH KING] · [DEADLY ACCURACY] · [ZONE EMPEROR]';

  return `### MASTER AI IMAGE INSTRUCTION: ULTIMATE TITAN EDITION CARD (PURE POWER FOCUS)
Target Engine: ChatGPT (DALL-E 3) / Google Gemini 2.0 / Midjourney
Target Aspect Ratio: ${ratio}
Target Competitive Game: ${gameName}
Reference Image: Use the uploaded portrait photo as the facial blueprint for the ascended Titan.

---

### [CORE DIRECTIVE FOR AI - PURE POWER & ZERO CLUTTER]
You are a world-class cinematic splash art concept artist for AAA mythological and sci-fi warrior franchises.
Create a breathtaking, ultra-hyped, legendary tier "ULTIMATE TITAN EDITION" profile card.
CRITICAL COMPOSITION RULE: Zero unnecessary clutter or background distractors. Pure visual focus strictly centered on the player's primary face and upper body as they unleash raw Titan power in real-time.

---

### [MASTER DEFAULT STYLING RULES - TITAN ASCENSION]
1. PHYSICAL TRANSFORMATION & FACIAL ANATOMY:
   - Ultra-handsome, battle-scarred titan warrior face based directly on the uploaded portrait photo.
   - Exceptionally sharp jawline, high chiseled cheekbones, intense god-tier warrior expression.
   - Blazing glowing demonic/cosmic irises emitting fierce crimson or solar-gold particle trails.
   - Battle-hardened scars carved across the brow, radiating faint internal energy like molten lava beneath skin.
   - ABSOLUTE PROHIBITION: NO cute, soft, anime, 3D Pixar, or cartoonish facial smoothing. Must be menacing, regal, and fiercely hyper-masculine.

2. TITAN ENERGY AURA & CONVERGING POWER:
   - Raw cosmic lightning, dark volcanic hellfire, or galactic kinetic energy continuously converging directly INTO the Titan's chest and shoulder plates.
   - Visually demonstrate immense cataclysmic power being generated and absorbed in real-time.
   - Shattered glowing iron chains bursting outward around the torso, signifying unbroken awakening from ancient seal.

3. OUTFIT & CELESTIAL BATTLE ARMOR:
   - Heavy obsidian armor plates accented with forged molten gold and glowing elemental runes carved into the metal.
   - High-tech high-collar cyber-titan mantle with jagged shoulder spaulders crackling with electric arcs.
   - Dark flowing war cape with scorched, shredded hem floating in the electromagnetic updraft.

---

### [TITAN CARD SPEC FRAME & TYPOGRAPHY HUD]
Surround the art with a dual-layered, heavy gold & obsidian armored spec frame:
- Top Header Badge: "ULTIMATE TITAN EDITION · LEVEL 5 SOVEREIGN"
- Titan Champion Name: "${fullDisplayName || 'THE IMMORTAL'}"
- Guild Empire: "${profile.guildName || 'BOSS EMPIRE'}" (Creed: "${profile.guildCreed || 'ONE TEAM · ONE FAMILY · ONE EMPIRE'}")
- Awakening State: "${profile.awakeningStatus || 'IS NOW BEEN AWAKING'}"
- Combat Archetype: "Ascended ${roleName}"
- Signature Mythic Relic: "Overclocked ${signatureWeapon}"
- In-Game UID: "${profile.playerUID || 'UID: 9842105471'}"
- Ascended Traits: ${traitsList}

### TITAN LEVEL STATISTICAL OVERDRIVE:
${statsList}

### HIGH-HYPE TITAN COMBAT PROCLAMATION:
"He does not fear the shrinking storm; the zone itself collapses upon his command. When he enters the final circle, Gloo Walls melt and enemy squads retreat in horror. If he breathes, the Booyah is absolute."

---

### [LIGHTING & RENDERING ENGINE FINISH]
- Style: Unreal Engine 5 cinematic ray-traced character key art meets dark cinematic comic masterpiece.
- Lighting: Volumetric god rays, intense crimson and molten gold backlight, dynamic shadows carving sharp facial contours.
- Camera: Imposing low-angle chest-up heroic perspective making the player feel towering, invincible, and god-tier.
- Resolution: Hyper-detailed 8K textures, pore-level facial details, metallic reflections on dark armor.`;
}
