/* ZANZA · comportamento da página inicial. As configurações ficam em js/config.js */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const motion = root.classList.contains('motion');
  const fine = root.classList.contains('fine');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  /* ---------- grão de asfalto (gerado em tempo ocioso) ---------- */
  const grain = () => {
    try {
      const c = document.createElement('canvas'); c.width = c.height = 120;
      const x = c.getContext('2d'); const d = x.createImageData(120, 120);
      for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
      x.putImageData(d, 0, 0);
      document.body.style.setProperty('--grain', `url(${c.toDataURL()})`);
    } catch (e) { /* sem grão, sem problema */ }
  };
  if ('requestIdleCallback' in window) requestIdleCallback(grain, { timeout: 1500 }); else setTimeout(grain, 400);

  /* ---------- faixas: duplica o texto pra rolar sem emenda ---------- */
  $$('[data-repeat]').forEach(t => { t.innerHTML = t.innerHTML.repeat(8); });

  /* ======================================================================
     HERO: holofote que revela a camada escondida
     Só mexe em translate/scale (sem repintar), segue o mouse ou o dedo e,
     quando ninguém mexe, passeia sozinho pela tela.
     ====================================================================== */
  const hero = $('#hero'), spot = $('#spot'), wm = $('#wordmark');
  if (motion && hero && spot) {
    let w = 0, h = 0, x = 0, y = 0, tx = 0, ty = 0, raf = 0, visible = true, lastInput = -1e9, started = false;
    const measure = () => {
      w = hero.offsetWidth; h = hero.offsetHeight;
      hero.style.setProperty('--hw', w + 'px'); hero.style.setProperty('--hh', h + 'px');
    };
    measure(); addEventListener('resize', measure, { passive: true });
    x = tx = w * .5; y = ty = h * .45;

    const tick = now => {
      raf = 0;
      if (!visible) return;
      if (now - lastInput > 2600) { // passeio automático
        if (root.classList.contains('paused')) { // pausado: para onde está
          if (Math.abs(x - tx) + Math.abs(y - ty) < .5) return;
        } else {
          const t = now / 1000;
          tx = w * (.5 + .34 * Math.sin(t * .45));
          ty = h * (.45 + .28 * Math.sin(t * .63 + 1.3));
        }
      }
      x = lerp(x, tx, .12); y = lerp(y, ty, .12);
      spot.style.setProperty('--sx', x.toFixed(1) + 'px');
      spot.style.setProperty('--sy', y.toFixed(1) + 'px');
      raf = requestAnimationFrame(tick);
    };
    const run = () => { if (!raf && visible) raf = requestAnimationFrame(tick); };
    const point = e => {
      const r = hero.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top; lastInput = performance.now();
      if (started) spot.style.setProperty('--ss', 1);
      run();
    };
    hero.addEventListener('pointermove', point, { passive: true });
    hero.addEventListener('pointerdown', point, { passive: true });
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) run(); }).observe(hero);
    document.addEventListener('zanza:pause', e => { if (!e.detail) run(); });
    // entra depois da abertura (estrela + logo)
    setTimeout(() => { started = true; spot.style.setProperty('--ss', 1); run(); }, 2300);

    // parallax suave da logo (só mouse)
    if (fine) hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      wm.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5) * 18 + 'px');
      wm.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5) * 10 + 'px');
    }, { passive: true });
  }

  /* ======================================================================
     CURSOR PRÓPRIO (só mouse): ponto + anel que segue com atraso,
     cresce e mostra uma palavra em cima do que dá pra clicar.
     ====================================================================== */
  const cursor = $('#cursor');
  if (motion && fine && cursor) {
    const label = $('#cursorLabel');
    let mx = -100, my = -100, rx = -100, ry = -100, raf = 0;
    const loop = () => {
      rx = lerp(rx, mx, .2); ry = lerp(ry, my, .2);
      cursor.style.setProperty('--rx', rx.toFixed(1) + 'px');
      cursor.style.setProperty('--ry', ry.toFixed(1) + 'px');
      raf = Math.abs(rx - mx) + Math.abs(ry - my) > .3 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      cursor.style.setProperty('--cx', mx + 'px'); cursor.style.setProperty('--cy', my + 'px');
      cursor.classList.remove('hide');
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    document.addEventListener('pointerover', e => {
      const el = e.target.closest('[data-cursor], a, button, summary, .chip, input, label');
      const typing = el && el.matches('input');
      cursor.classList.toggle('hide', !!typing);
      const word = el && !typing ? (el.dataset.cursor || '') : '';
      label.textContent = word;
      cursor.classList.toggle('big', !!el && !typing);
    });
    document.addEventListener('pointerdown', () => cursor.classList.add('press'));
    document.addEventListener('pointerup', () => cursor.classList.remove('press'));
    document.documentElement.addEventListener('pointerleave', () => cursor.classList.add('hide'));
  }

  /* ---------- botões magnéticos ---------- */
  if (motion && fine) $$('.magnetic, .lnav .btn, .form-card .btn').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5) * 14 + 'px');
      b.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5) * 10 + 'px');
    });
    b.addEventListener('pointerleave', () => { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
  });

  /* ---------- entrada ao rolar ---------- */
  if (motion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    $$('.rv').forEach(el => io.observe(el));
  }

  /* ======================================================================
     CENA FIXA (Visão geral): a camiseta entra, vira, troca de cor e dá zoom
     conforme a rolagem. 4 etapas, uma legenda por etapa.
     ====================================================================== */
  const track = $('#sceneTrack'), stageS = $('#sceneStage'), teeS = $('#sceneTee');
  const caps = $$('#sceneCaps .cap'), dots = $$('.scene-dots li');
  if (motion && track) {
    let step = -1, active = false, queued = false;
    const render = () => {
      queued = false;
      const r = track.getBoundingClientRect();
      const total = r.height - innerHeight;
      const p = clamp(-r.top / total);

      const intro = lerp(.8, 1, easeInOut(clamp(p / .14)));
      // virada: de 0,25 a 0,40 gira 180° e troca frente por costas no meio
      let turn = lerp(-24, 0, easeInOut(clamp(p / .2)));
      let view = 'front';
      if (p >= .25) {
        const t = easeInOut(clamp((p - .25) / .15));
        turn = t < .5 ? t * 180 : -180 + t * 180;
        view = t < .5 ? 'front' : 'back';
      }
      const zoom = easeInOut(clamp((p - .76) / .18));
      teeS.style.setProperty('--intro', intro.toFixed(3));
      teeS.style.setProperty('--turn', turn.toFixed(2) + 'deg');
      teeS.style.setProperty('--zoom', zoom.toFixed(3));
      if (stageS.dataset.view !== view) stageS.dataset.view = view;
      const color = p >= .55 ? 'off' : 'black';
      if (stageS.dataset.color !== color) stageS.dataset.color = color;

      const s = p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3;
      if (s !== step) {
        step = s;
        caps.forEach((c, i) => c.classList.toggle('on', i === s));
        dots.forEach((d, i) => d.classList.toggle('on', i === s));
      }
    };
    const onScroll = () => { if (active && !queued) { queued = true; requestAnimationFrame(render); } };
    new IntersectionObserver(([en]) => { active = en.isIntersecting; if (active) onScroll(); }, { rootMargin: '100px' }).observe(track);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    render();
  } else caps.forEach(c => c.classList.add('on'));

  /* ---------- brilho que segue o cursor nos cartões de detalhe ---------- */
  const bento = $('#bento');
  if (fine && bento) {
    const tiles = $$('.tile', bento);
    bento.addEventListener('pointermove', e => {
      tiles.forEach(t => {
        const r = t.getBoundingClientRect();
        t.style.setProperty('--gx', (e.clientX - r.left) + 'px');
        t.style.setProperty('--gy', (e.clientY - r.top) + 'px');
      });
    }, { passive: true });
  }

  /* ---------- lookbook: fotos reais no lugar dos quadros ---------- */
  CONFIG.LOOKBOOK_FOTOS.forEach((src, i) => {
    const fig = $$('.look')[i]; if (!fig) return;
    const img = new Image(); img.className = 'photo'; img.src = src; img.loading = 'lazy'; img.alt = $('.what', fig).textContent;
    fig.prepend(img); $('.ph', fig).remove(); $('.soon', fig)?.remove();
  });

  /* ---------- modais ---------- */
  const openDialog = d => {
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
  };
  $$('dialog').forEach(d => {
    d.addEventListener('click', e => { if (e.target === d) d.close(); }); // clicar fora fecha
    $$('[data-close]', d).forEach(b => b.addEventListener('click', () => d.close()));
  });
  $$('[data-open]').forEach(b => b.addEventListener('click', () => openDialog(document.getElementById(b.dataset.open))));

  /* ======================================================================
     PROVADOR (cartões de estampa)
     ====================================================================== */
  const zoomModal = $('#zoomModal'), zoomStage = $('#zoomStage'), zoomCap = $('#zoomCap');
  const pick = (group, text) => {
    const g = $(`[data-group="${group}"]`);
    if (!g) return;
    $$('.chip', g).forEach(o => o.setAttribute('aria-pressed', o.textContent.trim() === text));
  };
  $$('.tee-card').forEach(card => {
    const side = $('.side', card);
    $$('.swatch', card).forEach(b => b.addEventListener('click', () => {
      card.dataset.color = b.dataset.c;
      $$('.swatch', card).forEach(o => o.setAttribute('aria-pressed', o === b));
    }));
    $$('.view-btn', card).forEach(b => b.addEventListener('click', () => {
      card.dataset.view = b.dataset.v;
      side.textContent = b.dataset.v === 'front' ? 'Frente' : 'Costas';
      $$('.view-btn', card).forEach(o => o.setAttribute('aria-pressed', o === b));
    }));

    const stage = $('.stage', card), tee = $('.tee', card);
    if (motion) {
      stage.addEventListener('pointermove', e => {
        if (e.pointerType === 'touch') return;
        const r = stage.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        tee.style.setProperty('--ry', (px - .5) * 28 + 'deg');
        tee.style.setProperty('--rx', -(py - .5) * 16 + 'deg');
        stage.style.setProperty('--gx', px * 100 + '%');
        stage.style.setProperty('--gy', py * 100 + '%');
      });
      stage.addEventListener('pointerleave', () => { tee.style.setProperty('--ry', '0deg'); tee.style.setProperty('--rx', '0deg'); });
    }

    // "Quero essa": já deixa estampa e cor marcadas no formulário
    $('[data-tee]', card).addEventListener('click', e => {
      pick('est', e.currentTarget.dataset.tee);
      pick('cor', card.dataset.color === 'off' ? 'Off-white' : 'Preta');
    });

    // zoom: clona a camiseta e enquadra a estampa visível
    $('.zoom-btn', card).addEventListener('click', () => {
      const view = card.dataset.view;
      const print = $(`.print.${view}`, tee);
      const clone = tee.cloneNode(true);
      clone.removeAttribute('style'); clone.removeAttribute('role'); clone.setAttribute('aria-hidden', 'true');
      let box = { x: 60, y: 40, width: 280, height: 280 };
      try { const b = print.getBBox(); if (b.width && b.height) box = b; } catch (e) { /* mantém o enquadramento padrão */ }
      const size = Math.max(box.width, box.height) * 1.5;
      const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
      clone.setAttribute('viewBox', `${cx - size / 2} ${cy - size / 2} ${size} ${size}`);
      zoomStage.replaceChildren(clone);
      zoomStage.dataset.color = card.dataset.color;
      zoomStage.dataset.view = view;
      zoomCap.textContent = `${$('h3', card).textContent} · ${view === 'front' ? 'frente' : 'costas'}`;
      openDialog(zoomModal);
    });
  });

  /* ---------- manifesto: palavras acendem conforme a rolagem ---------- */
  const mt = $('#manifestoText');
  mt.innerHTML = mt.textContent.split(' ').map(w =>
    w.startsWith('*') ? `<span class="w hl">${w.slice(1)}</span>` : `<span class="w">${w}</span>`
  ).join(' ');
  const words = $$('.w', mt);
  let lit = -1, ticking = false;
  const light = () => {
    ticking = false;
    const r = mt.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((vh * .85 - r.top) / (r.height + vh * .35));
    const n = Math.round(p * words.length);
    if (n === lit) return;
    lit = n;
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  };
  if (!motion) words.forEach(w => w.classList.add('on'));
  else { addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(light); } }, { passive: true }); light(); }

  /* ---------- barra de compra no celular: aparece depois do hero, some no formulário ---------- */
  const bar = $('#buybar'), lista = $('#lista');
  if (bar && 'IntersectionObserver' in window) {
    let pastHero = false, atForm = false;
    const sync = () => {
      const on = pastHero && !atForm;
      bar.classList.toggle('on', on);
      document.body.classList.toggle('bar-on', on);
      $('a', bar).tabIndex = on ? 0 : -1;
      bar.setAttribute('aria-hidden', String(!on));
    };
    new IntersectionObserver(([en]) => { pastHero = !en.isIntersecting && en.boundingClientRect.top < 0; sync(); }).observe(hero);
    // some no formulário e no rodapé (não cobre o conteúdo do fim da página)
    const vistos = new Set();
    const io = new IntersectionObserver(es => {
      es.forEach(en => en.isIntersecting ? vistos.add(en.target) : vistos.delete(en.target));
      atForm = vistos.size > 0; sync();
    }, { threshold: .05 });
    [lista, $('footer')].forEach(el => el && io.observe(el));
  }

  /* ---------- contagem regressiva do drop ---------- */
  const alvo = CONFIG.DATA_DROP ? new Date(CONFIG.DATA_DROP).getTime() : NaN;
  if (alvo > Date.now()) {
    const cd = $('#countdown'), pad = n => String(n).padStart(2, '0');
    const tickCd = () => {
      const s = Math.max(0, Math.floor((alvo - Date.now()) / 1000));
      if (!s) { cd.hidden = true; return; }
      $('#cdD').textContent = pad(Math.floor(s / 86400));
      $('#cdH').textContent = pad(Math.floor(s / 3600) % 24);
      $('#cdM').textContent = pad(Math.floor(s / 60) % 60);
      $('#cdS').textContent = pad(s % 60);
      setTimeout(tickCd, 1000);
    };
    cd.hidden = false; tickCd();
  }

  /* ---------- WhatsApp flutuante e redes ---------- */
  const waLink = (texto) => `https://wa.me/${CONFIG.WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
  if (CONFIG.WHATSAPP_NUMERO) {
    const fab = $('#waFab'); fab.href = waLink(CONFIG.WHATSAPP_MENSAGEM); fab.hidden = false;
  }
  const socials = $('#socials');
  [['Instagram', CONFIG.INSTAGRAM, 'https://instagram.com/'], ['TikTok', CONFIG.TIKTOK, 'https://tiktok.com/@']].forEach(([nome, user, base]) => {
    const li = document.createElement('li');
    if (user) {
      const a = document.createElement('a');
      a.href = base + user.replace(/^@/, ''); a.target = '_blank'; a.rel = 'noopener';
      a.textContent = `${nome} @${user.replace(/^@/, '')}`;
      li.append(a);
    } else li.textContent = `${nome} em breve`;
    socials.append(li);
  });

  /* ======================================================================
     FORMULÁRIO DE PRÉ-VENDA
     ====================================================================== */
  $$('.chips').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip', g).forEach(o => o.setAttribute('aria-pressed', o === b));
  }));

  const form = $('#signup'), msg = $('#msg'), btn = $('#submitBtn');
  const nomeEl = $('#nome'), whatsEl = $('#whats'), aceiteEl = $('#aceite'), idadeEl = $('#idade');

  // máscara: (91) 9 0000-0000 (celular) ou (91) 0000-0000 (fixo)
  const mask = raw => {
    const d = raw.replace(/\D/g, '').replace(/^0+/, '').slice(0, 11);
    if (!d) return '';
    const cel = d[2] === '9';
    let o = '(' + d.slice(0, 2);
    if (d.length <= 2) return o;
    o += ') ';
    if (cel) { o += d[2]; if (d.length > 3) o += ' ' + d.slice(3, 7); if (d.length > 7) o += '-' + d.slice(7); }
    else { o += d.slice(2, 6); if (d.length > 6) o += '-' + d.slice(6, 10); }
    return o;
  };
  whatsEl.addEventListener('input', () => { whatsEl.value = mask(whatsEl.value); });

  const setErr = (el, texto) => {
    const p = document.getElementById('err-' + el.id);
    p.textContent = texto;
    if (texto) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return !texto;
  };
  const checkNome = () => {
    const v = nomeEl.value.trim();
    if (!v) return setErr(nomeEl, 'Coloca seu nome pra gente saber quem é.');
    if (v.length < 2) return setErr(nomeEl, 'Esse nome tá curto demais, confere aí.');
    if (!/\p{L}/u.test(v)) return setErr(nomeEl, 'Usa letras no nome, por favor.');
    return setErr(nomeEl, '');
  };
  const checkWhats = () => {
    const d = whatsEl.value.replace(/\D/g, '');
    if (!d) return setErr(whatsEl, 'Passa o WhatsApp pra gente te avisar do drop.');
    if (d.length < 10) return setErr(whatsEl, 'Faltou número. Confere com o DDD, tipo (91) 9 0000-0000.');
    const ddd = +d.slice(0, 2);
    if (ddd < 11 || ddd > 99 || ddd % 10 === 0) return setErr(whatsEl, 'Esse DDD não existe. Confere aí.');
    if (d.length === 11 && d[2] !== '9') return setErr(whatsEl, 'Celular começa com 9 depois do DDD.');
    return setErr(whatsEl, '');
  };
  const checkAceite = () => setErr(aceiteEl, aceiteEl.checked ? '' : 'Marca aqui pra gente poder te mandar mensagem no WhatsApp.');
  const checkIdade = () => setErr(idadeEl, idadeEl.checked ? '' : 'Confirma a idade (ou a autorização do seu responsável) pra entrar na lista.');
  aceiteEl.addEventListener('change', () => { if (aceiteEl.hasAttribute('aria-invalid')) checkAceite(); });
  idadeEl.addEventListener('change', () => { if (idadeEl.hasAttribute('aria-invalid')) checkIdade(); });
  nomeEl.addEventListener('blur', checkNome);
  whatsEl.addEventListener('blur', checkWhats);
  nomeEl.addEventListener('input', () => { if (nomeEl.hasAttribute('aria-invalid')) checkNome(); });
  whatsEl.addEventListener('input', () => { if (whatsEl.hasAttribute('aria-invalid')) checkWhats(); });

  const nomeLimpo = s => s.replace(/[<>&"]/g, '');
  const enviar = async dados => {
    if (!CONFIG.PLANILHA_URL) { console.info('[Zanza] PLANILHA_URL vazia: dados não foram enviados.', dados); return; }
    // Apps Script não libera CORS: no-cors envia igual e a resposta fica opaca
    await fetch(CONFIG.PLANILHA_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: new URLSearchParams(dados)
    });
  };

  const escolhido = g => $(`[data-group="${g}"] [aria-pressed="true"]`, form).textContent.trim();
  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.className = 'form-msg'; msg.textContent = '';
    const ok = [[checkNome(), nomeEl], [checkWhats(), whatsEl], [checkAceite(), aceiteEl], [checkIdade(), idadeEl]];
    const primeiroErro = ok.find(([v]) => !v);
    if (primeiroErro) { primeiroErro[1].focus(); return; }
    if (form.elements.site.value) return; // honeypot: robô preencheu

    const est = escolhido('est'), tam = escolhido('tam'), cor = escolhido('cor');
    // só o necessário (LGPD art. 6º, III). Data, aceite e versão da política provam o consentimento (art. 8º, § 2º)
    const dados = {
      data: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      nome: nomeEl.value.trim(),
      whatsapp: '55' + whatsEl.value.replace(/\D/g, ''),
      estampa: est, tamanho: tam, cor,
      consentimento_whatsapp: 'sim',
      declaracao_idade: 'sim',
      politica_versao: CONFIG.POLITICA_VERSAO
    };

    const label = btn.firstChild;
    btn.disabled = true; label.textContent = 'Enviando… ';
    try { await enviar(dados); }
    catch (err) {
      btn.disabled = false; label.textContent = 'Quero entrar na lista ';
      msg.textContent = 'Não rolou enviar agora. Confere a internet e tenta de novo.';
      return;
    }
    const card = $('#formCard');
    card.innerHTML = `<div class="success">
      <img class="stk" src="assets/star-light.webp" alt="" width="120" height="138">
      <h3>Tá na lista, ${nomeLimpo(dados.nome).split(' ')[0]}!</h3>
      <p>${est === 'Todas' ? 'Todas as estampas' : est}, tamanho ${tam}, cor ${cor.toLowerCase()}. A gente te chama no WhatsApp antes do drop abrir.</p>
      <a class="btn" href="#estampas">Ver as camisetas de novo</a>
    </div>`;
  });
})();
