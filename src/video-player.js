// 影片式教學的播放器（Node.js、React 共用）：程式自己打出來＋字幕＋可開語音。
// 每一步：say 字幕；slide 大字卡；file + code 編輯器（code 是這一步完成後的整個檔案，新的行會被打出來）；
// term 終端機（"$ " 開頭是你要打的指令，其他是電腦的回應）；web 瀏覽器畫面。
export function startPlayer(EPISODES, name) {
  const KEY = 'ddg-' + name;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })();
  let ep = Math.min(saved.ep || 0, EPISODES.length - 1), st = Math.min(saved.st || 0, EPISODES[ep].steps.length - 1);
  let playing = false, voice = false, speed = 1, token = 0;

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
    $('slide').hidden = !step.slide; $('ed').hidden = !step.file; $('term').hidden = !step.term; $('web').hidden = !step.web;
    if (step.slide) $('slide').innerHTML = step.slide.map((l, i) => `<p class="${i ? '' : 'big'}">${esc(l)}</p>`).join('');
    if (step.web) { $('url').textContent = step.web.url; $('page').innerHTML = step.web.html; }

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
