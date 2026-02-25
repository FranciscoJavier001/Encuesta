import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listExpedientes } from '../lib/db.js'

export default function Records() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const all = await listExpedientes()
      all.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
      if (mounted) setItems(all)
    })()
    return () => (mounted = false)
  }, [])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return items.filter((it) => {
      if (tipo && (it?.local?.tipo || '') !== tipo) return false
      if (!query) return true
      const hay = [
        it?.local?.tipo,
        it?.local?.numero,
        it?.local?.zona,
        it?.local?.giro,
        it?.responsable?.nombre,
        it?.responsable?.telefono
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(query)
    })
  }, [items, q, tipo])

  return (
    <div className="card">
      <h2>Registros</h2>
      <div className="grid two">
        <div>
          <label>Buscar</label>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre, número, zona, giro, teléfono…" />
        </div>
        <div>
          <label>Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Todos</option>
            <option value="BODEGA">Bodega</option>
            <option value="PIEDRA">Piedra</option>
          </select>
        </div>
      </div>

      <hr />

      {filtered.length === 0 ? (
        <p className="muted">No hay resultados.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Local</th>
              <th>Responsable</th>
              <th>Postura</th>
              <th>Propuesta</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => (
              <tr key={it.id}>
                <td>
                  <div><strong>{it?.local?.tipo}</strong> #{it?.local?.numero || '—'}</div>
                  <div className="small muted">{it?.local?.zona || 'Sin zona'} · {it?.local?.giro || 'Sin giro'}</div>
                </td>
                <td>
                  <div>{it?.responsable?.nombre || '—'}</div>
                  <div className="small muted">{it?.responsable?.telefono || ''}</div>
                </td>
                <td><span className={badgeClass(it?.postura?.ambulantes)}>{labelPostura(it?.postura?.ambulantes)}</span></td>
                <td><span className="badge">{labelApoyo(it?.propuesta?.apoya)}</span></td>
                <td style={{ width: 120 }}>
                  <Link className="btn" to={`/registros/${it.id}`}>Abrir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function badgeClass(value) {
  if (value === 'EN_CONTRA') return 'badge no'
  if (value === 'A_FAVOR') return 'badge ok'
  return 'badge neutral'
}

function labelPostura(v) {
  if (v === 'EN_CONTRA') return 'En contra'
  if (v === 'A_FAVOR') return 'A favor'
  return 'Neutral/sin'
}

function labelApoyo(v) {
  if (v === 'SI') return 'Apoya (20k/mes)'
  if (v === 'NO') return 'No apoya'
  if (v === 'AJUSTE') return 'Apoya con ajuste'
  return 'Sin dato'
}
