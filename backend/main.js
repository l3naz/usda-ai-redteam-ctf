// main.js
require('dotenv').config();
const express = require('express');
const challenges = require('./challenges.json');
const {error} = require('./Middlewares/errormiddleware')

const app = express();
app.use(express.json());

// ---- in-memory sessions: sessionId -> { level, history }
const sessions = new Map();

function newId() {
  return (global.crypto?.randomUUID?.() ??
          (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)));
}

function fillPassword(template, password) {
  return String(template || '').replace(/\$\{password\}/g, password ?? '');
}

function systemFor(levelKey) {
  const level = challenges.challenges[levelKey];
  if (!level) throw new Error(`Unknown level: ${levelKey}`);
  return fillPassword(level.context_prompt, level.password);
}

// Single endpoint: start or continue chat
app.post('/api', async (req, res, next) => {
  try {
    const { sessionId, level, message } = req.body || {};

    if (!sessionId && !level) {
      return res.status(400).json({ error: 'Provide level to start OR sessionId to continue' });
    }

    // Find or create session
    let sid = sessionId;
    let s = sid && sessions.get(sid);

    if (!s) {
      const chosenLevel = level || 'level1';
      const system = systemFor(chosenLevel);
      sid = newId();
      s = { level: chosenLevel, history: [ { role: 'user', parts: [{ text: system }] } ] };
      sessions.set(sid, s);
    }

    // If no message yet, just return session info (client can send next turn)
    if (!message) {
      return res.json({ sessionId: sid, level: s.level, status: 'ready' });
    }

    // Build contents = full history + new user turn
    const contents = [...s.history, { role: 'user', parts: [{ text: message }] }];

    // Use dynamic import because @google/genai is ESM
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const resp = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents
    });

    const text = typeof resp.text === 'function' ? await resp.text() : (resp.text || '');

    // Save the new turn(s) so the model "remembers"
    s.history.push({ role: 'user', parts: [{ text: message }] });
    s.history.push({ role: 'model', parts: [{ text }] });

    res.json({ sessionId: sid, level: s.level, reply: text });
  } catch (err) {
    console.error('Chat error:', err);
    //res.status(500).json({ error: 'LLM call failed' });
    return  next(err)
  }
});

app.get('/', (_req, res) => res.send('API OK'));

app.use(error)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
