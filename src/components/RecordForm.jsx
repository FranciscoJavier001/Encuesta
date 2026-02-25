import React, { useMemo, useState } from 'react'
import { fileToCompressedDataURL } from '../lib/images.js'

const POSTURA = [
  { value: 'EN_CONTRA', label: 'En contra de ambulantes' },
  { value: 'NEUTRAL', label: 'Neutral / depende' },
  { value: 'A_FAVOR', label: 'A favor' }
]

const APOYO = [
  { value: 'SI', label: 'Apoya cobro de $20,000/mes' },
  { value: 'AJUSTE', label: 'Apoya, pero con ajuste de monto' },
  { value: 'NO', label: 'No apoya' },
  { value: 'SIN', label: 'Aún no se registra' }
]

export default function RecordForm({ value, onChange, onSave, saving, showDelete, onDelete }) {
  const [busyPhoto, setBusyPhoto] = useState(false)

  const canSave = useMemo(() => {
    return Boolean(value?.local?.tipo && value?.local?.numero && value?.responsable?.nombre)
  }, [value])

  async function handlePhotos(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setBusyPhoto(true)
    try {
      const out = []
      for (const f of files.slice(0, 6)) {
        const dataUrl = await fileToCompressedDataURL(f)
        out.push({ id: crypto.randomUUID(), dataUrl, name: f.name, size: f.size, createdAt: new Date().toISOString() })
      }
      onChange({ ...value, evidencia: { ...(value.evidencia || {}), fotosLocal: [...(value?.evidencia?.fotosLocal || []), ...out] } })
    } finally {
      setBusyPhoto(false)
      e.target.value = ''
    }
  }

  async function handleFotoResponsable(e) {
    const f = (e.target.files || [])[0]
    if (!f) return
    setBusyPhoto(true)
    try {
      const dataUrl = await fileToCompressedDataURL(f, { maxW: 900, maxH: 900, quality: 0.78 })
      onChange({ ...value, evidencia: { ...(value.evidencia || {}), fotoResponsable: { id: crypto.randomUUID(), dataUrl, name: f.name, createdAt: new Date().toISOString() } } })
    } finally {
      setBusyPhoto(false)
      e.target.value = ''
    }
  }

  function removeLocalPhoto(id) {
    const fotos = (value?.evidencia?.fotosLocal || []).filter((p) => p.id !== id)
    onChange({ ...value, evidencia: { ...(value.evidencia || {}), fotosLocal: fotos } })
  }

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="grid two">
        <div>
          <label>Tipo de local *</label>
          <select value={value?.local?.tipo || ''} onChange={(e) => onChange({ ...value, local: { ...(value.local || {}), tipo: e.target.value } })}>
            <option value="">Selecciona…</option>
            <option value="BODEGA">Bodega</option>
            <option value="PIEDRA">Piedra</option>
          </select>
        </div>
        <div>
          <label>Número *</label>
          <input value={value?.local?.numero || ''} onChange={(e) => onChange({ ...value, local: { ...(value.local || {}), numero: e.target.value } })} placeholder="Ej. 12, A-5, 104…" />
        </div>
      </div>

      <div className="grid two">
        <div>
          <label>Zona / pasillo</label>
          <input value={value?.local?.zona || ''} onChange={(e) => onChange({ ...value, local: { ...(value.local || {}), zona: e.target.value } })} placeholder="Ej. Estacionamiento norte, Pasillo 3…" />
        </div>
        <div>
          <label>Giro</label>
          <input value={value?.local?.giro || ''} onChange={(e) => onChange({ ...value, local: { ...(value.local || {}), giro: e.target.value } })} placeholder="Ej. frutas, abarrotes, carne…" />
        </div>
      </div>

      <div className="grid two">
        <div>
          <label>Responsable *</label>
          <input value={value?.responsable?.nombre || ''} onChange={(e) => onChange({ ...value, responsable: { ...(value.responsable || {}), nombre: e.target.value } })} placeholder="Nombre completo" />
        </div>
        <div>
          <label>Teléfono / WhatsApp</label>
          <input value={value?.responsable?.telefono || ''} onChange={(e) => onChange({ ...value, responsable: { ...(value.responsable || {}), telefono: e.target.value } })} placeholder="Ej. 449 000 0000" />
        </div>
      </div>

      <div className="card" style={{ padding: 12 }}>
        <h2 style={{ marginTop: 0 }}>Postura (evidencia de consenso)</h2>
        <div className="grid two">
          <div>
            <label>¿Cuál es tu postura sobre ambulantes?</label>
            <select value={value?.postura?.ambulantes || 'NEUTRAL'} onChange={(e) => onChange({ ...value, postura: { ...(value.postura || {}), ambulantes: e.target.value } })}>
              {POSTURA.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Impacto percibido (opcional)</label>
            <select value={value?.postura?.impacto || ''} onChange={(e) => onChange({ ...value, postura: { ...(value.postura || {}), impacto: e.target.value } })}>
              <option value="">Sin dato</option>
              <option value="VENTAS">Afecta ventas</option>
              <option value="ORDEN">Afecta orden/circulación</option>
              <option value="IMAGEN">Afecta imagen/plusvalía</option>
              <option value="TODO">Afecta todo lo anterior</option>
            </select>
          </div>
        </div>
        <div style={{ height: 10 }} />
        <div>
          <label>Comentario breve</label>
          <textarea value={value?.postura?.comentario || ''} onChange={(e) => onChange({ ...value, postura: { ...(value.postura || {}), comentario: e.target.value } })} placeholder="Ej. ‘Nos quitan flujo en el pasillo’ / ‘Se siente desordenado’…" />
        </div>
      </div>

      <div className="card" style={{ padding: 12 }}>
        <h2 style={{ marginTop: 0 }}>Propuesta anti-ambulantaje</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Propuesta: cobro mensual de <strong>$20,000 MXN</strong> por ambulante como regulación de uso de áreas comunes (medida para desincentivar ambulantaje).
        </p>
        <div className="grid two">
          <div>
            <label>¿Apoya esta propuesta?</label>
            <select value={value?.propuesta?.apoya || 'SIN'} onChange={(e) => onChange({ ...value, propuesta: { ...(value.propuesta || {}), apoya: e.target.value } })}>
              {APOYO.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Si “ajuste”, monto sugerido (MXN)</label>
            <input
              type="number"
              value={value?.propuesta?.montoSugerido ?? ''}
              onChange={(e) => onChange({ ...value, propuesta: { ...(value.propuesta || {}), montoSugerido: e.target.value ? Number(e.target.value) : null } })}
              placeholder="Ej. 15000"
            />
          </div>
        </div>
        <div style={{ height: 10 }} />
        <div>
          <label>Motivo / comentario</label>
          <textarea value={value?.propuesta?.comentario || ''} onChange={(e) => onChange({ ...value, propuesta: { ...(value.propuesta || {}), comentario: e.target.value } })} placeholder="Ej. ‘Estoy de acuerdo para ordenar’ / ‘Debe ser por zonas’…" />
        </div>
      </div>

      <div className="card" style={{ padding: 12 }}>
        <h2 style={{ marginTop: 0 }}>Evidencia (fotos)</h2>
        <div className="grid two">
          <div>
            <label>Fotos del local (hasta 6 por carga)</label>
            <input type="file" accept="image/*" multiple onChange={handlePhotos} disabled={busyPhoto} />
            <div className="small muted">Se comprimen automáticamente para ahorrar espacio.</div>
          </div>
          <div>
            <label>Foto del responsable (opcional)</label>
            <input type="file" accept="image/*" onChange={handleFotoResponsable} disabled={busyPhoto} />
            <div className="small muted">Recomendado: foto dentro del local.</div>
          </div>
        </div>

        <div style={{ height: 10 }} />

        {(value?.evidencia?.fotosLocal?.length || value?.evidencia?.fotoResponsable) ? (
          <div className="photo-grid">
            {(value?.evidencia?.fotosLocal || []).map((p) => (
              <div key={p.id}>
                <img className="photo" src={p.dataUrl} alt="foto local" />
                <div className="row" style={{ justifyContent: 'space-between', marginTop: 6 }}>
                  <span className="small muted">Local</span>
                  <button className="btn" type="button" onClick={() => removeLocalPhoto(p.id)}>Quitar</button>
                </div>
              </div>
            ))}
            {value?.evidencia?.fotoResponsable ? (
              <div>
                <img className="photo" src={value.evidencia.fotoResponsable.dataUrl} alt="foto responsable" />
                <div className="small muted" style={{ marginTop: 6 }}>Responsable</div>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="muted">Aún no hay fotos.</p>
        )}
      </div>

      <div className="card" style={{ padding: 12 }}>
        <h2 style={{ marginTop: 0 }}>Confirmación</h2>
        <div className="grid two">
          <div>
            <label>Nombre de quien captura</label>
            <input value={value?.meta?.capturista || ''} onChange={(e) => onChange({ ...value, meta: { ...(value.meta || {}), capturista: e.target.value } })} placeholder="Ej. Francisco" />
          </div>
          <div>
            <label>Fecha (auto)</label>
            <input value={value?.meta?.fecha || new Date().toLocaleString()} readOnly />
          </div>
        </div>
        <div style={{ height: 10 }} />
        <label>
          <input
            type="checkbox"
            checked={Boolean(value?.meta?.confirmado)}
            onChange={(e) => onChange({ ...value, meta: { ...(value.meta || {}), confirmado: e.target.checked, fecha: new Date().toISOString() } })}
            style={{ width: 18, height: 18, marginRight: 8 }}
          />
          Declaro que este registro refleja lo que el responsable indicó al momento de la captura.
        </label>
      </div>

      <div className="row" style={{ justifyContent: 'space-between' }}>
        {showDelete ? (
          <button type="button" className="btn danger" onClick={onDelete} disabled={saving}>Eliminar</button>
        ) : <span />}

        <button type="button" className="btn primary" onClick={onSave} disabled={!canSave || saving}>
          {saving ? 'Guardando…' : 'Guardar expediente'}
        </button>
      </div>

      <div className="small muted">
        * Requerido: tipo, número y responsable. Todo lo demás es opcional.
      </div>
    </div>
  )
}
