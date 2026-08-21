import 'dotenv/config'
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
    const oaRes = await fetch('https://api.openai.com/v1/chat/completions', {
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
    const data = await oaRes.json()
    if (!oaRes.ok) {
      return res
        .status(oaRes.status)
        .json({ error: data.error?.message || 'OpenAI request failed' })
    }
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/huggingface', async (req, res) => {
  const { key, model, prompt } = req.body
  if (!key || !model || !prompt) {
    return res.status(400).json({ error: 'Missing key, model, or prompt' })
  }
  try {
    const hfRes = await fetch(
      'https://router.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
        }),
      }
    )
    const data = await hfRes.json()
    if (!hfRes.ok) {
      const msg =
        data.error?.message ||
        (typeof data.error === 'string' ? data.error : null) ||
        'Hugging Face request failed'
      return res.status(hfRes.status).json({ error: msg })
    }
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Backend proxy running on http://localhost:${PORT}`)
})
