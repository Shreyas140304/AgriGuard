import React from 'react'

export default function HistoryPanel({history}){
  return (
    <section className="card full-card">
      <h3>Classification History</h3>
      {history.length === 0 ? (
        <div className="empty-state">
          <div className="big-icon">📅</div>
          <p className="muted">No classification history yet. Analyzed images will appear here.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map(item=>(
            <div key={item.id} className="history-item">
              <img src={item.url} alt="" className="thumb"/>
              <div>
                <strong>{item.label}</strong>
                <div className="muted">{new Date(item.timestamp).toLocaleString()}</div>
                <div className="muted">Confidence: {item.confidence}%</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
