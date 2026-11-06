import { useEffect, useRef } from 'react'
import { ESCUDO_TODOS } from './Marca.jsx'

// Escudo da JV em 3D (vidro azul-marinho com bordas laranja), o cadeado do Bevel na versão JV.
// O three.js (700 kB) é baixado e lido logo na abertura, enquanto o escudo de carregamento está na
// tela e nada se mexe; montar a cena fica para quando a página estiver parada.
let promessaModulos = null
const modulos = () => (promessaModulos ||= Promise.all([
  import('three'),
  import('three/examples/jsm/loaders/SVGLoader.js'),
  import('three/examples/jsm/environments/RoomEnvironment.js'),
]))
if (typeof window !== 'undefined') modulos()

export function Escudo3D({ className }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    let limpar = () => {}
    let cancelado = false
    let iniciado = false
    // carrega e compila com a página parada, para não engasgar a rolagem quando a seção chegar
    const iniciar = async () => {
      if (iniciado) return
      iniciado = true
      io.disconnect()
      const [THREE, { SVGLoader }, { RoomEnvironment }] = await modulos()
      if (cancelado) return
      limpar = montar(THREE, SVGLoader, RoomEnvironment, el)
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) iniciar() }, { rootMargin: '900px 0px' })
    io.observe(el)
    const ocioso = window.requestIdleCallback || ((f) => setTimeout(f, 200))
    const t = setTimeout(() => ocioso(iniciar, { timeout: 3000 }), 2200)
    return () => { cancelado = true; clearTimeout(t); io.disconnect(); limpar() }
  }, [])
  return <div ref={ref} className={className} aria-hidden="true" />
}

function montar(THREE, SVGLoader, RoomEnvironment, el) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.82
  el.appendChild(renderer.domElement)

  const cena = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  cena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
  camera.position.set(0, 0, 9.5)

  // formas do escudo a partir dos mesmos caminhos do SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 950">${ESCUDO_TODOS.map((d) => `<path d="${d}"/>`).join('')}</svg>`
  const dados = new SVGLoader().parse(svg)
  const formas = dados.paths.flatMap((p) => SVGLoader.createShapes(p))

  const grupo = new THREE.Group()
  const escala = 0.0043
  // corpo de vidro: o contorno externo do escudo, grosso
  const contorno = new THREE.Shape()
  contorno.moveTo(70, 172); contorno.quadraticCurveTo(425, -130, 797, 177)
  contorno.lineTo(800, 263); contorno.bezierCurveTo(805, 420, 795, 560, 745, 665)
  contorno.bezierCurveTo(680, 790, 560, 860, 424, 905)
  contorno.bezierCurveTo(300, 840, 160, 720, 103, 583)
  contorno.bezierCurveTo(88, 520, 66, 420, 66, 330); contorno.lineTo(70, 172)
  const vidroGeo = new THREE.ExtrudeGeometry(contorno, { depth: 120, bevelEnabled: true, bevelThickness: 26, bevelSize: 18, bevelSegments: 6, curveSegments: 48 })
  vidroGeo.translate(-425, -460, -60)
  const vidro = new THREE.Mesh(vidroGeo, new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0b2f57'), metalness: 0.1, roughness: 0.18, transmission: 0.5, thickness: 1.4,
    ior: 1.35, clearcoat: 1, clearcoatRoughness: 0.12, transparent: true, opacity: 0.94, attenuationColor: new THREE.Color('#012849'), attenuationDistance: 2.2,
  }))
  vidro.scale.set(escala, -escala, escala)
  grupo.add(vidro)

  // J, V e lâminas em laranja metálico, saltando um pouco à frente do vidro
  const laranjaGeo = new THREE.ExtrudeGeometry(formas, { depth: 34, bevelEnabled: true, bevelThickness: 6, bevelSize: 4, bevelSegments: 3, curveSegments: 36 })
  laranjaGeo.translate(-425, -460, 92)
  const laranja = new THREE.Mesh(laranjaGeo, new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#fc6236'), metalness: 0.4, roughness: 0.34, clearcoat: 0.7, emissive: new THREE.Color('#5a1503'), emissiveIntensity: 0.18 }))
  laranja.scale.set(escala, -escala, escala)
  grupo.add(laranja)

  cena.add(grupo)
  const luz = new THREE.DirectionalLight('#ffffff', 2.2); luz.position.set(3, 4, 6); cena.add(luz)
  const contra = new THREE.PointLight('#fc6236', 20, 20); contra.position.set(-3, -2, -3); cena.add(contra)
  const azul = new THREE.PointLight('#5f8cff', 18, 20); azul.position.set(3, -3, 2); cena.add(azul)

  const medir = () => {
    const w = el.clientWidth, h = el.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  medir()
  const ro = new ResizeObserver(medir); ro.observe(el)

  let mx = 0, my = 0, alvoX = 0, alvoY = 0
  const mover = (e) => { alvoX = (e.clientX / window.innerWidth - 0.5) * 2; alvoY = (e.clientY / window.innerHeight - 0.5) * 2 }
  window.addEventListener('pointermove', mover, { passive: true })

  let visivel = true
  const io = new IntersectionObserver(([e]) => { visivel = e.isIntersecting }, { rootMargin: '100px 0px' })
  io.observe(el)
  let raf = 0
  let vivo = true
  const t0 = performance.now()
  const quadro = (agora) => {
    raf = requestAnimationFrame(quadro)
    if (!visivel || document.hidden) return
    const t = (agora - t0) / 1000
    mx += (alvoX - mx) * 0.04; my += (alvoY - my) * 0.04
    const r = el.getBoundingClientRect()
    const rol = (r.top + r.height / 2) / window.innerHeight - 0.5
    grupo.rotation.y = Math.sin(t * 0.35) * 0.32 + mx * 0.35 + rol * 0.5
    grupo.rotation.x = my * 0.18 - rol * 0.25
    grupo.position.y = -0.15 + Math.sin(t * 0.8) * 0.06
    renderer.render(cena, camera)
  }
  // compila os shaders em paralelo (sem travar a rolagem) e só então começa a desenhar
  const comecar = () => {
    if (!vivo) return
    renderer.render(cena, camera)
    raf = requestAnimationFrame(quadro)
    el.classList.add('pronto')
  }
  if (renderer.compileAsync) renderer.compileAsync(cena, camera).then(comecar, comecar)
  else { renderer.compile(cena, camera); comecar() }

  return () => {
    vivo = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
    window.removeEventListener('pointermove', mover)
    vidroGeo.dispose(); laranjaGeo.dispose(); renderer.dispose(); pmrem.dispose()
    renderer.domElement.remove()
  }
}
