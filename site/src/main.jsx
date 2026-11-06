import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import '@fontsource/montserrat/500.css'
import './estilos/tokens.css'
import './estilos/base.css'
import './estilos/aparelhos.css'
import './estilos/hero.css'
import './estilos/secoes.css'
import './estilos/entrega.css'
import App from './App.jsx'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('raiz')).render(<App />)
