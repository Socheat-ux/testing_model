// Comparison routes for LLM proxy
import express from 'express'
import { callOpenAI } from '../services/openai.service.js'
import { callGemini } from '../services/gemini.service.js'
import { callHF } from '../services/huggingface.service.js'

const router = express.Router()

// Health endpoint – reports which providers have API keys configured
router.get('/health', (req, res) => {
  res.json({
    openai: !!process.env.OPENAI_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
    huggingface: !!process.env.HUGGING_FACE_API_KEY,
  })
})

// POST /api/compare – expects { prompt, models: { openai, gemini, huggingface } }
router.post('/compare', async (req, res) => {
  const { prompt, models } = req.body
  if (!prompt || !models) {
    return res.status(400).json({ error: 'Missing prompt or models' })
  }
  const results = {}
  const tasks = []

  // OpenAI
  if (models.openai) {
    tasks.push(
      callOpenAI(models.openai, prompt)
        .then((data) => (results.openai = data))
        .catch((err) => (results.openai = { error: err.message }))
    )
  }
  // Gemini
  if (models.gemini) {
    tasks.push(
      callGemini(models.gemini, prompt)
        .then((data) => (results.gemini = data))
        .catch((err) => (results.gemini = { error: err.message }))
    )
  }
  // Hugging Face
  if (models.huggingface) {
    tasks.push(
      callHF(models.huggingface, prompt)
        .then((data) => (results.huggingface = data))
        .catch((err) => (results.huggingface = { error: err.message }))
    )
  }

  await Promise.allSettled(tasks)
  res.json(results)
})

export default router
