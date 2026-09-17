import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

function imageUploadPlugin() {
  return {
    name: 'blogger-image-upload',
    configureServer(server) {
      server.middlewares.use('/__save-image', async (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405
          response.end()
          return
        }

        let body = ''
        for await (const chunk of request) body += chunk
        const { name, data } = JSON.parse(body)
        const safeName = path.basename(String(name)).replace(/[^a-zA-Z0-9._-]/g, '-')
        const match = String(data).match(/^data:(image\/[\w.+-]+);base64,(.+)$/)
        if (!safeName || !match) {
          response.statusCode = 400
          response.end('Invalid image')
          return
        }

        const directory = path.resolve(process.cwd(), 'public/images')
        fs.mkdirSync(directory, { recursive: true })
        fs.writeFileSync(path.join(directory, safeName), Buffer.from(match[2], 'base64'))
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify({ path: `/images/${safeName}` }))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), imageUploadPlugin()],
  base: '/blogger/',
  assetsInclude: ['**/*.md'],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          markdown: ['react-markdown', 'gray-matter', 'remark-gfm'],
        }
      }
    }
  }
})
