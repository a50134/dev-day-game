// 第 1 部「建立專案」：新人建好專案就急著 npm run dev → 找不到 vite（忘了 npm install）→ 老師用問題點醒。
// 終端機輸出都是真的指令跑出來的（create-vite 9、npm install、vite 8）。
import { T, R, chapter, type, view, float, unfloat, fx, confetti, term, termClear, code, list, card, wait } from './dsl.js';
import * as C from '../tw-react-code.js';

const WIN_ERR = ["'vite' is not recognized as an internal or external command,", 'operable program or batch file.'];

const pages = list(['🏠 首頁（這一輯先做這個）', '🛍️ 產品列表', '🌿 品牌介紹', '📦 商品細節', '💳 結帳']);
const tree = `<div style="font:12.5px/1.7 ui-monospace,Consolas,monospace;text-align:left">📁 i-need-this<br>├ 📄 index.html　<span style="color:#999">網頁入口</span><br>├ 📄 package.json　<span style="color:#999">材料清單</span><br>├ 📄 vite.config.ts　<span style="color:#999">Vite 設定</span><br>└ 📁 src<br>　├ 📄 main.tsx　<span style="color:#999">程式從這裡開始</span><br>　├ 📄 App.tsx　<span style="color:#999">整個畫面</span><br>　└ 📄 index.css　<span style="color:#999">樣式</span></div>`;
const rules = list(['只當型別用的 import，要寫 <code>import type</code>', '不能用 <code>enum</code>（用聯集型別代替）']);

const beats = [
  chapter('開場', ['第 1 部', '建立專案', '🚀']),
  T('嗨新人～歡迎來到第一天！我們要把 Figma 的「I need this」做成真的網站 🛍️'),
  R('太好了！可是…我連從哪裡開始都不知道。', 'worried'),
  float(card('📐 設計稿有 5 個頁面', pages)),
  T('每一頁都有桌面版和手機版。這一輯我們先做「首頁」，其他頁面之後再做。'),
  unfloat,
  T('用 React、TypeScript、Tailwind，資料來自六角的 API。第一步，先把「工作桌」鋪好。'),

  chapter('檢查環境'),
  T('先問你：你的電腦能執行 JavaScript 程式嗎？看看有沒有裝 Node.js～'),
  R('我來試試！', 'happy', {}),
  term('node -v', ['v22.14.0']),
  R('有！v22.14.0。', 'happy'),
  T('很好！新版 Vite 要 Node **20.19 以上**，或 **22.12 以上**，你的版本沒問題。', 'happy'),

  chapter('建立專案'),
  T('現在用 Vite 幫我們建專案，它又快又方便。'),
  R('指令我知道，照著打～', 'happy'),
  term('npm create vite@latest i-need-this -- --template react-ts', ['', 'create-vite v9.3.4', '', 'o  Scaffolding project in i-need-this...', '', '—  Done. Now run:', '', '  cd i-need-this', '  npm install', '  npm run dev']),
  T('`react-ts` 的意思是「React 加 TypeScript」的範本。它問你要不要馬上安裝並啟動，記得選 No。', 'happy'),
  R('做好了！那我直接 `npm run dev` 看畫面～😎', 'happy', { jump: 'rookie' }),
  term('cd i-need-this', []),
  term('npm run dev', ['', '> i-need-this@0.0.0 dev', '> vite', ''], WIN_ERR),
  { fx: 'shake' },
  R('咦？它說找不到 vite…（Mac 會說 `vite: not found`）', 'surprised', { fx: '❗' }),

  chapter('老師點醒'),
  T('別慌～我問你喔：這個資料夾裡，vite 這個工具，真的有被裝進來嗎？', 'normal'),
  R('呃…剛剛只是「建立」專案，好像沒有「安裝」任何東西？', 'worried'),
  T('沒錯！Vite 只幫你把「食譜」放好，材料還沒買。材料清單寫在 `package.json`，用 `npm install` 一次買齊。', 'happy', { fx: '💡' }),
  R('原來少了這一步！', 'surprised', { jump: 'rookie' }),
  term('npm install', ['', 'added 28 packages, and audited 29 packages in 11s', '', '9 packages are looking for funding', '  run `npm fund` for details', '', 'found 0 vulnerabilities']),
  T('這次再試一次 `npm run dev`！', 'happy'),
  term('npm run dev', ['', '> i-need-this@0.0.0 dev', '> vite', '', '  VITE v8.3.8  ready in 205 ms', '', '  ➜  Local:   http://localhost:5173/', '  ➜  Network: use --host to expose']),
  R('成功了！它給了一個網址 `localhost:5173`。', 'happy', { fx: '✨' }),
  T('`localhost` 就是「你自己的電腦」，5173 是門牌號碼。打開它，就能看到網站～', 'happy'),
  T('這個伺服器會一直開著，所以終端機停在那裡不動是正常的喔。', 'normal'),

  chapter('認識資料夾'),
  float(card('📁 專案裡有什麼？', tree)),
  T('index.html 是網頁入口，`src` 裡放我們的程式。`main.tsx` 是程式開始的地方，`App.tsx` 是整個畫面。', 'happy'),
  R('檔名為什麼是 tsx？', 'normal'),
  T('`ts` 是 TypeScript，後面的 `x` 表示檔案裡有 JSX，也就是長得像 HTML 的語法。', 'happy'),
  float(card('⚠️ 新版範本有兩個嚴格規則', rules)),
  T('這兩個規則後面會遇到，先有個印象就好～', 'normal'),
  unfloat,

  chapter('清掉預設畫面'),
  T('預設的歡迎畫面我們用不到。把 `src/App.css`、`src/assets` 刪掉，`index.css` 清空。'),
  R('刪掉就好？不會壞掉嗎？', 'worried'),
  T('我們馬上換上自己的內容，就不會壞。來，打開 `App.tsx`，全部換成這樣～'),
  type('src/App.tsx', C.APP_1),
  view(2200),
  R('出現了！畫面上寫著「I need this」！', 'happy', { fx: '✨' }),
  T('`App` 是一個函式，它回傳什麼，畫面就顯示什麼。這就是 React 最基本的樣子。', 'happy'),
  R('那 `index.html` 呢？它還是英文的欸。', 'normal'),
  T('好眼力！改兩個地方：`lang` 改成 `zh-Hant`，`title` 改成「I need this」。', 'happy'),
  type('index.html', C.INDEX_HTML_1),
  R('改好了！', 'happy'),

  chapter('今天學到'),
  T('今天你學到什麼？換你當小老師～'),
  R('我來整理！', 'happy'),
  float(card('📝 今天學到', list(['<code>npm create vite</code> 只是「建立」，還要 <code>npm install</code> 才會「安裝」', '<code>npm run dev</code> 開啟開發伺服器，網址是 localhost:5173', '清掉預設畫面，換成自己的 <code>App.tsx</code>']))),
  wait(4800),
  T('滿分！下一部我們來安裝 Tailwind～', 'happy', { fx: '🎉' }),
  confetti,
  unfloat,
  wait(1500),
];

export default {
  title: '建立專案',
  endSub: '下一部：安裝 Tailwind CSS v4',
  beats,
};
