// 教學小工具（不用打字）：
//   viewer  看真實的回應（狀態碼、ok、內容），親眼看 404 / 400 / 500 / 斷網長什麼樣
//   lab     把程式一行一行「開關」，看拿掉那行會發生什麼事
//   blocks  拼積木：把打散的程式行排成正確順序
//   blanks  選填空：每個空格用選的
// 程式真的會執行（在看不見的 iframe 裡），結果是真的 API 回應。

const OK_URL = 'https://api.open-meteo.com/v1/forecast?current=temperature_2m&latitude=25.05&longitude=121.52';
export const SCENES = {
  ok: { name: '一切正常', url: OK_URL },
  nf: { name: '網址路徑打錯（404）', url: 'https://api.open-meteo.com/v1/forecasts?current=temperature_2m&latitude=25.05&longitude=121.52' },
  bad: { name: '參數亂寫（400）', url: 'https://api.open-meteo.com/v1/forecast?current=temperature_2m&latitude=abc&longitude=121.52' },
  err: { name: '伺服器壞掉（500，模擬）', url: OK_URL, mode: '500' },
  off: { name: '沒有網路（模擬）', url: OK_URL, mode: 'off' },
};
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// 在看不見的 iframe 裡執行 async 程式，收集 console.log 與沒被接住的錯誤
export function runSnippet(code, scene = SCENES.ok) {
  return new Promise((resolve) => {
    const f = document.createElement('iframe');
    f.style.display = 'none';
    document.body.append(f);
    const w = f.contentWindow, logs = [];
    const fmt = (v) => {
      if (v instanceof w.Promise || v instanceof Promise) return 'Promise { <pending> }　← 還沒拿到資料！';
      if (v instanceof w.Response) return `Response { status: ${v.status}, ok: ${v.ok} }　← 這是「信封」，還不是資料`;
      if (v === undefined) return 'undefined　← 沒有東西';
      if (typeof v === 'object' && v !== null) { try { return JSON.stringify(v, null, 1).slice(0, 400); } catch (e) { return String(v); } }
      return String(v);
    };
    w.console.log = (...a) => logs.push(a.map(fmt).join(' '));
    const real = w.fetch.bind(w);
    w.fetch = (u, ...r) => scene.mode === 'off' ? Promise.reject(new w.TypeError('Failed to fetch'))
      : scene.mode === '500' ? Promise.resolve(new w.Response('{"error":true,"reason":"Internal Server Error"}', { status: 500 }))
      : real(u, ...r);
    let done = false;
    const finish = (error) => { if (done) return; done = true; setTimeout(() => { f.remove(); resolve({ logs, error }); }, 250); };
    setTimeout(() => finish('等太久了（8 秒），可能是網路太慢'), 8000);
    try {
      new w.Function('return (async () => {\n' + code.split('{URL}').join(scene.url) + '\n})()')().then(() => finish(null), (e) => finish(e.name + ': ' + e.message));
    } catch (e) { finish('程式寫法有錯：' + e.message); }
  });
}

const outHtml = (r) => `<div class="labout"><b>▶ 執行結果</b>${r.logs.length ? r.logs.map((l) => `<pre>${esc(l)}</pre>`).join('') : '<p class="muted">（沒有印出任何東西）</p>'}${r.error ? `<p class="fail">💥 程式在這裡停住了（沒有被接住的錯誤）：${esc(r.error)}</p>` : ''}</div>`;
const sceneSelect = (keys, cur) => `<label class="muted">模擬環境：<select class="scn">${keys.map((k) => `<option value="${k}" ${k === cur ? 'selected' : ''}>${SCENES[k].name}</option>`).join('')}</select></label>`;

/* ---------- viewer：看回應 ---------- */
const VIEW_NOTE = {
  ok: '對方很開心地把資料給你。<b>狀態碼 200</b>、<code>response.ok</code> 是 <b>true</b>，內容是 JSON，氣溫就在 <code>current.temperature_2m</code>。',
  nf: '網址的路徑打錯了（<code>forecast</code> 多打了 s）。伺服器說「沒有這個地方」＝ <b>404</b>。<br>⚠️ 重點：<b>fetch 不會丟錯誤！</b>程式照樣往下跑，只是 <code>response.ok</code> 是 <b>false</b>，拿到的內容也不是你要的氣溫。你不檢查 <code>response.ok</code>，就會把錯誤的內容當成資料來用。',
  bad: '網址的參數亂寫（<code>latitude=abc</code>，緯度怎麼會是文字）。伺服器說「你問的東西我看不懂」＝ <b>400</b>。內容的 <code>reason</code> 會說明原因。fetch 一樣<b>不會丟錯誤</b>。',
  err: '伺服器自己壞掉了＝ <b>500</b>，不是你的錯，等一下再試。fetch 一樣<b>不會丟錯誤</b>，要靠 <code>response.ok</code> 發現。（這個情況是模擬的）',
  off: '根本連不上網（沒網路，或網域打錯）。這時 fetch <b>才會「丟出錯誤」</b>，錯誤訊息是 <code>Failed to fetch</code>。<b>沒有狀態碼</b>，因為根本沒有人回應你。這種錯誤要靠 <code>try / catch</code> 接住。（這個情況是模擬的）',
};
function viewer(box, spec) {
  const keys = spec.scenes || ['ok', 'nf', 'bad', 'err', 'off'];
  box.innerHTML = `<div class="lab"><h4>🔬 ${spec.title || '看看真的回應長什麼樣子'}</h4><p class="muted">${spec.intro || '點下面的按鈕，程式會「真的」去敲 API，你親眼看對方回了什麼。'}</p><div class="vbtns">${keys.map((k) => `<button data-k="${k}">${SCENES[k].name}</button>`).join('')}</div><div class="vres"></div></div>`;
  box.querySelectorAll('.vbtns button').forEach((b) => (b.onclick = async () => {
    const k = b.dataset.k, res = box.querySelector('.vres');
    res.innerHTML = '<p class="muted">敲 API 中…</p>';
    const r = await runSnippet(`try {
  const response = await fetch('{URL}');
  const text = await response.text();
  console.log(JSON.stringify({ status: response.status, ok: response.ok, text: text.slice(0, 260) }));
} catch (error) {
  console.log(JSON.stringify({ neterr: error.message }));
}`, SCENES[k]);
    let o = {}; try { o = JSON.parse(r.logs[0]); } catch (e) { o = { neterr: r.error || '連線有問題（可能是網路）' }; }
    res.innerHTML = `<div class="labout"><p><b>網址：</b><code>${esc(SCENES[k].url.replace('https://api.open-meteo.com', ''))}</code></p>` +
      (o.neterr ? `<p><b>fetch 丟出錯誤：</b><code>${esc(o.neterr)}</code>　<span class="muted">（沒有 status、沒有 ok）</span></p>`
        : `<p><b>response.status：</b><code>${o.status}</code>　<b>response.ok：</b><code>${o.ok}</code></p><p><b>回傳的內容：</b></p><pre>${esc(o.text || '（空的）')}</pre>`) +
      `<p>👉 ${VIEW_NOTE[k]}</p></div>`;
  }));
}

/* ---------- lab：一行一行開關 ---------- */
function lab(box, spec) {
  const st = { on: spec.lines.map(() => true), tryOn: false, scene: spec.scenes?.[0] || 'ok', result: null };
  const build = () => {
    const body = spec.lines.filter((_, i) => st.on[i]).map((l) => l.code);
    return st.tryOn ? 'try {\n' + body.map((c) => '  ' + c.split('\n').join('\n  ')).join('\n') + "\n} catch (error) {\n  console.log('抓到錯誤：', error.message);\n}" : body.join('\n');
  };
  const draw = () => {
    const code = build();
    box.innerHTML = `<div class="lab"><h4>🧪 ${spec.title}</h4><p class="muted">${spec.intro || ''}</p>
      ${spec.scenes ? sceneSelect(spec.scenes, st.scene) : ''}
      ${spec.lines.map((l, i) => `<div class="labline ${st.on[i] ? '' : 'off'}"><label><input type="checkbox" data-i="${i}" ${st.on[i] ? 'checked' : ''}> <code>${esc(l.code.split('{URL}').join('…網址…'))}</code></label>
        <div class="why"><b>做什麼：</b>${l.what}<br><b>為什麼要有：</b>${l.why}</div>${st.on[i] ? '' : `<div class="gone">❌ 拿掉這行 → ${l.off}</div>`}</div>`).join('')}
      ${spec.tryToggle ? `<div class="labline ${st.tryOn ? '' : 'off'}"><label><input type="checkbox" id="trytg" ${st.tryOn ? 'checked' : ''}> <b>用 try / catch 包起來</b></label><div class="why"><b>做什麼：</b>出錯時不讓程式停住，跳到 catch 去處理。<br><b>為什麼要有：</b>網路可能斷，斷了就會丟出錯誤。${st.tryOn ? '' : '<br><span class="gone">❌ 沒有它 → 一出錯，程式就在那一行停住，後面都不會執行（畫面可能卡在「載入中」）。</span>'}</div></div>` : ''}
      <p><b>目前組出來的程式：</b></p><pre>${esc(code.split('{URL}').join(SCENES[st.scene].url))}</pre>
      <button class="runbtn primary">▶ 執行看看</button><div class="rres">${st.result ? outHtml(st.result) : ''}</div></div>`;
    box.querySelectorAll('input[data-i]').forEach((c) => (c.onchange = () => { st.on[+c.dataset.i] = c.checked; st.result = null; draw(); }));
    box.querySelector('#trytg')?.addEventListener('change', (e) => { st.tryOn = e.target.checked; st.result = null; draw(); });
    box.querySelector('.scn')?.addEventListener('change', (e) => { st.scene = e.target.value; st.result = null; draw(); });
    box.querySelector('.runbtn').onclick = async () => {
      box.querySelector('.rres').innerHTML = '<p class="muted">執行中…</p>';
      st.result = await runSnippet(build(), SCENES[st.scene]);
      box.querySelector('.rres').innerHTML = outHtml(st.result);
    };
  };
  draw();
}

/* ---------- blocks：拼積木 ---------- */
function blocks(box, spec, ok) {
  const order = shuffle(spec.lines.map((_, i) => i));
  let picked = [], passed = false;
  const draw = (msg = '') => {
    box.innerHTML = `<div class="lab"><h4>🧩 ${spec.title}</h4><p class="muted">${spec.intro || '點下面的積木，依序放進「我的程式」。放錯了就點一下那一行拿掉。'}</p>
      <div class="pool">${order.map((i) => `<button class="blk" data-i="${i}" ${picked.includes(i) || passed ? 'disabled' : ''}>${esc(spec.lines[i].code.split('{URL}').join('…網址…'))}</button>`).join('')}</div>
      <p><b>我的程式：</b></p><div class="mine">${picked.length ? picked.map((i, n) => `<div class="mline" data-n="${n}"><span>${n + 1}.</span> <code>${esc(spec.lines[i].code.split('{URL}').join('…網址…'))}</code>${passed ? `<div class="why">${spec.lines[i].what}</div>` : ''}</div>`).join('') : '<p class="muted">（還沒放任何積木）</p>'}</div>
      ${passed ? '' : `<button class="chk primary" ${picked.length === spec.lines.length ? '' : 'disabled'}>檢查順序</button> <button class="clr">清除重來</button>`}<div class="bmsg">${msg}</div><div class="rres"></div></div>`;
    if (passed) return;
    box.querySelectorAll('.blk').forEach((b) => (b.onclick = () => { picked.push(+b.dataset.i); draw(); }));
    box.querySelectorAll('.mline').forEach((m) => (m.onclick = () => { picked.splice(+m.dataset.n, 1); draw(); }));
    box.querySelector('.clr').onclick = () => { picked = []; draw(); };
    box.querySelector('.chk').onclick = async () => {
      const bad = picked.findIndex((v, n) => v !== n);
      if (bad >= 0) { draw(`<p class="fail">❌ 第 ${bad + 1} 行放錯了。提示：這一行應該是「${spec.lines[bad].what}」</p>`); return; }
      passed = true; draw('<p class="ok">✅ 順序正確！下面是這支程式真的執行的結果：</p>');
      const r = await runSnippet(picked.map((i) => spec.lines[i].code).join('\n'), SCENES.ok);
      box.querySelector('.rres').innerHTML = outHtml(r);
      ok?.();
    };
  };
  draw();
}

/* ---------- blanks：選填空 ---------- */
function blanks(box, spec, ok) {
  const pick = spec.blanks.map(() => -1);
  let passed = false;
  const parts = spec.code.split(/⟦(\d+)⟧/);
  const draw = (msg = '') => {
    box.innerHTML = `<div class="lab"><h4>✏️ ${spec.title}</h4><p class="muted">${spec.intro || '每個空格點開選一個答案，選好按「檢查」。'}</p>
      <pre class="blk-code">${parts.map((p, i) => i % 2 === 0 ? esc(p.split('{URL}').join('…網址…')) : `<select data-b="${p - 1}" ${passed ? 'disabled' : ''}><option value="-1">▼ 第 ${p} 格</option>${spec.blanks[p - 1].options.map((o, j) => `<option value="${j}" ${pick[p - 1] === j ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`).join('')}</pre>
      ${passed ? '' : '<button class="chk primary">檢查</button>'}<div class="bmsg">${msg}</div><div class="rres"></div></div>`;
    if (passed) return;
    box.querySelectorAll('select').forEach((s) => (s.onchange = () => { pick[+s.dataset.b] = +s.value; }));
    box.querySelector('.chk').onclick = async () => {
      if (pick.some((p) => p < 0)) return draw('<p class="fail">還有空格沒選喔～</p>');
      const wrong = spec.blanks.map((b, i) => (pick[i] === b.answer ? '' : `<li>第 ${i + 1} 格不對。${b.hint || ''}</li>`)).join('');
      if (wrong) return draw(`<p class="fail">❌ 再想想：</p><ul>${wrong}</ul>`);
      passed = true;
      draw(`<p class="ok">✅ 全對！</p><ul>${spec.blanks.map((b, i) => `<li><code>${esc(b.options[b.answer])}</code>：${b.why}</li>`).join('')}</ul><p>這支程式真的執行的結果：</p>`);
      const code = parts.map((p, i) => (i % 2 === 0 ? p : spec.blanks[p - 1].options[spec.blanks[p - 1].answer])).join('');
      box.querySelector('.rres').innerHTML = outHtml(await runSnippet(code, SCENES.ok));
      ok?.();
    };
  };
  draw();
}

export function mountWidget(box, w, ok) {
  ({ viewer, lab, blocks, blanks })[w.type](box, w, ok);
}
