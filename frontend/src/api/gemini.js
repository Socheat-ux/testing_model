// Calls Gemini directly from the browser — Google allows CORS for this API.
export async function callGemini({ key, model, prompt }) {
  const t0 = performance.now()
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  )
  const data = await res.json()
  const t1 = performance.now()

  if (!res.ok) throw new Error(data.error?.message || 'Request failed')

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ?? '(empty response)'
  const usage = data.usageMetadata
  const tokens = usage
    ? `${usage.promptTokenCount} in / ${usage.candidatesTokenCount} out`
    : '—'

  return { text, time: `${((t1 - t0) / 1000).toFixed(2)}s`, tokens }
}