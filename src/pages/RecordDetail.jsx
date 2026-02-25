import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RecordForm from '../components/RecordForm.jsx'
import { deleteExpediente, getExpediente, upsertExpediente } from '../lib/db.js'

export default function RecordDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [value, setValue] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const it = await getExpediente(id)
      if (mounted) {
        setValue(it)
        setLoading(false)
      }
    })()
    return () => (mounted = false)
  }, [id])

  async function save() {
    setSaving(true)
    try {
      await upsertExpediente(value)
      // refresh timestamps view
      const it = await getExpediente(id)
      setValue(it)
    } finally {
      setSaving(false)
    }
  }

  async function del() {
    const ok = confirm('¿Eliminar este expediente? Esta acción no se puede deshacer.')
    if (!ok) return
    await deleteExpediente(id)
    nav('/registros')
  }

  if (loading) return <div className="card"><p className="muted">Cargando…</p></div>
  if (!value) return <div className="card"><p className="muted">No encontrado.</p></div>

  return (
    <div className="card">
      <h2>
        {value?.local?.tipo || 'Local'} #{value?.local?.numero || '—'}
      </h2>
      <p className="muted" style={{ marginTop: 0 }}>
        Última actualización: {value?.updatedAt ? new Date(value.updatedAt).toLocaleString() : '—'}
      </p>
      <RecordForm value={value} onChange={setValue} onSave={save} saving={saving} showDelete onDelete={del} />
    </div>
  )
}
