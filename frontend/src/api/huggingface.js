// Calls Hugging Face via the local backend proxy (see ../../../backend)
// to avoid the browser CORS restriction on api-inference.huggingface.co.
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

  const text = Array.isArray(data)
    ? data[0]?.generated_text ?? JSON.stringify(data)
    : JSON.stringify(data)

  return {
    text,
    time: `${((t1 - t0) / 1000).toFixed(2)}s`,
    tokens: 'not returned by HF API',
  }
}