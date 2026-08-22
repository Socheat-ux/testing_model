import { useState } from 'react'
import ResultPanel from './components/ResultPanel.jsx'
import { callCompare } from './api/compare.js'

const initialResult = { status: 'idle' }

export default function App() {
  const [prompt, setPrompt] = useState('Explain what a REST API is in 3 sentences.')
  const [openaiModel, setOpenaiModel] = useState('gpt-4o-mini')
  const [geminiModel, setGeminiModel] = useState('gemini-3.6-flash')
  const [hfModel, setHfModel] = useState('meta-llama/Llama-3.1-8B-Instruct')

  const [results, setResults] = useState({
    openai: initialResult,
    gemini: initialResult,
    hf: initialResult,
  })
  const [running, setRunning] = useState(false)

  function updateResult(id, patch) {
    setResults((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  async function runAll() {
    if (!prompt.trim()) return
    setRunning(true)
    // Set loading state for each provider
    updateResult('openai', { status: 'loading', text: 'Running...' })
    updateResult('gemini', { status: 'loading', text: 'Running...' })
    updateResult('hf', { status: 'loading', text: 'Running...' })
    try {
      const data = await callCompare({
        prompt,
        models: { openai: openaiModel, gemini: geminiModel, huggingface: hfModel },
      })
      // OpenAI result
      if (data.openai) {
        if (data.openai.error) {
          updateResult('openai', { status: 'error', text: data.openai.error })
        } else {
          const { text, time, tokens } = data.openai
          updateResult('openai', { status: 'done', text, time, tokens })
        }
      }
      // Gemini result
      if (data.gemini) {
        if (data.gemini.error) {
          updateResult('gemini', { status: 'error', text: data.gemini.error })
        } else {
          const { text, time, tokens } = data.gemini
          updateResult('gemini', { status: 'done', text, time, tokens })
        }
      }
      // Hugging Face result
      if (data.huggingface) {
        if (data.huggingface.error) {
          updateResult('hf', { status: 'error', text: data.huggingface.error })
        } else {
          const { text, time, tokens } = data.huggingface
          updateResult('hf', { status: 'done', text, time, tokens })
        }
      }
    } catch (e) {
      // Generic failure – mark all as error
      updateResult('openai', { status: 'error', text: e.message })
      updateResult('gemini', { status: 'error', text: e.message })
      updateResult('hf', { status: 'error', text: e.message })
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="page">
      <h1>LLM Comparison Bench</h1>
      <div className="sub">
        Send one prompt to multiple models, compare response, latency, and token usage.
      </div>

      <div className="setup">
        <div className="keybox">
          <label>
            <span className="dot" style={{ background: '#74AA9C' }}></span>
            OpenAI
          </label>
          <select value={openaiModel} onChange={(e) => setOpenaiModel(e.target.value)}>
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="gpt-4o">gpt-4o</option>
            <option value="gpt-4-turbo">gpt-4-turbo</option>
          </select>
          <div className="modelname">Routed through the backend proxy.</div>
        </div>

        <div className="keybox">
          <label>
            <span className="dot" style={{ background: '#4285F4' }}></span>
            Gemini
          </label>
          <select value={geminiModel} onChange={(e) => setGeminiModel(e.target.value)}>
            <option value="gemini-2.0-flash">gemini-2.0-flash</option>
            <option value="gemini-3.6-flash">gemini-3.6-flash</option>
            <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview</option>
            <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite</option>
          </select>
          <div className="modelname">Called through backend proxy.</div>
        </div>

        <div className="keybox">
          <label>
            <span className="dot" style={{ background: '#FFD21E' }}></span>
            Hugging Face
          </label>
          <input
            type="text"
            placeholder="e.g. meta-llama/Llama-3.1-8B-Instruct"
            style={{ marginTop: 6 }}
            value={hfModel}
            onChange={(e) => setHfModel(e.target.value)}
          />
          <div className="modelname">Called through backend proxy.</div>
        </div>
      </div>

      <div className="promptrow">
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Type your test prompt here..." />
        <button onClick={runAll} disabled={running}>
          {running ? 'Running...' : 'Run comparison'}
        </button>
      </div>

      <div className="results">
        <ResultPanel title="OpenAI" dotColor="#74AA9C" result={results.openai} />
        <ResultPanel title="Gemini" dotColor="#4285F4" result={results.gemini} />
        <ResultPanel title="Hugging Face" dotColor="#FFD21E" result={results.hf} />
      </div>
    </div>
  )
}
