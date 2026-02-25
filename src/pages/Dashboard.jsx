import React, { useEffect, useMemo, useState } from 'react'
import { listExpedientes } from '../lib/db.js'

function badgeClass(value) {
  if (value === 'EN_CONTRA') return 'badge no'
  if (value === 'A_FAVOR') return 'badge ok'
  return 'badge neutral'
}

export default function Dashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const all = await listExpedientes()
      if (mounted) {
        // newest first
        all.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
        setItems(all)
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const stats = useMemo(() => {
    const total = items.length
    const postura = {
      EN_CONTRA: 0,
      A_FAVOR: 0,
      NEUTRAL: 0
    }
    const apoyo = {
      SI: 0,
      NO: 0,
      AJUSTE: 0,
      SIN: 0
    }

    for (const it of items) {
      const p = it?.postura?.ambulantes || 'NEUTRAL'
      postura[p] = (postura[p] ?? 0) + 1

      const a = it?.propuesta?.apoya || 'SIN'
      apoyo[a] = (apoyo[a] ?? 0) + 1
    }

    const pct = (n) => (total ? Math.round((n / total) * 100) : 0)

    return {
      total,
      postura,
      apoyo,
      pctContra: pct(postura.EN_CONTRA),
      pctFavor: pct(postura.A_FAVOR),
      pctNeutral: pct(postura.NEUTRAL),
      pctApoyaPropuesta: pct(apoyo.SI)
    }
  }, [items])

  return (
    <div className="grid two">
      <div className="card">
        <h2>Estado general</h2>
        <div className="grid two">
          <div className="kpi">
            <div className="num">{stats.total}</div>
            <div className="muted">Expedientes registrados</div>
          </div>
          <div className="kpi">
            <div className="num">{stats.pctContra}%</div>
            <div className="muted">En contra de ambulantes</div>
          </div>
          <div className="kpi">
            <div className="num">{stats.pctApoyaPropuesta}%</div>
            <div className="muted">Apoya la propuesta (20k/mes)</div>
          </div>
          <div className="kpi">
            <div className="num">{stats.postura.NEUTRAL}</div>
            <div className="muted">Postura neutral / sin dato</div>
          </div>
        </div>
        <hr />
        <div className="row">
          <span className={badgeClass('EN_CONTRA')}>En contra: {stats.postura.EN_CONTRA}</span>
          <span className={badgeClass('A_FAVOR')}>A favor: {stats.postura.A_FAVOR}</span>
          <span className={badgeClass('NEUTRAL')}>Neutral/sin: {stats.postura.NEUTRAL}</span>
        </div>
        <div style={{ height: 10 }} />
        <div className="row">
          <span className="badge ok">Apoya propuesta: {stats.apoyo.SI}</span>
          <span className="badge neutral">Ajuste de monto: {stats.apoyo.AJUSTE}</span>
          <span className="badge no">No apoya: {stats.apoyo.NO}</span>
          <span className="badge neutral">Sin registrar: {stats.apoyo.SIN}</span>
        </div>
      </div>

      <div className="card">
        <h2>Últimos registros</h2>
        {loading ? (
          <p className="muted">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="muted">Aún no hay expedientes. Ve a “Nuevo registro”.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Local</th>
                <th>Responsable</th>
                <th>Postura</th>
                <th>Propuesta</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 8).map((it) => (
                <tr key={it.id}>
                  <td>
                    <div><strong>{it?.local?.tipo || 'Local'}</strong> #{it?.local?.numero || '—'}</div>
                    <div className="small muted">{it?.local?.zona || 'Sin zona'}</div>
                  </td>
                  <td>
                    <div>{it?.responsable?.nombre || '—'}</div>
                    <div className="small muted">{it?.responsable?.telefono || ''}</div>
                  </td>
                  <td><span className={badgeClass(it?.postura?.ambulantes || 'NEUTRAL')}>{labelPostura(it?.postura?.ambulantes)}</span></td>
                  <td><span className="badge">{labelApoyo(it?.propuesta?.apoya)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="small muted">Tip: esta app funciona offline y guarda los datos en tu dispositivo (IndexedDB). Exporta un respaldo seguido.</p>
      </div>
    </div>
  )
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
