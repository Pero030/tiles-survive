import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const contentOverridesPath = path.resolve(process.cwd(), 'src/data/contentOverrides.local.json');

const ensureContentOverridesFile = () => {
  if (!fs.existsSync(contentOverridesPath)) {
    fs.mkdirSync(path.dirname(contentOverridesPath), { recursive: true });
    fs.writeFileSync(contentOverridesPath, '{\n}\n');
  }
};

const readRequestBody = (request) => new Promise((resolve, reject) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
  });
  request.on('end', () => resolve(body));
  request.on('error', reject);
});

const localContentOverridesPlugin = () => ({
  name: 'local-content-overrides',
  configureServer(server) {
    server.middlewares.use('/api/admin/content-overrides', async (request, response) => {
      ensureContentOverridesFile();

      if (request.method === 'GET') {
        response.setHeader('Content-Type', 'application/json');
        response.end(fs.readFileSync(contentOverridesPath, 'utf8'));
        return;
      }

      if (request.method === 'PUT' || request.method === 'POST') {
        try {
          const body = await readRequestBody(request);
          const parsed = JSON.parse(body || '{}');
          fs.writeFileSync(contentOverridesPath, `${JSON.stringify(parsed, null, 2)}\n`);
          server.ws.send({ type: 'full-reload' });
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ ok: true }));
        } catch (error) {
          response.statusCode = 400;
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ ok: false, error: error.message }));
        }
        return;
      }

      response.statusCode = 405;
      response.end('Method Not Allowed');
    });
  },
});

export default defineConfig({
  plugins: [react(), localContentOverridesPlugin()],
  base: process.env.GITHUB_PAGES === 'true' ? '/tiles-survive/' : './',
});