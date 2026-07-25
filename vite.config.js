import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const localApiPlugin = () => ({
  name: 'local-api-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/save-projects' && req.method === 'POST') {
        let body = ''
        req.on('data', chunk => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const projects = JSON.parse(body)
            const publicImagesDir = path.resolve(__dirname, 'public/images')
            if (!fs.existsSync(publicImagesDir)) {
              fs.mkdirSync(publicImagesDir, { recursive: true })
            }

            const updatedProjects = projects.map(p => {
              if (p.image && p.image.startsWith('data:image/')) {
                // Extract base64 payload and extension
                const extMatch = p.image.match(/^data:image\/(\w+);base64,/)
                const ext = extMatch ? extMatch[1] : 'jpg'
                const base64Data = p.image.replace(/^data:image\/\w+;base64,/, '')
                const buffer = Buffer.from(base64Data, 'base64')
                const filename = `${p.id}.${ext}`
                const filePath = path.join(publicImagesDir, filename)
                fs.writeFileSync(filePath, buffer)
                return { ...p, image: `/images/${filename}` }
              }
              return p
            })

            // Generate JS code for projects.js
            const fileContent = `export const DEFAULT_PROJECTS = ${JSON.stringify(updatedProjects, null, 2)}\n`
            fs.writeFileSync(path.resolve(__dirname, 'src/data/projects.js'), fileContent)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true }))
          } catch (error) {
            console.error('Error saving projects:', error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, error: error.message }))
          }
        })
      } else {
        next()
      }
    })
  }
})

export default defineConfig({
  plugins: [react(), localApiPlugin()],
})
