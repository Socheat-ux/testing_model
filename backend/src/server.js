import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/openai', async (req, res) => {
  // ...existing OpenAI code...
})

app.post('/api/huggingface', async (req, res) => {
  const { key, model, prompt } = req.body
  if (!key || !model || !prompt) {
    return res.status(400).json({ error: 'Missing key, model, or prompt' })
  }
  try {
    const hfRes = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    )
    const data = await hfRes.json()
    if (!hfRes.ok) {
      return res.status(hfRes.status).json({ error: data.error || 'Hugging Face request failed' })
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