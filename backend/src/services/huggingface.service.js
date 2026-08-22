// Service to call Hugging Face Inference API via router endpoint
export async function callHF(model, prompt) {
  const start = Date.now()
  const res = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await res.json()
  const time = `${((Date.now() - start) / 1000).toFixed(2)}s`
  if (!res.ok) {
    const msg = data.error?.message || (typeof data.error === 'string' ? data.error : 'Hugging Face request failed')
    throw new Error(msg)
  }
  const text = data.choices?.[0]?.message?.content ?? (Array.isArray(data) ? data[0]?.generated_text : undefined) ?? JSON.stringify(data)
  const usage = data.usage
  return {
    text,
    time,
    tokens: usage
      ? `${usage.prompt_tokens} in / ${usage.completion_tokens} out`
      : 'not returned by HF API',
  }
}
