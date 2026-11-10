import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini AI client
const rawApiKey = process.env.GEMINI_API_KEY;
const isValidApiKey = Boolean(rawApiKey && rawApiKey !== 'MY_GEMINI_API_KEY' && rawApiKey.trim().length > 10);
let ai: GoogleGenAI | null = null;
if (isValidApiKey) {
  ai = new GoogleGenAI({
    apiKey: rawApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number = 7000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI request timeout')), ms)),
  ]);
}

// 1. Brainstorm Novel Combat Roles
app.post('/api/ai/roles', async (req: Request, res: Response) => {
  try {
    const { existingRoles = [] } = req.body;

    if (!ai) {
      // Fallback response if API key is not configured
      return res.json({
        roles: [
          {
            id: 'shadow-reaper',
            title: 'Shadow Reaper',
            category: 'Flanker / Assassin',
            tagline: 'Silent Hunter of Backlines',
            quote: 'Before you spot him on your radar, your entire squad is already wiped.',
            recommendedStats: ['Headshot Rate', 'Highest Kills', 'KDA Ratio'],
          },
          {
            id: 'iron-bastion',
            title: 'Iron Bastion',
            category: 'Cover Provider / Tank',
            tagline: 'Unbreakable Defense Pillar',
            quote: 'Bullets shatter against his presence. Defeat is not in his dictionary.',
            recommendedStats: ['Average Damage', 'Top 10 Rate', 'Win Rate'],
          },
          {
            id: 'apex-predator',
            title: 'Apex Predator',
            category: 'Clutch God',
            tagline: '1v4 Situation Dominator',
            quote: 'He doesn\'t ask for backup; he asks where the enemies are running to.',
            recommendedStats: ['Booyah Streak', 'Win Rate', 'Highest Kills'],
          },
          {
            id: 'zone-overlord',
            title: 'Zone Overlord',
            category: 'Zone Pusher / Architect',
            tagline: 'Tactical Ring Master',
            quote: 'The safe zone doesn\'t dictate his movement; it cowers where he drops.',
            recommendedStats: ['Top 10 Rate', 'Win Rate', 'Average Damage'],
          },
          {
            id: 'breach-terror',
            title: 'Frontline Breaker',
            category: 'Squad Rusher / Entry Fragger',
            tagline: 'Relentless Building Sweeper',
            quote: 'Gloo Walls are made of glass when he initiates the breach.',
            recommendedStats: ['Average Damage', 'Highest Kills', 'Headshot Rate'],
          },
        ],
      });
    }

    const prompt = `Generate 5 unique, badass, and aggressive combat roles for a high-intensity battle royale esports player card.
Existing roles already include: ${existingRoles.join(', ')}.
Each role must sound fierce, intimidating, and tournament-grade. Return JSON format matching the schema.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              roles: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    category: { type: Type.STRING },
                    tagline: { type: Type.STRING },
                    quote: { type: Type.STRING },
                    recommendedStats: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ['id', 'title', 'category', 'tagline', 'quote', 'recommendedStats'],
                },
              },
            },
            required: ['roles'],
          },
        },
      }),
      7000
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('AI roles fallback activated:', error?.message);
    return res.json({
      roles: [
        {
          id: 'shadow-reaper',
          title: 'Shadow Reaper',
          category: 'Flanker / Assassin',
          tagline: 'Silent Hunter of Backlines',
          quote: 'Before you spot him on your radar, your entire squad is already wiped.',
          recommendedStats: ['Headshot Rate', 'Highest Kills', 'KDA Ratio'],
        },
        {
          id: 'iron-bastion',
          title: 'Iron Bastion',
          category: 'Cover Provider / Tank',
          tagline: 'Unbreakable Defense Pillar',
          quote: 'Bullets shatter against his presence. Defeat is not in his dictionary.',
          recommendedStats: ['Average Damage', 'Top 10 Rate', 'Win Rate'],
        },
        {
          id: 'apex-predator',
          title: 'Apex Predator',
          category: 'Clutch God',
          tagline: '1v4 Situation Dominator',
          quote: 'He doesn\'t ask for backup; he asks where the enemies are running to.',
          recommendedStats: ['Booyah Streak', 'Win Rate', 'Highest Kills'],
        },
        {
          id: 'zone-overlord',
          title: 'Zone Overlord',
          category: 'Zone Pusher / Architect',
          tagline: 'Tactical Ring Master',
          quote: 'The safe zone doesn\'t dictate his movement; it cowers where he drops.',
          recommendedStats: ['Top 10 Rate', 'Win Rate', 'Average Damage'],
        },
        {
          id: 'breach-terror',
          title: 'Frontline Breaker',
          category: 'Squad Rusher / Entry Fragger',
          tagline: 'Relentless Building Sweeper',
          quote: 'Gloo Walls are made of glass when he initiates the breach.',
          recommendedStats: ['Average Damage', 'Highest Kills', 'Headshot Rate'],
        },
      ],
    });
  }
});

// 2. Dynamic Badass Quotes Generator
app.post('/api/ai/quotes', async (req: Request, res: Response) => {
  try {
    const { roleTitle, playerName, guildName } = req.body;

    if (!ai) {
      return res.json({
        quotes: [
          `When ${playerName || 'he'} steps into the lobby, even Gloo Walls beg for mercy.`,
          `If ${playerName || 'he'} locks his scope onto your helmet, your squad is already back in spectator mode.`,
          `He isn't defending the circle. The storm shrinks because it's afraid of him.`,
          `One trigger pull from ${playerName || 'him'}, and the entire tournament scoreboard rewrites itself.`,
          `The Booyah was decided before the plane even crossed the drop zone.`,
        ],
      });
    }

    const prompt = `Generate 5 aggressive, dark, terrifying and high-hype esports one-liner quotes for a tournament player named "${playerName || 'Player'}" who plays as a "${roleTitle || 'Apex Champion'}" in guild "${guildName || 'Imperial Legion'}".
Make them sound like legendary quotes that rival squads whisper in terror. Return JSON with a "quotes" array of 5 strings.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              quotes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['quotes'],
          },
        },
      }),
      7000
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('AI quotes service fallback activated:', error?.message);
    const { playerName } = req.body;
    return res.json({
      quotes: [
        `When ${playerName || 'he'} steps into the lobby, even Gloo Walls beg for mercy.`,
        `If ${playerName || 'he'} locks his scope onto your helmet, your squad is already back in spectator mode.`,
        `He isn't defending the circle. The storm shrinks because it's afraid of him.`,
        `One trigger pull from ${playerName || 'him'}, and the entire tournament scoreboard rewrites itself.`,
        `The Booyah was decided before the plane even crossed the drop zone.`,
      ],
    });
  }
});

// 3. Ultimate Gamer Alias Forge
app.post('/api/ai/aliases', async (req: Request, res: Response) => {
  try {
    const { rawName } = req.body;
    const name = rawName?.trim() || 'WARRIOR';

    if (!ai) {
      return res.json({
        aliases: [
          { prefix: 'Ultimate', styledName: `Ultimate ${name}`, slogan: 'THE UNTOUCHABLE TITAN' },
          { prefix: 'Devil', styledName: `『DEVIL』 ${name} ☬`, slogan: 'HELLFIRE AWAKENED' },
          { prefix: 'King', styledName: `亗 KING ${name} 亗`, slogan: 'ABSOLUTE LOBBY MONARCH' },
          { prefix: 'Mr.', styledName: `Mr. ${name} "boss"`, slogan: 'ONE SQUAD ONE EMPIRE' },
          { prefix: 'God', styledName: `꧁༺GOD•${name}༻꧂`, slogan: 'IMMORTAL CLUTCH DEITY' },
        ],
      });
    }

    const prompt = `Generate 6 badass stylized esports alias variations for player name "${name}", inspired by competitive Free Fire / BGMI clan styles like "Mr. ${name} 'boss'", "亗 KING ${name} 亗", "Ultimate ${name}", and "『DEVIL』 ${name}". Return JSON with an "aliases" array.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              aliases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    prefix: { type: Type.STRING },
                    styledName: { type: Type.STRING },
                    slogan: { type: Type.STRING },
                  },
                  required: ['prefix', 'styledName', 'slogan'],
                },
              },
            },
            required: ['aliases'],
          },
        },
      }),
      7000
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('AI aliases fallback activated:', error?.message);
    const { rawName } = req.body;
    const name = rawName?.trim() || 'WARRIOR';
    return res.json({
      aliases: [
        { prefix: 'Ultimate', styledName: `Ultimate ${name}`, slogan: 'THE UNTOUCHABLE TITAN' },
        { prefix: 'Devil', styledName: `『DEVIL』 ${name} ☬`, slogan: 'HELLFIRE AWAKENED' },
        { prefix: 'King', styledName: `亗 KING ${name} 亗`, slogan: 'ABSOLUTE LOBBY MONARCH' },
        { prefix: 'Mr.', styledName: `Mr. ${name} "boss"`, slogan: 'ONE SQUAD ONE EMPIRE' },
        { prefix: 'God', styledName: `꧁༺GOD•${name}༻꧂`, slogan: 'IMMORTAL CLUTCH DEITY' },
      ],
    });
  }
});

// Dev server or static server setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`ApexForge server running on port ${port}`);
  });
}

startServer();
