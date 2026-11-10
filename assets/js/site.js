/* HACHIMAN STUDIO — site behaviour (no dependencies). */
(function () {
  'use strict';

  /* 網站資料（聯絡方式、作品、時間線）由 tools/build_site.py 從 content/*.json 產生到 works.js／works.en.js。 */
  var DATA = window.HS_DATA || {};
  var SITE = DATA.site || {};

  document.documentElement.classList.remove('no-js');

  /* ---------- 語系：<html lang="en"> 的頁面（en/）使用英文；data-root 是回到網站根目錄的相對路徑 ---------- */
  var LANG = /^en/i.test(document.documentElement.lang) ? 'en' : 'zh';
  var ROOT = document.documentElement.getAttribute('data-root') || '';
  function u(p) { return /^([a-z]+:|\/|#)/i.test(p) ? p : ROOT + p; }
  var STR = {
    zh: {
      live: ['可實際使用', '公開上線，任何人都能直接使用'],
      demo: ['線上示範', '原本的介面搭配虛構資料，可以操作但不會儲存'],
      none: ['僅介紹', '目前沒有公開的試用入口'],
      availAria: '可用性', src: '附原始碼', srcTip: '可以在 GitHub 看到原始碼', nosrc: '原始碼未公開', nosrcTip: '原始碼不公開',
      all: '全部', shot: ' 畫面', more: '更多畫面', nth: function (n) { return '第 ' + n + ' 張畫面'; },
      role: '我的角色：', points: '重點', stack: '技術', privateNote: '此專案為非公開專案，歡迎來信詢問細節。',
      growth: '成長', sep: '・',
      month: function (d) { var p = d.split('-'); return p[0] + ' 年 ' + Number(p[1]) + ' 月'; }
    },
    en: {
      live: ['Live', 'Publicly available; anyone can use it'],
      demo: ['Demo', 'The original interface with made-up data; you can use it, but nothing is saved'],
      none: ['Overview only', 'No public version to try'],
      availAria: 'Availability', src: 'Source code', srcTip: 'Source code is on GitHub', nosrc: 'Private source', nosrcTip: 'Source code is not public',
      all: 'All', shot: ' screenshot', more: 'More screenshots', nth: function (n) { return 'Screenshot ' + n; },
      role: 'My role: ', points: 'Highlights', stack: 'Tech', privateNote: 'This project is not public. Feel free to email me for details.',
      growth: 'Growth', sep: ' · ',
      month: function (d) { var p = d.split('-'); return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(p[1]) - 1] + ' ' + p[0]; }
    }
  }[LANG];

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
  document.querySelectorAll('[data-contact="github"]').forEach(function (el) { if (SITE.github) el.href = SITE.github; });
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- 訪客統計（GoatCounter：不使用 cookie，不需要同意視窗） ---------- */
  var GC_CODE = /^[a-z0-9-]+$/i.test(SITE.goatcounter || '') ? SITE.goatcounter.toLowerCase() : '';
  var isLocal = /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname) || location.protocol === 'file:';
  if (GC_CODE && !isLocal) {
    var gc = document.createElement('script');
    gc.async = true;
    gc.src = 'https://gc.zgo.at/count.js';
    gc.setAttribute('data-goatcounter', 'https://' + GC_CODE + '.goatcounter.com/count');
    document.head.appendChild(gc);
  }
  // 頁尾的累計瀏覽數（全站總計）；讀不到時保持隱藏
  document.querySelectorAll('[data-visits]').forEach(function (el) {
    if (!GC_CODE || !window.fetch) return;
    fetch('https://' + GC_CODE + '.goatcounter.com/counter/TOTAL.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.count) return;
        el.querySelector('[data-visits-count]').textContent = String(d.count).replace(/\s/g, ',');
        el.hidden = false;
      })
      .catch(function () { /* 統計服務暫時無法連線時不顯示 */ });
  });

  /* ---------- works ---------- */
  var WORKS = DATA.works || [];
  var CATS = DATA.categories || {};
  var grid = document.querySelector('[data-works]');

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function statusClass(w) { return w.live ? 'status live' : 'status'; }

  /* 可用性標示：可實際使用／線上示範／僅介紹，以及是否附原始碼 */
  var ACCESS = {
    live: { label: STR.live[0], tip: STR.live[1] },
    demo: { label: STR.demo[0], tip: STR.demo[1] },
    none: { label: STR.none[0], tip: STR.none[1] }
  };
  function hasSource(w) { return w.links.some(function (l) { return /github\.com/.test(l.href); }); }
  function badges(w) {
    var a = ACCESS[w.access] || ACCESS.none;
    return '<ul class="avail" aria-label="' + STR.availAria + '">' +
      '<li class="av av-' + esc(w.access || 'none') + '" title="' + esc(a.tip) + '">' + esc(a.label) + '</li>' +
      (hasSource(w) ? '<li class="av av-src" title="' + STR.srcTip + '">' + STR.src + '</li>' : '<li class="av av-nosrc" title="' + STR.nosrcTip + '">' + STR.nosrc + '</li>') +
      '</ul>';
  }
  window.HS_BADGES = { badges: badges, hasSource: hasSource, ACCESS: ACCESS, esc: esc };

  function card(w) {
    return '<li><button type="button" class="work reveal" data-id="' + esc(w.id) + '" aria-haspopup="dialog">' +
      '<div class="thumb"><img src="' + esc(u(w.cover)) + '" alt="" loading="lazy" width="800" height="500"></div>' +
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
    var opts = [['all', STR.all, WORKS.length],
      ['live', STR.live[0], WORKS.filter(function (w) { return w.access === 'live'; }).length],
      ['demo', STR.demo[0], WORKS.filter(function (w) { return w.access === 'demo'; }).length],
      ['source', STR.src, WORKS.filter(hasSource).length]];
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
      '<div class="dlg-cover"><img data-dlg-main src="' + esc(u(w.cover)) + '" alt="' + esc(w.title + STR.shot) + '"></div>' +
      (w.gallery && w.gallery.length > 1 ? '<div class="dlg-gallery" role="group" aria-label="' + STR.more + '">' + w.gallery.map(function (g, i) {
        return '<button type="button" class="dlg-thumb" data-src="' + esc(u(g)) + '" aria-pressed="' + (i === 0) + '" aria-label="' + STR.nth(i + 1) + '"><img src="' + esc(u(g)) + '" alt="" loading="lazy"></button>';
      }).join('') + '</div>' : '') +
      '<div class="dlg-body">' +
      '<h2 id="dlg-title">' + esc(w.title) + '</h2>' +
      '<div class="meta"><span class="' + statusClass(w) + '">' + esc(w.status) + '</span><span>' + esc(CATS[w.category] || '') + '</span><span>' + esc(w.year) + '</span><span>' + STR.role + esc(w.role) + '</span></div>' +
      badges(w) +
      '<p>' + esc(w.summary) + '</p>' +
      '<h3>' + STR.points + '</h3><ul class="points">' + w.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' +
      '<h3>' + STR.stack + '</h3><ul class="tags">' + w.stack.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      (hasNote ? '<div class="dlg-note"><img src="' + u('assets/img/brand/olleh-portrait.webp') + '" alt=""><span>' + esc(w.note) + '</span></div>' : '') +
      (w.links.length ? '<div class="dlg-links">' + w.links.map(function (l, i) {
        return '<a class="btn ' + (i === 0 ? 'btn-primary' : 'btn-ghost') + ' btn-sm" href="' + esc(u(l.href)) + '" target="_blank" rel="noopener">' + esc(l.label) + ' ↗</a>';
      }).join('') + '</div>' : '<div class="dlg-note"><img src="' + u('assets/img/brand/hachiman-peek.webp') + '" alt=""><span>' + STR.privateNote + '</span></div>') +
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
  var ERAS = DATA.eras || {};
  var MILESTONES = DATA.milestones || [];
  function monthLabel(d) { return STR.month(d); }
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
        html += '<li class="tl-item tl-milestone reveal"><span class="tl-dot"><img src="' + u('assets/img/brand/logo-icon.webp') + '" alt=""></span>' +
          '<div class="tl-card"><time>' + monthLabel(it.date) + '</time><h3>' + esc(it.m.title) + '</h3><p>' + esc(it.m.text) + '</p></div></li>';
        return;
      }
      var w = it.w;
      html += '<li class="tl-item reveal ' + (i % 2 ? 'tl-right' : 'tl-left') + '"><span class="tl-dot"></span>' +
        '<button type="button" class="tl-card work-link" data-id="' + esc(w.id) + '" aria-haspopup="dialog">' +
        '<div class="tl-thumb"><img src="' + esc(u(w.cover)) + '" alt="" loading="lazy" width="800" height="500"></div>' +
        '<div class="tl-body"><time>' + monthLabel(w.date) + STR.sep + esc(CATS[w.category] || '') + '</time>' +
        '<h3>' + esc(w.title) + '</h3>' + badges(w) +
        '<p class="tl-growth"><span>' + STR.growth + '</span>' + esc(w.growth || w.summary) + '</p>' +
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
