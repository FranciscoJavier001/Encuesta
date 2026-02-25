import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RecordForm from '../components/RecordForm.jsx'
import { newId, upsertExpediente } from '../lib/db.js'

export default function NewRecord() {
  const nav = useNavigate()
  const [saving, setSaving] = useState(false)
  const [value, setValue] = useState(() => ({
    id: newId(),
    local: { tipo: '', numero: '', zona: '', giro: '' },
    responsable: { nombre: '', telefono: '' },
    postura: { ambulantes: 'NEUTRAL', impacto: '', comentario: '' },
    propuesta: { apoya: 'SIN', montoSugerido: null, comentario: '' },
    evidencia: { fotosLocal: [], fotoResponsable: null },
    meta: { capturista: '', confirmado: false, fecha: new Date().toISOString() }
  }))

  async function save() {
    setSaving(true)
    try {
      await upsertExpediente(value)
      nav(`/registros/${value.id}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <h2>Nuevo registro</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        Crea un expediente por bodega/piedra: datos básicos + postura + apoyo a propuesta + evidencia.
      </p>
      <RecordForm value={value} onChange={setValue} onSave={save} saving={saving} />
    </div>
  )
}
