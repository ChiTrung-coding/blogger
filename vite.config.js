import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

async function readJsonBody(request) {
  let body = ''
  for await (const chunk of request) body += chunk
  return JSON.parse(body || '{}')
}

function sendJson(response, status, payload) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(payload))
}

function localPersistPlugin() {
  return {
    name: 'blogger-local-persist',
    configureServer(server) {
      const postsDir = path.resolve(process.cwd(), 'posts')
      const imagesDir = path.resolve(process.cwd(), 'public/images')

      server.middlewares.use('/__save-image', async (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405
          response.end()
          return
        }

        const { name, data } = await readJsonBody(request)
        const safeName = path.basename(String(name)).replace(/[^a-z0-9._-]/gi, '-')
        const match = String(data).match(/^data:(image\/[\w.+-]+);base64,(.+)$/)
        if (!safeName || !match) {
          response.statusCode = 400
          response.end('Invalid image')
          return
        }

        fs.mkdirSync(imagesDir, { recursive: true })
        fs.writeFileSync(path.join(imagesDir, safeName), Buffer.from(match[2], 'base64'))
        sendJson(response, 200, { path: `/images/${safeName}` })
      })

      server.middlewares.use('/__save-config', async (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405
          response.end()
          return
        }

        const config = await readJsonBody(request)
        fs.writeFileSync(
          path.join(postsDir, '_config.json'),
          `${JSON.stringify(config, null, 2)}\n`,
          'utf8',
        )
        sendJson(response, 200, { ok: true })
      })

      server.middlewares.use('/__save-post', async (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405
          response.end()
          return
        }

        const { slug, date, markdown } = await readJsonBody(request)
        const safeSlug = String(slug || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
        const safeDate = String(date || '').slice(0, 10)
        if (!safeSlug || !/^\d{4}-\d{2}-\d{2}$/.test(safeDate) || typeof markdown !== 'string') {
          response.statusCode = 400
          response.end('Invalid post')
          return
        }

        const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'))
        for (const file of files) {
          if (file.endsWith(`-${safeSlug}.md`)) fs.unlinkSync(path.join(postsDir, file))
        }
        fs.writeFileSync(path.join(postsDir, `${safeDate}-${safeSlug}.md`), markdown, 'utf8')
        sendJson(response, 200, { ok: true })
      })

      server.middlewares.use('/__delete-post', async (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405
          response.end()
          return
        }

        const { slug } = await readJsonBody(request)
        const safeSlug = String(slug || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
        if (!safeSlug) {
          response.statusCode = 400
          response.end('Invalid slug')
          return
        }

        const files = fs.readdirSync(postsDir).filter((file) => file.endsWith(`-${safeSlug}.md`))
        for (const file of files) fs.unlinkSync(path.join(postsDir, file))
        sendJson(response, 200, { ok: true, deleted: files.length })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localPersistPlugin()],
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
