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

  /* 可用性標示：可實際使用／線上示範／僅介紹，以及是否附原始碼 */
  var ACCESS = {
    live: { label: '可實際使用', tip: '公開上線，任何人都能直接使用' },
    demo: { label: '線上示範', tip: '原本的介面搭配虛構資料，可以操作但不會儲存' },
    none: { label: '僅介紹', tip: '目前沒有公開的試用入口' }
  };
  function hasSource(w) { return w.links.some(function (l) { return /github\.com/.test(l.href); }); }
  function badges(w) {
    var a = ACCESS[w.access] || ACCESS.none;
    return '<ul class="avail" aria-label="可用性">' +
      '<li class="av av-' + esc(w.access || 'none') + '" title="' + esc(a.tip) + '">' + esc(a.label) + '</li>' +
      (hasSource(w) ? '<li class="av av-src" title="可以在 GitHub 看到原始碼">附原始碼</li>' : '<li class="av av-nosrc" title="原始碼不公開">原始碼未公開</li>') +
      '</ul>';
  }
  window.HS_BADGES = { badges: badges, hasSource: hasSource, ACCESS: ACCESS, esc: esc };

  function card(w) {
    return '<li><button type="button" class="work reveal" data-id="' + esc(w.id) + '" aria-haspopup="dialog">' +
      '<div class="thumb"><img src="' + esc(w.cover) + '" alt="" loading="lazy" width="800" height="500"></div>' +
      '<div class="body">' +
      '<div class="meta"><span>' + esc(CATS[w.category] || '') + ' · ' + esc(w.year) + '</span><span class="' + statusClass(w) + '">' + esc(w.status) + '</span></div>' +
      '<h3>' + esc(w.title) + '</h3>' +
      badges(w) +
      '<p>' + esc(w.summary) + '</p>' +
      '<ul class="tags">' + w.stack.slice(0, 4).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '</div></button></li>';
  }

  var state = { cat: 'all', avail: 'all' };
  function matchAvail(w, f) {
    if (f === 'live' || f === 'demo') return w.access === f;
    if (f === 'source') return hasSource(w);
    return true;
  }
  function render() {
    if (!grid) return;
    var mode = grid.getAttribute('data-works');
    var list = WORKS.filter(function (w) {
      if (mode === 'featured') return w.featured;
      return (state.cat === 'all' || w.category === state.cat) && matchAvail(w, state.avail);
    });
    var empty = document.querySelector('[data-works-empty]');
    if (empty) empty.hidden = list.length > 0;
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
      state.cat = b.getAttribute('data-filter');
      render();
    });
  }
  var availFilters = document.querySelector('[data-avail-filters]');
  if (availFilters) {
    var opts = [['all', '全部', WORKS.length],
      ['live', '可實際使用', WORKS.filter(function (w) { return w.access === 'live'; }).length],
      ['demo', '線上示範', WORKS.filter(function (w) { return w.access === 'demo'; }).length],
      ['source', '附原始碼', WORKS.filter(hasSource).length]];
    availFilters.innerHTML = opts.map(function (o) {
      return '<button type="button" class="chip chip-' + o[0] + '" data-avail="' + o[0] + '" aria-pressed="' + (o[0] === 'all') + '">' +
        esc(o[1]) + '<span class="count">' + o[2] + '</span></button>';
    }).join('');
    availFilters.addEventListener('click', function (e) {
      var b = e.target.closest('[data-avail]');
      if (!b) return;
      availFilters.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); });
      state.avail = b.getAttribute('data-avail');
      render();
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
      '<div class="dlg-cover"><img data-dlg-main src="' + esc(w.cover) + '" alt="' + esc(w.title) + ' 畫面"></div>' +
      (w.gallery && w.gallery.length > 1 ? '<div class="dlg-gallery" role="group" aria-label="更多畫面">' + w.gallery.map(function (g, i) {
        return '<button type="button" class="dlg-thumb" data-src="' + esc(g) + '" aria-pressed="' + (i === 0) + '" aria-label="第 ' + (i + 1) + ' 張畫面"><img src="' + esc(g) + '" alt="" loading="lazy"></button>';
      }).join('') + '</div>' : '') +
      '<div class="dlg-body">' +
      '<h2 id="dlg-title">' + esc(w.title) + '</h2>' +
      '<div class="meta"><span class="' + statusClass(w) + '">' + esc(w.status) + '</span><span>' + esc(CATS[w.category] || '') + '</span><span>' + esc(w.year) + '</span><span>角色：' + esc(w.role) + '</span></div>' +
      badges(w) +
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
      var t = e.target.closest('.dlg-thumb');
      if (t) {
        dlg.querySelector('[data-dlg-main]').src = t.getAttribute('data-src');
        dlg.querySelectorAll('.dlg-thumb').forEach(function (b) { b.setAttribute('aria-pressed', String(b === t)); });
        return;
      }
      if (e.target === dlg || e.target.closest('.dlg-close')) closeWork();
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.work[data-id], .work-link[data-id]');
    if (b) openWork(b.getAttribute('data-id'));
  });

  /* ---------- growth timeline（新的在上，往下滑越舊） ---------- */
  var ERAS = {
    '2026': { title: 'AI 工具與產品化', text: '把 AI 接進真實流程，同時把作品做成別人也能用的產品：本機優先、可追溯、可維運。' },
    '2025': { title: '走進辦公室', text: '開始替同事解決每天的麻煩：預約、活動、學習激勵，第一次有人每天在用我做的東西。' },
    '2023': { title: '從零開始自學', text: '一支爬蟲、一個 Flask 網站、一個計時器——寫程式的起點。' }
  };
  var MILESTONES = [
    { date: '2026-11', title: 'HACHIMAN STUDIO 成立', text: '以八萬與歐雷為品牌，整理三年來的作品，開始對外介紹。', icon: 'brand' }
  ];
  function monthLabel(d) { var p = d.split('-'); return p[0] + ' 年 ' + Number(p[1]) + ' 月'; }
  function renderTimeline() {
    var root = document.querySelector('[data-timeline]');
    if (!root) return;
    var items = WORKS.map(function (w) { return { kind: 'work', date: w.date, w: w }; })
      .concat(MILESTONES.map(function (m) { return { kind: 'milestone', date: m.date, m: m }; }))
      .sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    var html = ''; var year = '';
    items.forEach(function (it, i) {
      var y = it.date.slice(0, 4);
      if (y !== year) {
        year = y; var era = ERAS[y] || { title: '', text: '' };
        html += '<li class="tl-year reveal"><div class="tl-year-badge">' + y + '</div><div class="tl-era"><h2>' + esc(era.title) + '</h2><p>' + esc(era.text) + '</p></div></li>';
      }
      if (it.kind === 'milestone') {
        html += '<li class="tl-item tl-milestone reveal"><span class="tl-dot"><img src="assets/img/brand/logo-icon.webp" alt=""></span>' +
          '<div class="tl-card"><time>' + monthLabel(it.date) + '</time><h3>' + esc(it.m.title) + '</h3><p>' + esc(it.m.text) + '</p></div></li>';
        return;
      }
      var w = it.w;
      html += '<li class="tl-item reveal ' + (i % 2 ? 'tl-right' : 'tl-left') + '"><span class="tl-dot"></span>' +
        '<button type="button" class="tl-card work-link" data-id="' + esc(w.id) + '" aria-haspopup="dialog">' +
        '<div class="tl-thumb"><img src="' + esc(w.cover) + '" alt="" loading="lazy" width="800" height="500"></div>' +
        '<div class="tl-body"><time>' + monthLabel(w.date) + '・' + esc(CATS[w.category] || '') + '</time>' +
        '<h3>' + esc(w.title) + '</h3>' + badges(w) +
        '<p class="tl-growth"><span>成長</span>' + esc(w.growth || w.summary) + '</p>' +
        '<ul class="tags">' + w.stack.slice(0, 4).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '</div></button></li>';
    });
    root.innerHTML = html;
    var start = document.querySelector('[data-timeline-start]');
    if (start) start.textContent = items.length ? monthLabel(items[items.length - 1].date) : '';
    observe(root.querySelectorAll('.reveal'));
    // 中間的直線隨捲動填滿
    var fill = document.querySelector('.tl-fill');
    var wrap = document.querySelector('.tl-wrap');
    if (fill && wrap) {
      var onScroll = function () {
        var r = wrap.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
        fill.style.transform = 'scaleY(' + p + ')';
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    }
  }

  /* ---------- reveal on scroll ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function observe(nodes) {
    nodes.forEach(function (n) { if (io) io.observe(n); else n.classList.add('in'); });
  }

  render();
  renderTimeline();
  observe(document.querySelectorAll('.reveal:not(.work)'));

  var m = location.hash.match(/^#work-([\w-]+)$/);
  if (m) openWork(m[1], false);
})();
