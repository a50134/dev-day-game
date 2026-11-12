// 第 9 部「先建立商品資料（seed）」：
//   做錯 ①：把密碼放進 .env 的 VITE_ 變數 → 老師問「瀏覽器看得到嗎？」→ 搬到 .env.local
//   做錯 ②：直接 node scripts/seed.mjs，忘了 --env-file → 真的執行得到「缺少環境變數」（node 22 實測）
// 終端機「已建立／已存在，略過」是照程式邏輯寫的（沒有連真的六角帳號執行）。
import { T, R, chapter, type, open, view, hl, unhl, float, unfloat, fx, confetti, term, list, card, wait } from './dsl.js';
import * as C from '../tw-react-code.js';

const ENV_BAD = `${C.ENV_FILE}VITE_HEX_USERNAME=你的六角登入Email\nVITE_HEX_PASSWORD=你的六角密碼\n`;
const ENV_ERR = '缺少環境變數：請確認 .env 和 .env.local 都填好了';
const CMD = 'node --env-file=.env --env-file=.env.local scripts/seed.mjs';

const apply = list(['到 ec-course-api.hexschool.io 註冊、登入', '申請一個 <b>API 路徑</b>（自己取的名字，之後網址都會用到）', '⚠️ 路徑底下的資料，知道路徑的人都能讀寫 → 只放練習用的假資料']);
const devtools = `<div style="font:12.5px/1.7 ui-monospace,Consolas,monospace;text-align:left;background:#1e1e1e;color:#ddd;padding:10px;border-radius:8px"><span style="color:#8ab4f8">瀏覽器 ▸ 開發者工具 ▸ Sources</span><br>import.meta.env = {<br>&nbsp;&nbsp;VITE_API_PATH: "…",<br>&nbsp;&nbsp;<span style="color:#ff8a80">VITE_HEX_PASSWORD: "你的六角密碼"</span> 😱<br>}</div>`;
const flow = list(['① 用帳號密碼登入，拿到 token', '② 讀出已經存在的商品', '③ 一個一個建立；同名的就略過（重複執行也不會有兩份）']);

const beats = [
  chapter('開場', ['第 9 部', '建立商品資料', '🌱']),
  T('下一部要把首頁的「熱賣商品」換成真的 API 資料。但是你的 API 一開始是空的耶～'),
  R('那就沒有東西可以顯示了…', 'worried'),
  T('所以這部我們先把設計稿的商品「種」進 API，這叫 seed（播種）。', 'happy', { fx: '💡' }),
  float(card('🔑 先申請 API 路徑', apply)),
  wait(5200),
  unfloat,

  chapter('新人先試'),
  T('接著要放設定值。專案最外層新增 `.env`，放 API 網址和路徑。', 'happy'),
  R('我順便把登入帳號密碼也放進去，一次搞定！', 'happy', { jump: 'rookie' }),
  type('.env', ENV_BAD),
  R('名字取 `VITE_HEX_PASSWORD`，跟別人一樣有 `VITE_` 開頭～', 'happy'),

  chapter('老師點醒'),
  T('等一下！Vite 有個規則：`VITE_` 開頭的變數，會被「打包進網頁」。打包進網頁，代表誰能看到？', 'normal'),
  R('…瀏覽器？所有打開網頁的人？', 'worried'),
  float(card('😱 開發者工具看得到', devtools)),
  wait(3600),
  unfloat,
  hl(4, 4),
  R('密碼會被所有人看光光！趕快搬走！', 'surprised', { jump: 'rookie', fx: '❗' }),
  unhl,
  type('.env', C.ENV_FILE, { slow: true }),
  T('密碼放另一個檔案：`.env.local`，名字不要 `VITE_` 開頭，就不會被打包。範本的 `.gitignore` 也已經擋掉 `*.local`，不會上傳 GitHub。', 'happy', { fx: '💡' }),
  type('.env.local', C.ENV_LOCAL),

  chapter('寫 seed 程式'),
  T('接著新增 `scripts/seed.mjs`。它跑在你的電腦上，用 Node.js 執行，不是在網頁裡。第一段先檢查設定有沒有填。', 'happy'),
  type('scripts/seed.mjs', C.SEED_1),
  R('寫好了，執行看看！', 'happy', { jump: 'rookie' }),
  term('node scripts/seed.mjs', [], [ENV_ERR]),
  { fx: 'shake' },
  R('咦？它說缺少環境變數，可是我兩個檔案都有填啊…', 'surprised', { fx: '❗' }),
  T('Node 不會自動讀 `.env`。我們要用 `--env-file` 告訴它去哪裡讀。', 'happy', { fx: '💡' }),
  term(CMD, []),
  R('這次沒有報錯！檢查通過了～', 'happy', { fx: '✨' }),
  T('接著加商品資料：四個「熱賣」商品，名稱價格都照設計稿。`imagesUrl` 一定要是陣列，不然 API 會回「imagesUrl 格式不正確」。', 'happy'),
  type('scripts/seed.mjs', C.SEED_2, { bulk: true }),
  T('再加一個小函式 `request`：失敗就丟出錯誤，並顯示 API 回的訊息，除錯才知道哪裡錯。', 'happy'),
  type('scripts/seed.mjs', C.SEED_3),
  T('最後是主流程。', 'happy'),
  type('scripts/seed.mjs', C.SEED_4, { bulk: true }),
  float(card('🔁 seed 流程', flow)),
  wait(4800),
  unfloat,

  chapter('執行'),
  term(CMD, ['已建立：香氛蠟燭', '已建立：擴香瓶', '已建立：手工皂套組', '已建立：精油薰香（兩入）']),
  R('四行「已建立」，成功了！', 'happy', { fx: '✨' }),
  T('再跑一次試試看～', 'normal'),
  term(CMD, ['已存在，略過：香氛蠟燭', '已存在，略過：擴香瓶', '已存在，略過：手工皂套組', '已存在，略過：精油薰香（兩入）']),
  R('這次全部「已存在，略過」，沒有重複建立！', 'surprised', { fx: '✨' }),
  T('這種「重複做也沒關係」的寫法很重要。驗證：把網址貼到瀏覽器，API 路徑換成你的，後面加 `products?category=熱賣`，就會看到那四個商品的 JSON。', 'happy'),

  chapter('今天學到'),
  T('來，換你當小老師～'),
  R('我來整理！', 'happy'),
  float(card('📝 今天學到', list(['<code>VITE_</code> 開頭的變數會被打包進網頁，所以密碼要放 <code>.env.local</code>', 'Node 要用 <code>--env-file</code> 才會讀 .env', 'seed 程式要能重複執行：已經有就略過']))),
  wait(6000),
  T('太棒了！下一部把這些商品顯示在首頁～', 'happy', { fx: '🎉' }),
  confetti,
  unfloat,
  wait(1500),
];

export default {
  title: '先建立商品資料（seed）',
  endSub: '下一部：串接商品 API——熱賣商品',
  beats,
};
