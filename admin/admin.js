/* HACHIMAN STUDIO 內容後台（純前端，沒有後端）
 *
 * - 讀寫 content/site.json、content/works.json 與 assets/img/works/ 的圖片，透過 GitHub API 直接提交到儲存庫。
 * - 提交後由 .github/workflows/build.yml 執行 tools/build_site.py 重新產生網站。
 * - 權杖只送到 api.github.com；預設存在 sessionStorage（關閉分頁就忘記），勾「記住」才放 localStorage。
 */
(function () {
  'use strict';

  var API = 'https://api.github.com';
  var FILES = { site: 'content/site.json', works: 'content/works.json' };
  var DRAFT_KEY = 'hs-admin-draft';
  var MAX_IMG = 1600;      // 上傳圖片的最大寬度（px）
  var IMG_QUALITY = 0.8;   // WebP 品質

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var state = {
    cfg: null,            // { token, owner, repo, branch } ；本機模式時 token 為空
    data: { site: null, works: null },
    saved: { site: '', works: '' },   // 上次載入／儲存時的 JSON 字串，用來判斷有沒有修改
    sha: { site: null, works: null }, // 載入時的檔案 sha，用來偵測別人同時修改
    images: {},           // 待上傳的圖片 { path: { blob, url } }
    section: 'settings',
    work: null            // 正在編輯的作品 index
  };

  /* ================= 小工具 ================= */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'text') el.textContent = v;
      else if (k === 'class') el.className = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k in el && k !== 'list' && k !== 'type') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    (function add(c) {
      if (c == null || c === false) return;
      if (Array.isArray(c)) c.forEach(add);
      else el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    })(Array.prototype.slice.call(arguments, 2));
    return el;
  }
  function bi(zh, en) { return { zh: zh || '', en: en || '' }; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function setStatus(msg, kind) { var s = $('#status'); s.textContent = msg || ''; s.className = 'status' + (kind ? ' ' + kind : ''); }
  function b64ToUtf8(b64) { var bin = atob(b64.replace(/\s/g, '')); var bytes = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return new TextDecoder().decode(bytes); }
  function bytesToB64(bytes) { var s = ''; for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); }
  function utf8ToB64(str) { return bytesToB64(new TextEncoder().encode(str)); }
  function json(o) { return JSON.stringify(o, null, 2) + '\n'; }
  function kb(n) { return n < 1024 * 1024 ? Math.round(n / 1024) + ' KB' : (n / 1024 / 1024).toFixed(1) + ' MB'; }
  function imgSrc(path) { return state.images[path] ? state.images[path].url : (/^(https?:)?\/\//.test(path) ? path : '../' + path); }

  /* ================= GitHub API ================= */
  function gh(path, opts) {
    opts = opts || {};
    var c = state.cfg;
    return fetch(API + path.replace('{repo}', 'repos/' + encodeURIComponent(c.owner) + '/' + encodeURIComponent(c.repo)), {
      method: opts.method || 'GET',
      headers: { Authorization: 'Bearer ' + c.token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      cache: 'no-store'
    }).then(function (r) {
      if (r.status === 204) return null;
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) { var e = new Error(d.message || ('HTTP ' + r.status)); e.status = r.status; throw e; }
        return d;
      });
    });
  }
  function readFile(path) {
    var c = state.cfg;
    if (!c.token) {
      return fetch('../' + path, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(path + ' 讀取失敗'); return r.text(); })
        .then(function (t) { return { text: t, sha: null }; });
    }
    // 走 Git Data API 讀 blob，不受 contents API 1 MB 的限制
    return gh('/{repo}/contents/' + path + '?ref=' + encodeURIComponent(c.branch)).then(function (d) {
      if (d.content) return { text: b64ToUtf8(d.content), sha: d.sha };
      return gh('/{repo}/git/blobs/' + d.sha).then(function (b) { return { text: b64ToUtf8(b.content), sha: d.sha }; });
    });
  }

  /* ================= 登入 ================= */
  function loadCfg() {
    var raw = null;
    try { raw = sessionStorage.getItem('hs-admin') || localStorage.getItem('hs-admin'); } catch (e) { /* 無法使用儲存空間 */ }
    try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function saveCfg(cfg, remember) {
    try {
      sessionStorage.removeItem('hs-admin'); localStorage.removeItem('hs-admin');
      (remember ? localStorage : sessionStorage).setItem('hs-admin', JSON.stringify(cfg));
    } catch (e) { /* 儲存空間不可用時只在這次頁面中有效 */ }
  }
  function showLogin(err) {
    $('#app').hidden = true; $('#login').hidden = false;
    var e = $('#login-error'); e.hidden = !err; e.textContent = err || '';
    var cfg = loadCfg();
    if (cfg) { $('#owner').value = cfg.owner; $('#repo').value = cfg.repo; $('#branch').value = cfg.branch; }
  }
  $('#login-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var cfg = { token: $('#token').value.trim(), owner: $('#owner').value.trim(), repo: $('#repo').value.trim(), branch: $('#branch').value.trim() || 'main' };
    state.cfg = cfg;
    $('#login-error').hidden = true;
    gh('/{repo}').then(function (r) {
      if (r.permissions && !r.permissions.push) throw new Error('這個權杖沒有寫入權限，請把 Contents 設為 Read and write。');
      saveCfg(cfg, $('#remember').checked);
      start();
    }).catch(function (e) {
      showLogin(e.status === 401 ? '權杖無效或已過期。' : e.status === 404 ? '找不到儲存庫，或權杖沒有這個儲存庫的權限。' : e.message);
    });
  });
  $('#local-mode').addEventListener('click', function () { state.cfg = { token: '', owner: '', repo: '', branch: '' }; start(); });
  $('#btn-logout').addEventListener('click', function () {
    if (dirty() && !confirm('還有沒發布的修改，確定要登出？（修改會保留在這台電腦的草稿）')) return;
    try { sessionStorage.removeItem('hs-admin'); localStorage.removeItem('hs-admin'); } catch (e) { /* ignore */ }
    location.reload();
  });

  function start() {
    $('#login').hidden = true; $('#app').hidden = false;
    $('#btn-download').hidden = !!state.cfg.token;
    $('#btn-save').hidden = !state.cfg.token;
    setStatus('載入中…');
    Promise.all([readFile(FILES.site), readFile(FILES.works)]).then(function (res) {
      state.data.site = JSON.parse(res[0].text); state.sha.site = res[0].sha; state.saved.site = json(state.data.site);
      state.data.works = JSON.parse(res[1].text); state.sha.works = res[1].sha; state.saved.works = json(state.data.works);
      restoreDraft();
      buildNav(); renderSection(); updateDirty();
      setStatus(state.cfg.token ? '已載入 ' + state.cfg.owner + '/' + state.cfg.repo + '@' + state.cfg.branch : '本機模式：可以編輯與下載 JSON，不能發布');
    }).catch(function (e) {
      if (e.status === 401) { showLogin('權杖無效或已過期，請重新登入。'); return; }
      setStatus('載入失敗：' + e.message, 'error');
    });
  }

  /* ================= 草稿與修改狀態 ================= */
  function dirty() {
    return json(state.data.site) !== state.saved.site || json(state.data.works) !== state.saved.works || Object.keys(state.images).length > 0;
  }
  var draftTimer = null;
  function updateDirty() {
    var d = dirty();
    $('#btn-save').disabled = !d; $('#btn-discard').disabled = !d;
    document.title = (d ? '● ' : '') + '內容後台｜HACHIMAN STUDIO';
    clearTimeout(draftTimer);
    draftTimer = setTimeout(function () {
      try {
        if (d) localStorage.setItem(DRAFT_KEY, JSON.stringify({ site: state.data.site, works: state.data.works, base: state.saved, at: Date.now() }));
        else localStorage.removeItem(DRAFT_KEY);
      } catch (e) { /* 草稿只是方便用，存不了就算了 */ }
    }, 400);
  }
  function restoreDraft() {
    var d = null;
    try { d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch (e) { d = null; }
    if (!d || !d.site) return;
    var same = d.base && d.base.site === state.saved.site && d.base.works === state.saved.works;
    var when = new Date(d.at).toLocaleString('zh-TW');
    var msg = '找到 ' + when + ' 還沒發布的草稿。要繼續編輯這份草稿嗎？' +
      (same ? '' : '\n\n⚠ 網站內容在那之後有更新，套用草稿會蓋掉那些更新。') + '\n（上傳的圖片不會保存在草稿裡，需要重新上傳。）';
    if (confirm(msg)) { state.data.site = d.site; state.data.works = d.works; }
    else { try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ } }
  }
  window.addEventListener('beforeunload', function (e) { if (state.data.site && dirty()) { e.preventDefault(); e.returnValue = ''; } });
  $('#btn-discard').addEventListener('click', function () {
    if (!confirm('放棄所有還沒發布的修改？')) return;
    state.data.site = JSON.parse(state.saved.site); state.data.works = JSON.parse(state.saved.works);
    Object.keys(state.images).forEach(function (p) { URL.revokeObjectURL(state.images[p].url); });
    state.images = {};
    renderSection(); updateDirty();
  });
  $('#btn-download').addEventListener('click', function () {
    [['site.json', state.data.site], ['works.json', state.data.works]].forEach(function (f) {
      var a = h('a', { href: URL.createObjectURL(new Blob([json(f[1])], { type: 'application/json' })), download: f[0] });
      document.body.appendChild(a); a.click(); a.remove();
    });
  });

  /* ================= 欄位元件 ================= */
  // 每個欄位都直接修改傳進來的物件 obj[key]，改完呼叫 updateDirty()
  var HTML_HINT = '可用 <strong>粗體</strong>、<em>強調</em>、<br> 換行、<a href="…">連結</a>';

  function field(label, input, hint) {
    return h('div', { class: 'field' }, h('label', { class: 'field-label' }, label), input, hint ? h('p', { class: 'hint', text: hint }) : null);
  }
  function textInput(obj, key, o) {
    o = o || {};
    var el = h(o.multiline ? 'textarea' : 'input', { placeholder: o.placeholder || '', rows: o.multiline ? (o.rows || 3) : null, type: o.type || null, class: o.code ? 'code' : null });
    if (o.code) el.spellcheck = false;
    el.value = obj[key] == null ? '' : obj[key];
    el.addEventListener('input', function () { obj[key] = el.value; if (o.onInput) o.onInput(el.value); updateDirty(); });
    if (o.multiline) autoGrow(el);
    return el;
  }
  function autoGrow(el) {
    var fit = function () { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight + 2, 420) + 'px'; };
    el.addEventListener('input', fit); requestAnimationFrame(fit);
  }
  function biInput(obj, key, o) {
    o = o || {};
    if (!obj[key] || typeof obj[key] !== 'object') obj[key] = bi(obj[key]);
    var v = obj[key];
    var en;
    var mark = function () { en.classList.toggle('missing', !v.en && !!v.zh); };
    var zh = textInput(v, 'zh', { multiline: o.multiline, rows: o.rows, onInput: mark });
    en = textInput(v, 'en', { multiline: o.multiline, rows: o.rows, placeholder: 'English（空白時英文版顯示中文）', onInput: mark });
    mark();
    return h('div', { class: 'bi' }, h('div', null, h('span', { class: 'lang', text: '中文' }), zh), h('div', null, h('span', { class: 'lang', text: 'EN' }), en));
  }
  function select(obj, key, options, onChange) {
    var el = h('select', null, options.map(function (op) { return h('option', { value: op[0], text: op[1] }); }));
    el.value = obj[key];
    if (el.value !== obj[key] && obj[key]) { el.appendChild(h('option', { value: obj[key], text: obj[key] + '（未定義）' })); el.value = obj[key]; }
    el.addEventListener('change', function () { obj[key] = el.value; if (onChange) onChange(el.value); updateDirty(); });
    return el;
  }
  function checkbox(obj, key, label, onChange) {
    var el = h('input', { type: 'checkbox' }); el.checked = !!obj[key];
    el.addEventListener('change', function () { obj[key] = el.checked; if (onChange) onChange(el.checked); updateDirty(); });
    return h('label', { class: 'check' }, el, ' ' + label);
  }
  function stringList(arr, o) {
    // 簡單的字串清單（例如研究標籤）：一行一個
    o = o || {};
    var el = h('textarea', { rows: 3, placeholder: o.placeholder || '一行一個' });
    el.value = arr.join('\n');
    el.addEventListener('input', function () {
      var lines = el.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      arr.length = 0; Array.prototype.push.apply(arr, lines); updateDirty();
    });
    autoGrow(el);
    return el;
  }
  function biLines(obj, key, o) {
    // { zh: [..], en: [..] }：兩欄，一行一項
    o = o || {};
    if (!obj[key]) obj[key] = { zh: [], en: [] };
    var v = obj[key];
    var col = function (lang, ph) {
      var el = h('textarea', { rows: 4, placeholder: ph }); el.value = (v[lang] || []).join('\n');
      el.addEventListener('input', function () { v[lang] = el.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean); updateDirty(); });
      autoGrow(el);
      return h('div', null, h('span', { class: 'lang', text: lang === 'zh' ? '中文' : 'EN' }), el);
    };
    return h('div', { class: 'bi' }, col('zh', '一行一項'), col('en', o.enPlaceholder || 'English, one per line（空白時顯示中文）'));
  }

  // 可新增、刪除、排序的清單；renderItem(item, index) 回傳內容
  function list(arr, o) {
    var wrap = h('div', { class: 'list' });
    function draw() {
      wrap.innerHTML = '';
      arr.forEach(function (item, i) {
        var tools = h('div', { class: 'item-tools' },
          h('span', { class: 'item-title', text: o.title ? o.title(item, i) : '#' + (i + 1) }),
          h('button', { type: 'button', class: 'icon-btn', title: '上移', 'aria-label': '上移', disabled: i === 0, onclick: function () { move(i, -1); } }, '↑'),
          h('button', { type: 'button', class: 'icon-btn', title: '下移', 'aria-label': '下移', disabled: i === arr.length - 1, onclick: function () { move(i, 1); } }, '↓'),
          h('button', { type: 'button', class: 'icon-btn danger', title: '刪除', 'aria-label': '刪除', onclick: function () {
            if (o.confirmDelete === false || confirm('刪除「' + (o.title ? o.title(item, i) : '#' + (i + 1)) + '」？')) { arr.splice(i, 1); updateDirty(); draw(); }
          } }, '✕'));
        wrap.appendChild(h('div', { class: 'item' }, tools, o.render(item, i)));
      });
      wrap.appendChild(h('button', { type: 'button', class: 'btn add', onclick: function () { arr.push(o.make()); updateDirty(); draw(); } }, '＋ ' + (o.addLabel || '新增一項')));
    }
    function move(i, d) { var x = arr.splice(i, 1)[0]; arr.splice(i + d, 0, x); updateDirty(); draw(); }
    draw();
    return wrap;
  }
  function group(title, children, note) {
    return h('section', { class: 'group' }, h('h2', { text: title }), note ? h('p', { class: 'hint', text: note }) : null, children);
  }

  /* ---------- 圖片：在瀏覽器裡縮小並轉成 WebP 再上傳 ---------- */
  function toWebp(file) {
    return createImageBitmap(file).then(function (bmp) {
      var scale = Math.min(1, MAX_IMG / bmp.width);
      var c = document.createElement('canvas');
      c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      return new Promise(function (res, rej) { c.toBlob(function (b) { b ? res(b) : rej(new Error('圖片轉換失敗')); }, 'image/webp', IMG_QUALITY); });
    });
  }
  function slug(s) { return String(s || 'image').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'image'; }
  function pickImage(prefix, cb) {
    var inp = h('input', { type: 'file', accept: 'image/*' });
    inp.addEventListener('change', function () {
      var f = inp.files[0]; if (!f) return;
      setStatus('處理圖片中…');
      toWebp(f).then(function (blob) {
        var path = 'assets/img/works/' + slug(prefix) + '-' + Date.now().toString(36) + '.webp';
        state.images[path] = { blob: blob, url: URL.createObjectURL(blob) };
        setStatus('圖片已轉成 WebP：' + kb(f.size) + ' → ' + kb(blob.size) + '（發布時上傳）', 'ok');
        cb(path);
      }).catch(function (e) { setStatus('圖片處理失敗：' + e.message, 'error'); });
    });
    inp.click();
  }
  function forgetImage(path) {
    if (state.images[path]) { URL.revokeObjectURL(state.images[path].url); delete state.images[path]; }
  }
  function imageField(obj, key, prefix) {
    var wrap = h('div', { class: 'image-field' });
    function draw() {
      wrap.innerHTML = '';
      var path = obj[key] || '';
      var pathInput = textInput(obj, key, { placeholder: 'assets/img/works/…', code: true, onInput: function () { img.src = imgSrc(obj[key]); } });
      var img = h('img', { src: path ? imgSrc(path) : '', alt: '', loading: 'lazy' });
      wrap.append(h('div', { class: 'thumb' }, img), h('div', { class: 'image-meta' }, pathInput,
        h('button', { type: 'button', class: 'btn', onclick: function () { pickImage(prefix(), function (p) { forgetImage(obj[key]); obj[key] = p; updateDirty(); draw(); }); } }, '上傳新圖片')));
    }
    draw();
    return wrap;
  }
  function gallery(arr, prefix) {
    var wrap = h('div', { class: 'gallery' });
    function draw() {
      wrap.innerHTML = '';
      arr.forEach(function (p, i) {
        wrap.appendChild(h('figure', null, h('img', { src: imgSrc(p), alt: '', loading: 'lazy' }),
          h('figcaption', null,
            h('button', { type: 'button', class: 'icon-btn', 'aria-label': '往前', disabled: i === 0, onclick: function () { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); updateDirty(); draw(); } }, '←'),
            h('button', { type: 'button', class: 'icon-btn', 'aria-label': '往後', disabled: i === arr.length - 1, onclick: function () { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); updateDirty(); draw(); } }, '→'),
            h('button', { type: 'button', class: 'icon-btn danger', 'aria-label': '移除', onclick: function () { forgetImage(arr[i]); arr.splice(i, 1); updateDirty(); draw(); } }, '✕'))));
      });
      wrap.appendChild(h('button', { type: 'button', class: 'btn add', onclick: function () { pickImage(prefix(), function (p) { arr.push(p); updateDirty(); draw(); }); } }, '＋ 加一張畫面'));
    }
    draw();
    return wrap;
  }

  /* ================= 各區塊 ================= */
  var ICONS = [['shield', '盾牌'], ['star', '星星'], ['book', '書本'], ['calendar', '行事曆'], ['ai', 'AI'], ['document', '文件'], ['cap', '學士帽']];
  function ttl(item, k) { var v = item[k]; return (v && (v.zh || v.en)) || '（未命名）'; }

  var SECTIONS = [
    { id: 'settings', label: '網站設定', render: function (s) {
      return [
        group('聯絡與統計', [
          field('公開 Email（留空就隱藏「寄信諮詢」按鈕）', textInput(s.settings, 'email', { type: 'email', code: true })),
          field('GitHub 網址', textInput(s.settings, 'github', { code: true })),
          field('GoatCounter 代碼（留空不統計）', textInput(s.settings, 'goatcounter', { code: true }))
        ]),
        group('搜尋引擎與分享預覽', [
          field('首頁標題', biInput(s.pages.index, 'title')),
          field('首頁描述', biInput(s.pages.index, 'description', { multiline: true })),
          field('作品集頁標題', biInput(s.pages.works, 'title')),
          field('作品集頁描述', biInput(s.pages.works, 'description', { multiline: true })),
          field('成長時間線標題', biInput(s.pages.growth, 'title')),
          field('成長時間線描述', biInput(s.pages.growth, 'description', { multiline: true })),
          field('分享到社群時的描述', biInput(s.pages, 'og_description', { multiline: true }))
        ], '顯示在瀏覽器分頁、Google 搜尋結果與 LINE／Facebook 的分享預覽。')
      ];
    } },
    { id: 'hero', label: '首頁・主視覺', render: function (s) {
      return [group('主視覺', [
        field('大標題', biInput(s.hero, 'title', { multiline: true, rows: 2 }), HTML_HINT),
        field('介紹', biInput(s.hero, 'lead', { multiline: true }), HTML_HINT),
        field('圖片旁的對話框標題', biInput(s.hero, 'badge_title')),
        field('對話框內文', biInput(s.hero, 'badge_text')),
        field('數字亮點', list(s.hero.stats, { title: function (x) { return x.num + ' ' + (x.label.zh || ''); }, addLabel: '新增數字',
          make: function () { return { num: '', label: bi() }; },
          render: function (x) { return [field('數字', textInput(x, 'num')), field('說明', biInput(x, 'label'))]; } }))
      ])];
    } },
    { id: 'about', label: '首頁・關於我', render: function (s) {
      var a = s.about;
      return [
        group('自我介紹', [
          field('標題', biInput(a, 'heading')),
          field('第一段', biInput(a, 'intro', { multiline: true }), HTML_HINT),
          field('第二段（背景）', biInput(a, 'background', { multiline: true }), HTML_HINT),
          field('三個特點', list(a.values, { title: function (x) { return ttl(x, 'title'); }, addLabel: '新增特點',
            make: function () { return { icon: 'star', title: bi(), text: bi() }; },
            render: function (x) { return [field('圖示', select(x, 'icon', ICONS)), field('標題', biInput(x, 'title')), field('內文', biInput(x, 'text', { multiline: true }), HTML_HINT)]; } }))
        ]),
        group('學歷', [field('卡片標題', biInput(a, 'education_title')), list(a.education, { title: function (x) { return ttl(x, 'name'); }, addLabel: '新增學歷',
          make: function () { return { name: bi(), note: bi() }; },
          render: function (x) { return [field('學校與科系', biInput(x, 'name')), field('說明', biInput(x, 'note'))]; } })]),
        group('經歷', [field('卡片標題', biInput(a, 'experience_title')), list(a.experience, { title: function (x) { return ttl(x, 'name'); }, addLabel: '新增經歷',
          make: function () { return { name: bi(), note: bi() }; },
          render: function (x) { return [field('產業・部門', biInput(x, 'name')), field('期間與內容', biInput(x, 'note', { multiline: true }))]; } })],
          '只寫產業與部門，不寫公司名稱與職稱。'),
        group('技能', [field('卡片標題', biInput(a, 'skills_title')), list(a.skills, { title: function (x) { return ttl(x, 'label'); }, addLabel: '新增技能類別',
          make: function () { return { label: bi(), text: bi() }; },
          render: function (x) { return [field('類別', biInput(x, 'label')), field('內容', biInput(x, 'text', { multiline: true }))]; } })]),
        group('研究領域', [
          field('卡片標題', biInput(a, 'research_title')),
          field('段落', list(a.research, { title: function (x, i) { return '第 ' + (i + 1) + ' 段'; }, addLabel: '新增段落',
            make: function () { return bi(); }, render: function (x, i) { return biInput(a.research, i, { multiline: true }); } }), HTML_HINT),
          field('論文標籤（一行一個）', stringList(a.research_tags))
        ])
      ];
    } },
    { id: 'cats', label: '首頁・兩隻貓', render: function (s) {
      var c = s.cats;
      return [group('靈感來源', [
        field('標題', biInput(c, 'heading')), field('說明', biInput(c, 'intro', { multiline: true }), HTML_HINT),
        c.cards.map(function (x, i) {
          return h('div', { class: 'item' }, h('div', { class: 'item-tools' }, h('span', { class: 'item-title', text: i ? '歐雷' : '八萬' })),
            field('個性標籤', biInput(x, 'tag')), field('名字', biInput(x, 'name')), field('介紹', biInput(x, 'text', { multiline: true }), HTML_HINT),
            field('圖片替代文字', biInput(x, 'alt')));
        })
      ])];
    } },
    { id: 'consult', label: '首頁・概念諮詢', render: function (s) {
      var c = s.consult;
      return [
        group('概念諮詢', [field('標題', biInput(c, 'heading')), field('說明', biInput(c, 'intro', { multiline: true }), HTML_HINT)]),
        group('諮詢範圍', list(c.services, { title: function (x) { return ttl(x, 'title'); }, addLabel: '新增範圍',
          make: function () { return { icon: 'star', title: bi(), text: bi(), tags: [] }; },
          render: function (x) {
            return [field('圖示', select(x, 'icon', ICONS)), field('標題', biInput(x, 'title')), field('說明', biInput(x, 'text', { multiline: true }), HTML_HINT),
              field('標籤', list(x.tags, { title: function (t) { return t.zh || t.en || '標籤'; }, addLabel: '新增標籤', confirmDelete: false, make: function () { return bi(); },
                render: function (t, i) { return biInput(x.tags, i); } }))];
          } })),
        group('注意事項', list(c.scope, { title: function (x) { return ttl(x, 'title'); }, addLabel: '新增一條',
          make: function () { return { title: bi(), text: bi() }; },
          render: function (x) { return [field('標題', biInput(x, 'title')), field('內文', biInput(x, 'text', { multiline: true }), HTML_HINT)]; } }))
      ];
    } },
    { id: 'featured', label: '首頁・精選作品', render: function (s) {
      return [group('精選作品', [field('標題', biInput(s.featured, 'heading')), field('說明', biInput(s.featured, 'intro', { multiline: true }), HTML_HINT)],
        '要哪些作品出現在首頁，請到「作品」裡勾選「放在首頁精選」。')];
    } },
    { id: 'process', label: '首頁・諮詢流程', render: function (s) {
      var p = s.process;
      return [group('諮詢怎麼進行', [field('標題', biInput(p, 'heading')), field('說明', biInput(p, 'intro'), HTML_HINT),
        field('步驟（STEP 編號會自動產生）', list(p.steps, { title: function (x, i) { return 'STEP ' + (i + 1) + '・' + ttl(x, 'title'); }, addLabel: '新增步驟',
          make: function () { return { title: bi(), text: bi() }; },
          render: function (x) { return [field('標題', biInput(x, 'title')), field('內文', biInput(x, 'text', { multiline: true }), HTML_HINT)]; } }))])];
    } },
    { id: 'journey', label: '首頁・我的歷程', render: function (s) {
      var j = s.journey;
      return [group('我的歷程（首頁摘要）', [field('標題', biInput(j, 'heading')),
        list(j.items, { title: function (x) { return x.year + '・' + ttl(x, 'title'); }, addLabel: '新增一段',
          make: function () { return { year: String(new Date().getFullYear()), title: bi(), text: bi() }; },
          render: function (x) { return [field('年份（也可以寫 Now）', textInput(x, 'year')), field('標題', biInput(x, 'title')), field('內文', biInput(x, 'text', { multiline: true }), HTML_HINT)]; } })],
        '完整的時間線在「成長時間線」，會依作品日期自動排列。')];
    } },
    { id: 'contact', label: '首頁・聯絡與 FAQ', render: function (s) {
      return [
        group('聯絡', [field('標題', biInput(s.contact, 'heading')), field('內文', biInput(s.contact, 'text', { multiline: true }), HTML_HINT)], 'Email 與 GitHub 在「網站設定」。'),
        group('常見問題', list(s.faq, { title: function (x) { return ttl(x, 'q'); }, addLabel: '新增問題',
          make: function () { return { q: bi(), a: bi() }; },
          render: function (x) { return [field('問題', biInput(x, 'q')), field('回答', biInput(x, 'a', { multiline: true }), HTML_HINT)]; } }))
      ];
    } },
    { id: 'works', label: '作品', render: renderWorks },
    { id: 'works-page', label: '作品集頁', render: function (s) {
      var w = s.works_page;
      return [
        group('作品集頁', [field('標題', biInput(w, 'heading')), field('說明', biInput(w, 'intro', { multiline: true }), HTML_HINT), field('頁尾附註', biInput(w, 'footnote', { multiline: true }), HTML_HINT)]),
        group('作品類別', list(s.categories, { title: function (x) { return ttl(x, 'label') + '（' + x.key + '）'; }, addLabel: '新增類別',
          make: function () { return { key: 'new-' + Date.now().toString(36), label: bi() }; },
          render: function (x) { return [field('代號（英文小寫，作品用它分類）', textInput(x, 'key', { code: true })), field('名稱', biInput(x, 'label'))]; } }),
          '順序就是篩選按鈕的順序。'),
        group('作品狀態', list(s.statuses, { title: function (x) { return ttl(x, 'label'); }, addLabel: '新增狀態',
          make: function () { return { key: '新狀態', label: bi(), live: false }; },
          render: function (x) { return [field('代號（作品用它選狀態，通常和中文名稱相同）', textInput(x, 'key')), field('名稱', biInput(x, 'label')), checkbox(x, 'live', '用綠色標示（正式營運中）')]; } }))
      ];
    } },
    { id: 'growth', label: '成長時間線', render: function (s) {
      var g = s.growth_page;
      return [
        group('頁面文字', [field('標題', biInput(g, 'heading')), field('說明', biInput(g, 'intro', { multiline: true }), HTML_HINT), field('最底下的結尾句', biInput(g, 'end_text'))]),
        group('年度標題', list(g.eras, { title: function (x) { return x.year + '・' + ttl(x, 'title'); }, addLabel: '新增年度',
          make: function () { return { year: String(new Date().getFullYear()), title: bi(), text: bi() }; },
          render: function (x) { return [field('年份', textInput(x, 'year')), field('標題', biInput(x, 'title')), field('說明', biInput(x, 'text', { multiline: true }))]; } }),
          '時間線上每一年開頭的標題；作品依日期自動排進對應的年份。'),
        group('里程碑', list(g.milestones, { title: function (x) { return x.date + '・' + ttl(x, 'title'); }, addLabel: '新增里程碑',
          make: function () { return { date: new Date().toISOString().slice(0, 7), title: bi(), text: bi() }; },
          render: function (x) { return [field('年月', textInput(x, 'date', { type: 'month' })), field('標題', biInput(x, 'title')), field('說明', biInput(x, 'text', { multiline: true }))]; } }),
          '不是作品、但想放進時間線的事，例如工作室成立。')
      ];
    } }
  ];

  /* ---------- 作品 ---------- */
  var ACCESS = [['live', '可實際使用（公開上線）'], ['demo', '線上示範（原本介面＋虛構資料）'], ['none', '僅介紹']];
  function newWork() {
    return { id: 'new-work-' + Date.now().toString(36), title: bi(), date: new Date().toISOString().slice(0, 7), year: String(new Date().getFullYear()),
      category: (state.data.site.categories[0] || {}).key || 'product', status: (state.data.site.statuses[0] || {}).key || '', access: 'none',
      featured: false, hidden: true, cover: '', gallery: [], summary: bi(), role: bi(), growth: bi(), note: bi(),
      highlights: { zh: [], en: [] }, stack: { zh: [], en: [] }, links: [] };
  }
  function renderWorks() {
    var works = state.data.works;
    if (state.work != null && works[state.work]) return renderWork(works[state.work], state.work);
    state.work = null;
    var grid = h('div', { class: 'work-grid' });
    function draw() {
      grid.innerHTML = '';
      works.forEach(function (w, i) {
        grid.appendChild(h('div', { class: 'work-card' + (w.hidden ? ' is-hidden' : '') },
          h('button', { type: 'button', class: 'work-open', onclick: function () { state.work = i; renderSection(); window.scrollTo(0, 0); } },
            h('img', { src: w.cover ? imgSrc(w.cover) : '', alt: '', loading: 'lazy' }),
            h('span', { class: 'work-name', text: w.title.zh || w.id }),
            h('span', { class: 'work-meta', text: w.date + (w.featured ? '・首頁精選' : '') + (w.hidden ? '・已隱藏' : '') })),
          h('div', { class: 'work-order' },
            h('button', { type: 'button', class: 'icon-btn', 'aria-label': '往前', disabled: i === 0, onclick: function () { works.splice(i - 1, 0, works.splice(i, 1)[0]); updateDirty(); draw(); } }, '←'),
            h('button', { type: 'button', class: 'icon-btn', 'aria-label': '往後', disabled: i === works.length - 1, onclick: function () { works.splice(i + 1, 0, works.splice(i, 1)[0]); updateDirty(); draw(); } }, '→'))));
      });
    }
    draw();
    return [group('作品（' + works.length + '）', [
      h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn primary', onclick: function () { works.unshift(newWork()); state.work = 0; updateDirty(); renderSection(); } }, '＋ 新增作品')),
      grid
    ], '這裡的順序就是作品集頁的排列順序；成長時間線依日期排列。新作品預設「隱藏」，寫好再取消勾選。')];
  }
  function renderWork(w, idx) {
    var s = state.data.site;
    var head = h('h2', { text: w.title.zh || '新作品' });
    var prefix = function () { return w.id; };
    if (!w.links) w.links = [];
    if (!w.gallery) w.gallery = [];
    return [
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn', onclick: function () { state.work = null; renderSection(); } }, '← 所有作品'),
        h('a', { class: 'btn link', href: '../works.html#work-' + encodeURIComponent(w.id), target: '_blank', rel: 'noopener' }, '在網站上看（已發布的版本）'),
        h('button', { type: 'button', class: 'btn danger', onclick: function () {
          if (!confirm('刪除作品「' + (w.title.zh || w.id) + '」？（圖片檔不會刪除）')) return;
          state.data.works.splice(idx, 1); state.work = null; updateDirty(); renderSection();
        } }, '刪除作品')),
      h('section', { class: 'group' }, head,
        h('div', { class: 'grid2' },
          field('代號（英文小寫與 -，網址會用到）', textInput(w, 'id', { code: true })),
          field('顯示', h('div', { class: 'checks' }, checkbox(w, 'featured', '放在首頁精選'), checkbox(w, 'hidden', '隱藏（先不公開）')))),
        field('名稱', (function () { var el = biInput(w, 'title'); el.addEventListener('input', function () { head.textContent = w.title.zh || '新作品'; }); return el; })()),
        h('div', { class: 'grid3' },
          field('開始年月（時間線排序用）', textInput(w, 'date', { type: 'month' })),
          field('顯示的年份', textInput(w, 'year', { placeholder: '2025 – 2026' })),
          field('類別', select(w, 'category', s.categories.map(function (c) { return [c.key, c.label.zh]; })))),
        h('div', { class: 'grid2' },
          field('狀態', select(w, 'status', s.statuses.map(function (c) { return [c.key, c.label.zh]; }))),
          field('可用性', select(w, 'access', ACCESS))),
        field('一句話介紹', biInput(w, 'summary', { multiline: true })),
        field('我的角色', biInput(w, 'role')),
        field('成長時間線上的一句話（學到什麼）', biInput(w, 'growth', { multiline: true })),
        field('重點（一行一項）', biLines(w, 'highlights')),
        field('技術（一行一項）', biLines(w, 'stack', { enPlaceholder: '英文名稱不同時才填，空白就用中文欄' })),
        field('附註（選填，顯示在詳細視窗底部）', biInput(w, 'note', { multiline: true }))),
      group('圖片', [
        field('封面', imageField(w, 'cover', prefix), '上傳的圖片會自動縮到 ' + MAX_IMG + 'px 寬並轉成 WebP。'),
        field('詳細視窗的多張畫面（兩張以上才會顯示切換縮圖）', gallery(w.gallery, prefix))
      ]),
      group('連結', list(w.links, { title: function (x) { return x.label.zh || x.href || '連結'; }, addLabel: '新增連結',
        make: function () { return { label: bi('線上示範', 'Demo'), href: '' }; },
        render: function (x) { return [field('按鈕文字', biInput(x, 'label')), field('網址（站內示範寫 demos/名稱/）', textInput(x, 'href', { code: true }))]; } }),
        '連到 github.com 的連結會自動標示「附原始碼」。第一個連結是主要按鈕。⚠ 正式營運中的系統不要放正式站網址。')
    ];
  }

  /* ================= 版面 ================= */
  function buildNav() {
    var nav = $('#nav'), sel = $('#nav-select');
    nav.innerHTML = ''; sel.innerHTML = '';
    SECTIONS.forEach(function (sec) {
      nav.appendChild(h('button', { type: 'button', 'data-id': sec.id, class: sec.id === state.section ? 'active' : '', onclick: function () { go(sec.id); } }, sec.label));
      sel.appendChild(h('option', { value: sec.id, text: sec.label }));
    });
    sel.value = state.section;
    sel.onchange = function () { go(sel.value); };
  }
  function go(id) {
    state.section = id; state.work = null;
    document.querySelectorAll('#nav button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-id') === id); });
    $('#nav-select').value = id;
    renderSection(); window.scrollTo(0, 0);
  }
  function renderSection() {
    var sec = SECTIONS.filter(function (x) { return x.id === state.section; })[0] || SECTIONS[0];
    var ed = $('#editor');
    ed.innerHTML = '';
    var nodes = sec.render(state.data.site);
    (Array.isArray(nodes) ? nodes : [nodes]).forEach(function (n) { ed.appendChild(n); });
  }

  /* ================= 檢查與發布 ================= */
  function validate() {
    var errs = [], warns = [];
    var s = state.data.site, works = state.data.works;
    var ids = {};
    var cats = s.categories.map(function (c) { return c.key; });
    var sts = s.statuses.map(function (c) { return c.key; });
    works.forEach(function (w) {
      var name = '作品「' + (w.title.zh || w.id) + '」';
      if (!/^[a-z0-9][a-z0-9-]*$/.test(w.id)) errs.push(name + '的代號只能用英文小寫、數字和 -');
      if (ids[w.id]) errs.push('作品代號重複：' + w.id);
      ids[w.id] = 1;
      if (!/^\d{4}-\d{2}$/.test(w.date)) errs.push(name + '的開始年月格式不對');
      if (!w.title.zh) errs.push(name + '沒有中文名稱');
      if (cats.indexOf(w.category) < 0) errs.push(name + '的類別不存在');
      if (sts.indexOf(w.status) < 0) errs.push(name + '的狀態不存在');
      if (!w.cover && !w.hidden) warns.push(name + '沒有封面圖');
    });
    s.growth_page.milestones.forEach(function (m) { if (!/^\d{4}-\d{2}$/.test(m.date)) errs.push('里程碑「' + m.title.zh + '」的年月格式不對'); });
    // 沒填英文的欄位
    var missing = 0;
    (function walk(v) {
      if (v && typeof v === 'object' && !Array.isArray(v) && 'zh' in v && 'en' in v) {
        if (typeof v.zh === 'string' && v.zh && !v.en) missing++;
        return;
      }
      if (v && typeof v === 'object') Object.keys(v).forEach(function (k) { if (k !== 'stack') walk(v[k]); });
    })([s, works.filter(function (w) { return !w.hidden; })]);
    works.forEach(function (w) { if (!w.hidden && w.highlights.zh.length && !w.highlights.en.length) missing++; });
    if (missing) warns.push(missing + ' 個欄位沒有英文，英文版會先顯示中文');
    return { errs: errs, warns: warns };
  }
  function changedSections() {
    var before = JSON.parse(state.saved.site), now = state.data.site, out = [];
    var map = { settings: ['settings', 'pages'], hero: ['hero'], about: ['about'], cats: ['cats'], consult: ['consult'], featured: ['featured'], process: ['process'],
      journey: ['journey'], contact: ['contact', 'faq'], 'works-page': ['works_page', 'categories', 'statuses'], growth: ['growth_page'] };
    SECTIONS.forEach(function (sec) {
      var keys = map[sec.id];
      if (keys && keys.some(function (k) { return JSON.stringify(before[k]) !== JSON.stringify(now[k]); })) out.push(sec.label);
    });
    if (json(state.data.works) !== state.saved.works) out.push('作品');
    return out;
  }
  $('#btn-save').addEventListener('click', function () {
    var v = validate();
    if (v.errs.length) { alert('還不能發布：\n\n• ' + v.errs.join('\n• ')); return; }
    var changed = changedSections();
    var imgs = Object.keys(state.images);
    var sum = $('#save-summary'); sum.innerHTML = '';
    sum.appendChild(h('p', { text: '修改的區塊：' + (changed.join('、') || '（只有圖片）') }));
    if (imgs.length) sum.appendChild(h('p', { text: '新圖片 ' + imgs.length + ' 張，共 ' + kb(imgs.reduce(function (n, p) { return n + state.images[p].blob.size; }, 0)) }));
    if (v.warns.length) sum.appendChild(h('ul', { class: 'warn' }, v.warns.map(function (w) { return h('li', { text: w }); })));
    $('#commit-msg').value = '後台更新：' + (changed.join('、') || '圖片');
    var dlg = $('#save-dialog');
    dlg.returnValue = '';
    dlg.showModal();
    dlg.addEventListener('close', function onClose() {
      dlg.removeEventListener('close', onClose);
      if (dlg.returnValue === 'ok') publish($('#commit-msg').value.trim() || '後台更新');
    });
  });

  function publish(message) {
    var c = state.cfg, files = [];
    var siteText = json(state.data.site), worksText = json(state.data.works);
    if (siteText !== state.saved.site) files.push({ path: FILES.site, text: siteText });
    if (worksText !== state.saved.works) files.push({ path: FILES.works, text: worksText });
    var imgs = Object.keys(state.images);
    $('#btn-save').disabled = true;
    setStatus('發布中…');
    var head, baseTree;
    gh('/{repo}/git/ref/heads/' + encodeURIComponent(c.branch)).then(function (ref) {
      head = ref.object.sha;
      return gh('/{repo}/git/commits/' + head);
    }).then(function (commit) {
      baseTree = commit.tree.sha;
      // 檢查別人（或另一個分頁）是不是在載入後也改了內容
      return Promise.all(files.map(function (f) {
        var key = f.path === FILES.site ? 'site' : 'works';
        return gh('/{repo}/contents/' + f.path + '?ref=' + head).then(function (d) { return d.sha === state.sha[key] ? null : f.path; }, function (e) { if (e.status === 404) return null; throw e; });
      }));
    }).then(function (conflicts) {
      conflicts = conflicts.filter(Boolean);
      if (conflicts.length && !confirm('在你載入之後，' + conflicts.join('、') + ' 已經被更新過（可能是另一個分頁或電腦）。\n\n繼續發布會用你的版本蓋掉那些更新。要繼續嗎？')) {
        throw new Error('已取消發布');
      }
      var blobs = files.map(function (f) { return gh('/{repo}/git/blobs', { method: 'POST', body: { content: utf8ToB64(f.text), encoding: 'base64' } }).then(function (b) { return { path: f.path, sha: b.sha }; }); })
        .concat(imgs.map(function (p) {
          return state.images[p].blob.arrayBuffer().then(function (buf) {
            return gh('/{repo}/git/blobs', { method: 'POST', body: { content: bytesToB64(new Uint8Array(buf)), encoding: 'base64' } });
          }).then(function (b) { return { path: p, sha: b.sha }; });
        }));
      return Promise.all(blobs);
    }).then(function (blobs) {
      return gh('/{repo}/git/trees', { method: 'POST', body: { base_tree: baseTree, tree: blobs.map(function (b) { return { path: b.path, mode: '100644', type: 'blob', sha: b.sha }; }) } });
    }).then(function (tree) {
      return gh('/{repo}/git/commits', { method: 'POST', body: { message: message, tree: tree.sha, parents: [head] } });
    }).then(function (commit) {
      return gh('/{repo}/git/refs/heads/' + encodeURIComponent(c.branch), { method: 'PATCH', body: { sha: commit.sha } }).then(function () { return commit; });
    }).then(function (commit) {
      state.saved.site = siteText; state.saved.works = worksText;
      return Promise.all(files.map(function (f) {
        var key = f.path === FILES.site ? 'site' : 'works';
        return gh('/{repo}/contents/' + f.path + '?ref=' + commit.sha).then(function (d) { state.sha[key] = d.sha; });
      })).then(function () {
        imgs.forEach(function (p) { delete state.images[p]; }); // 圖片已在儲存庫，預覽改用網站上的檔案（上線前可能暫時看不到）
        updateDirty();
        renderSection();
        watchBuild(commit.sha);
      });
    }).catch(function (e) {
      setStatus('發布失敗：' + e.message, 'error');
      $('#btn-save').disabled = !dirty();
      if (e.status === 401) alert('權杖無效或已過期，請登出後重新登入。修改仍保留在這台電腦的草稿。');
      else if (e.status === 403 || e.status === 404) alert('沒有寫入權限：請確認權杖的 Contents 是 Read and write。');
      else if (e.status === 409 || e.status === 422) alert('發布時剛好有其他更新，請再按一次「儲存並發布」。');
    });
  }

  // 追蹤 GitHub Actions 的建置進度（權杖沒有 Actions 讀取權限時，只顯示連結）
  function watchBuild(sha) {
    var c = state.cfg, tries = 0;
    var link = 'https://github.com/' + c.owner + '/' + c.repo + '/actions';
    setStatus('已發布，網站重新產生中（約 1–2 分鐘）…', 'ok');
    (function poll() {
      tries++;
      gh('/{repo}/actions/runs?head_sha=' + sha + '&per_page=5').then(function (d) {
        var run = (d.workflow_runs || []).filter(function (r) { return /build/i.test(r.name || r.path || ''); })[0] || (d.workflow_runs || [])[0];
        if (run && run.status === 'completed') {
          if (run.conclusion === 'success') setStatus('網站已更新 ✓（瀏覽器若還是舊的，重新整理一次）', 'ok');
          else setStatus('網站建置失敗，請到 GitHub Actions 看原因：' + link, 'error');
          return;
        }
        if (tries < 60) setTimeout(poll, 5000);
      }).catch(function (e) {
        if (e.status === 403) setStatus('已發布，約 1–2 分鐘後上線（進度：' + link + '）', 'ok');
        else if (tries < 60) setTimeout(poll, 8000);
      });
    })();
  }

  /* ================= 開始 ================= */
  var cfg0 = loadCfg();
  if (cfg0 && cfg0.token) { state.cfg = cfg0; start(); } else showLogin();
})();
