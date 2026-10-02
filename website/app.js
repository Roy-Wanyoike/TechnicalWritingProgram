/* TechWritingPrograms — app logic (vanilla JS, zero deps) */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = { status: 'active', cat: 'all', q: '', sort: 'pay' };

  /* ---------- Theme ---------- */
  const themeToggle = $('#themeToggle');
  const themeIcon = $('.theme-icon');
  const stored = localStorage.getItem('twp-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(stored || (prefersDark ? 'dark' : 'light'), false);

  function setTheme(theme, persist = true) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    if (persist) localStorage.setItem('twp-theme', theme);
  }
  themeToggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    setTheme(cur === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Helpers ---------- */
  // Extract max dollar figure for sorting; unknown rates sort last.
  function payValue(p) {
    const nums = (p.pay.match(/\$[\d,]+/g) || []).map(s => parseFloat(s.replace(/[$,]/g, '')));
    if (!nums.length) return -1;
    return Math.max(...nums);
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function statusMeta(s) {
    return {
      active: { label: 'Active', cls: 'status-active' },
      paused: { label: 'Paused', cls: 'status-paused' },
      closed: { label: 'Closed', cls: 'status-closed' },
    }[s] || { label: s, cls: '' };
  }

  /* ---------- Stats ---------- */
  const actives = PROGRAMS.filter(p => p.status === 'active');
  $('#statActive').textContent = actives.length;
  $('#statTotal').textContent = PROGRAMS.length + FREE_PLATFORMS.length + MARKETPLACES.length;
  $('#statAgencies').textContent =
    PROGRAMS.filter(p => p.status === 'active' && p.category === 'agency').length + MARKETPLACES.length;
  const top = Math.max(...actives.map(payValue).filter(v => v > 0));
  $('#statTop').textContent = '$' + top.toLocaleString();

  /* ---------- Program cards ---------- */
  const grid = $('#grid');
  const emptyState = $('#emptyState');
  const resultCount = $('#resultCount');

  function cardHTML(p, i) {
    const meta = statusMeta(p.status);
    const note = p.note ? `<p class="card-note">${esc(p.note)}</p>` : '';
    return `
      <article class="card" style="animation-delay:${Math.min(i * 25, 300)}ms">
        <div class="card-top">
          <h3><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a></h3>
          <span class="status-dot ${meta.cls}" title="${meta.label}" aria-label="${meta.label}"></span>
        </div>
        <span class="pay">${esc(p.pay)}</span>
        <p>${esc(p.desc)}</p>
        ${note}
        <div class="card-foot">
          <span class="cat-chip">${esc(p.category)}</span>
          <a class="apply" href="${esc(p.url)}" target="_blank" rel="noopener">Apply ↗</a>
        </div>
      </article>`;
  }

  function render() {
    const q = state.q.trim().toLowerCase();
    let list = PROGRAMS.filter(p => {
      if (state.status !== 'all' && p.status !== state.status) return false;
      if (state.cat !== 'all' && p.category !== state.cat) return false;
      if (q && !(p.name + ' ' + p.desc + ' ' + p.pay + ' ' + (p.note || '')).toLowerCase().includes(q)) return false;
      return true;
    });
    if (state.sort === 'pay') {
      list.sort((a, b) => payValue(b) - payValue(a) || a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    grid.innerHTML = list.map(cardHTML).join('');
    resultCount.textContent = `${list.length} program${list.length === 1 ? '' : 's'} shown` +
      (state.status !== 'all' ? ` · status: ${state.status}` : '');
    emptyState.hidden = list.length > 0;
    grid.style.display = list.length ? '' : 'none';
  }

  /* ---------- Controls ---------- */
  let debounce;
  $('#search').addEventListener('input', (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { state.q = e.target.value; render(); }, 120);
  });

  $$('[data-status]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-status]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
    state.status = btn.dataset.status; render();
  }));

  $$('[data-cat]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-cat]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
    state.cat = btn.dataset.cat; render();
  }));

  $('#sort').addEventListener('change', (e) => { state.sort = e.target.value; render(); });

  $('#clearFilters').addEventListener('click', () => {
    state.q = ''; $('#search').value = '';
    state.cat = 'all'; state.status = 'active';
    $$('[data-status]').forEach(b => {
      const on = b.dataset.status === 'active';
      b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on));
    });
    $$('[data-cat]').forEach(b => {
      const on = b.dataset.cat === 'all';
      b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on));
    });
    render();
  });

  /* ---------- Free platforms / marketplaces / resources ---------- */
  $('#freeGrid').innerHTML = FREE_PLATFORMS.map(p => `
    <div class="mini-card">
      <h3><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a></h3>
      <span class="pay">${esc(p.pay)}</span>
      <p>${esc(p.desc)}</p>
    </div>`).join('');

  $('#marketGrid').innerHTML = MARKETPLACES.map(p => `
    <div class="mini-card">
      <h3><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a></h3>
      <span class="pay">${esc(p.pay)}</span>
      <p>${esc(p.desc)}</p>
    </div>`).join('');

  $('#resourceList').innerHTML = RESOURCES.map(p =>
    `<li><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a> — <span>${esc(p.desc)}</span></li>`
  ).join('');

  /* ---------- Back to top ---------- */
  const btt = $('#backToTop');
  window.addEventListener('scroll', () => {
    btt.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  render();
})();
