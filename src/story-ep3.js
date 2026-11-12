// 動畫版樣品：第 3 部「共用顏色」── 老師 ＋ 新人。
// 演法：新人先試 → 做錯（顏色沒出現）→ 老師用問題點醒 → 新人自己找到原因 → 修好。
// 程式碼和影片版第 3 部一致（最後的 CSS 就是 tw-react-code.js 的 CSS_2、色票畫面照 APP_3 的做法）。
import { startStory } from './story-player.js';
import * as C from './tw-react-code.js';

const CSS_START = '@import "tailwindcss";\n';
const css = (name, hex) => `@import "tailwindcss";\n\n@theme {\n  ${name}: ${hex};\n}\n`;
const CSS_TRY = css('--primary-dark', '#1d6617'); // 少了 color- ：做錯的版本
const CSS_FIX = css('--color-primary-dark', '#1d6617');
const CSS_LIGHT = css('--color-primary-dark', '#598e71');

const APP_TRY = `function App() {
  return (
    <div className="p-4">
      <div className="bg-primary-dark p-4 text-white">主色深綠</div>
      <p className="mt-3 text-sm">↑ 上面應該要有一塊深綠色</p>
    </div>
  )
}

export default App
`;
const APP_USES = `function App() {
  return (
    <div className="space-y-3 p-4">
      <div className="bg-primary-dark p-4 text-white">背景是 primary-dark</div>
      <p className="text-primary-dark">文字是 primary-dark</p>
      <div className="border-4 border-primary-dark p-4">框線是 primary-dark</div>
    </div>
  )
}

export default App
`;
const APP_SWATCH = `function App() {
  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      <div className="bg-primary-80 p-3">primary-80</div>
      <div className="bg-primary-100 p-3 text-white">primary-100</div>
      <div className="bg-primary-dark p-3 text-white">primary-dark</div>
      <div className="bg-bgc-green p-3">bgc-green</div>
      <div className="bg-n-20 p-3">n-20</div>
      <div className="bg-n-40 p-3">n-40</div>
      <div className="bg-n-60 p-3 text-white">n-60</div>
      <div className="bg-n-80 p-3 text-white">n-80</div>
    </div>
  )
}

export default App
`;
const APP_ALPHA = `function App() {
  return (
    <div className="space-y-3 p-4">
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-primary-80 p-3">80</div>
        <div className="bg-primary-100 p-3 text-white">100</div>
        <div className="bg-primary-dark p-3 text-white">dark</div>
        <div className="bg-bgc-green p-3">bgc</div>
      </div>
      <div className="bg-primary-100 p-5">
        <div className="bg-n-60/40 p-3 text-white">bg-n-60/40　半透明的灰色</div>
      </div>
    </div>
  )
}

export default App
`;

const sw = (bg, name, hex, dark = false, i = 0) => `<div class="sw" style="background:${bg};color:${dark ? '#fff' : '#222'};animation-delay:${i * 0.06}s">${name}<small>${hex}</small></div>`;
const FIGMA = `<h5>🎨 設計稿的 Color（Figma）</h5><div class="sw-row">${[
  ['#e3efe8', 'primary 80', '#E3EFE8'], ['#598e71', 'primary 100', '#598E71', 1], ['#1d6617', 'primary dark', '#1D6617', 1],
  ['#fff', 'white', '#FFFFFF'], ['#e8e8e8', '20', '#E8E8E8'], ['#9d9d9d', '40', '#9D9D9D'], ['#575757', '60', '#575757', 1], ['#1e1e1e', '80', '#1E1E1E', 1], ['#f6f9eb', 'bgc green', '#F6F9EB'],
].map(([bg, n, h, d], i) => sw(bg, n, h, d, i)).join('')}</div>`;
const RECAP = `<h5>📝 今天學到</h5><ul class="ck">
  <li style="animation-delay:.1s">✅ 顏色放在 <code>@theme</code>，取名字</li>
  <li style="animation-delay:.7s">✅ 名字要用 <code>--color-</code> 開頭</li>
  <li style="animation-delay:1.3s">✅ 改一個地方，全站一起變</li></ul>`;

const beats = [
  // ── 開場 ──
  { chapter: '開場', card: ['第 3 部', '共用顏色', '🎨'], ms: 2300 },
  { say: 'teacher', mood: 'happy', text: '早安～新人！今天我們要幫網站準備一盒「調色盤」🎨' },
  { say: 'rookie', mood: 'normal', text: '調色盤？設計稿的顏色，我直接寫色碼不就好了嗎？' },
  { float: FIGMA },
  { say: 'teacher', mood: 'happy', text: '先考考你～設計稿的深綠色 `#1d6617`，會用在按鈕、文字、框線。要寫幾次？' },
  { say: 'rookie', mood: 'worried', text: '呃…三次？', fx: '💦' },
  { say: 'teacher', mood: 'normal', text: '那如果設計師說「綠色再淺一點」呢？' },
  { say: 'rookie', mood: 'surprised', text: '我要找三個地方，一個一個改！？😱', jump: 'rookie' },
  { float: null },
  { say: 'teacher', mood: 'happy', text: '對！所以我們把顏色「取名字」，只放在一個地方。', fx: '💡' },
  { say: 'teacher', mood: 'happy', text: '這個地方叫 `@theme`。來，打開 `src/index.css`。' },
  { code: { file: 'src/index.css', text: CSS_START, speed: 30 } },
  { hl: [1, 1] },
  { say: 'teacher', mood: 'normal', text: '第一行是上次裝 Tailwind 時寫的，它把 Tailwind 整個叫進來。' },
  { hl: null },

  // ── 新人先試 ──
  { chapter: '新人先試' },
  { say: 'teacher', mood: 'happy', text: '換你囉！把主色「深綠」取名叫 `primary-dark`，試試看～' },
  { say: 'rookie', mood: 'happy', text: '沒問題！看我的～😎', jump: 'rookie' },
  { code: { file: 'src/index.css', text: CSS_TRY, speed: 34 } },
  { say: 'rookie', mood: 'happy', text: '再到 `App.tsx` 把它用上去！' },
  { code: { file: 'src/App.tsx', text: APP_TRY, speed: 20 } },
  { view: true },
  { fx: 'shake' },
  { say: 'rookie', mood: 'surprised', text: '咦？？沒有顏色欸…我哪裡打錯了嗎？', fx: '❗' },

  // ── 老師點醒 ──
  { chapter: '老師點醒' },
  { say: 'teacher', mood: 'normal', text: '別慌別慌，深呼吸～我問你喔：Tailwind 看到 `--primary-dark`，它怎麼知道這是「顏色」？' },
  { file: 'src/index.css' },
  { hl: [4, 4] },
  { say: 'rookie', mood: 'worried', text: '嗯…它只看到一個名字和 `#1d6617`…會不會以為是別的東西？' },
  { say: 'teacher', mood: 'happy', text: '沒錯！Tailwind 靠名字的「開頭」分類：`color` 開頭才是顏色，`font` 開頭是字型。', fx: '💡' },
  { say: 'rookie', mood: 'surprised', text: '啊！我少寫了 `color`！', fx: '❗', jump: 'rookie' },
  { hl: null },

  // ── 修好 ──
  { chapter: '修好它' },
  { code: { file: 'src/index.css', text: CSS_FIX, speed: 70 } },
  { view: true, ms: 2000 },
  { say: 'rookie', mood: 'happy', text: '哇！深綠色出現了！！', jump: 'rookie', fx: '✨' },
  { say: 'teacher', mood: 'happy', text: '耶～現在 Tailwind 會自動長出一整組 class：`bg-primary-dark`、`text-primary-dark`、`border-primary-dark`…' },
  { say: 'rookie', mood: 'normal', text: '真的嗎？我來試試！' },
  { code: { file: 'src/App.tsx', text: APP_USES, speed: 18 } },
  { view: true },
  { say: 'rookie', mood: 'happy', text: '同一個名字，背景、文字、框線都能用！' },
  { say: 'teacher', mood: 'normal', text: '那設計師說「綠色再淺一點」的時候呢？' },
  { file: 'src/index.css' },
  { say: 'rookie', mood: 'happy', text: '我只要改 `@theme` 這一個地方～' },
  { code: { file: 'src/index.css', text: CSS_LIGHT, speed: 80 } },
  { view: true, ms: 2200 },
  { say: 'rookie', mood: 'surprised', text: '三個地方，一起變淺了！！', fx: '✨' },
  { say: 'teacher', mood: 'happy', text: '對吧～這就是「取名字」的威力。先改回深綠吧！' },
  { code: { file: 'src/index.css', text: CSS_FIX, speed: 80 } },
  { view: true, ms: 1200 },

  // ── 放進全部顏色 ──
  { chapter: '全部顏色' },
  { say: 'teacher', mood: 'happy', text: '好～把設計稿的 9 個顏色都放進調色盤吧！' },
  { float: FIGMA },
  { say: 'rookie', mood: 'normal', text: '主色三個、中性色四個，再加一個背景綠…我來！' },
  { float: null },
  { code: { file: 'src/index.css', text: C.CSS_2, speed: 11 } },
  { hl: [10, 13] },
  { say: 'teacher', mood: 'happy', text: '中性色我取名 `n-20`、`n-40`…短一點好打。白色不用放，Tailwind 內建 `white`。' },
  { hl: null },
  { code: { file: 'src/App.tsx', text: APP_SWATCH, speed: 10 } },
  { view: true, ms: 2000 },
  { say: 'rookie', mood: 'surprised', text: '哇～跟設計稿的色票一模一樣！', fx: '✨', jump: 'rookie' },
  { say: 'rookie', mood: 'normal', text: '對了老師，設計稿的文字框有點「半透明」，那種怎麼寫？' },
  { say: 'teacher', mood: 'happy', text: '在顏色後面加斜線和數字！`bg-n-60/40` 就是 n-60 的灰色、`40%` 不透明度。' },
  { code: { file: 'src/App.tsx', text: APP_ALPHA, speed: 12 } },
  { view: true, ms: 2200 },
  { say: 'rookie', mood: 'happy', text: '透出底下的淺綠色了！好可愛～' },

  // ── 今天學到 ──
  { chapter: '今天學到' },
  { say: 'teacher', mood: 'happy', text: '來，換你當小老師，今天學到什麼？' },
  { say: 'rookie', mood: 'happy', text: '我來整理！' },
  { float: RECAP },
  { wait: 4200 },
  { say: 'teacher', mood: 'happy', text: '滿分！下一部我們來設定字型和文字樣式～', fx: '🎉' },
  { fx: 'confetti' },
  { float: null },
  { wait: 1800 },
];

startStory(document.getElementById('story'), {
  title: '第 3 部　共用顏色',
  cast: { teacher: { role: 'teacher', name: 'Lily 老師' }, rookie: { role: 'me', name: '新人' } },
  beats,
  backHref: 'tailwind-react-video.html',
  endTitle: '第 3 部完成！',
  endSub: '這是動畫版的樣品。下一部：共用字型與文字樣式',
});
