// Calls the backend /api/compare endpoint to query selected LLMs
export async function callCompare({ prompt, models }) {
  const res = await fetch('/api/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, models }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Comparison request failed')
  }
  return data // { openai: {...}, gemini: {...}, huggingface: {...} }
}
