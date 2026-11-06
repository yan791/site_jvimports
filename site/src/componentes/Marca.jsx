// Escudo da JV Imports redesenhado em SVG a partir do logo do Instagram (viewBox 850x950).
// A moldura são duas peças: a de cima vira as duas lâminas (direita e esquerda) e a de baixo
// fecha a ponta do escudo. J e V se fundem nela.
export const ESCUDO = {
  cima: 'M353 680 C260 665 170 640 103 583 C88 520 66 420 66 330 L70 172 Q425 -130 797 177 L800 263 C740 330 620 395 497 410 C600 385 700 310 760 190 Q425 -80 103 192 L100 330 C102 420 108 470 113 500 C130 545 220 625 353 680 Z',
  baixo: 'M797 297 C805 420 795 560 745 665 C680 790 560 860 424 905 C340 860 250 790 200 735 C160 690 135 650 127 623 C190 650 260 740 423 860 C610 770 750 630 768 470 L770 330 Z',
  j: 'M220 100 L460 50 L460 330 C460 432 390 492 300 492 C232 492 170 478 128 462 L128 300 L188 300 C208 300 220 288 220 268 Z',
  v: 'M350 510 L563 509 L607 743 L650 507 L772 505 L768 560 C740 680 620 790 457 857 Z',
}
export const ESCUDO_TODOS = [ESCUDO.cima, ESCUDO.baixo, ESCUDO.j, ESCUDO.v]

export function Escudo({ cor = 'currentColor', className, titulo }) {
  return (
    <svg
      className={className}
      viewBox="40 -10 790 930"
      role={titulo ? 'img' : undefined}
      aria-hidden={titulo ? undefined : 'true'}
      aria-label={titulo}
    >
      <g fill={cor}>
        {ESCUDO_TODOS.map((d, i) => <path key={i} d={d} />)}
      </g>
    </svg>
  )
}

// Escudo + "JV Imports" para o topo e o rodapé
export function Marca({ className = '', compacta = false }) {
  return (
    <span className={`marca ${compacta ? 'marca--compacta' : ''} ${className}`}>
      <Escudo className="marca__escudo" cor="var(--laranja)" />
      <span className="marca__nome">
        JV Imports
        {!compacta && <small>iPhones</small>}
      </span>
    </span>
  )
}
