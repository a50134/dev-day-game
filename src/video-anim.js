// 影片式教學的「概念動畫」。每個動畫是 (容器, { alive, speed }) => 清除函式，會一直循環播放到離開這一步。
// 用法：step.anim = '名稱'（見最下面 ANIMS）；找不到名稱時，播放器會退回顯示 step.slide 的大字卡。
const CSS = `
.an{padding:14px;min-height:300px;display:flex;flex-direction:column;gap:10px;font-size:13px;color:var(--fg)}
.an h4{margin:0;font-size:13px;opacity:.7;font-weight:600}
.an .row{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch}
.an .grow{flex:1;min-width:150px}
.an .code{background:#1e1e1e;color:#ddd;border-radius:10px;padding:10px;font:12px/1.7 ui-monospace,Consolas,monospace;white-space:pre-wrap;word-break:break-all}
.an .tok{padding:0 3px;border-radius:3px;transition:background .3s,color .3s}
.an .tok.hl{background:#f5d142;color:#222}
.an .rule{opacity:0;transform:translateX(-8px);transition:all .4s}.an .rule.on{opacity:1;transform:none}
.an .card{background:#fff;color:#222;border:1px solid var(--line);border-radius:10px;padding:10px}
.an .chip{display:inline-block;padding:3px 10px;border-radius:999px;font:12px ui-monospace,Consolas,monospace;background:var(--line);color:var(--fg);transition:all .3s}
.an .chip.on{background:var(--accent);color:#fff}
.an .pop{opacity:0;transform:scale(.8);transition:all .4s}.an .pop.on{opacity:1;transform:none}
.an .note{margin:0;font-size:12px;opacity:.8;min-height:1.6em}
.an .btn{display:inline-flex;align-items:center;gap:4px;padding:8px 20px;margin:0;font-size:14px;transition:all .25s;cursor:default;border:0;border-radius:0}
.an .ptr{position:absolute;font-size:22px;transition:all .6s;z-index:3;pointer-events:none}
.an .stage{position:relative}
.an .rs-bar{display:flex;align-items:center;gap:10px}
.an .rs-track{position:relative;flex:1;height:8px;background:var(--line);border-radius:4px}
.an .rs-knob{position:absolute;top:-4px;width:16px;height:16px;border-radius:50%;background:var(--accent);margin-left:-8px}
.an .rs-mk{position:absolute;top:-18px;font-size:10px;transform:translateX(-50%);opacity:.8;white-space:nowrap}
.an .rs-mk::after{content:"";position:absolute;left:50%;top:14px;width:1px;height:12px;background:var(--fg);opacity:.5}
.an .rs-frame{margin:0 auto;border:2px solid #bbb;border-radius:8px;background:#fff;color:#222;overflow:hidden;min-height:130px}
.an .node{border:2px solid var(--line);background:var(--card);border-radius:10px;padding:6px 12px;text-align:center;transition:all .3s}
.an .node.on{border-color:var(--accent);box-shadow:0 0 0 3px rgba(255,111,145,.25)}
.an .arr{text-align:center;opacity:.5;line-height:1}
@keyframes an-pulse{50%{transform:scale(1.25)}}
.an .pulse{animation:an-pulse .5s}
`;
if (typeof document !== 'undefined' && !document.getElementById('an-css')) {
  const st = document.createElement('style'); st.id = 'an-css'; st.textContent = CSS; document.head.append(st);
}

const G = '#1d6617', G100 = '#598e71', G80 = '#e3efe8';
const mount = (box, html) => { box.innerHTML = '<div class="an">' + html + '</div>'; return box.firstChild; };
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

// 時間軸：body(w) 跑完一輪就從頭再來；離開這一步（alive 變 false 或呼叫清除函式）就停。
function timeline(alive, speed, body) {
  let on = true; const STOP = Symbol('stop');
  const w = (ms) => new Promise((ok, no) => setTimeout(() => (on && alive() ? ok() : no(STOP)), ms / (speed || 1)));
  (async () => { try { for (;;) await body(w); } catch (e) { if (e !== STOP) console.error(e); } })();
  return () => { on = false; };
}

// 視窗縮放模擬：寬度在 min～max 之間來回，render(w) 回傳 { html, hint }
function resizeSim(box, { alive, speed }, o) {
  const pct = (w) => ((w - o.min) / (o.max - o.min)) * 100;
  const root = mount(box, `<h4>${o.title}</h4><div style="padding-top:18px"><div class="rs-bar"><div class="rs-track"><div class="rs-knob"></div>${o.markers.map((m) => `<span class="rs-mk" style="left:${pct(m.w)}%">${m.label}</span>`).join('')}</div><b class="rs-w" style="min-width:64px;text-align:right"></b></div></div><div class="rs-frame"><div class="rs-in"></div></div><p class="note"></p>`);
  const [knob, wl, frame, inner, note] = ['.rs-knob', '.rs-w', '.rs-frame', '.rs-in', '.note'].map((q) => root.querySelector(q));
  const set = (w) => {
    knob.style.left = pct(w) + '%'; wl.textContent = Math.round(w) + ' px';
    frame.style.width = Math.max(28, ((w / o.max) * 100)) + '%';
    const r = o.render(w); inner.innerHTML = r.html; note.innerHTML = r.hint;
  };
  return timeline(alive, speed, async (wait) => {
    for (let t = 0; t <= 100; t++) { set(o.min + (o.max - o.min) * (0.5 - 0.5 * Math.cos((t / 100) * Math.PI * 2))); await wait(60); }
  });
}

// ───────────────────────── 動畫們 ─────────────────────────
const ANIMS = {
  // 第 2 部：Tailwind 看你寫的 class，只產生用到的 CSS
  classToCss(box, ctx) {
    const items = [['text-3xl', 'font-size: 1.875rem;', 'font-size:30px'], ['font-bold', 'font-weight: 700;', 'font-weight:700'], ['text-red-500', 'color: #fb2c36;', 'color:#ef4444']];
    const root = mount(box, `<h4>Tailwind 的工作：看你寫了哪些 class → 只產生那幾條 CSS</h4>
      <div class="row"><div class="code grow">&lt;h1 class="<span class="tok" data-i="0">text-3xl</span> <span class="tok" data-i="1">font-bold</span> <span class="tok" data-i="2">text-red-500</span>"&gt;<br>　I need this<br>&lt;/h1&gt;</div>
      <div class="code grow">${items.map((it, i) => `<div class="rule" data-r="${i}">.${it[0]} { ${it[1]} }</div>`).join('')}</div></div>
      <div class="card" style="font-family:serif;font-size:14px"><span class="pv">I need this</span></div><p class="note">沒用到的 class（例如 text-sm）不會被產生，所以網站的 CSS 很小。</p>`);
    const pv = root.querySelector('.pv');
    return timeline(ctx.alive, ctx.speed, async (wait) => {
      root.querySelectorAll('.tok').forEach((t) => t.classList.remove('hl')); root.querySelectorAll('.rule').forEach((t) => t.classList.remove('on')); pv.removeAttribute('style');
      await wait(700);
      for (let i = 0; i < items.length; i++) {
        root.querySelector(`.tok[data-i="${i}"]`).classList.add('hl'); await wait(500);
        root.querySelector(`.rule[data-r="${i}"]`).classList.add('on'); pv.style.cssText += ';' + items[i][2]; await wait(900);
        root.querySelector(`.tok[data-i="${i}"]`).classList.remove('hl');
      }
      await wait(2200);
    });
  },

  // 第 3 部：@theme 的一個變數，自動變出一整組 class
  themeMap(box, ctx) {
    const root = mount(box, `<h4>@theme 裡寫一個變數 → Tailwind 自動變出 class</h4>
      <div class="code" style="text-align:center;font-size:14px">--color-<span class="tok hl">primary-dark</span>: <span class="hex" style="color:#8fdc84">#1d6617</span>;</div>
      <div class="arr">⬇️ ⬇️ ⬇️</div>
      <div class="row" style="justify-content:center">
        <div class="pop" data-p="0"><span class="chip on" style="background:${G}">bg-primary-dark</span><div class="sw" style="height:36px;margin-top:6px;border-radius:6px;background:${G}"></div></div>
        <div class="pop" data-p="1"><span class="chip on" style="background:${G}">text-primary-dark</span><div style="margin-top:6px;font:700 20px serif;color:${G}">好看的字</div></div>
        <div class="pop" data-p="2"><span class="chip on" style="background:${G}">border-primary-dark</span><div style="height:36px;margin-top:6px;border-radius:6px;border:3px solid ${G}"></div></div></div>
      <p class="note"></p>`);
    const note = root.querySelector('.note'), hex = root.querySelector('.hex');
    const paint = (c) => { hex.textContent = c; root.querySelectorAll('.chip.on').forEach((e) => (e.style.background = c)); root.querySelector('.sw').style.background = c; root.querySelector('[data-p="1"] div').style.color = c; root.querySelector('[data-p="2"] div').style.borderColor = c; };
    return timeline(ctx.alive, ctx.speed, async (wait) => {
      root.querySelectorAll('.pop').forEach((p) => p.classList.remove('on')); paint('#1d6617'); note.textContent = '';
      await wait(800);
      for (let i = 0; i < 3; i++) { root.querySelector(`[data-p="${i}"]`).classList.add('on'); await wait(600); }
      note.textContent = '想換顏色？只要改 @theme 這一個地方……'; await wait(1400);
      paint('#598e71'); note.textContent = '……全站所有用到 primary-dark 的地方，一起變了。'; await wait(2600);
    });
  },

  // 第 4 部：手機優先，到 768px 字級跳一級
  typeResize(box, ctx) {
    return resizeSim(box, ctx, {
      title: '視窗寬度改變時，h1 的字級怎麼變？', min: 375, max: 1100, markers: [{ w: 768, label: 'md 768' }],
      render: (w) => ({ html: `<div style="padding:12px 16px"><div style="font-family:serif;font-weight:700;line-height:1.2;font-size:${w >= 768 ? 28 : 19}px;transition:font-size .2s">生活小物的靜謐時光</div></div>`,
        hint: w >= 768 ? '≥ 768px：桌面字級 <b>48px</b>（@media min-width: 48rem 生效）' : '< 768px：手機字級 <b>32px</b>（預設值）' }),
    });
  },

  // 第 5 部：按鈕的三種狀態
  btnStates(box, ctx) {
    const root = mount(box, `<h4>按鈕的狀態：default → hover → active</h4>
      <div class="stage" style="min-height:120px"><div class="row" style="gap:30px;justify-content:center;padding-top:26px">
        <div style="text-align:center"><button class="btn b-fill" style="background:${G};color:#fff">看看商品</button><div class="note" style="margin-top:6px">fill 實心</div></div>
        <div style="text-align:center"><button class="btn b-un" style="color:${G};background:transparent">看看商品</button><div class="note" style="margin-top:6px">unfill 空心</div></div></div>
        <span class="ptr" style="left:20%;top:100px">🖱️</span></div>
      <div class="row" style="justify-content:center"><span class="chip st">default</span></div><p class="note nt" style="text-align:center"></p>`);
    const [fill, un, ptr, st, note] = ['.b-fill', '.b-un', '.ptr', '.st', '.nt'].map((q) => root.querySelector(q));
    const look = (state) => {
      const f = { default: [G, '#fff', 'transparent'], hover: ['transparent', G100, 'transparent'], active: [G80, G, 'transparent'] }[state];
      fill.style.background = f[0]; fill.style.color = f[1];
      const u = { default: ['transparent', G], hover: ['transparent', G100], active: [G80, G] }[state];
      un.style.background = u[0]; un.style.color = u[1];
      st.textContent = state; st.className = 'chip st' + (state === 'default' ? '' : ' on');
      note.textContent = { default: 'bg-primary-dark text-white', hover: 'hover:bg-transparent hover:text-primary-100', active: 'active:bg-primary-80 active:text-primary-dark' }[state];
    };
    return timeline(ctx.alive, ctx.speed, async (wait) => {
      look('default'); ptr.style.left = '78%'; ptr.style.top = '100px'; await wait(1300);
      ptr.style.left = '33%'; ptr.style.top = '52px'; await wait(700); look('hover'); await wait(1500);
      ptr.style.transform = 'scale(.8)'; look('active'); await wait(1100); ptr.style.transform = '';
      ptr.style.left = '60%'; ptr.style.top = '52px'; await wait(700); look('hover'); await wait(1200);
    });
  },

  // 第 5 部：TypeScript 幫你抓錯
  tsError(box, ctx) {
    const root = mount(box, `<h4>TypeScript：還沒打開瀏覽器就知道錯了</h4>
      <div class="code" style="font-size:13px">&lt;Button variant="<span class="v" style="padding:0 2px">fill</span>"&gt;看看商品&lt;/Button&gt;</div>
      <div class="code pop err" style="background:#3b1d1d;color:#ffb4b4">❌ Type '"blue"' is not assignable to type 'Variant | undefined'.</div>
      <p class="note">variant 只能是 <b>"fill"</b> 或 <b>"unfill"</b>，寫別的，編輯器馬上用紅線提醒你。</p>`);
    const v = root.querySelector('.v'), err = root.querySelector('.err');
    return timeline(ctx.alive, ctx.speed, async (wait) => {
      v.textContent = 'fill'; v.style.cssText = 'padding:0 2px'; err.classList.remove('on'); await wait(1200);
      for (const t of ['fil', 'fi', 'f', '', 'b', 'bl', 'blu', 'blue']) { v.textContent = t; await wait(260); }
      v.style.cssText = 'padding:0 2px;text-decoration:underline wavy #ff5c5c;text-underline-offset:3px'; await wait(500);
      err.classList.add('on'); await wait(3600);
    });
  },

  // 第 6 部：hidden lg:flex ── 桌面顯示、手機隱藏
  responsiveNav(box, ctx) {
    return resizeSim(box, ctx, {
      title: '導覽列：hidden lg:flex（手機先隱藏，≥1024px 才顯示）', min: 375, max: 1280, markers: [{ w: 1024, label: 'lg 1024' }],
      render: (w) => {
        const desk = w >= 1024;
        return { html: `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;box-shadow:0 1px 4px rgba(0,0,0,.15)"><span style="font-family:serif;color:${G100};font-size:16px">I need this</span>${desk ? `<span style="display:flex;gap:14px;align-items:center;font-size:12px"><span>輸入商品名稱 🔍</span><span>品牌介紹</span><span>所有商品</span><span>🛒</span><span style="background:${G};color:#fff;padding:6px 10px">註冊 / 登入</span></span>` : '<span style="font-size:18px">🔍 ☰</span>'}</div>`,
          hint: desk ? '<b>lg:flex</b> 生效 → 右邊整排連結顯示出來' : '<b>hidden</b> → 右邊整排隱藏，改顯示搜尋和選單圖示（lg:hidden）' };
      },
    });
  },

  // 第 6 部：Tailwind 的數字 × 4px
  spacing(box, ctx) {
    const rows = [['h-1', 1], ['h-4', 4], ['h-18', 18], ['h-22', 22], ['h-185', 185]];
    const root = mount(box, `<h4>Tailwind 的數字：1 單位 ＝ 4px</h4><div class="stage">${rows.map(([c, n], i) => `<div class="row" style="align-items:center;margin:5px 0"><span class="chip on" style="min-width:64px;text-align:center">${c}</span><div class="bar" data-i="${i}" style="height:14px;width:0;background:${G100};border-radius:3px;transition:width .8s"></div><b class="v" data-i="${i}" style="opacity:0;transition:opacity .4s"></b></div>`).join('')}</div><p class="note">h-18 ＝ 72px（手機導覽列）、h-22 ＝ 88px（桌面導覽列）、h-185 ＝ 740px（Hero 高度）</p>`);
    const maxW = 260;
    return timeline(ctx.alive, ctx.speed, async (wait) => {
      root.querySelectorAll('.bar').forEach((b) => (b.style.width = '0')); root.querySelectorAll('.v').forEach((v) => (v.style.opacity = 0)); await wait(600);
      for (let i = 0; i < rows.length; i++) {
        const [, n] = rows[i], bar = root.querySelector(`.bar[data-i="${i}"]`), v = root.querySelector(`.v[data-i="${i}"]`);
        bar.style.width = Math.max(4, (n / 185) * maxW) + 'px'; v.textContent = n + ' × 4 = ' + n * 4 + 'px'; v.style.opacity = 1; await wait(900);
      }
      await wait(2500);
    });
  },

  // 第 7 部：輪播 ＝ current 數字在 0、1、2 之間輪流
  heroCarousel(box, ctx) {
    const slides = [['生活小物的靜謐時光', '#c9bfb1'], ['仲夏香氛特調節', '#a9c4a0'], ['來自大自然的香氣防護', '#9bb7c4']];
    const root = mount(box, `<h4>輪播：用 current 記住現在是第幾張</h4><div class="stage card" style="height:130px;padding:0;overflow:hidden">${slides.map(([t, c], i) => `<div class="sl" data-i="${i}" style="position:absolute;inset:0;background:${c};display:flex;align-items:center;padding-left:18px;opacity:${i ? 0 : 1};transition:opacity .7s"><span style="background:rgba(87,87,87,.4);color:#fff;padding:10px 16px;font:700 16px serif">${t}</span></div>`).join('')}
      <div style="position:absolute;left:0;right:0;bottom:8px;display:flex;justify-content:center;gap:8px">${slides.map((_, i) => `<i class="dt" data-i="${i}" style="width:28px;height:6px;border-radius:3px;background:#e8e8e8;transition:background .3s"></i>`).join('')}</div></div>
      <div class="code" style="font-size:12px">setCurrent((n) =&gt; (n + 1) % 3)　<b class="cur" style="color:#f5d142"></b></div><p class="note">每 5 秒 current ＋ 1，到最後一張再回到第 0 張；換頁時 useEffect 會先清掉舊的計時器。</p>`);
    const set = (i, prev) => {
      root.querySelectorAll('.sl').forEach((s, k) => (s.style.opacity = k === i ? 1 : 0)); root.querySelectorAll('.dt').forEach((d, k) => (d.style.background = k === i ? G100 : '#e8e8e8'));
      root.querySelector('.cur').textContent = prev == null ? '// current = ' + i : `// ${prev} → ${i}`;
    };
    return timeline(ctx.alive, ctx.speed, async (wait) => { set(0); await wait(1800); set(1, 0); await wait(1800); set(2, 1); await wait(1800); set(0, 2); await wait(1800); });
  },

  // 第 8 部：flex-col → md:flex-row，還有 reverse
  flexFlip(box, ctx) {
    const blk = (rev) => (w) => {
      const row = w >= 768;
      return `<div style="display:flex;flex-direction:${row ? (rev ? 'row-reverse' : 'row') : 'column'};gap:6px;margin:6px;transition:all .2s"><div style="flex:1;min-height:34px;background:#b9a58f;border-radius:4px;display:grid;place-items:center;color:#fff;font-size:11px">圖片</div><div style="flex:1;min-height:34px;background:${G80};border-radius:4px;display:grid;place-items:center;color:${G};font-size:11px">文字</div></div>`;
    };
    return resizeSim(box, ctx, {
      title: '圖文並排：手機上下排，≥768px 左右排（第二段還會左右對調）', min: 375, max: 1100, markers: [{ w: 768, label: 'md 768' }],
      render: (w) => ({ html: blk(false)(w) + blk(true)(w), hint: w >= 768 ? '<b>md:flex-row</b>（第二段 <b>md:flex-row-reverse</b>）→ 左右並排' : '<b>flex-col</b> → 手機先上下排' }),
    });
  },

  // 第 9 部：seed 腳本的流程
  seedFlow(box, ctx) {
    const root = mount(box, `<h4>seed.mjs 在做什麼？</h4>
      <div class="row" style="justify-content:space-between;align-items:flex-start;gap:6px"><div class="node" style="min-width:90px">💻<br>你的電腦<br><small>seed.mjs</small></div>
      <div class="grow code lg" style="min-height:130px;font-size:11.5px"></div><div class="node" style="min-width:90px">☁️<br>六角 API<br><small class="cnt">0 個商品</small></div></div><p class="note"></p>`);
    const log = root.querySelector('.lg'), cnt = root.querySelector('.cnt'), note = root.querySelector('.note');
    const add = (t, c = '#ddd') => { log.innerHTML += `<div style="color:${c}">${esc(t)}</div>`; };
    const names = ['香氛蠟燭', '擴香瓶', '手工皂套組', '精油薰香（兩入）'];
    return timeline(ctx.alive, ctx.speed, async (wait) => {
      log.innerHTML = ''; cnt.textContent = '0 個商品'; note.textContent = ''; await wait(700);
      add('① POST /admin/signin　→　token ✅', '#8fdc84'); note.textContent = '先用帳號密碼登入，換到一把 token'; await wait(1300);
      add('② GET /admin/products/all　→　0 筆', '#9ec5ff'); note.textContent = '看看已經有哪些商品（避免重複）'; await wait(1300);
      for (let i = 0; i < 4; i++) { add('③ POST /admin/product　' + names[i], '#f5d142'); cnt.textContent = i + 1 + ' 個商品'; note.textContent = '一個一個建立商品'; await wait(900); }
      await wait(900); add('— 第二次執行 —', '#888'); note.textContent = '重複執行也安全：同名的會被略過'; await wait(900);
      add('已存在，略過：香氛蠟燭', '#bbb'); await wait(500); add('已存在，略過：擴香瓶 …', '#bbb'); await wait(2600);
    });
  },

  // 第 10 部：資料從六角一路流到畫面
  dataFlow(box, ctx) {
    const nodes = [['HotProducts', '畫面：顯示卡片'], ['useProducts', 'Hook：讀取中／錯誤／資料'], ['api.ts', 'getProducts()'], ['axios', '發出請求'], ['六角 API', '/products?category=熱賣']];
    const root = mount(box, `<h4>資料怎麼流到畫面上？</h4><div class="stage">${nodes.map(([n, d], i) => `<div class="node" data-i="${i}"><b>${n}</b><div style="font-size:11px;opacity:.75">${d}</div></div>${i < nodes.length - 1 ? '<div class="arr">⬇</div>' : ''}`).join('')}</div><p class="note"></p>`);
    const note = root.querySelector('.note'), ns = [...root.querySelectorAll('.node')];
    const lit = (i) => ns.forEach((n, k) => n.classList.toggle('on', k === i));
    return timeline(ctx.alive, ctx.speed, async (wait) => {
      note.textContent = '① 畫面出現，呼叫 useProducts("熱賣")'; for (let i = 0; i < 5; i++) { lit(i); await wait(650); }
      note.textContent = '② 請求送到六角，資料原路回來 ⬆'; await wait(900);
      for (let i = 4; i >= 0; i--) { lit(i); await wait(600); }
      note.textContent = '③ loading 變 false，畫面出現 4 張商品卡 ✅'; await wait(2200); lit(-1);
    });
  },

  // 第 10 部：group-hover
  groupHover(box, ctx) {
    const root = mount(box, `<h4>group：外層被 hover，裡面的元素一起動</h4><div class="stage" style="min-height:190px"><div class="card gc" style="width:200px;margin:0 auto;padding:0;overflow:hidden;text-align:center;transition:all .3s">
      <div style="height:92px;overflow:hidden"><div class="gi" style="height:100%;background:linear-gradient(135deg,#e9d8b8,#cfae83);transition:transform .5s"></div></div>
      <div class="gb" style="padding:10px;transition:background .3s"><b>香氛蠟燭</b><div style="font-size:12px;color:${G}">「不只是香氣…」</div></div></div><span class="ptr" style="left:62%;top:150px">🖱️</span></div>
      <div class="row" style="justify-content:center"><span class="chip c1">group</span><span class="chip c2">group-hover:scale-110</span><span class="chip c3">group-hover:bg-primary-80</span></div>`);
    const [gi, gb, ptr, c1, c2, c3] = ['.gi', '.gb', '.ptr', '.c1', '.c2', '.c3'].map((q) => root.querySelector(q));
    const state = (h) => { gi.style.transform = h ? 'scale(1.2)' : 'none'; gb.style.background = h ? G80 : 'transparent'; [c1, c2, c3].forEach((c) => c.classList.toggle('on', h)); };
    return timeline(ctx.alive, ctx.speed, async (wait) => {
      state(false); ptr.style.left = '62%'; ptr.style.top = '150px'; await wait(1000);
      ptr.style.left = '48%'; ptr.style.top = '80px'; await wait(700); state(true); await wait(2200);
      ptr.style.left = '62%'; ptr.style.top = '160px'; await wait(600); state(false); await wait(1200);
    });
  },

  // 第 11 部：Context ── 資料放最外層，大家都讀得到
  context(box, ctx) {
    const root = mount(box, `<h4>Context：把購物車數量放在最外層</h4>
      <div class="node cp" style="max-width:260px;margin:0 auto"><b>CartProvider</b><div>count ＝ <b class="cn" style="font-size:18px">0</b></div></div>
      <div class="arr">⬇　　　　　　　⬆</div>
      <div class="row" style="justify-content:center;gap:16px"><div class="node nv" style="min-width:130px"><b>Navbar</b><div>🛒 <span class="bd chip">0</span></div><small>讀 count</small></div>
      <div class="node pc" style="min-width:130px"><b>ProductCard</b><div><span class="chip ad" style="cursor:default">加入購物車</span></div><small>呼叫 add()</small></div></div><p class="note"></p>`);
    const [cn, bd, ad, cp, nv, pc, note] = ['.cn', '.bd', '.ad', '.cp', '.nv', '.pc', '.note'].map((q) => root.querySelector(q));
    return timeline(ctx.alive, ctx.speed, async (wait) => {
      let n = 0; cn.textContent = bd.textContent = '0'; note.textContent = '';
      await wait(900);
      for (let k = 0; k < 3; k++) {
        pc.classList.add('on'); ad.classList.add('on'); note.textContent = '① 按下加入購物車 → add() 送出 POST /cart'; await wait(1100);
        pc.classList.remove('on'); ad.classList.remove('on'); cp.classList.add('on'); n++; cn.textContent = n; cn.classList.add('pulse'); note.textContent = '② Provider 重新讀取購物車，count 更新'; await wait(1100);
        cp.classList.remove('on'); nv.classList.add('on'); bd.textContent = n; bd.classList.add('on'); bd.classList.remove('pulse'); void bd.offsetWidth; bd.classList.add('pulse'); note.textContent = '③ Navbar 讀到新的 count，數字跟著變'; await wait(1400);
        nv.classList.remove('on'); cn.classList.remove('pulse');
      }
      await wait(1500);
    });
  },

  // 第 12 部：企業責任的展開（flex-8 / flex-1）
  accordion(box, ctx) {
    const titles = ['環境責任', '社會責任', '道德責任'], cols = ['#8bb59a', '#7f8fa8', '#c7a98a'];
    const root = mount(box, `<h4>企業責任：目前展開的那張 flex-8，其他 flex-1</h4><div class="stage card" style="height:130px;padding:6px;display:flex;gap:6px">${titles.map((t, i) => `<div class="ac" data-i="${i}" style="position:relative;overflow:hidden;border-radius:6px;background:${cols[i]};color:#fff;flex:1;transition:flex .6s;display:grid;place-items:center;font-weight:700"><span class="tt">${t}</span><span class="ex" style="position:absolute;left:10px;bottom:8px;font-size:11px;font-weight:400;opacity:0;transition:opacity .4s">標籤 ＋ 一段說明文字…</span></div>`).join('')}</div><div class="row" style="justify-content:center"><span class="chip cc"></span></div>`);
    const cc = root.querySelector('.cc'), acs = [...root.querySelectorAll('.ac')];
    const set = (a) => { acs.forEach((el, i) => { el.style.flex = i === a ? 8 : 1; el.querySelector('.ex').style.opacity = i === a ? 1 : 0; el.querySelector('.tt').style.display = i === a ? 'none' : ''; }); cc.textContent = `active = ${a}　→　第 ${a + 1} 張 md:flex-8，其他 md:flex-1`; cc.classList.add('on'); };
    return timeline(ctx.alive, ctx.speed, async (wait) => { for (const a of [0, 1, 2, 0]) { set(a); await wait(2000); } });
  },

  // 第 13 部：斷點
  breakpoints(box, ctx) {
    const bps = [['sm', 640], ['md', 768], ['lg', 1024], ['xl', 1280]];
    return resizeSim(box, ctx, {
      title: '視窗越寬，生效的斷點越多（手機優先）', min: 375, max: 1920, markers: bps.map(([l, w]) => ({ w, label: l + ' ' + w })),
      render: (w) => {
        const on = bps.filter(([, v]) => w >= v).map(([l]) => l);
        const dev = w < 640 ? '📱 手機（設計稿 375）' : w < 1024 ? '📱 平板' : w < 1440 ? '💻 筆電' : '🖥️ 桌機（設計稿 1920）';
        const cols = w >= 768 ? 2 : 1;
        return { html: `<div style="padding:10px"><div style="font-size:12px;margin-bottom:6px">${dev}</div><div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:4px">${[0, 1, 2, 3].map(() => `<div style="height:22px;background:${G100};border-radius:3px"></div>`).join('')}</div></div>`,
          hint: '目前生效：' + (on.length ? on.map((l) => `<span class="chip on">${l}:</span>`).join(' ') : '<span class="chip">（只有預設的手機樣式）</span>') + `　商品分類：${cols} 欄（md:grid-cols-2）` };
      },
    });
  },
};

export { ANIMS };
