// 練習引擎：'ts' = 修紅線（真 TypeScript 編譯器）；'tw' = 寫 Tailwind class（和目標畫面比對實際樣式）
import { createEditor } from './editor.js';
import { loadTS, judge } from './ts.js';
import { store } from './store.js';
import { buildSrcdoc } from './sandbox.js';
import { makeCtx } from './checks.js';

const TWCDN = 'https://cdn.tailwindcss.com/3.4.16';
export const twDoc = (html) => `<!doctype html><meta charset="utf-8"><script src="${TWCDN}"></script><body style="margin:0;padding:12px;font-family:sans-serif">${html}</body>`;
// 載入後再等一下，讓 Tailwind 把用到的 class 轉成 CSS
export const mountTw = (frame, html) => new Promise((res) => { frame.onload = () => setTimeout(res, 600); frame.srcdoc = twDoc(html); });

const NAME = {
  'font-size': '字級', 'font-weight': '粗細', 'padding-left': '左內距', 'padding-top': '上內距', 'margin-top': '上外距', 'margin-bottom': '下外距',
  width: '寬度', height: '高度', color: '文字顏色', 'background-color': '背景色', 'border-top-width': '邊框粗細', 'border-top-color': '邊框顏色',
  'border-top-left-radius': '圓角', display: '排版方式', 'column-gap': '欄間距', 'row-gap': '列間距', 'grid-template-columns': '欄數', 'flex-direction': '排列方向',
};

// 比對兩個預覽裡的元素樣式；回傳不一致的訊息
export function compareTw(mine, target, checks) {
  const fails = [];
  const cs = (f, el) => f.contentWindow.getComputedStyle(el);
  for (const { sel, props } of checks) {
    const a = mine.contentDocument.querySelector(sel), b = target.contentDocument.querySelector(sel);
    if (!a || !b) { fails.push(`找不到元素 ${sel}（不要刪掉 id）`); continue; }
    for (const p of props) {
      const want = cs(target, b).getPropertyValue(p), got = cs(mine, a).getPropertyValue(p);
      if (want !== got) fails.push(`${sel}　${NAME[p] || p}：目標是 ${want}，你的是 ${got}`);
    }
  }
  return fails;
}

// React / Vue：把玩家的程式放進預覽頁，再用「真的操作畫面」的測試檢查（點按鈕、輸入文字）
const VUECDN = 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.38/vue.global.js';
const vueDoc = (code) => `<!doctype html><meta charset="utf-8"><script src="${VUECDN}"></script><script>window.__error = null; addEventListener('error', (e) => { window.__error = e.message; });</script><body style="margin:0;padding:12px;font-family:sans-serif">${code}</body>`;
export const mountLive = (frame, kind, code) => new Promise((res) => {
  frame.onload = () => setTimeout(res, 900);
  frame.srcdoc = kind === 'react' ? buildSrcdoc({ code, css: '', tech: { ts: false, tailwind: false } }) : vueDoc(code);
});
export async function runLive(frame, ex) {
  const w = frame.contentWindow;
  if (w.__error) return [`程式錯誤：${w.__error}`];
  try { return await ex.test(makeCtx(frame, {})); } catch (e) { return [`檢查時出錯（通常是缺少必要元素）：${e.message}`]; }
}

// 工具列：送出檢查（醒目）／重置／看解答。onCheck 為檢查；solution 為解答文字（沒有就不顯示「看解答」）
const BAR = (ans) => `<div class="exbar"><button class="chk primary big">✅ 送出檢查</button><button class="rst">↺ 重置成起始內容</button>${ans ? '<button class="ans">👀 看解答</button>' : ''}</div>`;
function wireBar(box, { getEd, starter, solution, onCheck }) {
  box.querySelector('.chk').onclick = onCheck;
  box.querySelector('.rst').onclick = () => { if (confirm('重置會清掉你寫的內容，確定嗎？')) getEd().value = starter; };
  const ans = box.querySelector('.ans');
  if (ans) ans.onclick = () => { if (confirm('看了解答就比較學不到東西，確定要看嗎？')) getEd().value = solution; };
}

const esc = (m) => String(m).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const list = (fails) => `<p class="fail">🔴 還有 ${fails.length} 個地方不一樣</p><ul class="fail">${fails.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>`;
const solved = (extra = '') => `<p class="ok">🎉 完成！${extra}</p>`;

// 在 box 裡建立練習；通過時呼叫 onPass()（只會呼叫一次）
export function exercise(box, ex, { key, onPass }) {
  let passed = false, timer;
  const pass = () => { if (!passed) { passed = true; onPass(); } };
  const saved = store.get(key);

  if (ex.kind === 'ts') {
    box.innerHTML = `<div class="exed"></div>${BAR(false)}<div class="exres"><p>載入 TypeScript 編譯器中…</p></div>`;
    const res = box.querySelector('.exres');
    let ed, ts;
    const run = () => {
      if (!ed || !ts) return;
      const bad = judge(ts, ex, ed.value);
      res.innerHTML = bad.length ? list(bad) : solved();
      if (!bad.length) pass();
    };
    (async () => {
      ed = await createEditor(box.querySelector('.exed'), { lang: 'ts', onInput: () => { clearTimeout(timer); timer = setTimeout(() => { store.set(key, ed.value); run(); }, 500); } });
      ed.value = saved ?? ex.starter;
      wireBar(box, { getEd: () => ed, starter: ex.starter, onCheck: run });
      try { ts = await loadTS(); run(); } catch (e) { res.innerHTML = `<p class="fail">${esc(e.message)}</p>`; }
    })();
    return;
  }

  if (ex.kind === 'react' || ex.kind === 'vue') {
    box.innerHTML = `<div class="exed"></div>${BAR(true)}
      <div class="cmp"><figure><figcaption>🎯 目標（參考解答的畫面）</figcaption><iframe class="tgt"></iframe></figure>
      <figure><figcaption>🛠 你的成果</figcaption><iframe class="mine"></iframe></figure></div>
      <div class="exres"></div>`;
    const tgt = box.querySelector('.tgt'), mine = box.querySelector('.mine'), res = box.querySelector('.exres');
    let ed;
    mountLive(tgt, ex.kind, ex.solution);
    const onCheck = async () => {
      if (!ed) return;
      res.innerHTML = '<p>檢查中…</p>';
      await mountLive(mine, ex.kind, ed.value);
      const fails = [...(ex.must || []).filter((m) => !m.re.test(ed.value)).map((m) => m.msg), ...(await runLive(mine, ex))];
      res.innerHTML = fails.length ? list(fails) : solved();
      if (!fails.length) pass();
    };
    (async () => {
      ed = await createEditor(box.querySelector('.exed'), { lang: ex.kind === 'react' ? 'jsx' : 'html', onInput: () => { clearTimeout(timer); timer = setTimeout(() => { store.set(key, ed.value); mountLive(mine, ex.kind, ed.value); }, 900); } });
      ed.value = saved ?? ex.starter;
      wireBar(box, { getEd: () => ed, starter: ex.starter, solution: ex.solution, onCheck });
      mountLive(mine, ex.kind, ed.value);
    })();
    return;
  }

  // Tailwind：上面編輯 HTML，下面左「目標」右「你的」
  const startHtml = ex.build({});
  box.innerHTML = `<div class="exed"></div>${BAR(true)}
    <div class="cmp"><figure><figcaption>🎯 目標</figcaption><iframe class="tgt"></iframe></figure>
    <figure><figcaption>🛠 你的成果</figcaption><iframe class="mine"></iframe></figure></div>
    <div class="exres"></div>`;
  const tgt = box.querySelector('.tgt'), mine = box.querySelector('.mine'), res = box.querySelector('.exres');
  let ed;
  mountTw(tgt, ex.build(ex.solution));
  const check = async () => {
    if (!ed) return;
    res.innerHTML = '<p>檢查中…</p>';
    await mountTw(mine, ed.value);
    const fails = [...ex.must?.filter((m) => !m.re.test(ed.value)).map((m) => m.msg) ?? [], ...compareTw(mine, tgt, ex.checks)];
    res.innerHTML = fails.length ? list(fails) : solved();
    if (!fails.length) pass();
  };
  (async () => {
    ed = await createEditor(box.querySelector('.exed'), { lang: 'html', onInput: () => { clearTimeout(timer); timer = setTimeout(() => { store.set(key, ed.value); mountTw(mine, ed.value); }, 700); } });
    ed.value = saved ?? startHtml;
    wireBar(box, { getEd: () => ed, starter: startHtml, solution: ex.build(ex.solution), onCheck: check });
    mountTw(mine, ed.value);
  })();
}
