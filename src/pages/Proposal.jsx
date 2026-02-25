import React from 'react'

export default function Proposal() {
  return (
    <div className="grid two">
      <div className="card">
        <h2>Postura: ambulantaje</h2>
        <p className="muted">
          Esta app sirve para documentar el consenso de bodegas y piedras: registro del local, responsable y evidencia.
        </p>
        <ol className="muted">
          <li>Las áreas comunes (arterias, estacionamientos, pasillos) son de todos los locatarios.</li>
          <li>El ambulantaje usa ese espacio para negocio privado sin asumir los costos formales.</li>
          <li>Eso genera competencia desleal y deteriora orden, imagen y plusvalía del agropecuario.</li>
        </ol>
        <p className="small muted">Objetivo: pasar de “quejas” a evidencia documentada.</p>
      </div>

      <div className="card">
        <h2>Propuesta de regulación</h2>
        <p>
          <strong>Cobro mensual de $20,000 MXN por ambulante</strong> como medida para desincentivar el ambulantaje y regular el uso de áreas comunes.
        </p>
        <p className="muted">
          La idea no es “perseguir”, sino alinear incentivos: quien use áreas comunes para vender debe asumir un costo real.
        </p>
        <hr />
        <p className="muted">
          En cada expediente se registra si el responsable apoya, no apoya, o apoya con ajuste de monto.
        </p>
        <p className="small muted">
          Nota: el monto puede ajustarse con base en los resultados del levantamiento.
        </p>
      </div>
    </div>
  )
}
