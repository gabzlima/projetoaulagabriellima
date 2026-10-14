/* ======================================================================
   ZANZA · configurações (é só trocar aqui)
   ====================================================================== */
const CONFIG = {
  // URL do Google Apps Script (Implantar > App da Web). Passo a passo em apps-script/LEIAME.md
  // Enquanto estiver vazia, o formulário funciona, mas não envia os dados pra lugar nenhum.
  PLANILHA_URL: '',

  // WhatsApp da marca: só números, com 55 + DDD. Ex.: '5591912345678'
  // Vazio = o botão flutuante fica escondido.
  WHATSAPP_NUMERO: '',
  WHATSAPP_MENSAGEM: 'Fala, Zanza! Vim pelo site e quero saber do Drop 01.',

  // Só o @ (sem o "@"). Vazio = aparece "em breve" no rodapé.
  INSTAGRAM: '',
  TIKTOK: '',

  // Fotos do lookbook (substituem os quadros em ordem). Ex.: ['assets/lookbook/01.webp', 'assets/lookbook/02.webp']
  LOOKBOOK_FOTOS: []
};

(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- grão de asfalto (gerado em tempo ocioso, sem blend mode) ---------- */
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

  /* ---------- header com fundo ao rolar ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 20);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- parallax suave da logo (só mouse) ---------- */
  const hero = $('#hero'), wm = $('#wordmark');
  if (!reduce && matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      wm.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5) * 22 + 'px');
      wm.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5) * 14 + 'px');
    });
  }

  /* ---------- entrada ao rolar ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    $$('.rv').forEach(el => io.observe(el));
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

  /* ---------- provador ---------- */
  const zoomModal = $('#zoomModal'), zoomStage = $('#zoomStage'), zoomCap = $('#zoomCap');
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
    if (!reduce) {
      stage.addEventListener('pointermove', e => {
        if (e.pointerType === 'touch') return;
        const r = stage.getBoundingClientRect();
        tee.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 28 + 'deg');
        tee.style.setProperty('--rx', -((e.clientY - r.top) / r.height - .5) * 16 + 'deg');
      });
      stage.addEventListener('pointerleave', () => { tee.style.setProperty('--ry', '0deg'); tee.style.setProperty('--rx', '0deg'); });
    }

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
    const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
    const n = Math.round(p * words.length);
    if (n === lit) return;
    lit = n;
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  };
  if (reduce) words.forEach(w => w.classList.add('on'));
  else { addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(light); } }, { passive: true }); light(); }

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

  /* ---------- formulário de pré-venda ---------- */
  $$('.chips').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip', g).forEach(o => o.setAttribute('aria-pressed', o === b));
  }));

  const form = $('#signup'), msg = $('#msg'), btn = $('#submitBtn');
  const nomeEl = $('#nome'), whatsEl = $('#whats');

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

  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.className = 'form-msg'; msg.textContent = '';
    const okNome = checkNome(), okWhats = checkWhats();
    if (!okNome || !okWhats) { (!okNome ? nomeEl : whatsEl).focus(); return; }
    if (form.elements.site.value) return; // honeypot: robô preencheu

    const tam = $('[data-group="tam"] [aria-pressed="true"]', form).textContent;
    const cor = $('[data-group="cor"] [aria-pressed="true"]', form).textContent;
    const dados = {
      data: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      nome: nomeEl.value.trim(),
      whatsapp: '55' + whatsEl.value.replace(/\D/g, ''),
      tamanho: tam, cor, origem: location.href
    };

    btn.disabled = true; btn.firstChild.textContent = 'Enviando… ';
    try { await enviar(dados); }
    catch (err) {
      btn.disabled = false; btn.firstChild.textContent = 'Quero entrar na lista ';
      msg.textContent = 'Não rolou enviar agora. Confere a internet e tenta de novo.';
      return;
    }
    const card = $('#formCard');
    card.innerHTML = `<div class="success">
      <img class="stk" src="assets/star-light.webp" alt="" width="120" height="138">
      <h3>Tá na lista, ${nomeLimpo(dados.nome).split(' ')[0]}!</h3>
      <p>Tamanho ${tam}, cor ${cor.toLowerCase()}. A gente te chama no WhatsApp antes do drop abrir.</p>
      <a class="btn ghost" href="#drop">Ver as camisetas de novo</a>
    </div>`;
  });
})();
