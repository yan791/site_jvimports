import { memo, useEffect, useRef, useState } from 'react'
import { ENTREGA, CLIENTES } from '../dados/conteudo.js'
import { Celular, FotoCliente, Costas } from '../componentes/Aparelhos.jsx'
import { Icone } from '../componentes/Icone.jsx'
import { Escudo } from '../componentes/Marca.jsx'
import { useRevela, aoRolar } from '../lib/rolagem.js'

const MSGS = ENTREGA.mensagens

/* ---------- conteúdos especiais das bolhas ---------- */
function Fotos() {
  // as três cores disponíveis: a foto laranja e as versões azul e prata tiradas dela
  return (
    <span className="bolha__fotos">
      {[undefined, 'azul', 'prata'].map((tom, i) => (
        <span key={i} className={`bolha__cor bolha__cor--${tom || 'laranja'}`}><Costas tom={tom} /></span>
      ))}
    </span>
  )
}
function Pedido({ m }) {
  return (
    <span className="bolha__pedido">
      <span className="bolha__pedido-topo"><Escudo cor="var(--laranja)" /><b>{m.titulo}</b></span>
      {m.linhas.map((l) => <span key={l} className="bolha__pedido-linha"><Icone nome="check" />{l}</span>)}
    </span>
  )
}
function Mapa() {
  return (
    <span className="bolha__mapa">
      <svg viewBox="0 0 200 110" aria-hidden="true">
        <path className="mapa__ruas" d="M0 30h200M0 78h200M40 0v110M120 0v110M165 0v110M0 8l200 40" />
        <path className="mapa__mar" d="M200 0v110h-34c14-30 6-60 34-110z" />
        <path className="mapa__rota" d="M18 92 C40 92 40 78 62 78 S118 80 120 60 S140 30 172 24" />
        <circle className="mapa__fim" cx="172" cy="24" r="5" />
        <circle className="mapa__moto" r="5.5"><animateMotion dur="6s" repeatCount="indefinite" path="M18 92 C40 92 40 78 62 78 S118 80 120 60 S140 30 172 24" /></circle>
      </svg>
      <span className="bolha__mapa-legenda"><Icone nome="pino" />Localização em tempo real</span>
    </span>
  )
}

// memo: quando uma mensagem nova aparece, as bolhas antigas não são redesenhadas
const Bolha = memo(function Bolha({ m }) {
  const de = m.de === 'jv' ? 'jv' : 'cli'
  if (m.tipo === 'selo') {
    return (
      <span className="bolha bolha--selo">
        <span className="selo-pilula">Obrigado pela</span>
        <span className="selo-pilula selo-pilula--2">preferência!</span>
        <span className="bolha__hora">{m.hora}</span>
      </span>
    )
  }
  return (
    <span className={`bolha bolha--${de} ${m.tipo ? 'bolha--' + m.tipo : ''}`}>
      {m.tipo === 'fotos' && <Fotos />}
      {m.tipo === 'pedido' && <Pedido m={m} />}
      {m.tipo === 'local' && <Mapa />}
      {m.tipo === 'foto-cliente' && <FotoCliente src={CLIENTES.fotos[0]} className="bolha__foto" rotulo={false} />}
      {m.texto && <span className="bolha__texto">{m.texto}</span>}
      <span className="bolha__hora">{m.hora}{de === 'cli' && <span className="bolha__lido"><Icone nome="check" /><Icone nome="check" /></span>}</span>
    </span>
  )
})

function TelaConversa({ visiveis, digitando }) {
  return (
    <div className="zap">
      <div className="zap__topo">
        <Icone nome="voltar" />
        <span className="zap__avatar"><Escudo cor="var(--laranja)" /></span>
        <span className="zap__quem"><b>JV Imports</b><small>{digitando ? 'digitando...' : 'online'}</small></span>
        <Icone nome="camera" />
      </div>
      <div className="zap__corpo">
        <span className="zap__dia">Hoje</span>
        {MSGS.map((m, i) => (
          <div key={i} className={`msg msg--${m.de === 'jv' ? 'jv' : 'cli'} ${i < visiveis ? 'visivel' : ''}`}>
            <div><Bolha m={m} /></div>
          </div>
        ))}
        <div className={`msg msg--jv ${digitando ? 'visivel' : ''}`}>
          <div><span className="bolha bolha--jv bolha--digitando"><i /><i /><i /></span></div>
        </div>
      </div>
      <div className="zap__entrada">
        <Icone nome="mais" />
        <span>Mensagem</span>
        <Icone nome="microfone" />
      </div>
    </div>
  )
}

function Flutuante({ f }) {
  if (f.tipo === 'selo') {
    return (
      <span className="flut flut--selo">
        <span className="selo-pilula">{f.titulo}</span>
        <span className="selo-pilula selo-pilula--2">{f.texto}</span>
      </span>
    )
  }
  return (
    <span className={`flut flut--${f.tipo}`}>
      <span className="flut__icone"><Icone nome={f.tipo === 'mapa' ? 'moto' : 'check'} /></span>
      <span><b>{f.titulo}</b><small>{f.texto}</small></span>
    </span>
  )
}

/* ---------- os 4 passos no alto da seção (os personagens do Bevel) ---------- */
const ICONES_PASSO = ['conversa', 'pedido', 'moto', 'escudoCheck']
function Passos() {
  const [ativo, setAtivo] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    let id = 0
    let visivel = false
    const io = new IntersectionObserver(([e]) => { visivel = e.isIntersecting })
    io.observe(ref.current)
    id = setInterval(() => { if (visivel && !document.hidden) setAtivo((a) => (a + 1) % 4) }, 2400)
    return () => { clearInterval(id); io.disconnect() }
  }, [])
  return (
    <div className="passos" ref={ref} aria-hidden="true">
      <span className="passos__luz" />
      <div className="passos__trilho" style={{ '--ativo': ativo }}>
        {ENTREGA.passos.map((p, i) => (
          <span key={p} className={`passo ${i === ativo ? 'ativo' : ''}`}>
            <span className="passo__orbe"><Icone nome={ICONES_PASSO[i]} /></span>
            <span className="passo__nome">{p}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- seção ---------- */
export function Entrega() {
  const topo = useRevela()
  const cartoes = useRef([])
  const flutuantes = useRef([])
  const celulares = useRef([])
  const [estado, setEstado] = useState(() => ENTREGA.etapas.map((e, k) => ({ v: k === 0 ? 0 : ENTREGA.etapas[k - 1].ate + 1, d: false })))
  const estadoRef = useRef(estado)

  useEffect(() => {
    // só calcula enquanto a seção está na tela; cartões longe desligam a camada fixa (não pintam)
    let ativa = false
    const perto = ENTREGA.etapas.map(() => false)
    const ioCartoes = new IntersectionObserver((entradas) => {
      for (const en of entradas) {
        const k = cartoes.current.indexOf(en.target)
        perto[k] = en.isIntersecting
        en.target.classList.toggle('etapa--longe', !en.isIntersecting)
      }
      ativa = perto.some(Boolean)
      if (ativa) atualizar()
    }, { rootMargin: '60px 0px' })
    cartoes.current.forEach((el) => el && ioCartoes.observe(el))

    const atualizar = () => {
      if (!ativa) return
      const antes = estadoRef.current
      {
        // 1) lê todas as medidas  2) depois escreve (sem forçar layout no meio)
        const medidas = ENTREGA.etapas.map((e, k) => {
          const el = cartoes.current[k]
          const cel = celulares.current[k]
          if (!perto[k] || !el || !cel) return null
          const r = el.getBoundingClientRect()
          const c = cel.getBoundingClientRect()
          const percurso = Math.max(1, r.height - c.height - 40)
          return Math.min(1, Math.max(0, (c.top - 20 - r.top) / percurso))
        })
        let mudou = false
        const novo = ENTREGA.etapas.map((e, k) => {
          const p = medidas[k]
          if (p === null) return antes[k]
          const fl = flutuantes.current[k]
          if (fl) fl.style.transform = `translate3d(0, ${((0.5 - p) * 90).toFixed(1)}px, 0)`
          const inicio = k === 0 ? 0 : ENTREGA.etapas[k - 1].ate + 1
          const fim = e.ate + 1
          const n = fim - inicio
          let v = inicio
          let d = false
          for (let i = 0; i < n; i++) {
            const limiar = 0.04 + (i * 0.78) / n
            if (p >= limiar) v = inicio + i + 1
            else {
              if (MSGS[inicio + i].de === 'jv' && p >= limiar - 0.1) d = true
              break
            }
          }
          if (v !== antes[k].v || d !== antes[k].d) mudou = true
          return { v, d }
        })
        if (mudou) { estadoRef.current = novo; setEstado(novo) }
      }
    }
    const sair = aoRolar(atualizar)
    window.addEventListener('resize', atualizar)
    return () => { sair(); ioCartoes.disconnect(); window.removeEventListener('resize', atualizar) }
  }, [])

  return (
    <section className="entrega" id="entrega" data-fundo-escuro aria-labelledby="entrega-titulo">
      <div className="entrega__topo container" ref={topo}>
        <Passos />
        <p className="entrega__rotulo" data-revela>{ENTREGA.rotulo}</p>
        <h2 id="entrega-titulo" className="titulo titulo--display centro">
          <span className="linha-mascara"><span className="apagado" style={{ '--i': 1 }}>{ENTREGA.titulo[0]}</span></span>
          <span className="linha-mascara"><span style={{ '--i': 2 }}>{ENTREGA.titulo[1]}</span></span>
        </h2>
        <p className="texto centro" data-revela style={{ '--i': 3 }}>{ENTREGA.texto}</p>
      </div>

      <div className="entrega__cartoes container">
        {ENTREGA.etapas.map((e, k) => (
          <article key={e.id} className={`etapa etapa--${e.tom}`} ref={(el) => (cartoes.current[k] = el)}>
            <Revelavel className="etapa__texto">
              <span className="etapa__num" data-revela>{String(k + 1).padStart(2, '0')} · {ENTREGA.passos[k]}</span>
              <h3 className="titulo titulo--display">
                {e.titulo.map((l, i) => <span className="linha-mascara" key={i}><span style={{ '--i': i }}>{l}</span></span>)}
              </h3>
              <p className="texto" data-revela style={{ '--i': 2 }}>{e.texto}</p>
            </Revelavel>
            <div className="etapa__fixo" aria-hidden="true">
              <div className="etapa__grade container">
                <div className="etapa__coluna">
                  <div className="etapa__celular" ref={(el) => (celulares.current[k] = el)}>
                    <Celular><TelaConversa visiveis={estado[k].v} digitando={estado[k].d} /></Celular>
                  </div>
                  <span className={`etapa__flutuante etapa__flutuante--${k}`} ref={(el) => (flutuantes.current[k] = el)}>
                    <Flutuante f={e.flutuante} />
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Revelavel({ className, children }) {
  const ref = useRevela({ margem: '0px 0px -25% 0px' })
  return <div className={className} ref={ref}>{children}</div>
}
