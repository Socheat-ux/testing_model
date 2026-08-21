// Calls the Hugging Face Inference API directly from the browser.
export async function callHF({ key, model, prompt }) {
  const t0 = performance.now()
  const res = await fetch(
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