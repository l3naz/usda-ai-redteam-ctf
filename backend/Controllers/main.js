import dotenv from 'dotenv';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const challenges = require('../data/misinformation.json');

dotenv.config();


export const main = (req,res,next)=>{
    try{
        res.status(200).json({msg:'API works successfully'})
    }catch(error)
    {
      next(error)
    }
}

const sessions = new Map();

function newId() {
  return (global.crypto?.randomUUID?.() ??
          (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)));
}

function fillPassword(template, flag) {
  return String(template || '').replace(/\$\{flag\}/g, flag ?? '');
}

function systemFor(levelKey) {
  const level = challenges.challenges[levelKey];
  if (!level) throw new Error(`Unknown level: ${levelKey}`);
  return fillPassword(level.context_prompt, level.flag);
}

// Single endpoint: start or continue chat
export const postapi =  async (req, res, next) => {
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

    res.json({ sessionId: sid,
       level: s.level,
        reply: text });
  } catch (err) {
    console.error('Chat error:', err);
    //res.status(500).json({ error: 'LLM call failed' });
    return  next(err)
  }
};

export const metadata = async( req,res,next)=>{

  try{
    
    const { level } = req?.body;                 
    if (!level){
      return res.status(400).json({message:"Please enter a valid level"})
    }
    //console.log(level)
    //const newlevel = id.toString()
    const source = challenges?.challenges?.[level];  
    if (!source){
      return res.status(500).json({message:'Invalid level'})
    }

    res.json({
      id: source.id,
      title: source.title,
      difficulty: source.difficulty,
      description: source.description,
      learning_objective: source.learning_objective,
      owasp_category: source.owasp_category
  })

  }catch(error){
    console.log(error)
    
    return next(error)
  }
}