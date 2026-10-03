// Chromium (Playwright) con Google Fonts disponibles aunque el navegador no confíe en el
// proxy de la sesión: las peticiones a fonts.googleapis.com / fonts.gstatic.com se descargan
// con curl (que sí usa el CA del sistema) y se le entregan al navegador. Se guardan en caché.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CACHE = path.join(require('os').tmpdir(), 'pastelia-fuentes');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';

function fetchCached(url) {
  fs.mkdirSync(CACHE, { recursive: true });
  const f = path.join(CACHE, crypto.createHash('sha1').update(url).digest('hex'));
  if (!fs.existsSync(f)) fs.writeFileSync(f, execFileSync('curl', ['-sSL', '--fail', '-A', UA, url], { maxBuffer: 50 * 1024 * 1024 }));
  return fs.readFileSync(f);
}

async function routeFonts(ctx) {
  await ctx.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, async (route) => {
    const url = route.request().url();
    try {
      const body = fetchCached(url);
      const type = url.includes('googleapis') ? 'text/css' : (url.endsWith('.woff2') ? 'font/woff2' : 'application/octet-stream');
      await route.fulfill({ status: 200, contentType: type, body, headers: { 'access-control-allow-origin': '*' } });
    } catch (e) { console.log('[fuentes] no se pudo bajar', url, e.message); await route.abort(); }
  });
}


async function launch() {
  // En Linux, Chromium toma el idioma de LANGUAGE/LANG: así los controles nativos salen como en un celular de México.
  return chromium.launch({ channel: 'chromium', args: ['--lang=es-MX'], env: { ...process.env, LANGUAGE: 'es_MX:es', LANG: 'es_MX.UTF-8' } });
}

module.exports = { launch, routeFonts };
