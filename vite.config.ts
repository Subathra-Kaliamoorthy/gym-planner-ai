import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'GymAI',
        short_name: 'GymAI',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#84cc16',
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png',
          }
        ],
      },
    })
  ]
})
