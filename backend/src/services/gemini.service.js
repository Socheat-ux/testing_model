// Service to call Gemini model via Google Generative Language API
export async function callGemini(model, prompt) {
  const start = Date.now()
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  })
  const data = await res.json()
  const time = `${((Date.now() - start) / 1000).toFixed(2)}s`
  if (!res.ok) {
    throw new Error(data.error?.message || 'Gemini request failed')
  }
  const usage = data.usageMetadata
  return {
    text: data.candidates?.[0]?.content?.parts?.[0]?.text ?? '(empty response)',
    time,
    tokens: usage
      ? `${usage.promptTokenCount} in / ${usage.candidatesTokenCount} out`
      : '—',
  }
}
