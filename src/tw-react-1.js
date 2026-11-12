// 第 1～5 部：建專案、Tailwind v4 環境、共用顏色、共用字型與文字樣式、Button 元件
import * as C from './tw-react-code.js';

const URL = 'http://localhost:5173';
const swatch = (bg, label, light = false) =>
  `<span style="display:inline-block;width:96px;margin:0 6px 6px 0;padding:10px 6px;background:${bg};color:${light ? '#fff' : '#222'};font-size:12px">${label}</span>`;

export const EPISODES_1 = [
  {
    title: '建立專案（Vite + React + TypeScript）',
    steps: [
      { say: '歡迎來到這個系列。我們要把 Figma 設計稿「I need this」做成真的網頁，用 React、TypeScript 和 Tailwind 第四版，資料來自六角的 API。', slide: ['🛍️ I need this 生活小物電商', 'React ＋ TypeScript ＋ Tailwind v4 ＋ 六角 API', '一共 13 部，每一步都很小'] },
      { say: '設計稿有五個頁面：首頁、產品列表、品牌介紹、商品細節、結帳，每一頁都有桌面版和手機版。這一輯我們先做到「首頁」，其他頁面之後再一頁一頁加。', slide: ['這一輯：環境設定 → 共用顏色字型按鈕 → 導覽列 → 首頁', '之後：產品列表、品牌介紹、商品細節、結帳'] },
      { say: '看設計稿有個小技巧。Design System 那一頁放的是顏色、字型、按鈕，是我們最先要做的共用設定。UI mockup 那一頁才是每個畫面的樣子。', slide: ['💎 Design System：顏色、字型、按鈕、導覽列', '🖥️ UI mockup：每一頁的桌面版和手機版'] },
      { say: '開始前先確認電腦裝好 Node.js。打開終端機，輸入 node 空一格 減號 v。新版 Vite 要求 Node 20.19 以上，或是 22.12 以上，版本太舊要先更新。', term: ['$ node -v', 'v22.11.0', '$ npm -v', '10.9.0'] },
      { say: '用 VS Code 的終端機最方便，按 Control 加反引號就會打開。先用 cd 走到你放專案的資料夾，這裡以桌面的 project 資料夾為例。', term: ['$ cd Desktop/project'] },
      { say: '輸入這行指令建立專案。Vite 是建專案和開發的工具。後面的 template react-ts，意思是用「React 加 TypeScript」的範本。專案名稱我們取 i-need-this。', term: ['$ npm create vite@latest i-need-this -- --template react-ts', '', 'Done. Now run:', '', '  cd i-need-this', '  npm install', '  npm run dev'] },
      { say: '如果它中途問你要不要現在安裝並啟動，選 No。我們自己一步一步來。接著走進資料夾，用 npm install 把需要的套件裝起來。', term: ['$ cd i-need-this', '$ npm install', 'found 0 vulnerabilities'] },
      { say: '用 VS Code 打開這個資料夾，看一下裡面有什麼。index.html 是網頁入口，src 資料夾放我們的程式，main.tsx 是程式開始的地方，App.tsx 是整個畫面的根元件。', slide: ['index.html　網頁的入口', 'src/main.tsx　程式從這裡開始', 'src/App.tsx　整個畫面的根元件', 'vite.config.ts　Vite 的設定', 'tsconfig.app.json　TypeScript 的設定'] },
      { say: '新版範本的 TypeScript 設定比較嚴格，有兩個規則後面會遇到。第一，只拿來當型別用的 import，前面要加 type。第二，不能使用 enum。', slide: ['import type { Product } from ...', '↑ 只用來當型別，就要寫 import type', '❌ 不能用 enum（用 union type 取代）'] },
      { say: '輸入 npm run dev 啟動開發伺服器。它會告訴你網址，通常是 localhost 冒號 五一七三。', term: ['$ npm run dev', '  VITE ready in 300 ms', '  ➜  Local:   http://localhost:5173/'] },
      { say: '打開瀏覽器，會看到 Vite 和 React 的預設歡迎畫面。這個畫面我們用不到，下一步就把它清乾淨。', web: { url: URL, html: '<div style="text-align:center"><b style="font-size:20px">Vite + React</b><p style="margin:6px 0">Get started — Edit <code>src/App.tsx</code> and save to test HMR</p><span class="fake btn">Count is 0</span></div>' } },
      { say: '先清理不要的檔案。在 VS Code 左邊的檔案列，對 src 裡的 App.css 按右鍵，選 Delete。再把 src 裡的 assets 資料夾也刪掉。', slide: ['刪掉 src/App.css', '刪掉 src/assets 資料夾', '打開 src/index.css，內容全部刪光，留空白'] },
      { say: '打開 App.tsx，全部換成這樣。App 是一個函式，它回傳什麼，畫面就顯示什麼。檔名是 tsx，是因為裡面有 JSX，也就是長得像 HTML 的語法。', file: 'src/App.tsx', code: C.APP_1 },
      { say: '再改 index.html。第一個，lang 改成 zh-Hant，告訴瀏覽器這是繁體中文網頁。第二個，title 改成 I need this。', file: 'index.html', code: C.INDEX_HTML_1 },
      { say: '存檔之後不用重新整理，瀏覽器會自己更新。看到這行字，代表專案建好了。', web: { url: URL, html: '<h3 style="margin:0;font-family:serif">I need this</h3>' } },
      { say: '這一部完成了：用 Vite 建好 React 加 TypeScript 專案，清掉預設內容，開發伺服器也跑起來了。下一部來安裝 Tailwind。', slide: ['✅ npm create vite → react-ts', '✅ npm install、npm run dev', '✅ 清掉預設畫面'] },
    ],
  },
  {
    title: '安裝 Tailwind CSS v4',
    steps: [
      { say: '這一部安裝 Tailwind。我們用的是第四版，跟你看過的舊教學有一個大差別：不需要 tailwind.config.js，也不用再設定 PostCSS，只要三個動作。', slide: ['Tailwind v4 只要 3 件事', '① 安裝套件　② 設定 Vite 外掛　③ CSS 第一行 import'] },
      { say: '先看一下官方文件。打開 tailwindcss.com，進到文件的 Installation，選 Using Vite。官方會一直更新，如果以後步驟不一樣，以官網為準。', web: { url: 'https://tailwindcss.com/docs/installation/using-vite', html: '<b>Install Tailwind CSS with Vite</b><ol style="margin:6px 0;padding-left:20px"><li>Create your project</li><li>Install Tailwind CSS</li><li>Configure the Vite plugin</li><li>Import Tailwind CSS</li></ol>' } },
      { say: '輸入這行指令，安裝 Tailwind 本體，和給 Vite 用的外掛。外掛會在你存檔時，自動把用到的 class 轉成 CSS。', term: ['$ npm install tailwindcss @tailwindcss/vite', 'added 20 packages', 'found 0 vulnerabilities'] },
      { say: '打開 vite.config.ts，把 Tailwind 外掛加進去。第一行 import 外掛，最後 plugins 這個陣列裡，除了 react，再加上 tailwindcss。', file: 'vite.config.ts', code: C.VITE_CONFIG },
      { say: '打開 src/index.css，只寫這一行。意思是：把 Tailwind 全部拉進來。我們之後的顏色、字型設定，都會寫在這個檔案裡。', file: 'src/index.css', code: C.CSS_1 },
      { say: '那這個 css 怎麼進到網頁的？其實範本的 main.tsx 已經幫你寫好了，第三行有一句 import 斜線 index.css。我們不需要改。', slide: ['src/main.tsx', "import './index.css'", '↑ 範本已經寫好，不用動'] },
      { say: '改一下 App.tsx 來試試看。className 裡面放的就是 Tailwind 的 class。text-3xl 是大字，font-bold 是粗體，text-red-500 是紅色。', file: 'src/App.tsx', code: C.APP_2 },
      { say: '因為改了 vite.config.ts，要把開發伺服器重開才會生效。在終端機按 Control 加 C 停掉它，再輸入 npm run dev。以後只改程式，就不用重開。', term: ['^C', '$ npm run dev', '  VITE ready in 280 ms', '  ➜  Local:   http://localhost:5173/'] },
      { say: '標題變成又大又粗又紅的字了，代表 Tailwind 裝好了。這個紅色只是測試，下一部我們就換成設計稿的顏色。', web: { url: URL, html: '<h3 style="margin:0;font-size:30px;font-weight:700;color:#ef4444">I need this</h3>' } },
      { say: '最後建議在 VS Code 安裝一個擴充套件，叫 Tailwind CSS IntelliSense。安裝後，你打 class 的時候會跳出建議，滑鼠移上去還會看到對應的 CSS，非常好用。', slide: ['VS Code → 擴充套件（Ctrl+Shift+X）', '搜尋：Tailwind CSS IntelliSense', '打 class 會跳出建議，滑鼠移上去看 CSS'] },
      { say: '這一部完成了：安裝 Tailwind、設定 Vite 外掛、在 CSS 匯入。下一部開始設定設計稿的共用顏色。', slide: ['✅ npm install tailwindcss @tailwindcss/vite', '✅ vite.config.ts 加 tailwindcss()', '✅ index.css：@import "tailwindcss"'] },
    ],
  },
  {
    title: '共用顏色（@theme）',
    steps: [
      { say: '這一部把設計稿的顏色放進 Tailwind。打開 Figma 的 Design System 那一頁，看 Color 這一區，一共有三組顏色。', slide: ['Primary：primary 80、primary 100、primary dark', 'Neutral：white、20、40、60、80', 'Other：bgc green'] },
      { say: '把顏色寫在 CSS 的 @theme 裡，Tailwind 就會幫你變出對應的 class。規則很簡單：變數名稱要以 color 開頭，後面接你取的名字。', slide: ['--color-primary-dark: #1d6617;', '⬇️ 自動變出', 'bg-primary-dark　text-primary-dark　border-primary-dark'] },
      { say: '先加主色。設計稿三個主色：primary 80 是 E3EFE8，淺綠色。primary 100 是 598E71，中間的綠。primary dark 是 1D6617，深綠色，按鈕就是用它。', file: 'src/index.css', code: C.CSS_2a },
      { say: '再加中性色。設計稿的 Neutral 有 20、40、60、80，從淺灰到近黑。我把名字取成 n-20、n-40，這樣 class 會比較短。白色就不用另外設，Tailwind 本來就有 white。', file: 'src/index.css', code: C.CSS_2b },
      { say: '最後是其他色，bgc green，是很淺的黃綠色背景，色碼 F6F9EB。我取名叫 bgc-green。', file: 'src/index.css', code: C.CSS_2 },
      { say: '注意一件事：色碼我都改成小寫，這只是寫法習慣，大小寫在 CSS 裡是一樣的。取名字時，盡量照著設計稿的名字，之後你和設計師討論才不會對不上。', slide: ['設計稿 primary dark　→　primary-dark', '設計稿 Neutral 60　→　n-60', '設計稿 bgc green　→　bgc-green'] },
      { say: '來試試看。把 App.tsx 換成這樣，一個格子放一種顏色。bg 開頭是背景色，text-white 是白色文字，因為深色背景上黑字會看不到。', file: 'src/App.tsx', code: C.APP_3 },
      { say: '畫面上出現八種顏色的格子，跟設計稿的色票一樣。grid-cols-2 是手機兩欄，md:grid-cols-4 是螢幕變大後改成四欄，這個 md 冒號的寫法，後面會常常用到。', web: { url: URL, html: swatch('#e3efe8', 'primary-80') + swatch('#598e71', 'primary-100', true) + swatch('#1d6617', 'primary-dark', true) + swatch('#f6f9eb', 'bgc-green') + '<br>' + swatch('#e8e8e8', 'n-20') + swatch('#9d9d9d', 'n-40') + swatch('#575757', 'n-60', true) + swatch('#1e1e1e', 'n-80', true) } },
      { say: '設定好之後，這些顏色可以用在很多地方。背景、文字、框線、漸層、還有透明度，例如 bg-n-60 斜線 40，就是 n-60 的 百分之四十 透明度。', slide: ['bg-primary-dark　背景', 'text-n-60　文字', 'border-primary-100　框線', 'from-white via-primary-80 to-white　漸層', 'bg-n-60/40　透明度 40%'] },
      { say: '這一部完成了：九個顏色都設定好了。以後想改顏色，只要改 index.css 這一個地方，全站就會一起變。下一部設定字型。', slide: ['✅ @theme 裡設定 --color-*', '✅ 自動變出 bg-、text-、border- 等 class', '✅ 全站只要改一個地方'] },
    ],
  },
  {
    title: '共用字型與文字樣式',
    steps: [
      { say: '這一部設定字型和文字大小。看設計稿 Typography 那一區。標題用 Noto Serif TC，有襯線的字；內文和小標用 Noto Sans TC，沒有襯線。', slide: ['區塊標題：Noto Serif TC（襯線）', '小卡名稱、內文：Noto Sans TC（無襯線）'] },
      { say: '這兩個字型要從 Google Fonts 載入。打開 index.html，在 title 前面加上這幾行。最重要的是 link 那一行，裡面指定要 Sans 的 400 和 700 粗細，還有 Serif 的 700 粗細。', file: 'index.html', code: C.INDEX_HTML_2 },
      { say: '接著回到 index.css 的 @theme 裡設定字型名稱。font-serif-tc 是新增的，之後用 font-serif-tc 這個 class。font-sans 是 Tailwind 本來就有的內文字型，我們把它換掉，全站的字就自動變成 Noto Sans TC。', file: 'src/index.css', code: C.CSS_3 },
      { say: '再看一下最下面這段 @layer base。base 是放「整個網站預設樣式」的地方，這裡設定全站文字顏色是 n-80，也就是近黑色。', slide: ['@layer base { body { color: ... } }', 'base ＝ 整站的預設樣式', '之後元素不用每次都寫文字顏色'] },
      { say: '再看設計稿的文字樣式表。每種樣式有桌面版和手機版，字級不一樣。例如 H1，桌面 48 像素，手機是 32 像素。', slide: ['H1　桌面 48 / 手機 32　襯線　粗體', 'H2　32 / 24　襯線　粗體', 'H3　28 / 20　襯線　粗體', 'H4　24 / 20　粗體', 'H5 18　H6 16　H7 14 / 12'] },
      { say: '每次都要寫「字型、粗細、行高、手機大小、桌面大小」太麻煩。所以我們用 Tailwind 的 @utility，把它們包成一個 class。以後只要寫 className 等於 h1 就好。', slide: ['className="h1"', '＝ 字型 ＋ 粗細 ＋ 行高 ＋ 手機大小 ＋ 桌面大小', '一個名字，全部搞定'] },
      { say: '先做 h1。@utility 後面接名字。裡面寫一般的 CSS：襯線字型、粗體、行高一點二，手機字級 2rem，就是 32 像素。', file: 'src/index.css', code: C.CSS_4a },
      { say: '看最下面那段 media。min-width 48rem，意思是螢幕寬度到 768 像素以上，字級改成 3rem，就是 48 像素。這跟 Tailwind 的 md 斷點是同一個數字。這種「先寫手機，再往大螢幕調整」的做法，叫做手機優先。', slide: ['先寫手機版（預設）', '螢幕 ≥ 768px（md）再改成桌面版', '1rem = 16px　→　2rem = 32px、3rem = 48px'] },
      { say: '接著做 h2 和 h3。一樣是襯線粗體，只有字級不同。h2 是 24 到 32，h3 是 20 到 28。', file: 'src/index.css', code: C.CSS_4b },
      { say: '再做 h4 到 h7。這幾個是無襯線，所以不用寫 font-family，會自動用我們剛剛設定的 Noto Sans TC。注意 h5 和 h6 手機桌面一樣大，所以不用寫 media。', file: 'src/index.css', code: C.CSS_4c },
      { say: '最後是內文四種：t-l、t-m、t-r 是一般粗細，行高一點五，比較好閱讀；t-s 是粗體小字。這樣文字樣式就全部設定完了。', file: 'src/index.css', code: C.CSS_4d },
      { say: '試試看。App.tsx 放上每一種文字樣式。注意是 className 等於 h1，不是標籤名稱，所以一個 p 標籤也可以套 h1 的樣式，語意和外觀是分開的。', file: 'src/App.tsx', code: C.APP_4 },
      { say: '畫面上，標題是襯線字，大小會隨視窗寬度改變。你可以把瀏覽器視窗拉寬再縮小，看字級在 768 像素的地方跳一下。', web: { url: URL, html: '<div style="font-family:serif;font-weight:700;font-size:26px;line-height:1.2">生活小物的靜謐時光</div><div style="font-family:serif;font-weight:700;font-size:20px;margin:6px 0">這個季節剛剛好</div><div style="font-weight:700;font-size:16px">日常療癒・文青系</div><p style="margin:6px 0 0;font-size:14px;color:#575757">Body T-R：隨時專注於自己的步調</p>' } },
      { say: '這一部完成了：載入字型、設定字型名稱、做出十一個文字樣式。接下來所有元件，標題就用 h1 到 h7，內文用 t-l、t-m、t-r、t-s。', slide: ['✅ Google Fonts 載入 Noto Serif / Sans TC', '✅ @theme 設定字型', '✅ @utility h1～h7、t-l／t-m／t-r／t-s'] },
    ],
  },
  {
    title: 'Button 元件（TypeScript）',
    steps: [
      { say: '這一部做按鈕。設計稿的按鈕有實心和空心兩種，每種有預設、滑鼠移上去、按下去三個狀態，桌面和手機版的大小也不同。', slide: ['實心 fill：深綠底、白字', '空心 unfill：只有綠色字', '狀態：default／hover／active'] },
      { say: '按鈕怎麼做有兩種方式。你的逐字稿用的是 @apply，把一堆 class 收成一個 CSS 類別。但我們用 React，所以改做成「元件」，不只收樣式，還能用 TypeScript 限制可以傳什麼。', slide: ['方式一：CSS 的 @apply（逐字稿）', '方式二：React 元件（這一部）', '元件可以加型別，打錯會馬上報錯'] },
      { say: '在 src 裡新增 components 資料夾，裡面新增 Button.tsx。先寫最簡單的，一個函式回傳一個 button。', file: 'src/components/Button.tsx', code: C.BUTTON_0 },
      { say: '這個按鈕不能按、也不能放文字，因為什麼都沒傳進去。我們讓它接受所有「原生按鈕」該有的屬性。ComponentProps 加上尖括號 button，就是「一個按鈕所有可以用的屬性」，例如 onClick、disabled、children。', file: 'src/components/Button.tsx', code: C.BUTTON_0b },
      { say: '注意第一行是 import type，因為 ComponentProps 只是型別，沒有用在執行的程式。記得第一部說的規則嗎？只拿來當型別的，前面要加 type。', slide: ['import type { ComponentProps } from "react"', '↑ 只當型別 → 一定要加 type', '❌ 不加會出現 TS1484 錯誤'] },
      { say: '接著加上款式。type Variant 等於 fill 或 unfill，這叫聯集型別，意思是只能是這兩個字串其中一個。variant 後面的問號代表可以不傳。', slide: ["type Variant = 'fill' | 'unfill'", 'variant?: Variant　← 問號：可不傳', '預設值：variant = "fill"'] },
      { say: '完整的 Button 在這裡。上面 base 放兩種款式共用的 class，variants 是每種款式專屬的 class。Record 加尖括號 Variant 和 string，意思是「每一種 Variant 都要有一個對應的字串」，少了就報錯。', file: 'src/components/Button.tsx', code: C.BUTTON_1 },
      { say: '看一下款式怎麼對應設計稿。fill 預設是深綠底白字；hover 時底色變透明、字變成中間的綠；active 按下去時背景是淺綠、字是深綠。空心的 unfill 則是只有字，hover 和 active 變色。', slide: ['fill：bg-primary-dark text-white', 'hover：透明底 ＋ text-primary-100', 'active：bg-primary-80 ＋ text-primary-dark', 'unfill：只有 text-primary-dark，同樣有 hover／active'] },
      { say: '再看 base 裡的 px-6 py-3 和 md:px-8 md:py-4。手機版內距小一點，到了 md 以上才變大，對應設計稿手機和桌面按鈕大小不同。transition-colors 讓變色有一點點漸變，比較順。', slide: ['px-6 py-3　手機：左右 24px、上下 12px', 'md:px-8 md:py-4　桌面：32px、16px', 'transition-colors　變色時漸變'] },
      { say: '那箭頭怎麼來的？設計稿的按鈕有些有向右箭頭。我們多加一個 arrow 屬性，是 true 的時候，在文字後面放箭頭圖片。圖片檔案在下一部會準備好，現在先看不到箭頭也沒關係。', file: 'src/components/Button.tsx', code: C.BUTTON_2 },
      { say: '來試試。在 App.tsx 放四個按鈕，實心、空心、有箭頭的，還有一個停用的。這四個都是同一個 Button 元件，只是傳的屬性不一樣。', file: 'src/App.tsx', code: C.APP_5 },
      { say: '先別急著存。這裡我們故意傳一個設計稿沒有的款式，variant 等於 blue，TypeScript 會立刻報錯，這就是型別的好處：打錯字或用錯款式，還沒打開瀏覽器就知道了。', slide: ['<Button variant="blue">', '❌ Type \'"blue"\' is not assignable to', "   type 'Variant | undefined'.", '→ 只能是 "fill" 或 "unfill"'] },
      { say: '做好的按鈕，深綠色實心的按鈕，滑鼠移上去會變成透明底綠色字，按下去是淺綠底。空心的按鈕也是類似。之後所有頁面都用這同一個元件，樣式只要在這一個地方改。', web: { url: URL, html: '<span class="fake btn" style="background:#1d6617;color:#fff;border-color:#1d6617">實心按鈕</span><span class="fake" style="color:#1d6617;border:0">空心按鈕</span><span class="fake btn" style="background:#1d6617;color:#fff;border-color:#1d6617">看看商品 ▶</span><span class="fake btn" style="opacity:.5">停用中</span>' } },
      { say: '這一部完成了：用 TypeScript 做出 Button 元件，用聯集型別限制款式，用 Record 確保每個款式都有樣式。之後做第三種白色款式時，你會再看到 TypeScript 怎麼幫你抓漏。', slide: ['✅ ComponentProps<"button"> 繼承原生屬性', "✅ type Variant = 'fill' | 'unfill'", '✅ Record<Variant, string> 不能漏款式', '✅ hover／active 狀態照設計稿'] },
    ],
  },
];
