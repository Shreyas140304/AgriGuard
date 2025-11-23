import React from 'react'
export default function NavTabs({tab, setTab}){
  return (
    <div className="tabs">
      <button className={tab==='upload'? 'tab active':'tab'} onClick={()=>setTab('upload')}>Upload & Analyze</button>
      <button className={tab==='history'? 'tab active':'tab'} onClick={()=>setTab('history')}>Classification History</button>
      <button className={tab==='dashboard'? 'tab active':'tab'} onClick={()=>setTab('dashboard')}>Dashboard & Metrics</button>
    </div>
  )
}
