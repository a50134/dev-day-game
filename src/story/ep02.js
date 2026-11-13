// 第 2 部「安裝 Tailwind」：新人把套件和 Vite 外掛都裝好了，class 卻沒有效果（忘了在 CSS 裡 @import）→ 老師反問「Tailwind 的 CSS 在哪裡被叫進來？」
import { T, R, chapter, type, open, view, float, unfloat, fx, confetti, term, list, card, wait } from './dsl.js';
import { SCAFFOLD } from './state.js';
import * as C from '../tw-react-code.js';

const VITE_A = "import tailwindcss from '@tailwindcss/vite'\n" + SCAFFOLD['vite.config.ts'];
const VITE_B = VITE_A.replace('[react()]', '[react(), tailwindcss()]');

const three = list(['① 安裝套件：<code>tailwindcss</code> 和 <code>@tailwindcss/vite</code>', '② 在 <code>vite.config.ts</code> 加上外掛', '③ 在 CSS 第一行 <code>@import "tailwindcss"</code>']);
const meaning = list(['<code>text-3xl</code>　字很大', '<code>font-bold</code>　粗體', '<code>text-red-500</code>　紅色']);
const lessCss = list(['你用到的 class → 才會產生對應的 CSS', '沒用到的（例如 <code>text-sm</code>）→ 不會產生', '所以網站的 CSS 很小、很快']);

const beats = [
  chapter('開場', ['第 2 部', '安裝 Tailwind', '🌬️']),
  T('歡迎回來～今天我們幫網站裝上 Tailwind，之後所有樣式都靠它！'),
  R('Tailwind 是什麼呀？我聽說要寫一大堆 class 名字…', 'worried'),
  T('先別怕！我們用的是第四版，比以前簡單很多：不用 `tailwind.config.js`，也不用設定 PostCSS。', 'happy'),
  float(card('🌬️ Tailwind v4：只要三件事', three)),
  T('先把這三件事記起來，我們一件一件做。', 'happy'),
  unfloat,

  chapter('裝套件'),
  T('第一件：安裝。官方文件的 Installation 選 Using Vite，步驟照著做就行。', 'happy'),
  R('指令我來打！', 'happy'),
  term('npm install tailwindcss @tailwindcss/vite', ['', 'added 19 packages, and audited 54 packages in 4s', '', '12 packages are looking for funding', '  run `npm fund` for details', '', 'found 0 vulnerabilities']),
  R('裝好了！我先來試試看它的威力～😎', 'happy', { jump: 'rookie' }),
  T('等一下！還有第二件事：要告訴 Vite「請用 Tailwind」。打開 `vite.config.ts`。', 'normal'),
  open('vite.config.ts'),
  R('好～先把它叫進來。', 'normal'),
  type('vite.config.ts', VITE_A, { slow: true, noCheck: true }),
  T('這行是「把 Tailwind 外掛拿進來」。再放進 `plugins` 這個陣列裡才會生效～', 'happy'),
  type('vite.config.ts', VITE_B, { slow: true }),
  R('好了！外掛設定完成。', 'happy'),
  T('小提醒：改了 `vite.config.ts` 要把開發伺服器重開，才會生效。', 'normal'),
  term(undefined, ['^C']),
  term('npm run dev', ['', '> i-need-this@0.0.0 dev', '> vite', '', '  VITE v8.3.8  ready in 205 ms', '', '  ➜  Local:   http://localhost:5173/']),

  chapter('新人先試'),
  T('來，改一下 `App.tsx`，用用看 Tailwind 的 class～'),
  R('我要讓標題又大又粗又紅！看我的～', 'happy', { jump: 'rookie' }),
  type('src/App.tsx', C.APP_2),
  view(2200),
  { fx: 'shake' },
  R('咦？？字還是一樣小小黑黑的…class 沒有效果欸！', 'surprised', { fx: '❗' }),

  chapter('老師點醒'),
  T('別急～Tailwind 是一堆 CSS 樣式，對不對？那我問你：這些 CSS，是從哪裡被「叫進網頁」的？', 'normal'),
  R('呃…我只裝了套件和外掛，好像沒有叫過它？', 'worried'),
  T('猜對一半了！我們來看 `src/index.css`，它是專門放樣式的地方。', 'happy'),
  open('src/index.css'),
  R('它是空的欸…那要寫什麼？', 'worried'),
  T('只要一行，第三件事：把 Tailwind 整個 import 進來。', 'happy', { fx: '💡' }),
  type('src/index.css', C.CSS_1),
  view(2400),
  R('哇！變大、變粗、變紅了！！', 'surprised', { fx: '✨', jump: 'rookie' }),
  T('耶～三件事全部做完，Tailwind 就上線了！', 'happy', { fx: '🎉' }),
  T('那為什麼網站載入時 `index.css` 會自動生效？因為範本的 `main.tsx` 第三行已經幫你 `import "./index.css"` 了，不用再改。', 'normal'),

  chapter('看懂 class'),
  open('src/App.tsx'),
  T('來看看你寫的三個 class 是什麼意思：', 'happy'),
  float(card('🔤 三個 class', meaning)),
  R('原來名字就是它的意思！`text-3xl` 就是 text 大小 3xl。', 'happy'),
  unfloat,
  T('而且 Tailwind 很聰明：', 'happy'),
  float(card('🪶 只產生用到的 CSS', lessCss)),
  wait(3200),
  unfloat,
  T('最後送你一個好用的工具：VS Code 的外掛 **Tailwind CSS IntelliSense**。', 'happy'),
  float(card('🧰 建議安裝', list(['VS Code → 擴充套件（Ctrl＋Shift＋X）', '搜尋 <b>Tailwind CSS IntelliSense</b>', '打 class 會跳出建議，滑鼠移上去看 CSS']))),
  wait(3800),
  unfloat,

  chapter('今天學到'),
  T('來，換你當小老師～'),
  R('我來整理！', 'happy'),
  float(card('📝 今天學到', list(['裝 Tailwind 要三件事：套件、Vite 外掛、<code>@import "tailwindcss"</code>', '改了 <code>vite.config.ts</code> 要重開開發伺服器', 'class 的名字就是它的意思，只會產生用到的 CSS']))),
  wait(5200),
  T('滿分！下一部開始設定設計稿的顏色～', 'happy', { fx: '🎉' }),
  confetti,
  unfloat,
  wait(1500),
];

export default {
  title: '安裝 Tailwind CSS v4',
  endSub: '下一部：共用顏色',
  beats,
};
