export default function ResultPanel({ title, dotColor, result }) {
  const { text, time, tokens, status } = result
  // status: 'idle' | 'loading' | 'error' | 'done'

  const bodyClass =
    status === 'error'
      ? 'panel-body errtext'
      : status === 'loading'
      ? 'panel-body loading'
      : status === 'idle'
      ? 'panel-body placeholder'
      : 'panel-body'

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="dot" style={{ background: dotColor }}></span>
        <span className="panel-title">{title}</span>
      </div>
      <div className={bodyClass}>
        {text || 'Response will appear here.'}
      </div>
      <div className="panel-foot">
        <span className="stat">time: <b>{time ?? '—'}</b></span>
        <span className="stat">tokens: <b>{tokens ?? '—'}</b></span>
      </div>
    </div>
  )
}