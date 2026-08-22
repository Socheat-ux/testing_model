// Service to call OpenAI Chat Completion via backend proxy
export async function callOpenAI(model, prompt) {
  const start = Date.now()
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await res.json()
  const time = `${((Date.now() - start) / 1000).toFixed(2)}s`
  if (!res.ok) {
    throw new Error(data.error?.message || 'OpenAI request failed')
  }
  return {
    text: data.choices?.[0]?.message?.content ?? '(empty response)',
    time,
    tokens: data.usage
      ? `${data.usage.prompt_tokens} in / ${data.usage.completion_tokens} out`
      : '—',
  }
}
