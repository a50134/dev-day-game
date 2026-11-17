// 第 18 部（品牌介紹）的「為什麼」：FILE_WHY5、LINE_NOTES5（新檔案）、INSERTS5（插進既有 App.tsx 的說明）、STEP_WHY5。
// INSERTS5 用 tw2-annot-checkout.js 的 applyInserts() 插入：applyInserts(lines, INSERTS5, {}, {})。

export const FILE_WHY5 = {
  'src/data/brand.ts': '品牌介紹頁的所有文字和圖片路徑。把「內容」和「版面」分開：以後要改文案，只改這個檔案，不用動版面。',
  'src/components/BrandLines.tsx': '設計稿裡的段落有「手動換行」（一句話一行）。把一串句子接起來、句與句之間換行，這個小動作在頁面裡用了 3 次，所以做成元件。',
  'src/components/BrandBlock.tsx': '頁面中間有兩塊「一邊是文字、一邊是圖片」，只有左右相反，其他一模一樣。做成一個元件，用 <code>reverse</code> 決定圖片在哪邊。',
  'src/pages/BrandPage.tsx': '品牌介紹頁：麵包屑、滿版圖片、「品牌故事」標題與開頭文字（左右各一片月桂葉）、兩塊圖文、結尾的一句話。',
};

export const LINE_NOTES5 = {
  'src/data/brand.ts': [
    ['export type BrandTopic', '一個「主題」：一個小標題，加上底下幾行文字。例如「療癒時光」。'],
    ['lines: string[]', '<code>string[]</code> ＝ 一串文字。每個元素是<b>一行</b>，也就是設計稿裡手動換行的地方。'],
    ['export type BrandBlockData', '一塊「圖＋文字」要的資料：圖片、圖片說明、兩個主題。'],
    ['alt: string', '<code>alt</code> 是圖片的文字說明：圖片壞掉或給螢幕閱讀器時會用到。'],
    ['topics: BrandTopic[]', '一塊裡有好幾個主題（設計稿每塊有 2 個）。'],
    ['export const brandIntro', '「品牌故事」標題底下的開頭三句話。'],
    ['export const brandBlocks: BrandBlockData[]', '兩塊圖文。<code>: BrandBlockData[]</code> 是型別標註：少寫欄位、拼錯名字，TypeScript 馬上紅線。'],
    ["image: '/images/img/hero img-01.jpg'", '圖片放在 <code>public/images/img/</code>，網址從 <code>/images/…</code> 開始寫（<code>public</code> 不用寫）。這張是擴香瓶。'],
    ["title: '生活小物", '第一個主題的小標題。'],
    ["image: '/images/img/hero img-02.jpg'", '第二塊的圖片：森林裡的精油瓶。'],
    ['export const brandClosing', '最後那句結尾，三行。'],
  ],
  'src/components/BrandLines.tsx': [
    ["import { Fragment }", '<code>Fragment</code>：一個「看不見的包裝」。需要把幾個東西包在一起（還要給 <code>key</code>），又不想多一層標籤時用它。'],
    ['lines: string[]', '收一串句子。'],
    ['function BrandLines', '這個元件<b>回傳的是一串東西</b>（陣列），不是單一標籤。React 允許元件直接回傳陣列，所以不用再包一層。'],
    ['lines.map((line, index)', '一行一行處理。<code>index</code> 是第幾行（從 0 開始）。'],
    ['<Fragment key={line}>', '用句子本身當 <code>key</code>（同一串裡每句都不一樣）。'],
    ['{index > 0 && <br />}', '第一行前面不用換行；從第二行開始，先放一個 <code>&lt;br /&gt;</code>（換行）再放文字。'],
  ],
  'src/components/BrandBlock.tsx': [
    ["import type { BrandBlockData }", '資料型別直接用 <code>data/brand.ts</code> 裡定義的，元件不用再寫一次。'],
    ['import BrandLines', '重用上一步的小元件。'],
    ['type BrandBlockProps = BrandBlockData &', '<code>&amp;</code> 是「交集」：把 <code>BrandBlockData</code> 的欄位全部拿來，再多加一個 <code>reverse</code>。'],
    ['reverse?: boolean', '<code>?</code> ＝ 可以不傳。不傳就用下面的預設值。'],
    ['reverse = false', '解構時給預設值：沒有傳 <code>reverse</code> 就是 <code>false</code>（圖片在右邊）。'],
    ["'grid items-center gap-4.5", '手機是一欄（文字在上、圖在下）；桌面變兩欄。<code>items-center</code>：文字和圖片<b>上下置中對齊</b>（設計稿兩邊的中線一樣）。間距手機 18、桌面 24。'],
    ["lg:grid-cols-[526px_1fr]", '圖在左：左欄 526、右欄吃剩下。圖在右時反過來 <code>[1fr_526px]</code>。<b>完整的類別名稱要整串寫出來</b>，Tailwind 才掃得到，不能用字串拼接。'],
    ['space-y-4.5', '兩個主題之間的距離：手機 18、桌面 24。'],
    ['topics.map', '每個主題畫一組：小標題＋文字。'],
    ['<h3 className="h5 text-primary-dark">', '小標題：18px 粗體、深綠色。'],
    ['mt-2.5 t-m lg:mt-4.5', '小標題和文字的距離：手機 10、桌面 18。內文 16px。'],
    ['<BrandLines lines={topic.lines} />', '把這個主題的幾行文字接起來。'],
    ['aspect-343/240', '圖片比例：手機 343×240；桌面 <code>aspect-526/264</code>（526×264，量出來的）。<code>object-cover</code> 讓圖片裁切而不變形。'],
    ["'lg:order-first'", '<code>order-first</code>：把這個元素排到最前面。<b>HTML 順序不變</b>（所以手機版仍是文字在上、圖在下），只有桌面版視覺上把圖換到左邊。'],
  ],
  'src/pages/BrandPage.tsx': [
    ['import Breadcrumb', '第 15 部做的麵包屑，直接重用。'],
    ['function BrandPage', '頁面元件。'],
    ['<>', '<code>&lt;&gt;…&lt;/&gt;</code> 是 Fragment 的簡寫。這一頁有「麵包屑、滿版圖、故事區」三個並排的東西，不需要多包一層 <code>div</code>。'],
    ['pt-6 pb-6 lg:pt-10.5 lg:pb-9.5', '麵包屑上下的空間（量出來的）：手機上 24 下 24；桌面上 42 下 38。'],
    ['items={[{ label:', '兩層麵包屑：首頁（可點）→ 品牌介紹（目前這頁，沒有 <code>to</code>）。'],
    ['src="/images/img/work space.png"', '滿版圖不放進置中的容器，所以左右貼齊螢幕。檔名有空格，瀏覽器會自動處理。'],
    ['aspect-75/32 w-full object-cover lg:aspect-4/1', '手機 375×160（比例 75:32）；桌面 1920×480（比例 4:1）。比例固定，圖片載入前就先佔好位置，不會把下面的內容往下推。'],
    ['bg-[url(/images/bgc-img.png)]', '只有故事區有淡綠色水彩背景（和首頁的區塊同一張圖）。'],
    ['lg:pt-24 lg:pb-41', '桌面上方 96、下方 164（設計稿結尾文字到頁尾的距離，包含原本鳥兒的位置）。'],
    ['<h1 className="h3 text-center">', '<code>h1</code> 是<b>語意</b>（這一頁最大的標題，一頁只放一個）；<code>h3</code> 是<b>外觀</b>（28px 襯線）。標籤和樣式是兩件事，可以分開選。'],
    ['mt-9.5 flex items-center justify-center gap-5 lg:mt-21', '月桂葉和文字排成一橫列：<code>items-center</code> 上下置中、<code>justify-center</code> 左右置中、<code>gap-5</code> 間距 20。'],
    ['graphic-05.svg', '左邊的月桂葉。<code>hidden lg:block</code>：手機隱藏，桌面才顯示。<code>w-29.5</code>＝118px（設計稿量出來的）。'],
    ['max-w-170', '文字最寬 680（680 ÷ 4 ＝ 170），超過就換行。'],
    ['h5 text-center text-primary-dark lg:h4', '「I need this.」：手機 18px、桌面 24px，深綠粗體，置中。'],
    ['mt-4 t-m lg:text-center', '開頭文字：手機靠左、桌面置中（設計稿兩個版本不一樣）。'],
    ['<BrandLines lines={brandIntro} />', '把三句話接起來。'],
    ['graphic-06.svg', '右邊的月桂葉（左邊那片的鏡像，素材裡本來就是兩張圖）。'],
    ['mt-14.5 flex flex-col', '兩塊圖文直排：手機間距 64、桌面 96。'],
    ['brandBlocks.map', '兩塊圖文用同一個元件畫出來。'],
    ['reverse={index % 2 === 1}', '<code>%</code> 是「除以 2 的餘數」。第 1 塊（index 0）餘 0、第 2 塊（index 1）餘 1，所以只有第 2 塊把圖片換到左邊。'],
    ['mt-26 text-center t-m lg:mt-39 lg:t-l', '結尾那句話：置中，手機 16px、桌面 20px。上方空比較多，是因為設計稿這裡原本有兩隻小鳥。'],
  ],
};

export const INSERTS5 = {
  'src/App.tsx': [
    ['path="order/:id"', [
      ['path="brand"', '網址 <code>/brand</code>：品牌介紹。導覽列的「品牌介紹」連結（第 14 部就寫好了）終於有地方去了。'],
    ]],
  ],
};

export const STEP_WHY5 = [
  ['新增 <code>data/brand.ts</code>', '頁面上的文字很多，先整理成資料。以後改文案不用碰版面，版面也不會被一大堆中文淹沒。'],
  ['新增 <code>BrandLines</code>', '設計稿的每個段落都是「一句一行」，頁面裡有 3 個地方要這樣排，所以做成小元件。'],
  ['新增 <code>BrandBlock</code>', '兩塊圖文只有左右相反，其他一樣。做成一個元件，用 <code>reverse</code> 切換。'],
  ['做 <code>BrandPage</code>', '把麵包屑、滿版圖、標題與開頭、兩塊圖文、結尾組起來。'],
  ['<code>App.tsx</code> 新增 <code>brand</code> 路由', '網址 <code>/brand</code> 顯示這一頁。'],
  ['<code>npm run build</code>', '最後確認型別和打包。'],
];
