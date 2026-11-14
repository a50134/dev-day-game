// 第二階段講義的文字：每部重點、設計稿對照（截圖＋這裡要注意什麼＋怎麼量尺寸＋程式怎麼寫）、速查表。

const MEASURE = [
  '在 Figma 點選一個元素，右邊面板會顯示 <b>W（寬）、H（高）</b>和 <b>X、Y（位置）</b>。先量大的（整欄、整張圖），再量小的。',
  '想知道<b>兩個東西中間空多少</b>：先點第一個，再按住 <kbd>Alt</kbd>（Mac 是 <kbd>Option</kbd>）把滑鼠移到第二個，會出現紅色的距離數字（這就是 <code>gap</code>、<code>margin</code>、<code>padding</code> 要填的值）。',
  '換成 Tailwind：<b>像素 ÷ 4 ＝ 數字</b>。例如 306px ÷ 4 ＝ <code>76.5</code> → <code>w-76.5</code>；56px ÷ 4 ＝ 14 → <code>size-14</code>。除不盡也可以直接寫小數，或用 <code>w-[306px]</code>。',
  '寫完要<b>回頭驗證</b>：瀏覽器把視窗調成設計稿的寬度（1920），按 F12 → 點「選取元素」→ 點你要量的東西，會顯示它的寬高。和 Figma 的數字對一下。',
  '注意設計稿的尺寸是<b>沒有捲軸</b>的 1920 寬；有些瀏覽器會有 15px 的捲軸，量出來差一點點是正常的。',
];

export const NOTES2 = [
  { goal: '用 React Router 讓網站有「很多頁」：網址是 / 顯示首頁、/products 顯示產品列表，而且換頁時導覽列、購物車數字都不會消失。',
    points: [
      '安裝：<code>npm install react-router</code>。',
      '三個零件：<b>BrowserRouter</b>（包在最外面，讓大家讀得到網址）、<b>Routes／Route</b>（網址對照表）、<b>Link</b>（換頁用的連結）。',
      '<b>Layout 與 Outlet</b>：每頁都一樣的外框（導覽列、頁尾）只寫一次；<code>&lt;Outlet /&gt;</code> 是中間「換頁的洞」。',
      '頁面元件放在 <code>src/pages/</code>，外框放在 <code>src/layouts/</code>。首頁的內容從 App 搬到 <code>HomePage</code>。',
      '<code>CartProvider</code> 留在 App 最外面（Routes 的外面）：換頁時購物車數字才不會被清掉。',
      '<code>Link</code> 取代 <code>&lt;a href&gt;</code>：<code>to="/products"</code>。不會整個網站重新載入。',
    ],
    tips: [
      '網址和畫面的對應：<code>/</code> → HomePage；<code>/products</code> → ProductsPage。之後每做一頁，就回 <code>App.tsx</code> 多加一行 <code>&lt;Route&gt;</code>。',
      '用 <code>npm run dev</code> 開網站，直接在瀏覽器網址列打 <code>/products</code> 重新整理，也能看到產品列表（Vite 開發伺服器會處理）。部署到 GitHub Pages 這類靜態空間時，直接開子網址會 404，要另外設定，這是之後上線才會遇到的事。',
    ] },
  { goal: '照設計稿做出「所有商品」頁：左邊分類側欄、右邊 3 欄商品、下面分頁；手機版側欄變成抽屜。資料來自六角 API 的 /products/all。',
    points: [
      '<b>狀態放網址</b>：分類和頁碼用 <code>useSearchParams</code> 存在網址的 <code>?category=精油&amp;page=2</code>。重新整理、複製連結，看到的還是同一頁。',
      '<b>前端篩選＋分頁</b>：一次讀全部商品，用 <code>filter</code> 篩分類、<code>slice</code> 切出這一頁（9 個一頁）。',
      '<b>三種非正常狀態</b>都要有畫面：讀取中、失敗、這個分類沒有商品。',
      '<b>元件切小</b>：Breadcrumb、CategorySidebar、ProductListItem、Pagination 各做一件事；Breadcrumb 之後的頁面還會用。',
      '<b>桌面／手機兩種長相</b>：側欄桌面固定在左（<code>lg:static lg:block</code>），手機是從右邊滑出的抽屜（<code>fixed inset-y-0 right-0</code>）。',
      '資料夾：新增 <code>src/data/</code> 放側欄選項，畫面和資料分開。',
    ],
    tips: [
      '設計稿右上「共有 17,204 項」只是示意；我們顯示真的數量（<code>filtered.length</code>）。',
      '設計稿的「熱門專區、日常專區、風格特色」三組連結，這一階段只做畫面（連結是 <code>#</code>），沒有做篩選功能。',
      '商品卡的連結 <code>/products/商品編號</code> 要等下一部做完「商品細節」才有頁面，現在點下去會是空白。',
    ],
    images: ['images/img/精油產品 01.jpg','images/img/精油產品 02.jpg','images/img/精油產品 03.jpg','images/img/精油產品 04.jpg','images/img/精油產品 05.jpg','images/img/精油產品 06.jpg','images/img/精油產品 07.jpg','images/img/精油產品 08.jpg','images/img/精油產品 09.jpg'],
    design: {
      title: '設計稿對照：所有商品（桌面 1920 ＋ 手機）',
      images: [
        { src: 'tw-assets/design/list-desktop.jpg', cap: '桌面版（1920 寬）。紅色數字是我量出來的尺寸，對照右邊的表。', cls: 'wide' },
        { src: 'tw-assets/design/list-mobile.jpg', cap: '手機版（375 寬）：側欄變成從右邊滑出的抽屜，寬約 268。', cls: 'phone' },
      ],
      notice: [
        '<b>整頁的內容寬是 1296</b>，左邊從 x=312 開始（導覽列、麵包屑、側欄、頁尾都對齊同一條線）。這一條就是 <code>max-w-332 px-4</code>（1328 − 左右各 16）。',
        '<b>側欄 306＋空 24＋商品區 966 ＝ 1296</b>。商品區用 <code>flex-1</code> 吃掉剩下的，不用自己算 966。',
        '<b>商品圖 306×204</b>，三欄中間各空 24（所以 306×3＋24×2＝966，剛好填滿商品區）。',
        '<b>選中的分類</b>是整列的綠底白字（不是只有文字變色），所以每一列都要做成「整列可以點的區塊」（<code>block px-6 py-3</code>）。',
        '側欄的「熱門專區」小標題右邊有一條細線：用 <code>after:</code> 假元素畫，不用另外放一個標籤。',
        '設計稿的手機版<b>被抽屜擋住</b>，看不出商品是幾欄；這裡選 2 欄，是我們的決定，不是設計稿給的。',
      ],
      measure: MEASURE,
      table: [
        ['內容寬度', '1296，左邊 x=312', '<code>mx-auto max-w-332 px-4</code>'],
        ['麵包屑上方留白', '導覽列底（88）到文字上緣 54', '<code>pt-13.5</code>'],
        ['麵包屑箭頭兩側', '各 16，箭頭 24', '<code>gap-x-4</code>、<code>size-6</code>'],
        ['側欄寬度', '306', '<code>lg:w-76.5</code>'],
        ['側欄與商品區間距', '24', '<code>gap-6</code>'],
        ['側欄每一列', '高 48、左右內距 24', '<code>px-6 py-3 t-m</code>（行高 24＋上下各 12）'],
        ['專區小標題', '高 60、14px 灰字', '<code>px-6 py-5 t-r text-n-60</code>'],
        ['標題「所有商品」', '28px 襯線', '<code>h3</code>'],
        ['商品圖', '306×204（3:2）', '<code>aspect-3/2 w-full</code>'],
        ['商品欄距／列距', '24／32', '<code>lg:gap-x-6 lg:gap-y-8</code>'],
        ['小標／名稱／價格', '14 灰／18 粗／16 深綠粗', '<code>t-r text-n-60</code>／<code>h5</code>／<code>h6 text-primary-dark</code>'],
        ['分頁按鈕', '56×56，選中綠底（#5A8F70）', '<code>size-14 bg-primary-100 text-white</code>'],
        ['商品區與分頁', '48', '<code>mt-12</code>'],
        ['分頁與頁尾', '72', '<code>pb-18</code>'],
      ],
    } },
];

export const ROUTER_CHEAT = [
  ['BrowserRouter', '<code>&lt;BrowserRouter&gt;&lt;App /&gt;&lt;/BrowserRouter&gt;</code>', '包在最外面，讓所有元件讀得到網址'],
  ['Routes／Route', '<code>&lt;Route path="products" element={&lt;ProductsPage /&gt;} /&gt;</code>', '網址對照表；<code>index</code> 是外層本身的網址'],
  ['Route 套外框', '<code>&lt;Route element={&lt;Layout /&gt;}&gt;…&lt;/Route&gt;</code>', '外層沒有 path，只負責套 Layout'],
  ['Outlet', '<code>&lt;Outlet /&gt;</code>', '外框裡「換頁的洞」'],
  ['Link', '<code>&lt;Link to="/products"&gt;所有商品&lt;/Link&gt;</code>', '換頁的連結（不整頁重載）'],
  ['useLocation', '<code>const { pathname } = useLocation()</code>', '讀目前網址的路徑'],
  ['useSearchParams', '<code>const [searchParams, setSearchParams] = useSearchParams()</code>', '讀寫網址 <code>?</code> 後面的參數'],
  ['useParams（下一部）', '<code>const { id } = useParams()</code>', '讀網址裡的變數，例如 <code>/products/:id</code>'],
];
