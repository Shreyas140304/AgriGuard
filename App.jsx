import React, {useState, useEffect} from 'react'
import Header from './components/Header'
import NavTabs from './components/NavTabs'
import UploadArea from './components/UploadArea'
import ResultsPanel from './components/ResultsPanel'
import HistoryPanel from './components/HistoryPanel'
import Dashboard from './components/Dashboard'

export default function App(){
  const [tab, setTab] = useState('upload')
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pd_history') || '[]')
    } catch { return [] }
  })
  useEffect(()=> {
    localStorage.setItem('pd_history', JSON.stringify(history))
  }, [history])

  const handleClassify = (item) => {
    // push to history
    setHistory(h=>[item, ...h])
  }

  return (
    <div className="app-root">
      <Header />
      <NavTabs tab={tab} setTab={setTab} />
      <main className="container">
        {tab === 'upload' && (
          <div className="grid-two">
            <UploadArea onClassify={handleClassify} />
            <ResultsPanel history={history} />
          </div>
        )}
        {tab === 'history' && <HistoryPanel history={history} />}
        {tab === 'dashboard' && <Dashboard history={history} />}
      </main>
      <footer className="footer">© {new Date().getFullYear()} Plant Disease Detection</footer>
    </div>
  )
}
