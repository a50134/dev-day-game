// 第 4 部「字型與文字樣式」：
//   做錯 ①：字型變數忘了 font- 開頭（和上一部顏色同一個規則）→ 老師叫新人想想「上次的規則」。
//   做錯 ②：h1 只寫了桌面的大小 → 手機上字太大 → 老師帶出「手機優先」。
import { T, R, chapter, type, open, view, vp, hl, unhl, float, unfloat, fx, confetti, list, card, wait, swatches } from './dsl.js';
import * as C from '../tw-react-code.js';

// 做錯的版本都是從「驗證過的正確版本」改出來的，所以其他部分一定是對的
const CSS_F1 = C.CSS_2.replace('  --color-bgc-green: #f6f9eb;\n}', '  --color-bgc-green: #f6f9eb;\n\n  /* 字型：標題用 Noto Serif TC，內文用 Noto Sans TC */\n  --serif-tc: "Noto Serif TC", serif;\n}');
const CSS_F2 = CSS_F1.replace('--serif-tc', '--font-serif-tc');
const H1_BAD = C.CSS_4a.replace('  font-size: 2rem;\n  @media (min-width: 48rem) {\n    font-size: 3rem;\n  }\n', '  font-size: 3rem;\n');

const app = (body) => `function App() {\n  return (\n    <div className="p-4">\n${body}\n    </div>\n  )\n}\n\nexport default App\n`;
const APP_FONT = app(`      <h1 className="font-serif-tc text-3xl font-bold">生活小物的靜謐時光</h1>\n      <p className="mt-2">用小物打造專屬的心靈港灣</p>`);
const APP_H1 = app(`      <h1 className="h1">生活小物的靜謐時光</h1>\n      <p className="mt-2">用小物打造專屬的心靈港灣</p>`);

const fonts = list(['區塊標題：<b>Noto Serif TC</b>（有襯線）', '小卡名稱、內文：<b>Noto Sans TC</b>（無襯線）']);
const sizes = `<table style="width:100%;border-collapse:collapse;font-size:12.5px;text-align:center"><tr style="background:#e3efe8"><th></th><th>桌面</th><th>手機</th></tr>
  <tr><td>H1</td><td>48px</td><td>32px</td></tr><tr><td>H2</td><td>32px</td><td>24px</td></tr><tr><td>H3</td><td>28px</td><td>20px</td></tr><tr><td>H4～H7</td><td>24～14</td><td>20～12</td></tr><tr><td>內文 T-L／M／R</td><td>20／16／14</td><td>18／16／14</td></tr></table>`;
const mobileFirst = list(['先寫<b>手機</b>的大小（預設）', '螢幕 ≥ 768px（<code>md</code>）再改成桌面大小', '<code>1rem = 16px</code>　2rem ＝ 32px、3rem ＝ 48px']);

const beats = [
  chapter('開場', ['第 4 部', '字型與文字樣式', '🔤']),
  T('今天來處理「字」！字型好不好看，網站氣質差很多～'),
  float(card('🔤 設計稿的字型', fonts)),
  R('標題是有襯線的宋體風，內文是黑體風，對不對？', 'happy'),
  T('對！這兩個字型要從 Google Fonts 載入。打開 `index.html`，在 `title` 前面加幾行～'),
  unfloat,
  type('index.html', C.INDEX_HTML_2),
  T('重點是 `link` 那一行：指定要 Sans 的 400、700 粗細，和 Serif 的 700 粗細。', 'happy'),

  chapter('新人先試'),
  T('接著回到 `index.css`，在 `@theme` 裡幫標題用的字型取名字。換你囉！'),
  open('src/index.css'),
  R('我知道！取名叫 `serif-tc`，然後在 `App.tsx` 用 `font-serif-tc`。', 'happy', { jump: 'rookie' }),
  type('src/index.css', CSS_F1),
  type('src/App.tsx', APP_FONT),
  view(2200),
  { fx: 'shake' },
  R('咦？標題還是黑體字，沒有變宋體欸…', 'surprised', { fx: '❗' }),

  chapter('老師點醒'),
  T('別急～還記得上一部「顏色」的規則嗎？Tailwind 靠名字的什麼來判斷？', 'normal'),
  R('呃…名字的「開頭」？顏色要用 `color` 開頭…', 'worried'),
  T('那字型呢？你覺得要用什麼開頭？', 'happy'),
  open('src/index.css'),
  hl(19, 19),
  R('應該是…`font` 開頭！我只寫了 `serif-tc`！', 'surprised', { fx: '❗', jump: 'rookie' }),
  unhl,
  type('src/index.css', CSS_F2, { slow: true }),
  view(2400),
  R('變成宋體了！好有氣質～', 'happy', { fx: '✨' }),
  T('對！規則是通用的：`--color-` 是顏色、`--font-` 是字型，Tailwind 才知道要幫你變出哪一種 class。', 'happy', { fx: '💡' }),

  chapter('內文字型'),
  T('內文呢？Tailwind 本來就有一個 `font-sans` 管全站的內文，我們把它換成 Noto Sans TC 就好。', 'happy'),
  type('src/index.css', C.CSS_3),
  hl(20, 20),
  T('`--font-sans` 是「覆蓋」內建的，所以全站的字都會自動變。', 'happy'),
  unhl,
  hl(23, 27),
  R('下面這段 `@layer base` 是什麼？', 'normal'),
  T('`base` 是放「整個網站預設樣式」的地方，這裡設定全站文字顏色是近黑色的 `n-80`。', 'happy'),
  unhl,

  chapter('文字樣式'),
  T('設計稿還有一張文字樣式表，每種樣式桌面和手機的大小不一樣。', 'normal'),
  float(card('📏 文字樣式（設計稿）', sizes)),
  R('每次都要寫字型、粗細、行高、手機大小、桌面大小…太麻煩了啦！', 'worried'),
  unfloat,
  T('所以我們把它們包成一個 class。用 Tailwind 的 `@utility`，來，先做 `h1`～', 'happy', { fx: '💡' }),
  R('我來！桌面標題是 48px，也就是 3rem～', 'happy'),
  type('src/index.css', H1_BAD),
  type('src/App.tsx', APP_H1),
  vp('mobile'),
  view(2400),
  { fx: 'shake' },
  R('欸？手機上標題好大，一行都放不下，換好幾行了…', 'surprised', { fx: '💦' }),
  T('我們看一下，你的 `h1` 只寫了一個大小。手機螢幕這麼窄，應該從「手機的大小」開始寫，對吧？', 'normal'),
  R('對耶！我只寫了桌面的，沒有手機版！', 'surprised', { jump: 'rookie' }),
  T('這叫「手機優先」：先寫手機的樣子，再用 `@media` 在大螢幕改大。', 'happy'),
  float(card('📱➡️🖥️ 手機優先', mobileFirst)),
  wait(3200),
  unfloat,
  type('src/index.css', C.CSS_4a, { slow: true }),
  view(2200),
  R('手機上變成 32px 了，剛剛好～', 'happy', { fx: '✨' }),
  T('換成桌面寬度看看！', 'happy'),
  vp('desktop'),
  wait(2600),
  R('到桌面就變成 48px 了！同一個 `h1`，會自己變大變小～', 'surprised', { jump: 'rookie' }),
  vp('mobile'),

  chapter('全部文字樣式'),
  T('其他的 h2～h7、內文 t-l、t-m、t-r、t-s，做法一模一樣，只是數字不同。我們快轉帶過～'),
  type('src/index.css', C.CSS_4d, { bulk: true }),
  T('設計稿 11 種文字樣式，全部做好了！', 'happy'),
  type('src/App.tsx', C.APP_4),
  view(2600),
  R('標題是宋體、內文是黑體，大小也都有層次！', 'happy', { fx: '✨' }),
  T('以後直接寫 `className="h2"` 或 `className="t-m"` 就好，超方便。', 'happy'),
  T('順帶一提：`className="h1"` 只是「套用樣式」，跟標籤叫什麼無關，`p` 標籤也可以套 `h1` 的樣式喔～', 'normal'),

  chapter('今天學到'),
  T('來，換你當小老師～'),
  R('我來整理！', 'happy'),
  float(card('📝 今天學到', list(['字型要從 Google Fonts 載入，再在 <code>@theme</code> 取名：<code>--font-</code> 開頭', '<code>@utility</code> 把「字型＋粗細＋行高＋手機／桌面大小」包成一個 class', '手機優先：先寫手機大小，再用 <code>@media (min-width: 48rem)</code> 放大']))),
  wait(5600),
  T('太棒了！下一部我們來做第一個元件：按鈕～', 'happy', { fx: '🎉' }),
  confetti,
  unfloat,
  wait(1500),
];

export default {
  title: '共用字型與文字樣式',
  endSub: '下一部：Button 元件（TypeScript）',
  beats,
};
