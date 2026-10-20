// Espelho do iPhone: captura a tela via USB (ffmpeg) e transmite no navegador, atrás de uma senha.
// Sem dependências: só Node 18+ e ffmpeg instalados no computador onde o iPhone está plugado.
'use strict';
const http = require('http');
const crypto = require('crypto');
const { spawn } = require('child_process');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1'; // use 0.0.0.0 para abrir de outro aparelho da rede
const SENHA = process.env.SENHA;
const FONTE = process.env.FONTE || (process.platform === 'darwin' ? 'mac' : 'demo');
const FPS = Number(process.env.FPS) || 20;
const LARGURA = Number(process.env.LARGURA) || 720;
const QUALIDADE = Number(process.env.QUALIDADE) || 5; // 2 (melhor) a 31 (pior)

if (!SENHA) {
  console.error('Defina a senha antes de iniciar:  SENHA="sua-senha" node server.js');
  process.exit(1);
}

const hash = (s) => crypto.createHash('sha256').update(String(s)).digest();
const senhaHash = hash(SENHA);
const sessoes = new Set();
const falhas = new Map(); // ip -> { n, ate }

// ---------- captura ----------
function argsEntrada() {
  switch (FONTE) {
    case 'mac': // o iPhone plugado aparece como dispositivo de vídeo do avfoundation
      return ['-f', 'avfoundation', '-framerate', String(FPS), '-pixel_format', 'uyvy422',
        '-i', `${process.env.IPHONE_DEVICE || 'iPhone'}`];
    case 'custom': // ex.: FFMPEG_ENTRADA="-f h264 -i pipe:0" ou qualquer entrada do ffmpeg
      return (process.env.FFMPEG_ENTRADA || '').split(/\s+/).filter(Boolean);
    default: // demo: imagem de teste, para conferir que o site funciona
      return ['-re', '-f', 'lavfi', '-i', `testsrc2=size=886x1920:rate=${FPS}`];
  }
}

const clientes = new Set();
let ff = null;
let ultimoFrame = null;
let ultimoErro = '';

function iniciarCaptura() {
  if (ff) return;
  const args = ['-hide_banner', '-loglevel', 'error', ...argsEntrada(),
    '-vf', `scale=${LARGURA}:-2`, '-q:v', String(QUALIDADE), '-f', 'image2pipe', '-c:v', 'mjpeg', 'pipe:1'];
  ff = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  ultimoErro = '';
  let buf = Buffer.alloc(0);
  ff.stdout.on('data', (d) => {
    buf = Buffer.concat([buf, d]);
    let i;
    while ((i = buf.indexOf(Buffer.from([0xff, 0xd9]))) !== -1) {
      const frame = buf.subarray(0, i + 2);
      buf = buf.subarray(i + 2);
      ultimoFrame = frame;
      for (const res of clientes) enviar(res, frame);
    }
  });
  ff.stderr.on('data', (d) => { ultimoErro = (ultimoErro + d).slice(-600); });
  ff.on('error', (e) => { ultimoErro = e.code === 'ENOENT' ? 'ffmpeg não está instalado.' : String(e); ff = null; });
  ff.on('close', () => {
    ff = null;
    if (clientes.size) setTimeout(iniciarCaptura, 2000); // iPhone desplugado? tenta de novo
  });
}

function pararCapturaSeOcioso() {
  if (!clientes.size && ff) { ff.kill('SIGTERM'); ff = null; ultimoFrame = null; }
}

function enviar(res, frame) {
  res.write(`--quadro\r\nContent-Type: image/jpeg\r\nContent-Length: ${frame.length}\r\n\r\n`);
  res.write(frame);
  res.write('\r\n');
}

// ---------- HTTP ----------
const cookie = (req) => Object.fromEntries((req.headers.cookie || '').split(/;\s*/).filter(Boolean)
  .map((c) => { const k = c.indexOf('='); return [c.slice(0, k), c.slice(k + 1)]; }));
const autenticado = (req) => sessoes.has(cookie(req).sessao);
const ipDe = (req) => req.socket.remoteAddress;

const HEAD = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Espelho do iPhone</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0b0d;color:#f5f5f7;font-family:-apple-system,system-ui,Segoe UI,sans-serif}
form,.painel{background:#1c1c1e;padding:32px;border-radius:20px;width:min(360px,92vw);text-align:center}
h1{font-size:22px;margin:0 0 20px}input,button{width:100%;padding:14px;border-radius:12px;border:0;font-size:16px}
input{background:#2c2c2e;color:#fff;margin-bottom:12px}button{background:#0a84ff;color:#fff;font-weight:600;cursor:pointer}
.erro{color:#ff453a;margin:0 0 12px;font-size:14px}
#tela{display:none;max-height:100vh;max-width:100vw;border-radius:24px}
#aviso{position:fixed;bottom:16px;left:0;right:0;text-align:center;font-size:14px;color:#8e8e93}
a{color:#0a84ff}
</style></head><body>`;

function paginaLogin(erro) {
  return `${HEAD}<form method="post" action="/entrar"><h1>Espelho do iPhone</h1>
${erro ? `<p class="erro">${erro}</p>` : ''}
<input type="password" name="senha" placeholder="Senha" autofocus required><button>Entrar</button></form></body></html>`;
}

const paginaEspelho = () => `${HEAD}<img id="tela" alt="Tela do iPhone">
<div class="painel" id="espera"><h1>Conectando ao iPhone…</h1><p>Plugue o cabo USB, desbloqueie o aparelho e toque em “Confiar” se aparecer.</p></div>
<div id="aviso"><a href="/sair">Sair</a></div>
<script>
const img=document.getElementById('tela'),espera=document.getElementById('espera');
function liga(){img.src='/video?'+Date.now();}
img.onload=()=>{img.style.display='block';espera.style.display='none';};
img.onerror=()=>{img.style.display='none';espera.style.display='block';setTimeout(liga,2000);};
liga();
</script></body></html>`;

const html = (res, code, body, extra = {}) => {
  res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', ...extra });
  res.end(body);
};

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');

  if (req.method === 'POST' && url.pathname === '/entrar') {
    const ip = ipDe(req);
    const f = falhas.get(ip);
    if (f && f.ate > Date.now()) return html(res, 429, paginaLogin('Muitas tentativas. Aguarde um minuto.'));
    let corpo = '';
    req.on('data', (d) => { corpo += d; if (corpo.length > 2048) req.destroy(); });
    req.on('end', () => {
      const senha = new URLSearchParams(corpo).get('senha') || '';
      if (crypto.timingSafeEqual(hash(senha), senhaHash)) {
        falhas.delete(ip);
        const id = crypto.randomBytes(32).toString('hex');
        sessoes.add(id);
        res.writeHead(302, { Location: '/', 'Set-Cookie': `sessao=${id}; HttpOnly; SameSite=Strict; Path=/` });
        return res.end();
      }
      const n = (f ? f.n : 0) + 1;
      falhas.set(ip, { n, ate: n >= 5 ? Date.now() + 60000 : 0 });
      html(res, 401, paginaLogin('Senha incorreta.'));
    });
    return;
  }

  if (url.pathname === '/sair') {
    sessoes.delete(cookie(req).sessao);
    res.writeHead(302, { Location: '/', 'Set-Cookie': 'sessao=; Max-Age=0; Path=/' });
    return res.end();
  }

  if (!autenticado(req)) {
    if (url.pathname === '/video') { res.writeHead(401); return res.end(); }
    return html(res, 200, paginaLogin());
  }

  if (url.pathname === '/video') {
    res.writeHead(200, { 'Content-Type': 'multipart/x-mixed-replace; boundary=quadro', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
    clientes.add(res);
    if (ultimoFrame) enviar(res, ultimoFrame);
    iniciarCaptura();
    req.on('close', () => { clientes.delete(res); setTimeout(pararCapturaSeOcioso, 5000); });
    return;
  }

  if (url.pathname === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ capturando: !!ff, frame: !!ultimoFrame, erro: ultimoErro }));
  }

  html(res, 200, paginaEspelho());
}).listen(PORT, HOST, () => {
  console.log(`Espelho do iPhone em http://${HOST}:${PORT}  (fonte: ${FONTE})`);
  if (HOST === '0.0.0.0') {
    for (const lista of Object.values(require('os').networkInterfaces()))
      for (const i of lista || [])
        if (i.family === 'IPv4' && !i.internal) console.log(`No iPad, abra: http://${i.address}:${PORT}`);
  }
});
