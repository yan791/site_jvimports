import { useEffect, useState } from 'react'
import { Topo, FlutuanteConversa } from './componentes/Topo.jsx'
import { ESCUDO_TODOS } from './componentes/Marca.jsx'
import { FOTOS } from './componentes/Aparelhos.jsx'
import { Hero } from './secoes/Hero.jsx'
import { Linha, Clientes } from './secoes/Prova.jsx'
import { Aparelhos, Pedido, Ecossistema } from './secoes/Vitrine.jsx'
import { Entrega } from './secoes/Entrega.jsx'
import { Servicos, Seguranca, Galeria, Final, Rodape } from './secoes/Fim.jsx'
import { iniciarRolagem, ScrollTrigger } from './lib/rolagem.js'

function Carregando() {
  const [saiu, setSaiu] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setSaiu(true), 1150)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={`carregando ${saiu ? 'saiu' : ''}`} aria-hidden="true">
      <svg viewBox="40 -10 790 930">{ESCUDO_TODOS.map((d, i) => <path key={i} d={d} />)}</svg>
    </div>
  )
}

export default function App() {
  const [pronto, setPronto] = useState(false)
  useEffect(() => {
    iniciarRolagem()
    // decodifica as fotos dos aparelhos durante a abertura (fora da thread principal),
    // para nenhuma delas ser decodificada no meio da rolagem
    Object.values(FOTOS).forEach((src) => { const im = new Image(); im.decoding = 'async'; im.src = src; im.decode?.().catch(() => {}) })
    const t = setTimeout(() => setPronto(true), 1050)
    const pausar = () => document.body.classList.toggle('pausado', document.hidden)
    document.addEventListener('visibilitychange', pausar)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => { clearTimeout(t); document.removeEventListener('visibilitychange', pausar) }
  }, [])
  return (
    <>
      <a className="pular" href="#main">Pular para o conteúdo</a>
      <Carregando />
      <Topo />
      <main id="main" tabIndex={-1} className={pronto ? 'pronto' : ''}>
        <Hero />
        <Linha />
        <Clientes />
        <Aparelhos />
        <section className="largos container" aria-label="Pedido e aparelhos">
          <Pedido />
          <Ecossistema />
        </section>
        <Entrega />
        <Servicos />
        <Seguranca />
        <Galeria />
        <Final />
      </main>
      <Rodape />
      <FlutuanteConversa />
    </>
  )
}
