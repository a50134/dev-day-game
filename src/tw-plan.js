// 10 天計畫：每天 10～15 分鐘，把首頁以外的頁面做完（第一階段首頁已完成）。
// 每天要做的檔案，是從第二階段講義的資料（tw2-episodes.js）按「步驟範圍」自動帶出來的，所以不會和講義對不上。
// 勾選的進度存在這個瀏覽器的 localStorage。
import { EPISODES } from './tw-episodes.js';
import { EPISODES2 } from './tw2-episodes.js';
import { HOMEFIX } from './tw-plan-homefix.js';
import { addedLines } from './tw-handout-diff.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const H2 = 'tailwind-react-handout-2.html';

// 每一天：ep ＝ 第二階段講義的第幾個單元（0＝第 14 部路由、1＝第 15 部產品列表…），from／to ＝ 該部的第幾步到第幾步（含）
// 預估分鐘＝只算動手的時間（照講義複製貼上）。讀說明的時間另外算，所以每天抓 10～15 分鐘。
export const DAYS = [
  { title: '首頁校正：19 處小修改', sub: '讓首頁和設計稿的尺寸一致（只改幾個 class，不新增檔案）', home: true, min: '10～12 分',
    done: '重新整理首頁：桌面版輪播變高（剛好佔滿一個螢幕）、各區塊上下間距和設計稿一致，沒有紅字。',
    stuck: '找不到那一行？用 VS Code 的搜尋（Ctrl＋Shift＋F）貼上<b>舊的那一行的一小段</b>。改完存檔，畫面會自己更新。' },
  { ep: 0, from: 1, to: 9, title: '路由：讓網站有很多頁', sub: '第 14 部（全部）', min: '10～13 分', link: '#ep14',
    done: '網址打 <code>/products</code> 會看到「所有商品」的空殼頁；點導覽列的「所有商品」換頁，頁面沒有整頁重新載入；最後一步 <code>npm run build</code> 通過。',
    stuck: '白畫面？看終端機和瀏覽器 Console 的紅字。最常見是 <code>BrowserRouter</code> 沒包在 <code>main.tsx</code>，或是 import 路徑少了 <code>../</code>。' },
  { ep: 1, from: 1, to: 6, title: '產品列表①：商品資料與基本元件', sub: '第 15 部（前半）', min: '10～13 分', link: '#ep15',
    done: '<code>seed</code> 跑完，你的 API 裡有 13 個商品（可以打網址 <code>…/products/all</code> 看到）；<code>npm run build</code> 通過。這天還看不到新畫面。',
    stuck: 'seed 失敗？確認 <code>.env</code> 和 <code>.env.local</code> 都填好，指令要有兩個 <code>--env-file</code>。' },
  { ep: 1, from: 7, to: 11, title: '產品列表②：側欄、分頁、組裝頁面', sub: '第 15 部（後半）', min: '12～15 分', link: '#ep15',
    done: '打開 <code>/products</code>：左邊有分類側欄、右邊是商品列表、下面有分頁，點分類或分頁會變；手機版也正常。',
    stuck: '這天檔案比較多，一次一個檔案：貼完先存檔，看有沒有紅線再繼續。紅線看逐行說明裡的「📥」import 說明。' },
  { ep: 2, from: 1, to: 7, title: '商品細節①：資料、圖庫、數量框', sub: '第 16 部（前半）', min: '10～13 分', link: '#ep16',
    done: '<code>npm run build</code> 通過。這天做的是「零件」（資料、圖庫、數量加減），頁面明天組裝。',
    stuck: '型別紅線多半是欄位名稱打錯，照講義「types.ts」那一步比對。' },
  { ep: 2, from: 8, to: 13, title: '商品細節②：分頁籤、組裝頁面', sub: '第 16 部（後半）', min: '10～13 分', link: '#ep16',
    done: '在列表點一個商品會進到 <code>/products/商品編號</code>：有大圖、縮圖、數量加減、加入購物車、三個分頁籤；首頁的商品卡也能點進去。',
    stuck: '商品出不來？看網址最後的商品編號對不對、網路面板有沒有 404。' },
  { ep: 3, from: 1, to: 8, title: '結帳①：型別、購物車資料、小元件', sub: '第 17 部（前段）', min: '10～14 分', link: '#ep17',
    done: '<code>npm run build</code> 通過。注意：第 3 步（CartContext）<b>會故意出現紅線</b>，下一步（CartProvider）補上就消失，這是正常的。',
    stuck: '第 3 步的紅線不用急著修，繼續做第 4 步，兩個檔案都貼好就會消失。' },
  { ep: 3, from: 9, to: 11, title: '結帳②：購物車頁、填寫資料頁', sub: '第 17 部（中段）', min: '12～15 分', link: '#ep17',
    done: '<code>npm run build</code> 通過。這兩頁還沒接上網址，所以今天還看不到，明天接上路由就會出現。',
    stuck: '這天檔案最長（購物車頁 140 多行）。不用逐行讀，先貼好，晚點再回頭看逐行說明。' },
  { ep: 3, from: 12, to: 16, title: '結帳③：訂單確認、接上路由、走完整個流程', sub: '第 17 部（後段）', min: '10～13 分', link: '#ep17',
    done: '加入購物車 → 打開 <code>/cart</code> 看到購物車 → 填寫資料 → 送出訂單 → 看到訂單確認頁，整個流程走通。導覽列購物車連得到 <code>/cart</code>。',
    stuck: '送出訂單失敗？打開瀏覽器 Console 看 API 回的訊息（六角會說明哪個欄位格式不對）。' },
  { ep: 4, from: 1, to: 6, title: '品牌介紹頁＋最後檢查', sub: '第 18 部（全部）', min: '12～15 分', link: '#ep18', last: true,
    done: '打開 <code>/brand</code> 看到品牌介紹；導覽列「品牌介紹」連得到。最後用 F12 手機模式檢查 375、768、1440、1920 寬，沒有橫向捲軸。',
    stuck: '這頁大多是資料和排版，沒有新觀念。做完回到首頁，從頭點一遍每個連結。' },
];

// 這個單元每一步的種類／行數：要依「整個第二階段的順序」比對上一個版本，所以先整個走過一遍
const base = new Map();
for (const ep of EPISODES) for (const s of ep.steps) if (s.file) base.set(s.file, s.code);
const INFO = EPISODES2.map((ep) => ep.steps.map((s) => {
  if (!s.file) return { kind: 'cmd', text: (s.term?.[0] || '').replace(/^\$ /, ''), say: s.say };
  const prev = base.get(s.file);
  const total = s.code.trim().split('\n').length;
  const add = prev ? addedLines(prev, s.code).size : total;
  base.set(s.file, s.code);
  return { kind: prev ? 'edit' : 'new', file: s.file, lines: prev ? add : total, say: s.say, broken: !!s.broken };
}));

const KEY = 'ddg-plan-v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { saved = {}; }
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* 沒有儲存空間也沒關係 */ } };

// 首頁校正：把「舊的一行 → 新的一行」中有變的字標出來
function tokens(s) { return s.split(/(\s+)/); }
function markNew(oldLine, newLine) {
  const have = new Set(tokens(oldLine || ''));
  return tokens(newLine).map((t) => (/^\s+$/.test(t) || have.has(t) ? esc(t) : `<mark>${esc(t)}</mark>`)).join('');
}
function homeTasks() {
  let n = 0;
  return HOMEFIX.map((f) => {
    const hunks = f.hunks.map((h) => {
      const id = 'd1-' + n++;
      const rm = h.removed.map((l) => `<div class="l rm">${esc(l.trim())}</div>`).join('');
      const ad = h.added.map((l, i) => `<div class="l ad">${h.removed.length ? markNew(h.removed[Math.min(i, h.removed.length - 1)], l.trim()) : `<mark>${esc(l.trim())}</mark>`}</div>`).join('');
      const at = h.anchor ? `<div class="at">在這一行附近：<code>${esc(h.anchor.trim().slice(0, 56))}…</code></div>` : '';
      return `<div class="hunk"><label><input type="checkbox" data-id="${id}"><span class="txt">${at}${rm}${ad}</span></label></div>`;
    }).join('');
    return `<div class="fix"><div class="f">${esc(f.file)}</div>${hunks}</div>`;
  }).join('');
}
const homeCount = HOMEFIX.reduce((a, f) => a + f.hunks.length, 0);

function tasksOf(d, di) {
  if (d.home) return { html: `<h3>今天要改的 ${homeCount} 處（逐處打勾）</h3><p style="margin:2px 0 6px;font-size:14px">紅色刪除線是<b>舊的</b>，綠色是<b>新的</b>（綠底的字就是有變的地方）。</p>${homeTasks()}`, ids: HOMEFIX.flatMap((f) => f.hunks).map((_, i) => 'd1-' + i) };
  const ids = [];
  const items = [];
  for (let s = d.from; s <= d.to; s++) {
    const inf = INFO[d.ep][s - 1], id = `d${di + 1}-${s}`;
    ids.push(id);
    const label = inf.kind === 'cmd'
      ? `<span class="kind cmd">終端機</span><code>${esc(inf.text)}</code>`
      : `<span class="kind ${inf.kind === 'new' ? 'new' : ''}">${inf.kind === 'new' ? '新增' : '修改'}</span><code>${esc(inf.file)}</code><span class="sub">${esc(inf.say.replace(/。$/, ''))}・${inf.kind === 'new' ? inf.lines + ' 行' : '改 ' + inf.lines + ' 行'}${inf.broken ? '・⚠️ 這步會故意出現紅線' : ''}</span>`;
    items.push(`<li><input type="checkbox" id="${id}" data-id="${id}"><label for="${id}">${label}</label></li>`);
  }
  return { html: `<h3>今天要做（照順序，做完打勾）</h3><ul class="tasks">${items.join('')}</ul>`, ids };
}

const days = DAYS.map((d, i) => ({ d, i, ...tasksOf(d, i) }));
const cards = days.map(({ d, i, html }) => `<details class="day" id="day${i + 1}" data-day="${i}">
  <summary><span class="badge">第 ${i + 1} 天</span><span class="ttl">${esc(d.title)}<small>${esc(d.sub)}・約 ${d.min}</small></span><span class="tick"></span></summary>
  <div class="body">${html}
    <div class="done-box">✅ <b>完成的樣子：</b>${d.done}</div>
    <div class="stuck">🆘 <b>卡住了：</b>${d.stuck}</div>
    <div class="links">${d.link ? `<a class="main" href="${H2}${d.link}" target="_blank" rel="noopener">📘 打開講義（${d.sub.split('（')[0]}）</a>` : '<a class="main" href="tailwind-react-handout.html" target="_blank" rel="noopener">📘 打開第一階段講義</a>'}</div>
  </div></details>`).join('');

const root = document.getElementById('plan');
root.innerHTML = `<header class="top"><p>Tailwind ＋ React ＋ TypeScript</p><h1>10 天計畫：把網站做完</h1>
  <p>每天 10～15 分鐘，產品列表、商品細節、結帳、品牌介紹。</p></header>
  <div class="bar"><i id="barfill"></i></div><div class="stat" id="stat"></div>
  <div class="how"><b>怎麼用：</b><ol><li>打開「今天」那一天（粉紅色框），照順序一個一個做。</li><li>每做完一個檔案就打勾；全部勾完，這天就完成，明天自動換下一天。</li><li>時間到就停也沒關係：每一步程式都能 <code>npm run build</code>，明天從沒勾的地方接著做。</li><li>不懂為什麼這樣寫？打開當天的講義，每一行旁邊有說明（也有 import／export 怎麼看）。</li></ol></div>
  ${cards}
  <div class="note"><b>之後要接自己的後端時：</b>這 10 天做的東西，所有「跟 API 講話」的地方都集中在 <code>src/api.ts</code>，資料的樣子集中在 <code>src/types.ts</code>，網址設定在 <code>.env</code>。所以之後換成你自己的後端，主要是改這三個地方，頁面和元件不用重做。六角 API 沒有顧客登入，真的後端要多做「註冊／登入」。</div>
  <footer class="end"><button class="reset" id="reset" type="button">清除打勾紀錄</button><p>進度只存在這個瀏覽器。</p></footer>`;

function refresh(openToday) {
  let doneCount = 0, today = -1;
  days.forEach(({ i, ids }) => {
    const el = document.getElementById('day' + (i + 1));
    const all = ids.length > 0 && ids.every((id) => saved[id]);
    el.classList.toggle('done', all);
    if (all) doneCount++; else if (today < 0) today = i;
    el.querySelector('.tick').textContent = all ? '✅' : '';
  });
  days.forEach(({ i }) => document.getElementById('day' + (i + 1)).classList.toggle('today', i === today));
  document.getElementById('barfill').style.width = doneCount * 10 + '%';
  document.getElementById('stat').textContent = doneCount === 10 ? '🎉 10 天全部完成！' : `已完成 ${doneCount} / 10 天${today >= 0 ? `　・　今天做第 ${today + 1} 天` : ''}`;
  if (openToday && today >= 0) document.getElementById('day' + (today + 1)).open = true;
}
root.querySelectorAll('input[data-id]').forEach((cb) => {
  cb.checked = !!saved[cb.dataset.id];
  cb.onchange = () => { if (cb.checked) saved[cb.dataset.id] = 1; else delete saved[cb.dataset.id]; persist(); refresh(false); };
});
document.getElementById('reset').onclick = () => { if (confirm('要清除全部打勾紀錄嗎？')) { saved = {}; persist(); root.querySelectorAll('input[data-id]').forEach((c) => (c.checked = false)); refresh(true); } };
refresh(true);
