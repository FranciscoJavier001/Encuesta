import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewRecord from './pages/NewRecord.jsx'
import Records from './pages/Records.jsx'
import RecordDetail from './pages/RecordDetail.jsx'
import Proposal from './pages/Proposal.jsx'
import ExportImport from './pages/ExportImport.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/nuevo" element={<NewRecord />} />
        <Route path="/registros" element={<Records />} />
        <Route path="/registros/:id" element={<RecordDetail />} />
        <Route path="/propuesta" element={<Proposal />} />
        <Route path="/exportar" element={<ExportImport />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
