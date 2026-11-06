import { useEffect, useState } from 'react'
import { Icone } from './Icone.jsx'
import { Escudo } from './Marca.jsx'
import { CLIENTES } from '../dados/conteudo.js'

// Fotos dos aparelhos (geradas no ChatGPT, tratadas com ferramentas/processa-imagens.cjs).
// A tela viva do site entra por cima da tela preta da foto; se a foto faltar, volta o aparelho em CSS.
export const FOTOS = {
  frente: 'aparelhos/iphone-frente.webp',
  costas: 'aparelhos/iphone-costas.webp',
  relogio: 'aparelhos/apple-watch.webp',
  mesa: 'aparelhos/mesa.webp',
}
const estados = new Map()
function useFoto(src) {
  // começa como existente (as fotos estão no projeto) para nada mudar de tamanho depois de carregar
  const [ok, setOk] = useState(true)
  useEffect(() => {
    if (!estados.has(src)) {
      estados.set(src, new Promise((r) => { const im = new Image(); im.onload = () => r(true); im.onerror = () => r(false); im.src = src }))
    }
    let vivo = true
    estados.get(src).then((v) => { if (vivo) setOk(v) })
    return () => { vivo = false }
  }, [src])
  return ok
}

// iPhone de frente: a foto é a moldura e a tela é HTML vivo (conversa, notificações, telas de app)
export function Celular({ children, className = '', escuro = false, semBarra = false, hora = '9:41', acabamento = 'titanio' }) {
  const foto = useFoto(FOTOS.frente)
  return (
    <div className={`celular celular--${acabamento} ${escuro ? 'celular--escuro' : ''} ${foto ? 'celular--foto' : ''} ${className}`}>
      {foto && <img className="celular__moldura" src={FOTOS.frente} alt="" aria-hidden="true" decoding="async" />}
      <span className="celular__botao celular__botao--acao" />
      <span className="celular__botao celular__botao--vol1" />
      <span className="celular__botao celular__botao--vol2" />
      <span className="celular__botao celular__botao--lado" />
      <div className="celular__tela">
        {!semBarra && (
          <div className="celular__barra" aria-hidden="true">
            <span className="celular__hora">{hora}</span>
            <span className="celular__ilha" />
            <span className="celular__status"><Icone nome="sinal" /><Icone nome="wifi" /><span className="celular__bat" /></span>
          </div>
        )}
        {semBarra && <span className="celular__ilha celular__ilha--solta" aria-hidden="true" />}
        {children}
      </div>
    </div>
  )
}

// Apple Watch: foto com a tela viva por cima (ou o relógio em CSS, se a foto faltar)
export function Relogio({ children, className = '' }) {
  const foto = useFoto(FOTOS.relogio)
  if (foto) {
    return (
      <div className={`relogio relogio--foto ${className}`} aria-hidden="true">
        <img className="relogio__foto" src={FOTOS.relogio} alt="" decoding="async" />
        <div className="relogio__tela">{children}</div>
      </div>
    )
  }
  return (
    <div className={`relogio ${className}`} aria-hidden="true">
      <span className="relogio__pulseira relogio__pulseira--cima" />
      <span className="relogio__pulseira relogio__pulseira--baixo" />
      <span className="relogio__coroa" />
      <span className="relogio__botao" />
      <div className="relogio__caixa">
        <div className="relogio__tela">{children}</div>
      </div>
    </div>
  )
}

// iPhone de costas (foto), também em miniatura nas telas e nas "fotos das cores" da conversa
export function Costas({ className = '', tom }) {
  return <img className={`costas ${tom ? 'costas--' + tom : ''} ${className}`} src={FOTOS.costas} alt="" aria-hidden="true" decoding="async" />
}

// Cada foto de cliente é procurada uma vez só, no carregamento, e o resultado vale para todas as
// cópias (assim nenhum espaço reservado troca de estado no meio da rolagem)
const sondas = new Map()
function sondar(src) {
  if (src.startsWith('clientes/') && !CLIENTES.prontas) return Promise.resolve(false)
  if (!sondas.has(src)) {
    sondas.set(src, new Promise((ok) => {
      const im = new Image()
      im.onload = () => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(() => ok(true))
      im.onerror = () => ok(false)
      im.src = src
    }))
  }
  return sondas.get(src)
}

// Foto de cliente: mostra a foto se o arquivo existir, senão um espaço reservado da marca
export function FotoCliente({ src, indice = 0, className = '', rotulo = true }) {
  const [existe, setExiste] = useState(false)
  useEffect(() => {
    let vivo = true
    sondar(src).then((r) => { if (vivo) setExiste(r) })
    return () => { vivo = false }
  }, [src])
  return (
    <figure className={`foto-cliente ${existe ? 'foto-cliente--ok' : ''} ${className}`} style={{ '--n': indice }}>
      {existe && <img src={src} alt="Cliente da JV Imports com o aparelho novo" decoding="async" />}
      {!existe && (
        <div className="foto-cliente__vazia" aria-hidden="true">
          <Escudo className="foto-cliente__escudo" cor="currentColor" />
          {rotulo && <span>foto do cliente<br /><b>{src.split('/').pop()}</b></span>}
        </div>
      )}
    </figure>
  )
}

// Imagem opcional: some sem deixar buraco se o arquivo não existir
export function ImagemOpcional({ src, alt = '', className = '', onStatus }) {
  const [ok, setOk] = useState(null)
  useEffect(() => { onStatus?.(ok) }, [ok, onStatus])
  if (ok === false) return null
  return <img className={`${className} ${ok ? 'pronta' : 'esperando'}`} src={src} alt={alt} decoding="async" onLoad={() => setOk(true)} onError={() => setOk(false)} />
}
