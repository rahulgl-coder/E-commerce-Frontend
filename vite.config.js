// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     host: '0.0.0.0',
//     port: parseInt(process.env.PORT) || 5173,
//     allowedHosts: 'all' // ✅ Let it access any external host
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 5173,
    allowedHosts: [
      'e-commerce-frontend-1-7tv7.onrender.com', // ✅ Allow this host
      'localhost' // ✅ Also allow localhost for dev
    ]
  }
})

