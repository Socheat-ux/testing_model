// Calls Hugging Face via the local backend proxy (see ../../../backend)
// to avoid the browser CORS restriction on the Hugging Face router API.
export async function callHF({ key, model, prompt }) {
  const t0 = performance.now()
  const res = await fetch('/api/huggingface', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, model, prompt }),
  })
  const data = await res.json()
  const t1 = performance.now()

  if (!res.ok) throw new Error(data.error || 'Request failed')

  const text =
    data.choices?.[0]?.message?.content ??
    (Array.isArray(data) ? data[0]?.generated_text : undefined) ??
    JSON.stringify(data)

  const usage = data.usage
  const tokens = usage
    ? `${usage.prompt_tokens} in / ${usage.completion_tokens} out`
    : 'not returned by HF API'

  return {
    text,
    time: `${((t1 - t0) / 1000).toFixed(2)}s`,
    tokens,
  }
}
