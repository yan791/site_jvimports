// Capturas rolando a página com a roda do mouse (Lenis), no Chrome headless.
// node rolar.cjs <url> <pasta> [largura] [altura] [a_cada_px] [--movel]
const { createRequire } = require('module');
const req = createRequire('C:/Users/yanya/OneDrive/Documentos/Claude_Sites/ioma/ferramentas/package.json');
const puppeteer = req('puppeteer-core');
const fs = require('fs');
const [,, url, out, W0, H0, E0] = process.argv; const movel = process.argv.includes('--movel');
const W = +(W0||1440), H = +(H0||900), every = +(E0||450);
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--use-angle=d3d11','--enable-gpu','--ignore-gpu-blocklist','--hide-scrollbars'] });
  const p = await b.newPage();
  const erros = [];
  p.on('console', m => { if (['error','warning'].includes(m.type())) erros.push(`[${m.type()}] ${m.text()}`) });
  p.on('pageerror', e => erros.push(`[pageerror] ${e.message}`));
  await p.setViewport({ width: W, height: H, deviceScaleFactor: 1, isMobile: movel, hasTouch: movel });
  await p.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise(r => setTimeout(r, 2600));
  await p.screenshot({ path: `${out}/y00000.jpg`, type: 'jpeg', quality: 72 });
  let total = await p.evaluate(() => document.documentElement.scrollHeight);
  let y = 0, next = every;
  while (y < total - H) {
    if (movel) { await p.evaluate(() => window.scrollBy(0, 60)); } else { await p.mouse.move(W/2, H/2); await p.mouse.wheel({ deltaY: 60 }); }
    y += 60; await new Promise(r => setTimeout(r, 40));
    if (y >= next) { await new Promise(r => setTimeout(r, 750)); const sy = await p.evaluate(() => Math.round(scrollY)); await p.screenshot({ path: `${out}/y${String(sy).padStart(5,'0')}.jpg`, type: 'jpeg', quality: 72 }); next += every; total = await p.evaluate(() => document.documentElement.scrollHeight); }
  }
  console.log('altura', total); console.log(erros.length ? erros.join('\n') : 'sem erros no console');
  await b.close();
})();
