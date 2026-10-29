import { COMPANIES, COLORS, FONTS, PAGES, REVIEWS, EVENTS, RANKS } from './scenes.js';
import { LEVELS } from './levels.js';
import { mount } from './sandbox.js';
import { runCheck } from './checks.js';
import { specHtml, twHtml, bsHtml } from './spec.js';
import { createEditor } from './editor.js';
import { say, avatar } from './chars.js';
import { store } from './store.js';
import { makeOffice, leaveOffice } from './office.js';
import { STAGE_PHASES, mountStage, leaveStage } from './stage.js';
import { makeCourse } from './course-ui.js';
import { makeWorkday } from './workday.js';
import { loadTS, judge, CHALLENGES } from './ts.js';

const app = document.getElementById('app');
const clamp = (n) => Math.max(0, Math.min(100, n));
const LABEL = { progress: '進度', quality: '品質', stress: '壓力', team: '同事關係' };

const S = {}; // 單一狀態物件，重新開始時原地覆蓋（其他模組才拿得到最新的）
let acts = [];
const reset = () => { for (const k of Object.keys(S)) delete S[k]; Object.assign(S, fresh()); };
const fresh = () => ({
  phase: 'company',
  stats: { progress: 0, quality: 50, stress: 30, team: 50 },
  tokens: { primary: COLORS[0].value, font: FONTS[0].value, radius: 6 },
  tech: { ts: false, tailwind: false },
  levels: [], li: 0, events: [], review: 0, done: [], tsDone: [], ch: null, lunch: false, back: 'company',
  pos: { x: 5, y: 5 }, goal: 'req', pending: [], prog: {}, cur: null,
});


const apply = (fx = {}) => { Object.entries(fx).forEach(([k, v]) => (S.stats[k] = clamp(S.stats[k] + v))); store.set('save', S); };
const go = (phase) => { S.phase = phase; render(); };

// 畫面 = 狀態列 + 內容；acts 存放按鈕的 callback，用 data-a 索引
function screen(html, actions = []) {
  acts = actions;
  const bar = Object.entries(S.stats)
    .map(([k, v]) => `<span class="stat"><b>${LABEL[k]}</b> <i style="--w:${v}%"></i> ${v}</span>`).join('');
  app.innerHTML = `<header>${avatar('me', S.stats.stress > 70 ? 'worried' : 'happy', 36)}${bar}${S.phase === 'office' || S.phase === 'company' ? '' : '<button id="homebtn" class="hm">🏠 回辦公室</button>'}<button id="classbtn" class="rs">🏫 教室（七門課）</button><button id="tsbtn" class="rs2">🧩 TS 練習場</button><button id="restart" class="rs2">🔄 重新開始</button></header><section>${STAGE_PHASES[S.phase] ? '<div id="st3d" class="map map3d mini"></div>' : ''}${html}</section>`;
}
const btn = (label, i, cls = '') => `<button class="${cls}" data-a="${i}">${label}</button>`;
document.addEventListener('click', (e) => {
  if (e.target.id === 'homebtn') { // 任何畫面都能回主畫面（辦公室）；主線中途離開，回來時 ❗ 會指向要去找的人
    const resume = { req: 'req', design: 'design', review: 'design', tech: 'tech', level: 'level', event: 'event', end: 'end' }[S.phase];
    if (resume) S.goal = resume;
    return go('office');
  }
  const side = ['ts', 'tsmenu', 'classroom', 'lesson', 'quiz', 'project']; // 旁支畫面：不覆蓋「回去哪裡」
  if (e.target.id === 'tsbtn' || e.target.id === 'classbtn') {
    if (!side.includes(S.phase)) S.back = S.phase;
    S.lunch = false;
    return go(e.target.id === 'tsbtn' ? 'tsmenu' : 'classroom');
  }
  if (e.target.id === 'restart') return confirm('會清掉所有進度與程式，確定重新開始？') && (store.clear(), reset(), render());
  acts[e.target.closest('[data-a]')?.dataset.a]?.();
});

function choice(html, options, after) {
  screen(`${html}${options.map((o, i) => btn(o.label, i, 'opt')).join('')}`,
    options.map((o) => () => { apply(o.fx); if (o.radius) S.tokens.radius = o.radius; after(); }));
}

const radios = (name, items) => items.map((x, i) =>
  `<label><input type="radio" name="${name}" value="${x.id}" ${i ? '' : 'checked'}> ${x.name}</label>`).join('');
const picked = (name) => document.querySelector(`input[name=${name}]:checked`).value;

const toOffice = (goal) => { S.goal = goal; go('office'); };
const nextLevel = () => (++S.li < S.levels.length ? render() : (S.events = [...EVENTS].sort(() => Math.random() - 0.5).slice(0, 2), go('event')));

const phases = {
  company() {
    screen(`<h1>前端工程師的一天</h1>${say('mate', '新人你好！先選一家公司，今天你就是這裡的前端工程師～想先熱身的話，右上角有 TypeScript 練習場！', 'happy')}` +
      COMPANIES.map((c, i) => `<div class="card ${c.open ? '' : 'lock'}"><h3>${c.name}</h3><p>${c.desc}</p>${c.open ? btn('進入公司', i) : ''}</div>`).join(''),
      COMPANIES.map((c) => () => c.open && toOffice('req')));
  },
  req() {
    screen(`<h2>早上 9:30 需求會議</h2>${say('pm', '這個 sprint 我們要做訂票網站，你覺得要先做哪些頁面？（至少選一個，做越多越花時間，但進度越高）', 'happy')}` +
      PAGES.map((p) => `<label><input type="checkbox" value="${p.id}" checked> ${p.name}</label>`).join('') + btn('決定了', 0, 'primary'),
      [() => {
        S.levels = PAGES.filter((p) => document.querySelector(`input[value=${p.id}]`).checked).map((p) => p.id);
        if (!S.levels.length) return alert('至少選一個頁面');
        apply({ stress: S.levels.length * 5 });
        toOffice('design');
      }]);
  },
  design() {
    screen(`<h2>跟設計師討論風格</h2>${say('designer', '主色和字體你有偏好嗎？', 'happy')}<h4>主色</h4>${radios('color', COLORS)}<h4>字體</h4>${radios('font', FONTS)}${btn('請她出設計圖', 0, 'primary')}`,
      [() => {
        S.tokens.primary = COLORS.find((c) => c.id === picked('color')).value;
        S.tokens.font = FONTS.find((f) => f.id === picked('font')).value;
        go('review');
      }]);
  },
  review() {
    const r = REVIEWS[S.review];
    const t = S.tokens;
    const mock = `<div class="mock" style="font-family:${t.font}"><b>熱門活動・設計稿 ${S.review + 1}</b><p>星光巡迴演唱會 · NT$ 3800</p><span style="background:${t.primary};border-radius:${t.radius}px">立即購票</span></div>`;
    choice(mock + say(r.who, r.text, r.mood), r.options, () => (++S.review < REVIEWS.length ? render() : toOffice('tech')));
  },
  tech() {
    screen(`<h2>技術選擇</h2>${say('lead', '框架是 React。語言和樣式你想怎麼做？', 'happy')}
      <label><input type="checkbox" id="ts"> 用 TypeScript（預覽只轉譯，不檢查型別）</label>
      <h4>樣式方案</h4>
      <label><input type="radio" name="fw" value="" checked> 純 CSS（只用 styles.css）</label>
      <label><input type="radio" name="fw" value="tailwind"> Tailwind（直接在 className 寫小 class；實作時有速查）</label>
      <label><input type="radio" name="fw" value="bootstrap"> Bootstrap（現成元件 class，如 btn、form-control；實作時有速查）</label>${btn('開始實作', 0, 'primary')}`,
      [() => { const fw = picked('fw'); S.tech = { ts: ts.checked, tailwind: fw === 'tailwind', bootstrap: fw === 'bootstrap' }; toOffice('level'); }]);
  },
  level() {
    const lv = LEVELS.find((l) => l.id === S.levels[S.li]);
    let tries = 0, peeked = false, passed = S.done.includes(lv.id), jsx, cssEd;
    const next = () => btn(S.li + 1 < S.levels.length ? '下一頁' : '準備上線', 3, 'primary');
    screen(`<div class="split"><div class="side"><h2>${S.li + 1}/${S.levels.length} ${lv.title}</h2><p class="ticket">${lv.ticket}</p>
      <details><summary>提示</summary><div class="hint">${lv.hint}</div></details>
      <p class="tip">💡 打字會跳出建議，<kbd>Tab</kbd> 接受並跳到下一格；程式自動存檔。</p>
      ${btn('提交給 QA', 0, 'primary')} ${btn('看參考解答（品質 -8）', 1)} ${btn('重置', 2)}<div id="qa"></div></div>
      <div class="work"><div class="ed"><div class="tabs"><button id="tjsx" class="on">App.jsx</button><button id="tcss">styles.css</button></div>
      <div id="edbox"></div></div>
      <div class="cmp"><figure><figcaption class="tabs"><button id="dview" class="on">🎨 設計稿</button><button id="dspec">📐 規格</button><button id="dtw" ${S.tech.tailwind || S.tech.bootstrap ? '' : 'hidden'}>${S.tech.bootstrap ? '🅱 Bootstrap 對照' : '🌬 Tailwind 對照'}</button></figcaption><iframe id="ds"></iframe><div id="spec" hidden></div><div id="twpane" hidden></div></figure>
      <figure><figcaption>🛠 你的成果（即時預覽）</figcaption><iframe id="pv"></iframe></figure></div></div></div>`, [
      async () => {
        if (!jsx) return;
        tries++;
        const fails = await runCheck(lv.id, pv, S.tokens);
        qa.innerHTML = fails.length
          ? `<ul class="fail">${fails.map((f) => `<li>${f.replace(/</g, '&lt;')}</li>`).join('')}</ul>`
          : `<p class="ok">✅ QA 通過！</p>${next()}`;
        if (fails.length) return passed || apply({ stress: 3 });
        if (passed) return;
        passed = true;
        S.done.push(lv.id);
        apply({ progress: Math.floor(70 / S.levels.length), quality: peeked ? 0 : Math.max(8 - 3 * (tries - 1), 0) });
      },
      () => { if (confirm('看解答會扣品質，確定嗎？')) { peeked = true; apply({ quality: -8 }); fill('solution'); } },
      () => confirm('重置會清掉你寫的程式，確定嗎？') && fill('starter'),
      () => { // 過關後：午休，同事帶來對應的 TS 小挑戰（可跳過）
        const ch = CHALLENGES.find((c) => c.after === lv.id && !S.tsDone.includes(c.id));
        if (!ch) return nextLevel();
        S.ch = ch.id; S.lunch = true;
        go('ts');
      },
    ]);
    const key = 'code-' + lv.id;
    const preview = () => mount(pv, { code: jsx.value, css: cssEd.value, tech: S.tech });
    let timer;
    const changed = () => { // 停手 0.7 秒後：存檔 + 更新預覽
      clearTimeout(timer);
      timer = setTimeout(() => { store.set(key, { jsx: jsx.value, css: cssEd.value }); preview(); }, 700);
    };
    const fill = (kind) => { jsx.value = lv[kind + 'Jsx'](S.tokens); cssEd.value = lv[kind + 'Css'](S.tokens); };
    const group = (pairs) => pairs.forEach(([b]) => (b.onclick = () => pairs.forEach(([b2, el]) => {
      el.hidden = b2 !== b;
      b2.className = b2 === b ? 'on' : '';
    })));
    group([[dview, ds], [dspec, spec], [dtw, twpane]]);
    spec.innerHTML = specHtml(lv, S.tokens);
    twpane.innerHTML = S.tech.bootstrap ? bsHtml(lv) : twHtml(lv);
    if (passed) qa.innerHTML = `<p class="ok">✅ 這一頁已通過</p>${next()}`;
    // 設計稿 = 參考解答的畫面（程式碼不顯示）
    mount(ds, { code: lv.solutionJsx(S.tokens), css: lv.solutionCss(S.tokens), tech: { ts: false, tailwind: false } });
    (async () => {
      jsx = await createEditor(edbox, { lang: 'jsx', onInput: changed });
      cssEd = await createEditor(edbox, { lang: 'css', onInput: changed });
      cssEd.el.hidden = true;
      group([[tjsx, jsx.el], [tcss, cssEd.el]]);
      const saved = store.get(key);
      if (saved) { jsx.value = saved.jsx; cssEd.value = saved.css; } else fill('starter');
    })();
  },
  tsmenu() {
    screen(`<h1>🧩 TypeScript 練習場</h1>${say('mate', '每題都是一小段有紅線的 TypeScript，修到沒有紅線就過關！編譯器是真的喔。', 'happy')}` +
      CHALLENGES.map((c, i) => `<div class="card"><h3>${S.tsDone.includes(c.id) ? '✅' : '🔲'} ${c.title}</h3>${btn('挑戰', i)}</div>`).join('') + btn('← 返回', CHALLENGES.length),
      [...CHALLENGES.map((c) => () => { S.ch = c.id; S.lunch = false; go('ts'); }), () => go(S.back || 'company')]);
  },
  ts() {
    const ch = CHALLENGES.find((c) => c.id === S.ch);
    const key = 'ts-' + ch.id;
    let ed, ts, timer, won = S.tsDone.includes(ch.id);
    const leave = () => (S.lunch ? nextLevel() : go(S.back || 'company'));
    const run = () => {
      if (!ts || !ed) return;
      const bad = judge(ts, ch, ed.value);
      tsres.innerHTML = bad.length
        ? `<p class="fail">🔴 還有 ${bad.length} 個問題</p><ul class="fail">${bad.map((m) => `<li>${m.replace(/</g, '&lt;')}</li>`).join('')}</ul>`
        : `<p class="ok">🎉 沒有紅線了！</p>${btn(S.lunch ? '吃飯去，回去工作' : '完成', 3, 'primary')}`;
      if (!bad.length && !won) { won = true; S.tsDone.push(ch.id); apply({ quality: 5, stress: -8 }); }
    };
    screen(`<div class="split"><div class="side">${say(S.lunch ? 'mate' : 'lead', ch.brief, 'happy')}
      <details open><summary>提示</summary><div class="hint">${ch.hint}</div></details><div id="tsres"><p>載入 TypeScript 編譯器中…</p></div>
      ${btn('重置', 0)} ${btn(S.lunch ? '先跳過，趕進度' : '← 返回', 1)}</div>
      <div class="work1"><div id="tsbox"></div></div></div>`,
      [() => { if (confirm('重置會清掉你寫的程式，確定嗎？')) { ed.value = ch.starter; } }, leave, null, leave]);
    (async () => {
      ed = await createEditor(tsbox, { lang: 'ts', onInput: () => { clearTimeout(timer); timer = setTimeout(() => { store.set(key, ed.value); run(); }, 500); } });
      ed.value = store.get(key) ?? ch.starter;
      try { ts = await loadTS(); run(); } catch (e) { tsres.innerHTML = `<p class="fail">${e.message}</p>`; }
    })();
  },
  event() {
    const ev = S.events[0];
    if (!ev) return go('end');
    choice(`<h2>突發事件</h2>${say(ev.who, ev.text, ev.mood)}`, ev.options, () => { S.events.shift(); go('event'); });
  },
  end() {
    const s = S.stats;
    const score = s.progress * 0.4 + s.quality * 0.3 + s.team * 0.2 + (100 - s.stress) * 0.1;
    const [, title, text] = RANKS.find(([min]) => score >= min);
    screen(`<h1>下班了 🌙</h1>${say('me', `${title}　${text}`, score >= 65 ? 'happy' : score >= 40 ? 'normal' : 'worried')}<p>總分 ${Math.round(score)}</p>${btn('再玩一次', 0, 'primary')}`, [() => { store.clear(); reset(); render(); }]);
  },
};

const ctx = { S, screen, btn, apply, go, say, store };
const extra = { office: makeOffice(ctx), ...makeCourse(ctx), ...makeWorkday(ctx) };
const render = () => {
  store.set('save', S);
  leaveOffice();
  leaveStage();
  (phases[S.phase] || extra[S.phase])();
  mountStage(S);
};
Object.assign(S, fresh(), store.get('save') || {});
render();
