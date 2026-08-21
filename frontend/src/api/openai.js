// Calls OpenAI via the local backend proxy (see ../../../backend)
// to avoid the browser CORS restriction on api.openai.com.
export async function callOpenAI({ key, model, prompt }) {
  const t0 = performance.now()
  const res = await fetch('/api/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, model, prompt }),
  })
  const data = await res.json()
  const t1 = performance.now()

  if (!res.ok) throw new Error(data.error || 'Request failed')

  const text = data.choices?.[0]?.message?.content ?? '(empty response)'
  const tokens = data.usage
    ? `${data.usage.prompt_tokens} in / ${data.usage.completion_tokens} out`
    : '—'

  return { text, time: `${((t1 - t0) / 1000).toFixed(2)}s`, tokens }
}