// 第 13 部「檢查、型別錯誤整理與上線」：
//   做錯：HotProducts 留了一行沒用到的 import → npm run build 先跑 tsc 就停下來（TS6133，真的跑出來的）
// 終端機的 lint／build 輸出都是在最後完成的專案裡真的執行的（模組數、檔案大小會因環境略有不同）。
import { T, R, chapter, type, open, view, vp, hl, unhl, float, unfloat, fx, confetti, term, code, list, card, wait } from './dsl.js';
import * as C from '../tw-react-code.js';

const HOT_BAD = "import { useState } from 'react'\n" + C.HOT_1;
const ERR_UNUSED = "src/components/HotProducts.tsx(1,10): error TS6133: 'useState' is declared but its value is never read.";

const checks = list(['① 有沒有橫向捲軸（左右滑動）', '② 文字、圖片有沒有被切掉或蓋住', '③ 按鈕夠大嗎（手機手指好不好按）']);
const widths = list(['375：手機（設計稿手機版）', '768：平板（<code>md</code>）', '1024：<code>lg</code>　1440：筆電', '1920：桌機（設計稿桌面版）', '設計稿只有 375 和 1920，中間尺寸自己判斷']);
const bp = list(['<code>sm</code> 640　<code>md</code> 768　<code>lg</code> 1024　<code>xl</code> 1280', '文字樣式、圖文並排用 <code>md</code>', '導覽列桌面版用 <code>lg</code>（項目比較多，需要更寬）']);
const readErr = `<div style="font:12.5px/1.8 ui-monospace,Consolas,monospace;text-align:left"><b style="color:#1d6617">src/components/Button.tsx(13,7)</b> ← 第 13 行第 7 個字<br><b style="color:#b91c1c">error TS2741</b> ← 錯誤編號（可以拿去搜尋）<br><b>後面的英文</b> ← 原因和建議</div>`;
const errs = list([
  "<code>TS1484</code>：'Product' is a type and must be imported using a type-only import…　→ 加 <code>type</code>",
  "<code>TS2322</code>：Type '\"blue\"' is not assignable to type 'Variant | undefined'.　→ 用了不存在的選項",
  "<code>TS2741</code>：Property 'subtitle' is missing in type …　→ 少傳必要的欄位",
  "<code>TS2551</code>：Property 'product' does not exist … Did you mean 'products'?　→ 欄位打錯字",
  "<code>TS2345</code>：Argument of type 'Product' is not assignable to parameter of type 'string'.　→ 傳錯型別",
  "<code>TS6133</code>：'useState' is declared but its value is never read.　→ 沒用到的東西",
]);
const env = list(['平台設定頁：填 <code>VITE_API_BASE</code>、<code>VITE_API_PATH</code>', '❌ 不要填 <code>HEX_PASSWORD</code>（網站用不到）', '改了環境變數，要重新部署一次才生效']);
const host = list(['Vercel／Netlify：連 GitHub，每次推上去自動更新（建議）', 'GitHub Pages：網址多一層，要另外設 <code>base</code> 和圖片路徑', '圖片路徑 <code>/images/...</code> 適合放在網站根目錄']);
const next = list(['產品列表（分類、分頁、搜尋）', '品牌介紹', '商品細節（加入購物車搬到這裡）', '結帳（建立訂單）']);

const beats = [
  chapter('開場', ['第 13 部', '檢查與上線', '🚀']),
  T('最後一部！首頁做完了，我們來檢查、整理，再準備上線～'),
  R('終於到最後了，我想看看整個首頁！', 'happy'),
  vp('desktop'),
  view(4200, 'ok', '默默熱賣中'),
  R('桌面版完整！那手機版呢？', 'normal'),

  chapter('檢查響應式'),
  T('用開發者工具（F12）左上角的手機圖示，就能切換成手機大小。', 'happy'),
  vp('mobile'),
  view(4200, 'ok', '默默熱賣中'),
  float(card('📏 檢查哪些寬度', widths)),
  wait(4600),
  unfloat,
  float(card('👀 每個寬度看三件事', checks)),
  wait(4000),
  unfloat,
  float(card('📌 記住斷點', bp)),
  wait(4600),
  unfloat,

  chapter('新人先試'),
  T('接著跑程式檢查。先 `npm run lint` 檢查寫法有沒有問題。', 'happy'),
  term('npm run lint', ['', '> i-need-this@0.0.0 lint', '> oxlint', '']),
  T('沒有任何警告，就是什麼都不會多印。再來 `npm run build`，換你！', 'happy'),
  R('我順便在 `HotProducts` 先放一個 `useState`，以後可能用得到～', 'happy', { jump: 'rookie' }),
  open('src/components/HotProducts.tsx'),
  type('src/components/HotProducts.tsx', HOT_BAD, { broken: true, slow: true }),
  term('npm run build', ['', '> i-need-this@0.0.0 build', '> tsc -b && vite build', ''], [ERR_UNUSED]),
  { fx: 'shake' },
  R('build 失敗了！它說 `useState` 宣告了卻沒有用到…', 'surprised', { fx: '❗' }),

  chapter('老師點醒'),
  T('注意 `build` 做的第一件事是什麼？', 'normal'),
  R('`tsc -b`，TypeScript 的型別檢查！有錯就會停在這裡，不會打包。', 'surprised', { jump: 'rookie', fx: '💡' }),
  T('對！它保護你不會把有問題的程式放上網。來看怎麼讀錯誤訊息：', 'happy'),
  float(card('🔍 怎麼讀錯誤', readErr)),
  wait(4800),
  unfloat,
  R('所以是 `HotProducts.tsx` 第 1 行第 10 個字…就是那個沒用到的 `useState`！把它刪掉～', 'happy', { jump: 'rookie' }),
  code,
  type('src/components/HotProducts.tsx', C.HOT_1, { slow: true }),
  term('npm run build', ['', '> i-need-this@0.0.0 build', '> tsc -b && vite build', '', 'vite v8.3.8 building client environment for production...', '✓ 90 modules transformed.', 'dist/index.html                   0.77 kB │ gzip:  0.41 kB', 'dist/assets/index-BLymeE40.css   25.99 kB │ gzip:  5.27 kB', 'dist/assets/index-B5kdG__S.js   293.66 kB │ gzip: 95.73 kB', '', '✓ built in 248ms']),
  R('成功了！檔案都放在 `dist` 資料夾，那就是可以上線的成品。', 'happy', { fx: '✨' }),

  chapter('整理型別錯誤'),
  T('回頭看，這個系列你遇過哪些錯誤？每一個訊息都在告訴你哪裡錯、怎麼改。', 'happy'),
  float(card('🧯 我們遇過的 TypeScript 錯誤', errs)),
  wait(9000),
  unfloat,
  T('慢慢讀，你會發現它非常誠實。', 'normal'),

  chapter('準備上線'),
  T('上線有兩件事要注意。第一，環境變數：`.env` 不一定會跟著上傳，要在平台設定頁自己填。', 'happy'),
  float(card('🔐 環境變數', env)),
  wait(5200),
  unfloat,
  T('放哪裡？', 'happy'),
  float(card('☁️ 放到哪裡', host)),
  wait(5200),
  unfloat,

  chapter('今天學到'),
  T('來，換你當小老師～'),
  R('我來整理！', 'happy'),
  float(card('📝 今天學到', list(['<code>npm run build</code> 會先跑 <code>tsc</code>，有型別錯誤就停下來，保護你不會上線壞掉的網站', '讀錯誤：檔名（行,列）→ 錯誤編號 → 後面的英文就是原因', '上線只填 <code>VITE_</code> 開頭的環境變數，密碼絕對不要放']))),
  wait(6000),
  T('首頁全部完成了！第二階段會做產品列表、品牌介紹、商品細節、結帳，都會用到你做好的顏色、字型、按鈕、元件和 API。', 'happy', { fx: '🎉' }),
  float(card('🗺️ 第二階段', next)),
  wait(5200),
  unfloat,
  R('我想自己從頭做一次，放上 Vercel，把網址放進履歷！', 'happy', { fx: '🎉' }),
  T('太棒了！面試時你可以清楚說：React ＋ TypeScript ＋ Tailwind ＋ API，每個決定的原因。恭喜完成全部 13 部！', 'happy', { fx: '🎉' }),
  confetti,
  wait(2500),
];

export default {
  title: '檢查、型別錯誤整理與上線',
  endSub: '全部 13 部完成 🎉',
  beats,
};
