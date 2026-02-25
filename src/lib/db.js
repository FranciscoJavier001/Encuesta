import { openDB } from 'idb'

const DB_NAME = 'agro_evidencia_db'
const DB_VERSION = 1

export const STORE = {
  EXPEDIENTES: 'expedientes'
}

function nowISO() {
  return new Date().toISOString()
}

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE.EXPEDIENTES)) {
        const store = db.createObjectStore(STORE.EXPEDIENTES, { keyPath: 'id' })
        store.createIndex('tipo', 'local.tipo')
        store.createIndex('zona', 'local.zona')
        store.createIndex('postura', 'postura.ambulantes')
        store.createIndex('apoyoPropuesta', 'propuesta.apoya')
        store.createIndex('updatedAt', 'updatedAt')
      }
    }
  })
}

export function newId() {
  return crypto.randomUUID()
}

export async function upsertExpediente(expediente) {
  const db = await getDB()
  const base = {
    createdAt: expediente.createdAt ?? nowISO(),
    updatedAt: nowISO()
  }
  await db.put(STORE.EXPEDIENTES, { ...expediente, ...base })
}

export async function getExpediente(id) {
  const db = await getDB()
  return db.get(STORE.EXPEDIENTES, id)
}

export async function listExpedientes() {
  const db = await getDB()
  return db.getAll(STORE.EXPEDIENTES)
}

export async function deleteExpediente(id) {
  const db = await getDB()
  await db.delete(STORE.EXPEDIENTES, id)
}

export async function exportJSON() {
  const all = await listExpedientes()
  const payload = {
    exportedAt: nowISO(),
    version: 1,
    expedientes: all
  }
  return JSON.stringify(payload, null, 2)
}

export async function importJSON(jsonText) {
  const parsed = JSON.parse(jsonText)
  if (!parsed?.expedientes || !Array.isArray(parsed.expedientes)) {
    throw new Error('Archivo inválido: falta "expedientes".')
  }
  const db = await getDB()
  const tx = db.transaction(STORE.EXPEDIENTES, 'readwrite')
  for (const item of parsed.expedientes) {
    // normaliza timestamps
    item.createdAt = item.createdAt ?? nowISO()
    item.updatedAt = nowISO()
    await tx.store.put(item)
  }
  await tx.done
}
