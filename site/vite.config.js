import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Endereço público do site. As prévias de link (WhatsApp, Instagram) exigem og:image e og:url
// com endereço completo; troque aqui quando houver domínio próprio.
const ENDERECO_PUBLICO = 'https://yan791.github.io/site_jvimports/'

const linksAbsolutos = {
  name: 'jv-links-absolutos',
  transformIndexHtml: {
    order: 'post',
    handler: (html) =>
      ENDERECO_PUBLICO
        ? html
            .replace('content="og-jv.jpg"', `content="${ENDERECO_PUBLICO}og-jv.jpg"`)
            .replace('</head>', `  <meta property="og:url" content="${ENDERECO_PUBLICO}" />\n    <link rel="canonical" href="${ENDERECO_PUBLICO}" />\n  </head>`)
        : html,
  },
}

export default defineConfig({
  // caminhos relativos: o build funciona em qualquer hospedagem, inclusive em subpasta
  base: './',
  plugins: [react(), linksAbsolutos],
  // o OneDrive transforma node_modules em atalhos de nuvem; sem isto o build perde os imports
  resolve: { preserveSymlinks: true },
  server: { port: 5280, strictPort: true },
  preview: { port: 5281, strictPort: true },
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
  },
})
