import { useEffect, useRef, useState } from 'react'
import { SERVICOS, SEGURANCA, GALERIA, FINAL, RODAPE, CLIENTES, INSTAGRAM, linkConversa } from '../dados/conteudo.js'
import { Celular, Relogio, FotoCliente, ImagemOpcional, Costas, FOTOS } from '../componentes/Aparelhos.jsx'
import { Icone } from '../componentes/Icone.jsx'
import { Escudo, Marca } from '../componentes/Marca.jsx'
import { Escudo3D } from '../componentes/Escudo3D.jsx'
import { BotaoConversa } from '../componentes/Topo.jsx'
import { useRevela, irPara } from '../lib/rolagem.js'

/* ---------- E tem mais: lista que avança sozinha + celular ---------- */
const DURACAO = 4200
function TelaServico({ id }) {
  return (
    <div className={`folha folha--${id}`}>
      <span className="folha__alca" />
      <div className="folha__topo"><Escudo cor="var(--laranja)" /><b>JV Assistência</b><Icone nome="mais" /></div>
      {id === 'tela' && (
        <div className="serv serv--tela">
          <div className="serv__visor"><svg viewBox="0 0 100 160"><path d="M60 20 48 52 56 76 38 104 46 136M48 52 24 62M56 76 82 90M38 104 16 114" /></svg><span className="serv__varre" /></div>
          <p><b>Troca de tela</b><small>Toque, cor e brilho como no original</small></p>
        </div>
      )}
      {id === 'bateria' && (
        <div className="serv serv--bateria">
          <div className="serv__pilha"><i /><b>100%</b></div>
          <p><b>Bateria nova</b><small>Capacidade máxima de volta</small></p>
        </div>
      )}
      {id === 'laser' && (
        <div className="serv serv--laser">
          <div className="serv__costas"><Costas className="serv__foto" /><span className="serv__feixe" /></div>
          <p><b>Vidro traseiro</b><small>Troca feita a laser</small></p>
        </div>
      )}
      {id === 'android' && (
        <div className="serv serv--android">
          <div className="serv__icone"><Icone nome="android" /></div>
          <p><b>Android</b><small>Tela, bateria, conector e mais</small></p>
        </div>
      )}
      {id === 'acessorios' && (
        <div className="serv serv--acessorios">
          <div className="serv__grade">{['cabo', 'airpods', 'escudoCheck', 'raio'].map((n) => <span key={n}><Icone nome={n} /></span>)}</div>
          <p><b>Acessórios originais</b><small>Para cada modelo</small></p>
        </div>
      )}
      <span className="folha__botao"><Icone nome="whatsapp" /> Pedir orçamento</span>
    </div>
  )
}

export function Servicos() {
  const ref = useRevela()
  const [ativo, setAtivo] = useState(0)
  const [tocando, setTocando] = useState(true)
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.25 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!tocando || !visivel) return
    const id = setTimeout(() => setAtivo((a) => (a + 1) % SERVICOS.itens.length), DURACAO)
    return () => clearTimeout(id)
  }, [ativo, tocando, visivel])
  const item = SERVICOS.itens[ativo]
  return (
    <section className="servicos container" ref={ref} aria-labelledby="servicos-titulo">
      <div className="servicos__lado">
        <h2 id="servicos-titulo" className="titulo titulo--display"><span className="linha-mascara"><span>{SERVICOS.titulo}</span></span></h2>
        <p className="texto" data-revela style={{ '--i': 1 }}>{SERVICOS.texto}</p>
        <ul className="servicos__lista">
          {SERVICOS.itens.map((s, i) => (
            <li key={s.id} data-revela style={{ '--i': i + 2 }}>
              <button className={`servico ${i === ativo ? 'ativo' : ''} ${i === ativo && tocando && visivel ? 'rodando' : ''}`} onClick={() => { if (i === ativo) setTocando((t) => !t); else { setAtivo(i); setTocando(true) } }} style={{ '--dur': `${DURACAO}ms` }} aria-pressed={i === ativo}>
                <span className="servico__texto"><b>{s.titulo}</b><small>{s.texto}</small></span>
                <span className="servico__anel" aria-label={i === ativo && tocando ? 'Pausar' : 'Mostrar'}>
                  <svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" /><circle cx="18" cy="18" r="15.5" className="progresso" /></svg>
                  <Icone nome={i === ativo && tocando ? 'pausa' : 'play'} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="servicos__palco" data-revela style={{ '--i': 3 }}>
        <Celular className="servicos__celular">
          <div className="servicos__fundo" />
          <div className="servicos__folhas">
            {SERVICOS.itens.map((s, i) => (
              <div key={s.id} className={`servicos__folha ${i === ativo ? 'ativa' : i < ativo ? 'antes' : 'depois'}`}><TelaServico id={s.id} /></div>
            ))}
          </div>
          <div className="servicos__pontos">{SERVICOS.itens.map((s, i) => <i key={s.id} className={i === ativo ? 'ativo' : ''} />)}</div>
        </Celular>
        <p className="servicos__legenda" aria-live="polite">{item.titulo}</p>
      </div>
    </section>
  )
}

/* ---------- Compra segura: cartão azul-marinho com o escudo 3D ---------- */
export function Seguranca() {
  const ref = useRevela()
  return (
    <section className="seguranca container" ref={ref} data-fundo-escuro aria-labelledby="seg-titulo">
      <div className="seguranca__cartao">
        <Escudo3D className="seguranca__3d" />
        <div className="seguranca__texto">
          <h2 id="seg-titulo" className="titulo titulo--display"><span className="linha-mascara"><span>{SEGURANCA.titulo}</span></span></h2>
          <p className="texto centro" data-revela style={{ '--i': 1 }}>{SEGURANCA.texto}</p>
          <ul className="seguranca__itens">
            {SEGURANCA.itens.map((t, i) => <li key={t} data-revela style={{ '--i': i + 2 }}><Icone nome="check" />{t}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---------- Mosaico de clientes ---------- */
const COLUNAS = [[0, 1], [2, 3, 4], [5], [6, 7], [8], [0, 3], [1, 4, 6], [2, 7]]
export function Galeria() {
  const ref = useRevela()
  return (
    <section className="galeria" ref={ref} aria-labelledby="galeria-titulo">
      <div className="galeria__mosaico" aria-hidden="true">
        {COLUNAS.map((col, c) => (
          <div key={c} className="galeria__coluna" style={{ '--c': c }}>
            {col.map((i, j) => <FotoCliente key={j} src={CLIENTES.fotos[i]} indice={i} className="galeria__foto" rotulo={false} />)}
          </div>
        ))}
      </div>
      <div className="galeria__texto">
        <h2 id="galeria-titulo" className="titulo titulo--display centro">
          {GALERIA.titulo.map((l, i) => <span className="linha-mascara" key={i}><span style={{ '--i': i }}>{l}</span></span>)}
        </h2>
        <p className="texto centro" data-revela style={{ '--i': 2 }}>{GALERIA.texto}</p>
        <a className="pilula pilula--clara" href={INSTAGRAM} target="_blank" rel="noopener" data-revela style={{ '--i': 3 }}>
          <Icone nome="instagram" /><span>{GALERIA.cta}</span><Icone nome="seta" className="pilula__seta" />
        </a>
      </div>
    </section>
  )
}

/* ---------- Final + rodapé ---------- */
export function Final() {
  const ref = useRevela()
  const [foto, setFoto] = useState(null)
  return (
    <section className="final" id="final" ref={ref} aria-labelledby="final-titulo">
      <h2 id="final-titulo" className="titulo titulo--display centro">
        {FINAL.titulo.map((l, i) => <span className="linha-mascara" key={i}><span style={{ '--i': i }}>{l}</span></span>)}
      </h2>
      <p className="texto centro" data-revela style={{ '--i': 2 }}>{FINAL.texto}</p>
      <div data-revela style={{ '--i': 3 }}><BotaoConversa grande mensagem="Oi, JV! Vim pelo site e quero comprar um aparelho." /></div>
      <div className={`final__mesa ${foto ? 'final__mesa--foto' : ''}`} aria-hidden="true">
        {/* mesa de produtos (foto do ChatGPT); sem ela, entra a composição em CSS */}
        <ImagemOpcional src={FOTOS.mesa} className="final__foto" onStatus={setFoto} />
        {!foto && (
          <div className="final__composicao" data-revela style={{ '--i': 4 }}>
            <span className="final__sacola"><Escudo cor="var(--laranja)" /><b>JV IMPORTS</b><small>iPhones</small></span>
            <Celular className="final__celular" escuro>
              <div className="final__tela"><Escudo cor="var(--laranja)" /><p>Obrigado pela<br />preferência!</p></div>
            </Celular>
            <span className="final__caixa"><i /></span>
            <Relogio className="final__relogio"><div className="final__relogio-tela"><b>14:49</b><small>Entregue</small></div></Relogio>
            <span className="final__fone"><Icone nome="airpods" /></span>
          </div>
        )}
      </div>
    </section>
  )
}

export function Rodape() {
  const ir = (e, alvo) => { if (alvo.startsWith('#')) { e.preventDefault(); irPara(alvo) } }
  return (
    <footer className="rodape">
      <div className="container rodape__grade">
        <div className="rodape__marca">
          <Marca />
          <p>{RODAPE.local}</p>
        </div>
        {RODAPE.grupos.map((g) => (
          <div key={g.titulo} className="rodape__grupo">
            <p className="rodape__titulo">{g.titulo}</p>
            {g.links.map(([t, h]) => {
              const href = h === 'conversa' ? linkConversa() : h
              const fora = !href.startsWith('#')
              return <a key={t} href={href} onClick={(e) => ir(e, href)} {...(fora ? { target: '_blank', rel: 'noopener' } : {})}>{t}</a>
            })}
          </div>
        ))}
      </div>
      <p className="container rodape__aviso">{RODAPE.aviso} © {new Date().getFullYear()} JV Imports.</p>
      <p className="rodape__gigante" aria-hidden="true">JV IMPORTS</p>
    </footer>
  )
}
