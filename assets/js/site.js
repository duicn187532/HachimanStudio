/* HACHIMAN STUDIO — site behaviour (no dependencies). */
(function () {
  'use strict';

  /* 聯絡設定：想公開 Email 時填入，例如 'hello@example.com'；留空則只顯示 GitHub。 */
  var SITE = {
    email: '',
    github: 'https://github.com/duicn187532'
  };

  document.documentElement.classList.remove('no-js');

  /* ---------- header ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---------- contact links ---------- */
  document.querySelectorAll('[data-contact="email"]').forEach(function (el) {
    if (SITE.email) { el.href = 'mailto:' + SITE.email; el.hidden = false; } else { el.hidden = true; }
  });
  document.querySelectorAll('[data-contact="github"]').forEach(function (el) { el.href = SITE.github; });
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- works ---------- */
  var WORKS = window.HS_WORKS || [];
  var CATS = window.HS_CATEGORIES || {};
  var grid = document.querySelector('[data-works]');

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function statusClass(w) { return w.status === '營運中' ? 'status live' : 'status'; }

  function card(w) {
    return '<li><button type="button" class="work reveal" data-id="' + esc(w.id) + '" aria-haspopup="dialog">' +
      '<div class="thumb"><img src="' + esc(w.cover) + '" alt="" loading="lazy" width="800" height="500"></div>' +
      '<div class="body">' +
      '<div class="meta"><span>' + esc(CATS[w.category] || '') + ' · ' + esc(w.year) + '</span><span class="' + statusClass(w) + '">' + esc(w.status) + '</span></div>' +
      '<h3>' + esc(w.title) + '</h3>' +
      '<p>' + esc(w.summary) + '</p>' +
      '<ul class="tags">' + w.stack.slice(0, 4).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '</div></button></li>';
  }

  function render(filter) {
    if (!grid) return;
    var mode = grid.getAttribute('data-works');
    var list = WORKS.filter(function (w) {
      if (mode === 'featured') return w.featured;
      return filter === 'all' || !filter || w.category === filter;
    });
    grid.innerHTML = list.map(card).join('');
    observe(grid.querySelectorAll('.reveal'));
  }

  var filters = document.querySelector('[data-filters]');
  if (filters) {
    var counts = { all: WORKS.length };
    WORKS.forEach(function (w) { counts[w.category] = (counts[w.category] || 0) + 1; });
    filters.innerHTML = Object.keys(CATS).filter(function (k) { return counts[k]; }).map(function (k) {
      return '<button type="button" class="chip" data-filter="' + k + '" aria-pressed="' + (k === 'all') + '">' +
        esc(CATS[k]) + '<span class="count">' + counts[k] + '</span></button>';
    }).join('');
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]');
      if (!b) return;
      filters.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); });
      render(b.getAttribute('data-filter'));
    });
  }

  /* ---------- dialog ---------- */
  var dlg = document.querySelector('dialog.work-dialog');
  var lastFocus = null;
  function openWork(id, push) {
    var w = WORKS.find(function (x) { return x.id === id; });
    if (!w || !dlg) return;
    var hasNote = !!w.note;
    dlg.querySelector('.dlg-content').innerHTML =
      '<div class="dlg-cover"><img src="' + esc(w.cover) + '" alt="' + esc(w.title) + ' 示意圖"></div>' +
      '<div class="dlg-body">' +
      '<h2 id="dlg-title">' + esc(w.title) + '</h2>' +
      '<div class="meta"><span class="' + statusClass(w) + '">' + esc(w.status) + '</span><span>' + esc(CATS[w.category] || '') + '</span><span>' + esc(w.year) + '</span><span>角色：' + esc(w.role) + '</span></div>' +
      '<p>' + esc(w.summary) + '</p>' +
      '<h3>重點</h3><ul class="points">' + w.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' +
      '<h3>技術</h3><ul class="tags">' + w.stack.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      (hasNote ? '<div class="dlg-note"><img src="assets/img/brand/orei-portrait.webp" alt=""><span>' + esc(w.note) + '</span></div>' : '') +
      (w.links.length ? '<div class="dlg-links">' + w.links.map(function (l, i) {
        return '<a class="btn ' + (i === 0 ? 'btn-primary' : 'btn-ghost') + ' btn-sm" href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label) + ' ↗</a>';
      }).join('') + '</div>' : '<div class="dlg-note"><img src="assets/img/brand/hachiman-peek.webp" alt=""><span>此專案為非公開專案，歡迎來信詢問細節。</span></div>') +
      '</div>';
    lastFocus = document.activeElement;
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    dlg.scrollTop = 0;
    if (push !== false && history.replaceState) history.replaceState(null, '', '#work-' + id);
  }
  function closeWork() {
    if (!dlg) return;
    if (dlg.open) dlg.close();
  }
  if (dlg) {
    dlg.addEventListener('close', function () {
      if (location.hash.indexOf('#work-') === 0 && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
      if (lastFocus) lastFocus.focus();
    });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('.dlg-close')) closeWork();
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.work[data-id]');
    if (b) openWork(b.getAttribute('data-id'));
  });

  /* ---------- reveal on scroll ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function observe(nodes) {
    nodes.forEach(function (n) { if (io) io.observe(n); else n.classList.add('in'); });
  }

  render('all');
  observe(document.querySelectorAll('.reveal:not(.work)'));

  var m = location.hash.match(/^#work-([\w-]+)$/);
  if (m) openWork(m[1], false);
})();
