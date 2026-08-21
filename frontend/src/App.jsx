import { useState } from 'react'
import ResultPanel from './components/ResultPanel.jsx'
import { callOpenAI } from './api/openai.js'
import { callGemini } from './api/gemini.js'
import { callHF } from './api/huggingface.js'

const initialResult = { status: 'idle' }

export default function App() {
  const [prompt, setPrompt] = useState(
    'Explain what a REST API is in 3 sentences.'
  )
  const [openaiKey, setOpenaiKey] = useState('')
  const [openaiModel, setOpenaiModel] = useState('gpt-4o-mini')
  const [geminiKey, setGeminiKey] = useState('')
  const [geminiModel, setGeminiModel] = useState('gemini-2.0-flash')
  const [hfKey, setHfKey] = useState('')
  const [hfModel, setHfModel] = useState('')

  const [results, setResults] = useState({
    openai: initialResult,
    gemini: initialResult,
    hf: initialResult,
  })
  const [running, setRunning] = useState(false)

  function updateResult(id, patch) {
    setResults((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  async function runOne(id, hasKey, fn, args) {
    if (!hasKey) {
      updateResult(id, { status: 'error', text: 'No API key entered.' })
      return
    }
    updateResult(id, { status: 'loading', text: 'Running...' })
    try {
      const { text, time, tokens } = await fn(args)
      updateResult(id, { status: 'done', text, time, tokens })
    } catch (e) {
      updateResult(id, { status: 'error', text: `Error: ${e.message}` })
    }
  }

  async function runAll() {
    if (!prompt.trim()) return
    setRunning(true)
    await Promise.allSettled([
      runOne('openai', !!openaiKey.trim(), callOpenAI, {
        key: openaiKey.trim(),
        model: openaiModel,
        prompt,
      }),
      runOne('gemini', !!geminiKey.trim(), callGemini, {
        key: geminiKey.trim(),
        model: geminiModel,
        prompt,
      }),
      runOne('hf', !!hfKey.trim() && !!hfModel.trim(), callHF, {
        key: hfKey.trim(),
        model: hfModel.trim(),
        prompt,
      }),
    ])
    setRunning(false)
  }

  return (
    <div className="page">
      <h1>LLM Comparison Bench</h1>
      <div className="sub">
        Send one prompt to multiple models, compare response, latency, and
        token usage.
      </div>

      <div className="setup">
        <div className="keybox">
          <label>
            <span className="dot" style={{ background: '#74AA9C' }}></span>
            OpenAI
          </label>
          <input
            type="password"
            placeholder="sk-..."
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
          />
          <select
            value={openaiModel}
            onChange={(e) => setOpenaiModel(e.target.value)}
          >
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="gpt-4o">gpt-4o</option>
            <option value="gpt-4-turbo">gpt-4-turbo</option>
          </select>
          <div className="modelname">
            Routed through the backend proxy (CORS).
          </div>
        </div>

        <div className="keybox">
          <label>
            <span className="dot" style={{ background: '#4285F4' }}></span>
            Gemini
          </label>
          <input
            type="password"
            placeholder="AIza..."
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
          />
          <select
            value={geminiModel}
            onChange={(e) => setGeminiModel(e.target.value)}
          >
            <option value="gemini-2.0-flash">gemini-2.0-flash</option>
            <option value="gemini-1.5-pro">gemini-1.5-pro</option>
            <option value="gemini-1.5-flash">gemini-1.5-flash</option>
          </select>
          <div className="modelname">Called directly from the browser.</div>
        </div>

        <div className="keybox">
          <label>
            <span className="dot" style={{ background: '#FFD21E' }}></span>
            Hugging Face
          </label>
          <input
            type="password"
            placeholder="hf_..."
            value={hfKey}
            onChange={(e) => setHfKey(e.target.value)}
          />
          <input
            type="text"
            placeholder="e.g. meta-llama/Llama-3.1-8B-Instruct"
            style={{ marginTop: 6 }}
            value={hfModel}
            onChange={(e) => setHfModel(e.target.value)}
          />
          <div className="modelname">Called directly from the browser.</div>
        </div>
      </div>

      <div className="promptrow">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your test prompt here..."
        />
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