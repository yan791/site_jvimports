// Trata as fotos do ChatGPT (recorte, fundo, franja) e grava .webp em site/public/aparelhos.
// Uso: copie as originais para site/public/aparelhos/_bruto (frente.png, costas.png, relogio.jpg, mesa.jpg
// e um vazio.html), com o servidor "jv-imports" (5280) ligado: node processa-imagens.cjs. Depois apague _bruto.
const { createRequire } = require('module');
const req = createRequire('C:/Users/yanya/OneDrive/Documentos/Claude_Sites/ioma/ferramentas/package.json');
const puppeteer = req('puppeteer-core');
const fs = require('fs');
const DEST = 'C:/Users/yanya/OneDrive/Documentos/Claude_Sites/jv-imports/site/public/aparelhos/';
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const p = await b.newPage();
  await p.goto('http://127.0.0.1:5280/aparelhos/_bruto/vazio.html');
  const r = await p.evaluate(async () => {
    const carregar = (src) => new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.src = src; });
    const ler = async (src) => { const im = await carregar(src); const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d'); x.drawImage(im, 0, 0); return { c, x, w: c.width, h: c.height, img: x.getImageData(0, 0, c.width, c.height) }; };
    const caixaAlfa = (I, lim = 8) => { const d = I.img.data; let minx = 1e9, miny = 1e9, maxx = -1, maxy = -1; for (let y = 0; y < I.h; y++) for (let x = 0; x < I.w; x++) if (d[(y * I.w + x) * 4 + 3] > lim) { if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; } return { minx, miny, maxx, maxy }; };
    const cortar = (I, cx, tipo, q) => { const w = cx.maxx - cx.minx + 1, h = cx.maxy - cx.miny + 1; const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').putImageData(I.img, -cx.minx, -cx.miny); return { url: c.toDataURL(tipo, q), w, h }; };
    const out = {};

    // 1) frente: só recorta no contorno do aparelho
    let I = await ler('/aparelhos/_bruto/frente.png');
    let cx = caixaAlfa(I, 40);
    out.frente = { ...cortar(I, cx, 'image/webp', 0.92), cx };

    // 2) costas: limpa a franja vermelha (alfa baixo e pontos soltos) e fecha o corpo semitransparente
    I = await ler('/aparelhos/_bruto/costas.png');
    { const d = I.img.data; const W = I.w, H = I.h;
      for (let i = 3; i < d.length; i += 4) { const a = d[i]; d[i] = a < 90 ? 0 : a > 185 ? 255 : Math.round((a - 90) / 95 * 255); }
      // mantém só a peça ligada ao centro
      const vis = new Uint8Array(W * H); const pilha = [(H / 2 | 0) * W + (W / 2 | 0)];
      while (pilha.length) { const k = pilha.pop(); if (vis[k] || d[k * 4 + 3] === 0) continue; vis[k] = 1; const x = k % W, y = (k / W) | 0; if (x > 0) pilha.push(k - 1); if (x < W - 1) pilha.push(k + 1); if (y > 0) pilha.push(k - W); if (y < H - 1) pilha.push(k + W); }
      let soltos = 0; for (let k = 0; k < W * H; k++) if (!vis[k] && d[k * 4 + 3]) { d[k * 4 + 3] = 0; soltos++; }
      // borda: puxa a cor dos pixels de contorno para o laranja do corpo (tira o tom vermelho do recorte)
      out.costasSoltos = soltos; }
    cx = caixaAlfa(I, 10);
    out.costas = { ...cortar(I, cx, 'image/webp', 0.9), cx };

    // 3) relógio: tira o fundo preto ligado às bordas (a tela preta, cercada pela caixa, fica)
    I = await ler('/aparelhos/_bruto/relogio.jpg');
    { const d = I.img.data; const W = I.w, H = I.h; const br = (k) => Math.max(d[k * 4], d[k * 4 + 1], d[k * 4 + 2]);
      const fundo = new Uint8Array(W * H); const pilha = [];
      for (let x = 0; x < W; x++) { pilha.push(x, (H - 1) * W + x); } for (let y = 0; y < H; y++) { pilha.push(y * W, y * W + W - 1); }
      while (pilha.length) { const k = pilha.pop(); if (fundo[k] || br(k) > 20) continue; fundo[k] = 1; const x = k % W, y = (k / W) | 0; if (x > 0) pilha.push(k - 1); if (x < W - 1) pilha.push(k + 1); if (y > 0) pilha.push(k - W); if (y < H - 1) pilha.push(k + W); }
      for (let k = 0; k < W * H; k++) {
        if (fundo[k]) { d[k * 4 + 3] = 0; continue; }
        // contorno suave: pixel escuro vizinho do fundo vira semitransparente
        const x = k % W, y = (k / W) | 0;
        const viz = (x > 0 && fundo[k - 1]) || (x < W - 1 && fundo[k + 1]) || (y > 0 && fundo[k - W]) || (y < H - 1 && fundo[k + W]);
        if (viz) { const v = br(k); d[k * 4 + 3] = Math.max(0, Math.min(255, Math.round((v - 20) / 40 * 255))); }
      } }
    cx = caixaAlfa(I, 10);
    out.relogio = { ...cortar(I, cx, 'image/webp', 0.92), cx, telaOriginal: { minx: 285, miny: 251, maxx: 708, maxy: 760 } };

    // 4) mesa: recorta dentro da moldura cinza e clareia o fundo para casar com a página (#fbfcfe)
    I = await ler('/aparelhos/_bruto/mesa.jpg');
    { const d = I.img.data; const fx = [251 / 231, 252 / 232, 254 / 242];
      for (let i = 0; i < d.length; i += 4) for (let c = 0; c < 3; c++) d[i + c] = Math.min(255, Math.round(d[i + c] * fx[c])); }
    out.mesa = { ...cortar(I, { minx: 34, miny: 92, maxx: 1500, maxy: 932 }, 'image/webp', 0.88) };
    return out;
  });
  const salvar = (nome, url) => { const buf = Buffer.from(url.split(',')[1], 'base64'); fs.writeFileSync(DEST + nome, buf); return `${nome} ${buf.length >> 10} kB`; };
  console.log(salvar('iphone-frente.webp', r.frente.url), r.frente.w + 'x' + r.frente.h, JSON.stringify(r.frente.cx));
  console.log(salvar('iphone-costas.webp', r.costas.url), r.costas.w + 'x' + r.costas.h, 'pontos soltos removidos:', r.costasSoltos);
  console.log(salvar('apple-watch.webp', r.relogio.url), r.relogio.w + 'x' + r.relogio.h, JSON.stringify(r.relogio.cx));
  console.log(salvar('mesa.webp', r.mesa.url), r.mesa.w + 'x' + r.mesa.h);
  await b.close();
})();
