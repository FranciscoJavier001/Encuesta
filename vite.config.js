import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Agropecuario — Evidencia y Postura',
        short_name: 'AgroPWA',
        description: 'Registro de bodegas/piedras, evidencia y respaldo a medidas anti-ambulantaje.',
        theme_color: '#111827',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}']
      }
    })
  ],
  base: 'https://FranciscoJavier001.github.io/Encuesta/',
  server: {
    port: 5173,
    strictPort: true
  }
})
