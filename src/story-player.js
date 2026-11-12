// 劇場式教學動畫播放器：老師 ＋ 新人，自己從頭演到尾，不用按「下一步」，沒有聲音（對話用氣泡）。
// 劇本是一串「動作（beat）」，播放器依序執行。可以點一下暫停、點章節跳轉、調速度、重播。
//
// 動作種類（每個物件只寫一種主要動作，可搭配 mood / fx）：
//   { chapter: '章節名' }                         章節開始（進度條分段、可跳轉）
//   { card: ['大標', '副標', '🎨'], ms: 2200 }    全螢幕標題卡
//   { say: 'teacher'|'rookie', text, mood, fx }   說話（氣泡逐字出現；**粗體**、`程式`）
//   { mood: { teacher: 'happy', rookie: 'worried' } }  只換表情
//   { code: { file, text, slow, bulk } }         新人在編輯器裡打字（只改中間不一樣的地方，像真人改字；slow 用於小地方的修改；bulk 用於大量重複的內容，快速帶過）。每打完一行會停一下讓人看
//   { term: { cmd, out, err, clear } }           終端機：打指令、輸出結果（err 是紅字的錯誤輸出）；term: null 回到程式碼
//   { err: { line, match, text } | null }       在第 line 行的 match 上畫紅色波浪線，並顯示 TypeScript 的錯誤訊息
//   { vp: 'desktop' | 'mobile' }                 預覽用桌面寬度或手機寬度
//   { file: 'src/App.tsx' }                      切換顯示哪個檔案
//   { hl: [起, 迄] | null }                      老師用手指指出第幾行
//   { view: true | { mode } }                    把目前所有檔案丟進預覽（真的執行）
//   { float: '<html>' | null }                   浮動卡片（設計稿色票、整理清單）
//   { fx: '💡', on: 'teacher'|'rookie'|'laptop' } 浮起的小表情；fx: 'confetti' 彩帶；fx: 'shake' 筆電搖晃
//   { jump: 'rookie' }                           跳一下
//   { wait: 毫秒 }
import { avatar } from './chars.js';

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const CANCEL = Symbol('cancel');

// 氣泡文字：每個字一個 span（先看不見、依序顯示），所以氣泡一開始就是完整大小，不會跳動
function bubbleHtml(text) {
  let html = '', mode = '';
  for (const part of text.split(/(\*\*|`)/)) {
    if (part === '**') { html += mode === 'b' ? '</b>' : '<b>'; mode = mode === 'b' ? '' : 'b'; }
    else if (part === '`') { html += mode === 'c' ? '</code>' : '<code>'; mode = mode === 'c' ? '' : 'c'; }
    else html += [...part].map((ch) => `<span class="c">${esc(ch)}</span>`).join('');
  }
  return html;
}

// 簡單的程式碼上色（CSS／TSX 都夠用）
const TOKEN = /(\/\*.*?\*\/|\/\/.*$)|('[^'\n]*'|"[^"\n]*")|(@[\w-]+)|(--[\w-]+)|(#[0-9a-fA-F]{3,8}\b)|(\b(?:function|return|export|default|import|from|const|let|type)\b)|(<\/?[A-Za-z][\w.]*)|(\b\d+(?:\.\d+)?(?:px|rem|%)?\b)/g;
const CLS = ['', 't-c', 't-s', 't-a', 't-v', 't-n', 't-k', 't-g', 't-n'];
const paint = (line) => {
  let out = '', last = 0, m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(line))) {
    out += esc(line.slice(last, m.index));
    const k = m.slice(1).findIndex((x) => x !== undefined) + 1;
    out += `<span class="${CLS[k]}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(line.slice(last));
};

export function startStory(root, cfg) {
  const { title, sub = '', cast, beats, preview = 'tw-preview.html', backHref = '', baseFiles = {}, menu = [], index = 0, next = null } = cfg;
  const q = new URLSearchParams(location.search);
  const KEY = 'ddg-story-settings';
  const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })();
  const TYPE = { slow: 3.2, mid: 1.6, fast: 0.8 }, TYPE_LABEL = { slow: '慢', mid: '中', fast: '快' }; // 打字每個字的時間倍率
  const PAUSE = { slow: 1.3, mid: 1, fast: 0.6 }; // 每打完一行停多久的倍率
  let speed = +q.get('speed') || saved.speed || 1;
  let typing = TYPE[q.get('typing')] ? q.get('typing') : TYPE[saved.typing] ? saved.typing : 'mid';
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ speed, typing })); } catch {} };
  let paused = false, fast = false, token = 0, measure = false, acc = 0;
  const S = {};

  // ── 畫面骨架 ──
  root.innerHTML = `<div class="st">
    <div class="st-top">${menu.length ? '<button class="st-btn" data-a="menu" title="目錄">☰</button>' : ''}<div class="st-title">${esc(title)}<small></small></div>${backHref ? `<a class="st-back" href="${backHref}">← 回影片版</a>` : ''}
      <button class="st-btn" data-a="speed" title="整體速度">⏱ 1×</button><button class="st-btn" data-a="typing" title="打字速度">⌨️ 中</button><button class="st-btn" data-a="play">⏸</button><button class="st-btn" data-a="replay">↻</button></div>
    <div class="st-scene">
      <div class="st-chr teacher"><div class="st-av"><div class="face"></div><span class="nm"></span></div><div class="bub"></div></div>
      <div class="st-laptop"><div class="lp-bar"><i></i><i></i><i></i><button class="tab fn" data-a="pin-code" title="點一下：固定放大程式碼">（還沒有檔案）</button><button class="tab vw" data-a="pin-view" title="點一下：固定放大預覽">🌐 預覽</button><button class="tab vp" data-a="vp" title="切換手機／桌面預覽">📱</button><button class="tab zoom" data-a="full" title="暫停，全螢幕看完整程式碼">🔍</button></div>
        <div class="lp-body"><div class="lp-code" data-pane="code"><pre></pre><div class="lp-term"></div></div><div class="lp-view"><div class="empty">電腦螢幕還是黑的～</div></div></div></div>
      <div class="st-chr rookie"><div class="st-av"><div class="face"></div><span class="nm"></span></div><div class="bub"></div></div>
      <div class="st-float"></div><div class="st-card"></div><div class="st-paused">⏸ 暫停中　點一下繼續</div>
      <div class="st-menu"><h3>目錄</h3><div class="mn-list"></div><button class="st-btn" data-a="close-menu">關閉</button></div>
      <div class="st-full"><div class="sf-bar"><span class="sf-tabs"></span><button class="st-btn" data-a="copy">複製</button><button class="st-btn" data-a="close-full">✕ 關閉</button></div><pre class="sf-pre"></pre></div>
    </div><div class="st-prog"></div></div>`;
  const $ = (sel) => root.querySelector(sel);
  const scene = $('.st-scene'), laptop = $('.st-laptop'), codeBox = $('.lp-code'), pre = $('pre'), viewBox = $('.lp-view');
  const chr = { teacher: $('.st-chr.teacher'), rookie: $('.st-chr.rookie') };
  for (const w of ['teacher', 'rookie']) chr[w].querySelector('.nm').textContent = cast[w].name;
  const float = $('.st-float'), card = $('.st-card'), pausedEl = $('.st-paused'), termEl = $('.lp-term'), codePane = $('.lp-code');
  const FRAME_W = () => (S.vp === 'desktop' ? 1280 : 390);

  // 章節
  const chapters = [];
  beats.forEach((b, i) => { if (b.chapter) chapters.push({ title: b.chapter, at: i }); });
  const prog = $('.st-prog');
  prog.innerHTML = chapters.map((c, k) => `<button class="seg" data-k="${k}" title="${esc(c.title)}"><i><b></b></i>${esc(c.title)}</button>`).join('');
  const segs = [...prog.querySelectorAll('.seg')];

  // ── 等待（可暫停、可調速、可快轉）──
  const wait = async (ms, my) => {
    if (measure) { acc += ms; return; }
    if (fast) return;
    let left = ms / speed;
    while (left > 0) {
      const step = Math.min(left, 40); // 每 40ms 檢查一次有沒有被暫停／取消，但短的等待照實等
      await sleep(step);
      if (my !== token) throw CANCEL;
      if (!paused) left -= step;
    }
  };

  // ── 角色 ──
  const setMood = (who, mood = 'normal', pop = true) => {
    if (S.mood[who] === mood && S.drawn[who]) return;
    S.mood[who] = mood; S.drawn[who] = true;
    chr[who].querySelector('.face').innerHTML = avatar(cast[who].role, mood, 84);
    if (pop && !fast) { chr[who].classList.remove('squash'); void chr[who].offsetWidth; chr[who].classList.add('squash'); }
  };
  const speak = async (who, text, mood, my) => {
    const other = who === 'teacher' ? 'rookie' : 'teacher';
    setMood(who, mood || 'normal');
    chr[who].classList.remove('dim'); chr[other].classList.add('dim');
    const bub = chr[who].querySelector('.bub'), bubOther = chr[other].querySelector('.bub');
    bubOther.classList.remove('show', 'pop');
    bub.innerHTML = bubbleHtml(text);
    bub.classList.add('show');
    const spans = [...bub.querySelectorAll('.c')];
    if (fast) { spans.forEach((s) => s.classList.add('on')); return; }
    bub.classList.remove('pop'); void bub.offsetWidth; bub.classList.add('pop');
    chr[who].classList.add('talking');
    for (const s of spans) { s.classList.add('on'); await wait(/[，。！？～…]/.test(s.textContent) ? 90 : 26, my); }
    chr[who].classList.remove('talking');
    await wait(Math.max(1000, text.length * 105), my); // 留時間讓人讀完
  };

  // ── 特效 ──
  const where = (on) => (on === 'laptop' ? laptop : chr[on].querySelector('.st-av'));
  const fx = (emoji, on = 'laptop') => {
    if (fast) return;
    if (emoji === 'shake') { laptop.classList.remove('shake'); void laptop.offsetWidth; laptop.classList.add('shake'); return; }
    if (emoji === 'confetti') {
      for (let i = 0; i < 34; i++) {
        const c = document.createElement('i'); c.className = 'confetti';
        c.style.cssText = `left:${Math.random() * 100}%;background:hsl(${Math.random() * 360} 90% 65%);animation-duration:${1.8 + Math.random() * 1.6}s;animation-delay:${Math.random() * 0.5}s`;
        scene.append(c); setTimeout(() => c.remove(), 4200);
      }
      return;
    }
    const target = where(on).getBoundingClientRect(), base = scene.getBoundingClientRect();
    for (let k = 0; k < (emoji === '✨' ? 3 : 1); k++) {
      const s = document.createElement('span'); s.className = 'fx' + (emoji === '✨' ? ' s' : ''); s.textContent = emoji;
      s.style.left = target.left - base.left + target.width * (0.2 + Math.random() * 0.6) + 'px';
      s.style.top = target.top - base.top + (on === 'laptop' ? target.height * 0.25 : 0) + 'px';
      s.style.animationDelay = k * 0.12 + 's';
      scene.append(s); setTimeout(() => s.remove(), 1700);
    }
  };

  // ── 程式碼編輯器 ──
  const renderCode = () => {
    const text = S.files[S.cur] ?? '';
    const lines = text.split('\n');
    // 游標在第幾行第幾個字
    let ci = -1, cj = 0;
    if (S.caret >= 0) { const before = text.slice(0, S.caret).split('\n'); ci = before.length - 1; cj = before[ci].length; }
    pre.innerHTML = lines.map((ln, i) => {
      const hl = S.hl && i + 1 >= S.hl[0] && i + 1 <= S.hl[1];
      let body = i === ci ? paint(ln.slice(0, cj)) + '<span class="caret"></span>' + paint(ln.slice(cj)) : paint(ln);
      let tip = '';
      if (S.err && S.err.file === S.cur && S.err.line === i + 1) {
        const at = ln.indexOf(S.err.match);
        if (at >= 0) body = paint(ln.slice(0, at)) + `<span class="sq">${paint(S.err.match)}</span>` + paint(ln.slice(at + S.err.match.length));
        tip = `<div class="ln-tip">❌ ${esc(S.err.text)}</div>`;
      }
      return `<div class="ln${hl ? ' hl' : ''}${i === ci ? ' cur' : ''}${tip ? ' bad' : ''}" data-n="${i + 1}">${body}</div>${tip}`;
    }).join('');
    $('.fn').textContent = S.pane === 'term' ? '⌨️ 終端機' : S.cur || '（還沒有檔案）';
    const h = codeBox.clientHeight, tEl = pre.querySelector('.ln.cur') || pre.querySelector('.ln.hl');
    const ty = Math.min(Math.max(0, tEl ? tEl.offsetTop - h * 0.5 : 0), Math.max(0, pre.scrollHeight - h));
    pre.style.transform = `translateY(${-ty}px)`;
  };
  // 放大／縮小程式碼區（自動：新人打字時程式碼大、預覽小；顯示畫面時反過來。也可以點分頁固定）
  const renderTerm = () => {
    termEl.innerHTML = S.term.map((l) => (l.k === 'cmd' ? `<div class="tl cmd"><span>$</span> ${esc(l.t)}${l.live ? '<i class="caret"></i>' : ''}</div>` : `<div class="tl ${l.k}">${esc(l.t) || '&nbsp;'}</div>`)).join('');
    termEl.scrollTop = termEl.scrollHeight;
  };
  const applyMode = () => {
    codePane.dataset.pane = S.pane || 'code';
    $('.vp').textContent = S.vp === 'desktop' ? '🖥️' : '📱';
    $('.lp-body').dataset.m = S.pin || S.mode || 'even';
    $('.fn').classList.toggle('pinned', S.pin === 'code'); $('.vw').classList.toggle('pinned', S.pin === 'view');
    renderCode();
  };
  const typeTo = async (file, target, slow, my, bulk) => {
    S.cur = file; S.pane = 'code'; if (!(file in S.files)) S.files[file] = '';
    const cur = S.files[file];
    if (fast) { S.files[file] = target; S.caret = -1; return; }
    const rate = (slow ? 45 : bulk ? 8 : 16) * TYPE[typing]; // 一般打得快（約 40 字／秒）；小地方的修改（slow）打慢一點；大量重複的內容（bulk）打很快、不逐行停
    const common = (from) => { let k = 0; while (k < cur.length - from && k < target.length - from && cur[cur.length - 1 - k] === target[target.length - 1 - k]) k++; return k; };
    let p = 0; while (p < cur.length && p < target.length && cur[p] === target[p]) p++;
    let s = common(p);
    if (cur.slice(p, cur.length - s).includes('\n') || target.slice(p, target.length - s).includes('\n')) { p = cur.lastIndexOf('\n', p - 1) + 1; s = common(p); } // 跨行的修改：從行首開始
    const tail = cur.slice(cur.length - s), head = cur.slice(0, p);
    let mid = cur.slice(p, cur.length - s);
    for (; mid.length; ) { mid = mid.slice(0, -1); S.files[file] = head + mid + tail; S.caret = p + mid.length; renderCode(); await wait(30, my); }
    const add = target.slice(p, target.length - s);
    for (let i = 0; i < add.length; i++) {
      S.files[file] = head + add.slice(0, i + 1) + tail; S.caret = p + i + 1; renderCode();
      await wait(rate * (0.6 + Math.random() * 0.8), my);
      if (add[i] === '\n') { // 這一行打完了：停一下，停多久看這一行有多長
        const done = (head + add.slice(0, i + 1)).split('\n').slice(-2, -1)[0].trim().length;
        await wait((bulk ? 60 : done ? 380 + Math.min(done, 80) * 16 : 160) * PAUSE[typing], my);
      }
    }
    S.files[file] = target; S.caret = p + add.length; renderCode();
  };

  // ── 預覽（真的執行程式碼；新舊兩個 iframe 交替，不會閃一下白畫面）──
  const fitFrame = (f) => {
    const W = FRAME_W(), k = viewBox.clientWidth / W;
    Object.assign(f.style, { width: W + 'px', height: viewBox.clientHeight / k + 'px', transform: `scale(${k})` });
  };
  const loadView = () => {
    if (!S.view) return;
    viewBox.querySelector('.empty')?.remove();
    const f = document.createElement('iframe'); f.className = 'lp-frame'; f.src = preview; f.title = '預覽';
    fitFrame(f); viewBox.append(f);
    const old = [...viewBox.querySelectorAll('.lp-frame')].filter((x) => x !== f);
    const { files, mode } = S.view;
    const onMsg = (ev) => {
      if (ev.source !== f.contentWindow) return;
      if (ev.data?.type === 'preview-ready') f.contentWindow.postMessage({ type: 'render', files, mode }, '*');
      if (ev.data?.type === 'preview-rendered') { window.removeEventListener('message', onMsg); f.style.opacity = 1; setTimeout(() => old.forEach((o) => o.remove()), 300); }
    };
    window.addEventListener('message', onMsg);
    setTimeout(() => { f.style.opacity = 1; old.forEach((o) => o.remove()); }, 6000);
  };
  new ResizeObserver(() => { viewBox.querySelectorAll('.lp-frame').forEach(fitFrame); renderCode(); }).observe(viewBox);

  // ── 終端機：打指令、一行一行印出結果 ──
  const runTerm = async (t, my) => {
    if (t === null) { S.pane = 'code'; applyMode(); return; }
    S.pane = 'term'; S.mode = 'code'; if (t.clear) S.term = [];
    applyMode(); renderTerm();
    if (fast) {
      if (t.cmd !== undefined) S.term.push({ k: 'cmd', t: t.cmd });
      for (const l of t.out || []) S.term.push({ k: 'out', t: l });
      for (const l of t.err || []) S.term.push({ k: 'err', t: l });
      return;
    }
    if (t.cmd !== undefined) {
      const line = { k: 'cmd', t: '', live: true }; S.term.push(line);
      await wait(400, my);
      for (let i = 1; i <= t.cmd.length; i++) { line.t = t.cmd.slice(0, i); renderTerm(); await wait(16 * TYPE[typing] * (0.6 + Math.random() * 0.8) * 2, my); }
      line.live = false; renderTerm(); await wait(500, my);
    }
    for (const l of t.out || []) { S.term.push({ k: 'out', t: l }); renderTerm(); await wait(t.gap ?? 240, my); }
    for (const l of t.err || []) { S.term.push({ k: 'err', t: l }); renderTerm(); await wait(t.gap ?? 240, my); }
    await wait(t.hold ?? 900, my);
  };

  // ── 一個動作 ──
  const run1 = async (b, i, my) => {
    if (b.chapter) {
      S.chapter = chapters.findIndex((c) => c.at === i);
      $('.st-title small').textContent = '　' + b.chapter;
      if (!fast) { /* 章節轉場：新人跳一下 */ }
    }
    if (b.card) {
      card.innerHTML = `<div class="big">${b.card[2] || '✨'}</div><h2>${esc(b.card[0])}</h2><p>${esc(b.card[1] || '')}</p>`;
      card.classList.add('show');
      if (!fast) await wait(b.ms || 2400, my);
      card.classList.remove('show');
    }
    if (b.mood && !b.say) for (const [w, m] of Object.entries(b.mood)) setMood(w, m);
    if (b.file) { S.cur = b.file; S.pane = 'code'; S.mode = 'code'; applyMode(); }
    if (b.vp) { S.vp = b.vp; applyMode(); viewBox.querySelectorAll('.lp-frame').forEach(fitFrame); }
    if (b.err !== undefined) { S.err = b.err ? { ...b.err, file: S.cur } : null; renderCode(); }
    if (b.term !== undefined) await runTerm(b.term, my);
    if (b.hl !== undefined) { S.hl = b.hl; if (b.hl) S.mode = 'code'; renderCode(); }
    if (b.float !== undefined) {
      if (b.float) { float.innerHTML = b.float; float.classList.add('show'); } else float.classList.remove('show');
    }
    if (b.code) {
      S.hl = null; S.mode = 'code'; applyMode();
      const who = b.code.by || 'rookie', other = who === 'teacher' ? 'rookie' : 'teacher';
      chr[who].classList.remove('dim'); chr[other].classList.add('dim'); chr[who].classList.add('typing');
      await typeTo(b.code.file, b.code.text, b.code.slow, my, b.code.bulk);
      chr[who].classList.remove('typing'); renderCode();
      await wait(800, my); // 打完停一下，讓人看清楚
    }
    if (b.view) {
      S.view = { files: { ...S.files }, mode: b.view.mode || 'ok' }; S.mode = 'view'; applyMode();
      if (!fast) loadView(); else S.pendingView = true;
      if (!fast) await wait(b.view.ms || 1500, my);
    }
    if (b.jump && !fast) { const c = chr[b.jump]; c.classList.remove('jump'); void c.offsetWidth; c.classList.add('jump'); }
    if (b.fx) fx(b.fx, b.on || (b.say ? b.say : 'laptop'));
    if (b.say) {
      await speak(b.say, b.text, b.mood, my);
    }
    if (b.wait) await wait(b.wait, my);
  };

  // ── 主迴圈 ──
  const reset = () => {
    Object.assign(S, { files: JSON.parse(JSON.stringify(baseFiles)), cur: null, caret: -1, hl: null, mood: {}, drawn: {}, view: null, pendingView: false, chapter: -1, mode: 'even', pin: null, pane: 'code', term: [], err: null, vp: cfg.vp || 'mobile' });
    applyMode(); renderTerm();
    pre.innerHTML = ''; $('.fn').textContent = '（還沒有檔案）';
    viewBox.querySelectorAll('.lp-frame').forEach((f) => f.remove());
    if (!viewBox.querySelector('.empty')) viewBox.insertAdjacentHTML('afterbegin', '<div class="empty">電腦螢幕還是黑的～</div>');
    for (const w of ['teacher', 'rookie']) { chr[w].classList.remove('dim', 'talking'); chr[w].querySelector('.bub').className = 'bub'; chr[w].querySelector('.bub').innerHTML = ''; setMood(w, 'normal', false); }
    float.classList.remove('show'); card.classList.remove('show'); scene.querySelectorAll('.fx,.confetti').forEach((x) => x.remove());
    segs.forEach((s) => { s.classList.remove('on'); s.querySelector('b').style.width = '0'; });
  };
  const paintProgress = (i) => {
    const k = S.chapter;
    segs.forEach((s, n) => {
      s.classList.toggle('on', n === k);
      const from = chapters[n].at, to = chapters[n + 1] ? chapters[n + 1].at : beats.length;
      s.querySelector('b').style.width = (n < k ? 100 : n === k ? ((i - from + 1) / (to - from)) * 100 : 0) + '%';
    });
  };
  async function play(target = 0) {
    const my = ++token;
    card.classList.remove('show'); card.innerHTML = '';
    reset(); fast = target > 0; paused = false; updatePlayBtn();
    try {
      for (let i = 0; i < beats.length; i++) {
        if (i === target && fast) { fast = false; renderCode(); if (S.pendingView) { S.pendingView = false; loadView(); } }
        await run1(beats[i], i, my);
        paintProgress(i);
      }
      fast = false; end();
    } catch (e) { if (e !== CANCEL) console.error(e); }
  }
  const end = () => {
    for (const w of ['teacher', 'rookie']) { chr[w].classList.remove('talking', 'dim'); }
    card.innerHTML = `<div class="big">🎉</div><h2>${esc(cfg.endTitle || '完成！')}</h2><p>${esc(cfg.endSub || '')}</p>
      ${next ? `<p class="nx">下一部：<b>${esc(next.title)}</b>　<span class="cd"></span></p>` : '<p class="nx">這份教學全部完成了 🎊</p>'}
      <div class="row">${next ? '<button class="st-btn p" data-a="go-next">▶ 馬上開始</button><button class="st-btn" data-a="stay">停在這裡</button>' : ''}<button class="st-btn${next ? '' : ' p'}" data-a="replay">↻ 再看一次</button>${menu.length ? '<button class="st-btn" data-a="menu">☰ 目錄</button>' : ''}</div>`;
    card.classList.add('show');
    if (next) { // 不用按：幾秒後自動接著播下一部（可以按「停在這裡」取消）
      let left = 8; const cd = card.querySelector('.cd'); cd.textContent = left + ' 秒後自動開始';
      const tick = setInterval(() => {
        if (!card.classList.contains('show') || !card.querySelector('.cd')) return clearInterval(tick);
        if (paused) return;
        cd.textContent = --left + ' 秒後自動開始';
        if (left <= 0) { clearInterval(tick); location.href = next.href; }
      }, 1000);
      card.dataset.tick = tick;
    }
    segs.forEach((s) => (s.querySelector('b').style.width = '100%'));
  };

  // ── 控制：暫停、速度、重播、跳章節 ──
  const updatePlayBtn = () => { $('[data-a=play]').textContent = paused ? '▶' : '⏸'; pausedEl.classList.toggle('show', paused); };
  const SPEEDS = [0.5, 0.75, 1, 1.5, 2], TYPES = ['slow', 'mid', 'fast'];
  const labels = () => { $('[data-a=speed]').textContent = '⏱ ' + speed + '×'; $('[data-a=typing]').textContent = '⌨️ ' + TYPE_LABEL[typing]; };
  // 全螢幕看完整程式碼：暫停，關掉後回到原本的狀態
  const full = $('.st-full'); let fullFile = null, resumeAfter = false;
  const drawFull = () => {
    const names = Object.keys(S.files);
    fullFile = names.includes(fullFile) ? fullFile : (S.cur || names[0]);
    full.querySelector('.sf-tabs').innerHTML = names.map((n) => `<button class="sf-tab${n === fullFile ? ' on' : ''}" data-a="full-file" data-f="${esc(n)}">${esc(n)}</button>`).join('') || '<span>（還沒有檔案）</span>';
    full.querySelector('.sf-pre').innerHTML = (S.files[fullFile] || '').split('\n').map((ln, i) => `<div class="ln" data-n="${i + 1}">${paint(ln)}</div>`).join('');
  };
  const menuEl = $('.st-menu');
  const openMenu = () => { resumeAfter = !paused; paused = true; updatePlayBtn(); menuEl.querySelector('.mn-list').innerHTML = menu.map((m, k) => `<a class="mn${k === index ? ' on' : ''}" href="${m.href}"><b>${k + 1}</b>${esc(m.title)}</a>`).join(''); menuEl.classList.add('show'); };
  const closeMenu = () => { menuEl.classList.remove('show'); if (resumeAfter && !full.classList.contains('show')) { paused = false; updatePlayBtn(); } };
  const openFull = () => { resumeAfter = !paused; paused = true; updatePlayBtn(); fullFile = S.cur; drawFull(); full.classList.add('show'); };
  const closeFull = () => { full.classList.remove('show'); if (resumeAfter) { paused = false; updatePlayBtn(); } };
  root.addEventListener('click', (e) => {
    const a = e.target.closest('[data-a]')?.dataset.a, seg = e.target.closest('.seg');
    if (seg) return play(chapters[+seg.dataset.k].at);
    if (a === 'play') { paused = !paused; updatePlayBtn(); }
    else if (a === 'replay') play(0);
    else if (a === 'speed') { speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length] || 1; save(); labels(); }
    else if (a === 'typing') { typing = TYPES[(TYPES.indexOf(typing) + 1) % TYPES.length]; save(); labels(); }
    else if (a === 'pin-code') { S.pin = S.pin === 'code' ? null : 'code'; applyMode(); }
    else if (a === 'pin-view') { S.pin = S.pin === 'view' ? null : 'view'; applyMode(); }
    else if (a === 'full') openFull();
    else if (a === 'vp') { S.vp = S.vp === 'desktop' ? 'mobile' : 'desktop'; applyMode(); viewBox.querySelectorAll('.lp-frame').forEach(fitFrame); }
    else if (a === 'menu') openMenu();
    else if (a === 'close-menu') closeMenu();
    else if (a === 'go-next') location.href = next.href;
    else if (a === 'stay') { clearInterval(+card.dataset.tick); card.querySelector('.nx .cd')?.remove(); card.querySelector('[data-a=stay]')?.remove(); }
    else if (a === 'close-full') closeFull();
    else if (a === 'full-file') { fullFile = e.target.closest('[data-f]').dataset.f; drawFull(); }
    else if (a === 'copy') { navigator.clipboard?.writeText(S.files[fullFile] || '').then(() => { e.target.textContent = '已複製 ✓'; setTimeout(() => (e.target.textContent = '複製'), 1500); }).catch(() => {}); }
    else if (e.target.closest('.st-full, .st-menu')) { /* 全螢幕程式碼、目錄裡面的點擊不要當成暫停 */ }
    else if (e.target.closest('.st-scene') && !card.classList.contains('show')) { paused = !paused; updatePlayBtn(); } // 點畫面也能暫停
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && !paused) { paused = true; updatePlayBtn(); } });
  labels();

  window.__story = { play, get state() { return S; }, setSpeed: (v) => (speed = v), setTyping: (v) => (typing = v), // 測試用
    measure: async () => { measure = true; acc = 0; await play(0); measure = false; return acc; } };
  play(+q.get('start') ? chapters[+q.get('start')]?.at || 0 : 0);
}
