// 影片式教學的播放器（Node.js、React 共用）：程式自己打出來＋字幕＋可開語音。
// 每一步：say 字幕；slide 大字卡；file + code 編輯器（code 是這一步完成後的整個檔案，新的行會被打出來）；
// term 終端機（"$ " 開頭是你要打的指令，其他是電腦的回應）；web 瀏覽器畫面。
// 進階（選用，Tailwind 教學使用）：
//   opts.anims   概念動畫表 { 名稱: (容器, { alive }) => 清除函式 }；step.anim 指定名稱，找不到就退回 step.slide。
//   opts.preview 即時預覽頁網址；web 步驟會把「到這一步為止的所有檔案」送進去真的執行（web.live === false 則不用）。
//                web.live 可寫 { vp: 'mobile', modes: [['ok','正常'],['slow','讀取中']] }。
export function startPlayer(EPISODES, name, opts = {}) {
  const KEY = 'ddg-' + name;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })();
  let ep = Math.min(saved.ep || 0, EPISODES.length - 1), st = Math.min(saved.st || 0, EPISODES[ep].steps.length - 1);
  let playing = false, voice = false, speed = 1, token = 0;
  let stopAnim = null, stopLive = null; // 離開這一步時，要把動畫與預覽收掉

  // 這一步之前，同一個檔案最後的內容（跨部也算，因為 server.js 是一路改下去的）
  const before = (file) => {
    for (let e = ep, s = st - 1; e >= 0; e--, s = e >= 0 ? EPISODES[e].steps.length - 1 : 0) {
      for (; s >= 0; s--) if (EPISODES[e].steps[s].file === file) return EPISODES[e].steps[s].code;
    }
    return '';
  };
  const codeLine = (t) => (/^\s*(\/\/|<!--)/.test(t) ? `<i>${esc(t)}</i>` : esc(t)) || ' ';

  const speak = (text) => new Promise((done) => {
    if (!voice || !window.speechSynthesis) return done();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-TW'; u.rate = speed;
    u.onend = u.onerror = () => done();
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  });

  // 固定在下方的字幕列會隨字數變高，頁面底部要留出同樣的空間，程式區塊才不會被蓋住
  const fitBottom = () => {
    const bar = document.querySelector('footer'), main = document.querySelector('main');
    if (bar && main) main.style.paddingBottom = bar.offsetHeight + 16 + 'px';
  };
  window.addEventListener('resize', fitBottom);

  // 到 (e, s) 這一步為止，每個檔案的最新內容
  const filesUpTo = (e, s) => {
    const files = {};
    for (let i = 0; i <= e; i++) {
      const steps = EPISODES[i].steps;
      for (let j = 0; j < steps.length && (i < e || j <= s); j++) if (steps[j].file) files[steps[j].file] = steps[j].code;
    }
    return files;
  };

  // 即時預覽：iframe 裡真的編譯並執行教學的程式碼
  function mountLive(step) {
    const page = $('page');
    const cfg = typeof step.web.live === 'object' ? step.web.live : {};
    let vp = cfg.vp || (window.innerWidth < 700 ? 'mobile' : 'desktop');
    let mode = cfg.modes ? cfg.modes[0][0] : 'ok';
    const files = filesUpTo(ep, st);
    page.classList.add('is-live');
    page.innerHTML = `<div class="live-bar"><button data-vp="desktop">🖥️ 桌面</button><button data-vp="mobile">📱 手機</button>${
      (cfg.modes || []).map(([m, label]) => `<button data-mode="${m}">${label}</button>`).join('')}<button data-reload="1">↻ 重新載入</button></div><div class="live-view"></div><p class="live-note">👆 這是真的程式碼跑出來的畫面，可以點、可以滑。</p>`;
    const view = page.querySelector('.live-view');
    let frame = null, timer = 0, onMsg = null;
    const mark = () => {
      page.querySelectorAll('[data-vp]').forEach((b) => b.classList.toggle('on', b.dataset.vp === vp));
      page.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
    };
    const fit = () => {
      if (!frame) return;
      const W = vp === 'desktop' ? 1280 : 390, avail = view.clientWidth || 600, H = 380;
      const k = Math.min(1, avail / W);
      Object.assign(frame.style, { width: W + 'px', height: H / k + 'px', transform: 'scale(' + k + ')', marginLeft: Math.max(0, (avail - W * k) / 2) + 'px' });
      view.style.height = H + 'px';
    };
    const load = () => {
      clearTimeout(timer);
      if (onMsg) window.removeEventListener('message', onMsg);
      view.innerHTML = '<p class="live-wait">載入預覽中…</p>';
      frame = document.createElement('iframe');
      frame.className = 'live-frame'; frame.title = '即時預覽'; frame.src = opts.preview;
      let ready = false;
      onMsg = (ev) => {
        if (ev.source !== frame.contentWindow || ev.data?.type !== 'preview-ready') return;
        ready = true; view.querySelector('.live-wait')?.remove();
        frame.contentWindow.postMessage({ type: 'render', files, mode }, '*');
      };
      window.addEventListener('message', onMsg);
      view.append(frame); fit(); mark();
      timer = setTimeout(() => { // 載不到（例如沒有網路）就退回靜態示意圖
        if (ready) return;
        page.classList.remove('is-live'); page.innerHTML = step.web.html + '<p class="live-note">（即時預覽載入失敗，這裡是示意圖）</p>';
      }, 9000);
    };
    page.onclick = (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.vp) { vp = b.dataset.vp; fit(); mark(); }
      else if (b.dataset.mode) { mode = b.dataset.mode; load(); }
      else if (b.dataset.reload) load();
    };
    const onResize = () => fit();
    window.addEventListener('resize', onResize);
    load();
    return () => { clearTimeout(timer); window.removeEventListener('message', onMsg); window.removeEventListener('resize', onResize); page.onclick = null; };
  }

  // 概念動畫的容器（頁面上沒有就建立）
  const animPane = () => {
    let el = $('anim');
    if (!el) { el = document.createElement('div'); el.id = 'anim'; el.className = 'pane anim-pane'; el.hidden = true; $('screen').prepend(el); }
    return el;
  };

  async function show(animate) {
    const mine = ++token;
    const alive = () => mine === token;
    window.speechSynthesis?.cancel();
    const E = EPISODES[ep], step = E.steps[st];
    try { localStorage.setItem(KEY, JSON.stringify({ ep, st })); } catch {}
    $('eps').innerHTML = EPISODES.map((e, i) => `<button data-ep="${i}" class="${i === ep ? 'on' : ''}">第 ${i + 1} 部<small>${e.title}</small></button>`).join('');
    $('eps').querySelector('.on').scrollIntoView({ block: 'nearest', inline: 'center' });
    $('title').textContent = `第 ${ep + 1} 部　${E.title}`;
    $('count').textContent = `第 ${st + 1} 步／共 ${E.steps.length} 步`;
    $('bar').style.width = `${((st + 1) / E.steps.length) * 100}%`;
    $('say').textContent = step.say;
    fitBottom();
    $('play').textContent = playing ? '⏸ 暫停' : '▶ 播放';
    $('next').textContent = st === E.steps.length - 1 ? (ep === EPISODES.length - 1 ? '🔁 從頭看' : '下一部 ⏭') : '下一步 ⏭';
    if (stopAnim) { try { stopAnim(); } catch {} stopAnim = null; }
    if (stopLive) { stopLive(); stopLive = null; }
    const useAnim = !!(step.anim && opts.anims?.[step.anim]);
    const pane = animPane();
    pane.hidden = !useAnim;
    $('slide').hidden = useAnim || !step.slide; $('ed').hidden = !step.file; $('term').hidden = !step.term; $('web').hidden = !step.web;
    if (step.slide) $('slide').innerHTML = step.slide.map((l, i) => `<p class="${i ? '' : 'big'}">${esc(l)}</p>`).join('');
    if (useAnim) { pane.innerHTML = ''; stopAnim = opts.anims[step.anim](pane, { alive, speed }); }
    if (step.web) {
      $('url').textContent = step.web.url;
      $('page').classList.remove('is-live'); $('page').onclick = null;
      if (opts.preview && step.web.live !== false) stopLive = mountLive(step);
      else $('page').innerHTML = step.web.html;
    }

    const talk = speak(step.say);
    const wait = (ms) => (animate ? sleep(ms / speed) : Promise.resolve());
    if (step.file) {
      $('fname').textContent = step.file;
      const old = new Set(before(step.file).split('\n').map((l) => l.trim()).filter(Boolean));
      const lines = step.code.split('\n');
      const isNew = lines.map((l) => l.trim() && !old.has(l.trim()));
      const body = $('code');
      body.innerHTML = lines.map((l, i) => `<div class="${isNew[i] ? 'new' : ''}">${isNew[i] && animate ? ' ' : codeLine(l)}</div>`).join('');
      body.querySelector('.new')?.scrollIntoView({ block: 'nearest' });
      if (animate) for (let i = 0; i < lines.length && alive(); i++) {
        if (!isNew[i]) continue;
        const el = body.children[i];
        el.scrollIntoView({ block: 'nearest' });
        for (let n = 1; n <= lines[i].length && alive(); n++) { el.textContent = lines[i].slice(0, n); await wait(22); }
        if (alive()) el.innerHTML = codeLine(lines[i]);
        await wait(120);
      }
    }
    if (step.term && alive()) {
      const body = $('tout');
      body.innerHTML = '';
      for (const l of step.term) {
        if (!alive()) break;
        const el = document.createElement('div');
        const cmd = l.startsWith('$ ');
        el.className = cmd ? 'cmd' : '';
        body.append(el);
        if (cmd && animate) { for (let n = 2; n <= l.length && alive(); n++) { el.textContent = l.slice(0, n); await wait(45); } await wait(350); }
        else { el.textContent = l || ' '; await wait(cmd ? 0 : 250); }
        body.scrollTop = body.scrollHeight;
      }
    }
    if (!alive() || !playing) return;
    // 自動播放：等語音唸完；沒開語音就依字數留閱讀時間
    await Promise.all([talk, voice ? sleep(600) : sleep(Math.max(2500, step.say.length * 170) / speed)]);
    if (!alive() || !playing) return;
    if (st < E.steps.length - 1) { st++; show(true); }
    else { playing = false; $('play').textContent = '▶ 播放'; } // 一部播完先停，讓你決定要不要看下一部
  }

  const jump = (e, s) => { ep = e; st = s; show(playing); };
  $('play').onclick = () => { playing = !playing; show(playing); };
  $('prev').onclick = () => { if (st > 0) jump(ep, st - 1); else if (ep > 0) jump(ep - 1, 0); };
  $('next').onclick = () => {
    if (st < EPISODES[ep].steps.length - 1) jump(ep, st + 1);
    else jump(ep < EPISODES.length - 1 ? ep + 1 : 0, 0);
  };
  $('again').onclick = () => show(true);
  $('voice').onclick = () => { voice = !voice; $('voice').textContent = voice ? '🔊 語音：開' : '🔇 語音：關'; if (!voice) speechSynthesis?.cancel(); else show(playing); };
  $('speed').onchange = () => { speed = +$('speed').value; };
  $('eps').onclick = (e) => { const b = e.target.closest('[data-ep]'); if (b) jump(+b.dataset.ep, 0); };
  if (!window.speechSynthesis) $('voice').hidden = true;
  show(false);
}
