# Agropecuario — Evidencia y Postura (PWA)

PWA local para:
- Registrar bodegas/piedras y responsables
- Documentar postura sobre ambulantes
- Registrar apoyo/no-apoyo a la propuesta de cobro mensual ($20,000/mes)
- Guardar evidencia fotográfica
- Exportar/importar respaldos (.json)

> **Importante:** Los datos se guardan en tu dispositivo (IndexedDB). Exporta respaldos seguido.

## Requisitos
- Node.js 18+ (recomendado 20+)

## Instalar y correr
```bash
npm install
npm run dev
```
Abre: http://localhost:5173

## Construir (producción)
```bash
npm run build
npm run preview
```

## Notas
- Funciona offline una vez cargada (PWA).
- Las fotos se comprimen automáticamente para ahorrar espacio.
- No incluye backend; es intencional para que puedas levantar evidencia rápido. Si luego quieres multiusuario/servidor, se agrega.
