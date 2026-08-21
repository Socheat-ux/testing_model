// Minimal proxy server. Only needed because OpenAI blocks direct
// browser calls (CORS). Gemini and Hugging Face don't need this —
// the frontend calls them directly.
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/openai', async (req, res) => {
  const { key, model, prompt } = req.body

  if (!key || !model || !prompt) {
    return res.status(400).json({ error: 'Missing key, model, or prompt' })
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await openaiRes.json()

    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({ error: data.error?.message || 'OpenAI request failed' })
    }

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Backend proxy running on http://localhost:${PORT}`)
})
