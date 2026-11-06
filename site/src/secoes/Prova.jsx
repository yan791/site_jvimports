import { LINHA, CLIENTES } from '../dados/conteudo.js'
import { Icone } from '../componentes/Icone.jsx'
import { FotoCliente } from '../componentes/Aparelhos.jsx'
import { useRevela } from '../lib/rolagem.js'

const ICONES = { iPhone: 'iphone', iPad: 'ipad', MacBook: 'macbook', 'Apple Watch': 'relogio', AirPods: 'airpods', Android: 'android' }

export function Linha() {
  const ref = useRevela()
  return (
    <section className="linha" ref={ref} aria-labelledby="linha-titulo">
      <h2 id="linha-titulo" className="linha__titulo" data-revela>{LINHA.titulo}</h2>
      <ul className="linha__lista">
        {LINHA.itens.map((n, i) => (
          <li key={n} data-revela style={{ '--i': i + 1 }}><Icone nome={ICONES[n]} />{n}</li>
        ))}
      </ul>
    </section>
  )
}

function Louro({ lado }) {
  return (
    <svg className={`louro louro--${lado}`} viewBox="0 0 20 44" aria-hidden="true">
      <path d="M15 42C7 36 4 26 6 14 7.5 9 9.5 5 12 2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {[8, 15, 22, 29, 36].map((y, i) => (
        <g key={i}>
          <ellipse cx={5 + i * 0.6} cy={y} rx="2" ry="4.4" transform={`rotate(-28 ${5 + i * 0.6} ${y})`} fill="currentColor" opacity="0.85" />
          <ellipse cx={11 + i * 0.4} cy={y + 3} rx="1.8" ry="4" transform={`rotate(34 ${11 + i * 0.4} ${y + 3})`} fill="currentColor" opacity="0.6" />
        </g>
      ))}
    </svg>
  )
}

export function Clientes() {
  const ref = useRevela()
  const fotos = [...CLIENTES.fotos, ...CLIENTES.fotos]
  return (
    <section className="clientes" ref={ref} aria-labelledby="clientes-titulo">
      <div className="clientes__selos" data-revela>
        {CLIENTES.selos.map((s) => (
          <span className="selo-louro" key={s.linha2}>
            <Louro lado="esq" />
            <span><small>{s.linha1}</small>{s.linha2}</span>
            <Louro lado="dir" />
          </span>
        ))}
      </div>
      <h2 id="clientes-titulo" className="titulo titulo--display centro">
        {CLIENTES.titulo.map((l, i) => <span className="linha-mascara" key={i}><span style={{ '--i': i + 1 }}>{l}</span></span>)}
      </h2>
      <div className="clientes__faixa" data-revela style={{ '--i': 3 }}>
        <div className="clientes__trilho">
          {fotos.map((src, i) => <FotoCliente key={i} src={src} indice={i % 9} className="clientes__foto" />)}
        </div>
      </div>
    </section>
  )
}
