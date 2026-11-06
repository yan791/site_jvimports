import { useEffect, useState } from 'react'
import { Marca, Escudo } from './Marca.jsx'
import { Icone } from './Icone.jsx'
import { NAV, linkConversa, canalConversa } from '../dados/conteudo.js'
import { irPara, aoRolar } from '../lib/rolagem.js'

export function Topo() {
  const [escuro, setEscuro] = useState(false)
  useEffect(() => {
    // a cápsula escurece sobre as seções azul-marinho; um observador numa faixa fina no alto da
    // tela faz isso sem medir nada a cada quadro de rolagem
    const sobre = new Set()
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) (e.isIntersecting ? sobre.add(e.target) : sobre.delete(e.target))
      setEscuro(sobre.size > 0)
    }, { rootMargin: '-30px 0px -93% 0px', threshold: 0 })
    const alvos = () => document.querySelectorAll('[data-fundo-escuro]').forEach((s) => io.observe(s))
    alvos()
    const t = setTimeout(alvos, 1500)
    return () => { clearTimeout(t); io.disconnect() }
  }, [])
  const clicar = (e, alvo) => { e.preventDefault(); irPara(alvo) }
  return (
    <header className={`topo ${escuro ? 'topo--escuro' : ''}`}>
      <nav className="topo__barra" aria-label="Principal">
        <a href="#inicio" onClick={(e) => clicar(e, '#inicio')} aria-label="JV Imports, início"><Marca compacta /></a>
        <div className="topo__links">
          {NAV.map((n) => <a key={n.alvo} className="topo__link" href={n.alvo} onClick={(e) => clicar(e, n.alvo)}>{n.rotulo}</a>)}
        </div>
        <BotaoConversa compacto />
      </nav>
    </header>
  )
}

export function BotaoConversa({ texto, mensagem, grande = false, clara = false, compacto = false }) {
  const mover = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const canal = canalConversa()
  return (
    <a className={`pilula ${grande ? 'pilula--grande' : ''} ${clara ? 'pilula--clara' : ''}`} href={linkConversa(mensagem)} target="_blank" rel="noopener" onPointerMove={mover}>
      <Icone nome={canal === 'WhatsApp' ? 'whatsapp' : 'instagram'} />
      <span>{texto || (compacto ? 'Falar com a JV' : `Chamar no ${canal}`)}</span>
      {!compacto && <Icone nome="seta" className="pilula__seta" />}
    </a>
  )
}

// Cartão fixo no canto (o cartão de QR do Bevel), aparece depois do primeiro scroll
export function FlutuanteConversa() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    // aparece depois do hero e some perto da chamada final (só lê o scrollY por quadro)
    let perto = false
    let passou = false
    const decidir = () => setVisivel(passou && !perto)
    const io = new IntersectionObserver(([e]) => { perto = e.isIntersecting || e.boundingClientRect.top < 0; decidir() }, { rootMargin: '0px 0px -20% 0px' })
    const t = setTimeout(() => { const fim = document.querySelector('#final'); if (fim) io.observe(fim) }, 300)
    const sair = aoRolar((y) => { const p = y > window.innerHeight * 0.5; if (p !== passou) { passou = p; decidir() } })
    return () => { clearTimeout(t); io.disconnect(); sair() }
  }, [])
  return (
    <a className={`flutuante-conversa ${visivel ? 'visivel' : ''}`} href={linkConversa()} target="_blank" rel="noopener" aria-label="Falar com a JV Imports">
      <span className="flutuante-conversa__icone"><Escudo cor="var(--laranja)" /></span>
      <span>
        <strong>Fale com a JV</strong>
        <span>{canalConversa() === 'WhatsApp' ? 'Resposta rápida no WhatsApp' : 'Resposta rápida no Direct'}</span>
      </span>
    </a>
  )
}
