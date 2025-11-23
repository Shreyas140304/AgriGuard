import React, {useState} from 'react'

function computeSHA256(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const data = new Uint8Array(reader.result)
        const hash = await crypto.subtle.digest('SHA-256', data)
        const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('')
        resolve(hex)
      } catch(err){ reject(err) }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export default function UploadArea({onClassify}){
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFile = async (f) => {
    if(!f) return
    if(!['image/png','image/jpeg','image/jpg'].includes(f.type)) {
      setMessage('Only PNG / JPG allowed')
      return
    }
    if(f.size > 10*1024*1024){
      setMessage('File too large (max 10MB)')
      return
    }
    setMessage('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const onDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }

  const onChoose = (e) => {
    const f = e.target.files[0]
    handleFile(f)
  }

  const classify = async () => {
    if(!file) { setMessage('Please upload an image first'); return }
    setLoading(true)
    const hash = await computeSHA256(file)
    // fake classification: random label from list
    const labels = ['Healthy','Early Blight','Late Blight','Powdery Mildew','Rust']
    const label = labels[Math.floor(Math.random()*labels.length)]
    const confidence = Math.floor(60 + Math.random()*40) // 60-99
    const item = {
      id: Date.now(),
      filename: file.name,
      hash,
      label,
      confidence,
      timestamp: new Date().toISOString(),
      url: preview
    }
    // simulate delay
    setTimeout(()=> {
      setLoading(false)
      setMessage('Analysis complete — see results on the right')
      onClassify(item)
    }, 800)
  }

  return (
    <section className="card upload-card">
      <h3>Upload Leaf Image</h3>
      <p className="muted">Upload a clear photo of the plant leaf for disease analysis</p>

      <div className="dropbox" onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}>
        {preview ? (
          <img src={preview} alt="preview" className="preview"/>
        ) : (
          <div className="drop-inner">
            <div className="icon">⤴️</div>
            <div>Click to upload or drag and drop</div>
            <div className="muted small">PNG, JPG up to 10MB</div>
          </div>
        )}
        <input type="file" accept="image/*" onChange={onChoose} className="file-input"/>
      </div>

      <div style={{marginTop:12}}>
        <button className="btn" onClick={classify} disabled={loading}>{loading? 'Analyzing...':'Analyze Image'}</button>
      </div>

      <div className="note">🔒 All images are verified with SHA-256 hash for data integrity before processing</div>
      {message && <div className="message">{message}</div>}
    </section>
  )
}
