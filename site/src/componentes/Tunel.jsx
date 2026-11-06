import { useEffect, useRef } from 'react'

// Túnel de luz do hero (a versão JV do túnel de arco-íris do Bevel): faixas de luz laranja,
// pêssego e azul correndo para fora de um horizonte claro. WebGL puro, fundo transparente.
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uT; uniform float uRolagem;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for(int i=0;i<4;i++){ v += a*n(p); p = p*2.03 + 7.1; a *= 0.5; } return v; }
vec3 paleta(float x){
  vec3 laranja = vec3(0.988, 0.384, 0.212);
  vec3 coral = vec3(1.0, 0.67, 0.58);
  vec3 ceu = vec3(0.56, 0.76, 1.0);
  vec3 azul = vec3(0.16, 0.36, 0.86);
  vec3 lilas = vec3(0.73, 0.68, 1.0);
  x = fract(x);
  if (x < 0.2) return mix(laranja, coral, x/0.2);
  if (x < 0.4) return mix(coral, ceu, (x-0.2)/0.2);
  if (x < 0.6) return mix(ceu, azul, (x-0.4)/0.2);
  if (x < 0.8) return mix(azul, lilas, (x-0.6)/0.2);
  return mix(lilas, laranja, (x-0.8)/0.2);
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv - vec2(0.5, 0.4 + uRolagem*0.08);
  p.x *= uRes.x / uRes.y;
  float abre = 1.0 + uRolagem*0.9;
  vec2 e = vec2(p.x, p.y * 4.6) / abre;
  float r = length(e);
  float ang = atan(e.y, e.x);
  float z = 0.32 / max(r, 0.002);
  float t = uT * (0.07 + uRolagem*0.25);
  float s = z - t;
  float faixas = fbm(vec2(ang * 3.2, s * 0.55));
  float fios = pow(n(vec2(ang * 26.0, s * 0.35)), 3.0);
  float cor = ang / 6.2831 + faixas * 0.55 + s * 0.04;
  vec3 c = paleta(cor);
  float anel = smoothstep(0.14, 0.4, r) * (1.0 - smoothstep(0.5, 1.25, r));
  float a = anel * (0.3 + 0.6 * faixas) + fios * anel * 0.3;
  a *= 0.78;
  // horizonte branco no centro
  float brilho = exp(-r * r * 10.0);
  c = mix(c, vec3(1.0), clamp(brilho * 1.2, 0.0, 1.0));
  a = max(a, brilho * 0.95);
  // some nas bordas de cima e de baixo, e bem cedo para cima, onde fica o texto
  a *= smoothstep(0.0, 0.16, uv.y) * smoothstep(0.86, 0.48, uv.y);
  gl_FragColor = vec4(c * a, a);
}`

export function Tunel({ className, progresso }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'high-performance' })
    if (!gl) { canvas.classList.add('sem-webgl'); return }
    const sh = (tipo, src) => { const s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s); return s }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uT = gl.getUniformLocation(prog, 'uT')
    const uRol = gl.getUniformLocation(prog, 'uRolagem')

    const escala = Math.min(window.devicePixelRatio || 1, 1.5) * 0.55
    const medir = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = Math.max(2, Math.round(r.width * escala))
      canvas.height = Math.max(2, Math.round(r.height * escala))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(canvas)

    let visivel = true
    const io = new IntersectionObserver(([e]) => { visivel = e.isIntersecting })
    io.observe(canvas)
    let raf = 0
    const t0 = performance.now()
    let suave = 0
    const quadro = (agora) => {
      raf = requestAnimationFrame(quadro)
      if (!visivel || document.hidden) return
      suave += ((progresso?.current || 0) - suave) * 0.08
      gl.uniform1f(uT, (agora - t0) / 1000)
      gl.uniform1f(uRol, suave)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(quadro)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [])
  return <canvas ref={ref} className={className} aria-hidden="true" />
}
