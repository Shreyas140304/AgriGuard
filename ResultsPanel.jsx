import React from 'react'

export default function ResultsPanel({history}){
  const latest = history[0]
  return (
    <section className="card results-card">
      <h3>Results</h3>
      {latest ? (
        <div className="result-inner">
          <img src={latest.url} alt="result" className="result-thumb"/>
          <div>
            <h4>{latest.label}</h4>
            <p className="muted">Confidence: {latest.confidence}%</p>
            <p className="muted">File: {latest.filename}</p>
            <p className="muted">SHA256: <span className="mono">{latest.hash.slice(0,16)}...</span></p>
            <p className="muted">Analyzed: {new Date(latest.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="big-icon">⚠️</div>
          <p className="muted">Upload and analyze an image to see results</p>
        </div>
      )}
    </section>
  )
}
