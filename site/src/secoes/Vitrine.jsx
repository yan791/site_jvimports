import { useEffect, useRef, useState } from 'react'
import { APARELHOS, PEDIDO, ECOSSISTEMA, linkConversa, canalConversa } from '../dados/conteudo.js'
import { Celular, Costas } from '../componentes/Aparelhos.jsx'
import { Icone } from '../componentes/Icone.jsx'
import { Escudo } from '../componentes/Marca.jsx'
import { useRevela, gsap } from '../lib/rolagem.js'

/* ---------- telas dos três cartões ---------- */
function TelaLacrado() {
  const cores = [['#d9532a', 'Laranja'], ['#22324b', 'Azul'], ['#d8dadd', 'Prata'], ['#2a2b2e', 'Preto']]
  return (
    <div className="app app--loja">
      <div className="app__topo"><Icone nome="voltar" /><b>Lacrados</b><Icone nome="mais" /></div>
      <div className="loja__produto">
        <div className="loja__caixa">
          <Costas className="loja__foto" />
          <span className="loja__caixa-selo">Lacrado</span>
        </div>
        <p className="loja__nome">iPhone 18 Pro Max</p>
        <p className="loja__desc">256 GB · na caixa original</p>
      </div>
      <div className="loja__cores">
        {cores.map(([c, n], i) => <span key={n} className={i === 0 ? 'ativa' : ''} style={{ '--c': c }} title={n} />)}
      </div>
      <div className="loja__linhas">
        <span><Icone nome="nota" />Nota fiscal</span>
        <span><Icone nome="escudoCheck" />Garantia</span>
      </div>
    </div>
  )
}

function TelaSeminovo() {
  const itens = ['Face ID', 'Câmeras', 'Tela', 'Alto-falantes']
  return (
    <div className="app app--bateria">
      <div className="app__topo"><Icone nome="voltar" /><b>Revisão</b><span /></div>
      <div className="bateria__anel" style={{ '--p': 0.96 }}>
        <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" /><circle cx="60" cy="60" r="50" className="cheio" /></svg>
        <span><b>96%</b><small>saúde da bateria</small></span>
      </div>
      <ul className="bateria__lista">
        {itens.map((t, i) => <li key={t} style={{ '--i': i }}><Icone nome="check" />{t}<em>ok</em></li>)}
      </ul>
    </div>
  )
}

function TelaAssistencia() {
  return (
    <div className="app app--reparo">
      <div className="reparo__vidro">
        <svg className="reparo__trincas" viewBox="0 0 100 200" aria-hidden="true">
          <path d="M62 38 50 70 58 96 40 128 47 160M50 70 26 82M58 96 84 112M40 128 18 140M47 160 70 186M62 38 80 18M62 38 44 22" />
        </svg>
        <div className="reparo__nova">
          <span className="reparo__brilho" />
          <p className="reparo__hora">9:41</p>
        </div>
      </div>
      <div className="reparo__cartao">
        <span><Icone nome="tela" /></span>
        <p><b>Tela nova</b><small>Pronta para retirar</small></p>
        <Icone nome="check" className="reparo__ok" />
      </div>
    </div>
  )
}

const TELAS = { lacrados: TelaLacrado, seminovos: TelaSeminovo, assistencia: TelaAssistencia }
const CHIPS = {
  lacrados: { titulo: 'Na caixa', texto: 'lacre original', icone: 'caixa' },
  seminovos: { titulo: 'Bateria', texto: 'conferida', icone: 'bateria' },
  assistencia: { titulo: 'Peça de qualidade', texto: 'com garantia', icone: 'escudoCheck' },
}

export function Aparelhos() {
  const ref = useRevela()
  return (
    <section className="aparelhos container" id="aparelhos" ref={ref} aria-labelledby="aparelhos-titulo">
      <header className="cabeca">
        <h2 id="aparelhos-titulo" className="titulo titulo--display">
          {APARELHOS.titulo.map((l, i) => <span className="linha-mascara" key={i}><span style={{ '--i': i }}>{l}</span></span>)}
        </h2>
        <p className="texto centro" data-revela style={{ '--i': 2 }}>{APARELHOS.texto}</p>
      </header>
      <div className="aparelhos__grade">
        {APARELHOS.cartoes.map((c, i) => {
          const Tela = TELAS[c.id]
          const chip = CHIPS[c.id]
          return (
            <article key={c.id} className={`cartao cartao--${c.tom}`} data-revela style={{ '--i': i + 2 }} id={c.id === 'assistencia' ? 'assistencia' : undefined}>
              <h3 className="titulo titulo--cartao">{c.titulo}</h3>
              <p className="texto">{c.texto}</p>
              <div className="cartao__palco">
                <Celular className="cartao__celular"><Tela /></Celular>
                <div className="cartao__chip">
                  <span><Icone nome={chip.icone} /></span>
                  <p><b>{chip.titulo}</b><small>{chip.texto}</small></p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- Monte seu pedido (o momento interativo) ---------- */
export function Pedido() {
  const ref = useRevela()
  const [aparelho, setAparelho] = useState('iPhone')
  const [estado, setEstado] = useState('Lacrado')
  const [extras, setExtras] = useState(['Quero entrega hoje'])
  const [enviando, setEnviando] = useState(false)
  const alternar = (x) => setExtras((l) => (l.includes(x) ? l.filter((y) => y !== x) : [...l, x]))
  const estadoTxt = estado === 'Tanto faz' ? 'lacrado ou seminovo' : estado.toLowerCase()
  const frases = { 'Quero entrega hoje': 'quero receber hoje', 'Quero dar meu usado na troca': 'quero dar meu usado na troca', 'Pagamento no cartão': 'prefiro pagar no cartão' }
  const partes = PEDIDO.extras.filter((x) => extras.includes(x)).map((x) => frases[x])
  const juntas = partes.length > 1 ? `${partes.slice(0, -1).join(', ')} e ${partes.at(-1)}` : partes[0] || ''
  const extrasTxt = juntas ? ` ${juntas.charAt(0).toUpperCase()}${juntas.slice(1)}.` : ''
  const msg = `Oi, JV! Vim pelo site. Procuro um ${aparelho} ${estadoTxt}.${extrasTxt} Pode me passar as opções?`
  const bolha = useRef(null)
  useEffect(() => {
    if (!bolha.current) return
    gsap.fromTo(bolha.current, { scale: 0.96, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' })
  }, [msg])
  const enviar = () => { setEnviando(true); setTimeout(() => setEnviando(false), 1600) }

  return (
    <article className="largo largo--pedido" id="pedido" ref={ref}>
      <div className="largo__texto">
        <h3 className="titulo titulo--display">
          {PEDIDO.titulo.map((l, i) => <span className="linha-mascara" key={i}><span style={{ '--i': i }}>{l}</span></span>)}
        </h3>
        <p className="texto" data-revela style={{ '--i': 2 }}>{PEDIDO.texto}</p>
      </div>
      <div className="pedido" data-revela style={{ '--i': 3 }}>
        <div className="pedido__grupo">
          <p className="pedido__rotulo">Aparelho</p>
          <div className="pedido__opcoes">
            {PEDIDO.aparelhos.map((a) => (
              <button key={a} className={`opcao ${aparelho === a ? 'ativa' : ''}`} onClick={() => setAparelho(a)} aria-pressed={aparelho === a}>{a}</button>
            ))}
          </div>
        </div>
        <div className="pedido__grupo">
          <p className="pedido__rotulo">Estado</p>
          <div className="pedido__opcoes">
            {PEDIDO.estados.map((a) => (
              <button key={a} className={`opcao ${estado === a ? 'ativa' : ''}`} onClick={() => setEstado(a)} aria-pressed={estado === a}>{a}</button>
            ))}
          </div>
        </div>
        <div className="pedido__grupo">
          <p className="pedido__rotulo">Extras</p>
          <div className="pedido__opcoes">
            {PEDIDO.extras.map((a) => (
              <button key={a} className={`opcao opcao--marca ${extras.includes(a) ? 'ativa' : ''}`} onClick={() => alternar(a)} aria-pressed={extras.includes(a)}>
                <i><Icone nome="check" /></i>{a}
              </button>
            ))}
          </div>
        </div>
        <div className="pedido__previa">
          <p className="pedido__rotulo">Sua mensagem</p>
          <div className="pedido__bolha" ref={bolha}>
            {msg}
            <span className="pedido__hora">agora <Icone nome="check" /><Icone nome="check" /></span>
          </div>
          <a className={`pilula pilula--grande pedido__enviar ${enviando ? 'enviando' : ''}`} href={linkConversa(msg)} target="_blank" rel="noopener" onClick={enviar}>
            <Icone nome={canalConversa() === 'WhatsApp' ? 'whatsapp' : 'instagram'} />
            <span>{enviando ? 'Abrindo a conversa...' : `Enviar no ${canalConversa()}`}</span>
            <Icone nome="seta" className="pilula__seta" />
          </a>
        </div>
      </div>
    </article>
  )
}

/* ---------- Do iPhone ao MacBook ---------- */
const PECAS = [
  { icone: 'ipad', x: 50, y: 6, cor: '#fff' },
  { icone: 'macbook', x: 76, y: 22, cor: '#fff' },
  { icone: 'relogio', x: 58, y: 44, cor: 'var(--laranja)', claro: true },
  { icone: 'airpods', x: 84, y: 60, cor: '#fff' },
  { icone: 'cabo', x: 52, y: 76, cor: '#fff' },
  { icone: 'android', x: 72, y: 88, cor: 'var(--marinho)', claro: true },
]

export function Ecossistema() {
  const ref = useRevela()
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.eco__peca').forEach((el, i) => {
        gsap.fromTo(el, { y: 40 + i * 12 }, { y: -40 - i * 10, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  const lista = [['iphone', 'iPhone 18 Pro Max', 'Conectado'], ['relogio', 'Apple Watch', 'Conectado'], ['airpods', 'AirPods Pro', '82% de bateria'], ['macbook', 'MacBook Air', 'Mesma conta']]
  return (
    <article className="largo largo--eco" id="ecossistema" ref={ref}>
      <div className="eco__palco">
        <Celular className="eco__celular">
          <div className="app app--eco">
            <div className="app__topo"><Icone nome="voltar" /><b>Meus aparelhos</b><Icone nome="mais" /></div>
            <div className="eco__abas"><span className="ativa">Todos</span><span>Apple</span><span>Acessórios</span></div>
            <p className="eco__mes">Comprados na JV</p>
            {lista.map(([ic, n, s], i) => (
              <div className="eco__item" key={n} style={{ '--i': i }}>
                <span><Icone nome={ic} /></span>
                <p><b>{n}</b><small>{s}</small></p>
                <Icone nome="seta" />
              </div>
            ))}
          </div>
        </Celular>
        {PECAS.map((p, i) => (
          <span key={i} className={`eco__peca ${p.claro ? 'eco__peca--cor' : ''}`} style={{ left: `${p.x}%`, top: `${p.y}%`, '--fundo': p.cor }} aria-hidden="true">
            {i === 2 ? <Escudo cor="#fff" /> : <Icone nome={p.icone} />}
          </span>
        ))}
      </div>
      <div className="largo__texto largo__texto--dir">
        <h3 className="titulo titulo--display">
          {ECOSSISTEMA.titulo.map((l, i) => <span className="linha-mascara" key={i}><span style={{ '--i': i }}>{l}</span></span>)}
        </h3>
        <p className="texto" data-revela style={{ '--i': 2 }}>{ECOSSISTEMA.texto}</p>
      </div>
    </article>
  )
}
