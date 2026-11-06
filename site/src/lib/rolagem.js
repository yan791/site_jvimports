import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

let lenis = null
const ouvintes = new Set()

// Rolagem suave (Lenis) ligada ao ticker do GSAP, com o mesmo ajuste do bevel.health (lerp 0.1).
// respectReducedMotion: false é obrigatório: o Lenis 1.3.2x desliga a suavidade quando o Windows
// está com "Efeitos de animação" desligado, que é o caso do PC de quem faz os sites.
export function iniciarRolagem() {
  if (lenis) return lenis
  lenis = new Lenis({ respectReducedMotion: false, lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1 })
  lenis.on('scroll', () => {
    ScrollTrigger.update()
    for (const f of ouvintes) f(window.scrollY)
  })
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  window.__lenis = lenis
  return lenis
}

export function irPara(alvo) {
  const el = typeof alvo === 'string' ? document.querySelector(alvo) : alvo
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

// Avisa a cada quadro de rolagem (com Lenis) e também no scroll nativo
export function aoRolar(f) {
  ouvintes.add(f)
  const nativo = () => { if (!lenis) f(window.scrollY) }
  window.addEventListener('scroll', nativo, { passive: true })
  return () => { ouvintes.delete(f); window.removeEventListener('scroll', nativo) }
}

// Marca o elemento com .in quando ele entra na tela (uma vez)
export function useRevela(opcoes = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
        }
      },
      { rootMargin: opcoes.margem || '0px 0px -12% 0px', threshold: opcoes.limite ?? 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

// Liga uma classe enquanto o elemento está visível (para pausar loops fora da tela)
export function useVisivel(ref, aoMudar) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => aoMudar(e.isIntersecting), { rootMargin: '120px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
}

export { gsap, ScrollTrigger }
