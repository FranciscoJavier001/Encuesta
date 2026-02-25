import React, { useRef, useState } from 'react'
import { exportJSON, importJSON } from '../lib/db.js'

export default function ExportImport() {
  const fileRef = useRef(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function doExport() {
    setBusy(true)
    setMsg('')
    try {
      const text = await exportJSON()
      const blob = new Blob([text], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const ts = new Date().toISOString().replace(/[:.]/g, '-')
      a.href = url
      a.download = `agro-evidencia-backup-${ts}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setMsg('Exportación lista. Guarda ese archivo como respaldo.')
    } finally {
      setBusy(false)
    }
  }

  async function doImport(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    setMsg('')
    try {
      const text = await f.text()
      await importJSON(text)
      setMsg('Importación completada. Ve al Dashboard o Registros para ver los datos.')
    } catch (err) {
      setMsg(`Error: ${err.message}`)
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div className="card">
      <h2>Exportar / Importar</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        La PWA guarda los datos en tu dispositivo. Para no perder información, exporta seguido un respaldo (.json).
      </p>

      <div className="row">
        <button className="btn primary" onClick={doExport} disabled={busy}>
          {busy ? 'Procesando…' : 'Exportar respaldo (.json)'}
        </button>

        <button className="btn" onClick={() => fileRef.current?.click()} disabled={busy}>
          Importar respaldo
        </button>
        <input ref={fileRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={doImport} />
      </div>

      {msg ? (
        <p className="small" style={{ marginTop: 12 }}>{msg}</p>
      ) : null}

      <hr />
      <p className="small muted">
        Recomendación: exporta un respaldo al terminar cada recorrido y guárdalo en iCloud/Drive/USB.
      </p>
    </div>
  )
}
