import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <>
      <div className="nav">
        <div className="nav-inner">
          <div className="brand">Agropecuario · Evidencia</div>
          <div className="tabs">
            <Nav to="/" label="Dashboard" />
            <Nav to="/nuevo" label="Nuevo registro" />
            <Nav to="/registros" label="Registros" />
            <Nav to="/propuesta" label="Propuesta" />
            <Nav to="/exportar" label="Exportar" />
          </div>
        </div>
      </div>
      <div className="container">{children}</div>
    </>
  )
}

function Nav({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
    >
      {label}
    </NavLink>
  )
}
