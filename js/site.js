/* ======================================================================
   ZANZA · comportamento comum a todas as páginas
   - dados legais da empresa (vindos de js/config.js)
   - botão "Pausar animações" (WCAG 2.2.2)
   - aviso de cookies + Google Analytics só com consentimento (LGPD)
   ====================================================================== */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const E = CONFIG.EMPRESA || {};
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* navegador sem armazenamento */ } }
  };

  /* ---------- dados da empresa ---------- */
  const ROTULOS = { RAZAO_SOCIAL: 'razão social', CNPJ: 'CNPJ', ENDERECO: 'endereço', EMAIL: 'e-mail', ENCARREGADO: 'encarregado', NOME_FANTASIA: 'nome fantasia' };
  $$('[data-empresa]').forEach(el => {
    const k = el.dataset.empresa, v = (E[k] || '').trim();
    if (v) {
      if (k === 'EMAIL') { const a = document.createElement('a'); a.href = 'mailto:' + v; a.textContent = v; el.replaceChildren(a); }
      else el.textContent = v;
    } else {
      const m = document.createElement('mark'); m.className = 'todo'; m.textContent = `[a preencher: ${ROTULOS[k] || k}]`;
      el.replaceChildren(m);
    }
  });
  // encarregado vazio: mostra o texto do canal de comunicação no lugar
  $$('[data-se-encarregado]').forEach(el => { el.hidden = !(E.ENCARREGADO || '').trim(); });
  $$('[data-sem-encarregado]').forEach(el => { el.hidden = !!(E.ENCARREGADO || '').trim(); });

  // versão da política em formato de data brasileira
  $$('[data-politica-versao]').forEach(el => {
    const d = new Date(CONFIG.POLITICA_VERSAO + 'T12:00:00');
    el.textContent = isNaN(d) ? CONFIG.POLITICA_VERSAO : d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  });

  // linha da empresa no rodapé: só aparece quando os dados obrigatórios estão preenchidos
  const linha = $('#empresaLinha');
  if (linha && E.RAZAO_SOCIAL && E.CNPJ) {
    linha.textContent = [E.RAZAO_SOCIAL, 'CNPJ ' + E.CNPJ, E.ENDERECO, E.EMAIL].filter(Boolean).join(' · ');
    linha.hidden = false;
  }

  /* ---------- pausar animações ---------- */
  const setPaused = on => {
    root.classList.toggle('paused', on);
    $$('[data-pause]').forEach(b => {
      b.setAttribute('aria-pressed', String(on));
      b.textContent = on ? 'Retomar animações' : 'Pausar animações';
    });
    document.dispatchEvent(new CustomEvent('zanza:pause', { detail: on }));
  };
  if (store.get('zanza-pausado') === '1') setPaused(true);
  $$('[data-pause]').forEach(b => b.addEventListener('click', () => {
    const on = !root.classList.contains('paused');
    setPaused(on); store.set('zanza-pausado', on ? '1' : '0');
  }));

  /* ---------- cookies e Google Analytics (só com consentimento) ---------- */
  const GA = (CONFIG.GA_ID || '').trim();
  const temGA = /^G-[A-Z0-9]+$/.test(GA);
  $$('[data-se-ga]').forEach(el => { el.hidden = !temGA; });
  $$('[data-sem-ga]').forEach(el => { el.hidden = temGA; });
  if (!temGA) return; // sem GA: nenhum cookie, nenhum aviso

  const CHAVE = 'zanza-cookies';
  let carregado = false;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });

  const ligarGA = () => {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    if (carregado) return;
    carregado = true;
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA);
    document.head.append(s);
    gtag('js', new Date());
    gtag('config', GA, { allow_google_signals: false, allow_ad_personalization_signals: false });
  };
  const desligarGA = () => {
    gtag('consent', 'update', { analytics_storage: 'denied' });
    // apaga os cookies _ga que já existirem (melhor esforço)
    const host = location.hostname.split('.');
    document.cookie.split(';').map(c => c.trim().split('=')[0]).filter(n => /^_ga/.test(n)).forEach(n => {
      for (let i = 0; i < host.length; i++) {
        const dom = host.slice(i).join('.');
        document.cookie = `${n}=; Max-Age=0; path=/; domain=${dom}`;
      }
      document.cookie = `${n}=; Max-Age=0; path=/`;
    });
  };

  const banner = document.createElement('div');
  banner.className = 'consent';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.innerHTML = `
    <p>A gente usa o Google Analytics pra contar quantas pessoas visitam o site. Ele só liga se você aceitar.
      <a href="privacidade.html#cookies">Saiba mais</a></p>
    <div class="consent-btns">
      <button type="button" class="btn btn-sm consent-btn" data-escolha="recusado">Recusar</button>
      <button type="button" class="btn btn-sm consent-btn" data-escolha="aceito">Aceitar</button>
    </div>`;
  document.body.append(banner);
  const mostrar = foco => { banner.classList.add('on'); if (foco) $('button', banner).focus(); };
  const esconder = () => banner.classList.remove('on');
  $$('[data-escolha]', banner).forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.escolha;
    store.set(CHAVE, v);
    if (v === 'aceito') ligarGA(); else desligarGA();
    esconder();
  }));
  // links "Cookies" do rodapé reabrem o aviso pra mudar a escolha
  $$('[data-cookies]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); mostrar(true); }));

  const escolha = store.get(CHAVE);
  if (escolha === 'aceito') ligarGA();
  else if (escolha !== 'recusado') mostrar(false);
})();
