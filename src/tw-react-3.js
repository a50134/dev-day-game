// 第 10～13 部：商品 API、購物車、分類／企業責任／頁尾、檢查與上線
// broken: true 表示這一步的程式碼「刻意」有型別錯誤（教學示範用），驗證時會略過。
import * as C from './tw-react-code.js';

const URL = 'http://localhost:5173';
const card = (name, desc, extra = '') =>
  `<div style="flex:1;min-width:0;text-align:center;font-size:11px"><div style="height:46px;background:#d8cbb8"></div><b>${name}</b><div style="color:#1d6617">${desc}</div>${extra}</div>`;
const cartBadge = (n) => `<span style="margin-left:4px;color:#1d6617">${n || ''}</span>`;

export const EPISODES_3 = [
  {
    title: '串接商品 API：熱賣商品',
    steps: [
      { say: '這一部讓「默默熱賣中」顯示真的 API 資料。先看資料怎麼流動：卡片元件，向 useProducts 這個自訂函式要資料，它呼叫 api.ts 裡的函式，再用 axios 發請求給六角。', slide: ['HotProducts（畫面）', '⬆️ useProducts（管理讀取中／錯誤）', '⬆️ api.ts（發請求）', '⬆️ axios → 六角 API'] },
      { say: '為什麼要拆這麼多層？因為每一層只做一件事。之後想換 API 網址，只改 api.ts；想改讀取中的畫面，只改元件。這樣程式比較好維護。先安裝 axios，它是發請求的套件，跟你在 DoraHandmade 專案用的一樣。', term: ['$ npm install axios', 'added 23 packages', 'found 0 vulnerabilities'] },
      { say: '先處理環境變數的型別。新增 src/vite-env.d.ts。副檔名 d.ts 是「只放型別」的檔案。這裡告訴 TypeScript：我們的 VITE_API_BASE 和 VITE_API_PATH 都是字串。這樣你打 import.meta.env 點的時候，會有自動建議，打錯名字也會報錯。', file: 'src/vite-env.d.ts', code: C.ENV_DTS },
      { say: '接著定義資料的樣子。新增 src/types.ts。Product 型別，描述一個商品有哪些欄位，這些欄位名稱，是我們從六角的 API 文件讀來的。imagesUrl 後面有問號，代表可能沒有。', file: 'src/types.ts', code: C.TYPES_1 },
      { say: '要特別提醒一件事。六角的文件範例，把商品列表畫成一個物件，用商品編號當 key。但是我們實際呼叫 API 確認過，回來的是陣列，所以型別寫陣列。寫型別時，以真正回來的資料為準，不要只看文件。', slide: ['文件範例：products 是物件（用編號當 key）', '實際回應：products 是陣列 [ ... ]', '→ 型別 products: Product[]', '養成習慣：實際呼叫一次，看真的資料'] },
      { say: '新增 src/api.ts。axios.create 建立一個專用的連線設定，baseURL 是網址的前半段：六角網址、api、再加你的路徑。之後每次呼叫，只要寫後面不一樣的部分，例如 products。', file: 'src/api.ts', code: C.API_1 },
      { say: '看 getProducts 這個函式。api.get 後面的尖括號，放的是「回應資料的型別」，這叫泛型。我們告訴 TypeScript：回來的資料是 ProductsResponse。這樣 res.data 就有型別，打 products 的時候會有自動建議。', slide: ['api.get<ProductsResponse>(...)', '↑ 泛型：告訴 TS 回應的資料長相', 'res.data.products　→　Product[]', 'Promise<Product[]>　＝ 這個函式會回傳商品陣列'] },
      { say: '試試看型別的保護。如果不小心把 products 的 s 打掉，寫成 res.data.product，TypeScript 會馬上告訴你：ProductsResponse 沒有 product，你是不是想打 products？不用等到畫面出錯才發現。', slide: ['res.data.product', "❌ Property 'product' does not exist on type 'ProductsResponse'.", "   Did you mean 'products'?", '→ 打錯字，編輯器立刻提醒'] },
      { say: '接著做 useProducts，一個自訂的 Hook。它管理三個狀態：商品、是不是還在讀取、有沒有錯誤。然後 useEffect 在畫面出現時，呼叫 getProducts，成功就存起來，失敗就記下錯誤，最後不管成功失敗，都把讀取中關掉。', file: 'src/hooks/useProducts.ts', code: C.USE_PRODUCTS },
      { say: '注意這裡的 category 加問號，是選用的。我們傳 熱賣 進去，就只拿熱賣的商品。useEffect 後面的中括號放 category，意思是分類換了就重新讀取。以後做產品列表，直接換分類就能重用。', slide: ['useProducts("熱賣")　只拿熱賣商品', 'useProducts()　拿全部', '[category]：分類改變 → 重新讀取', '同一個 Hook，多個頁面可以共用'] },
      { say: '做卡片元件。ProductCard 接收一個 product，型別就是我們剛剛寫的 Product。卡片用 group，滑鼠移到卡片上時，裡面的圖片會放大、文字區變淺綠色，這是設計稿的 hover 效果。', file: 'src/components/ProductCard.tsx', code: C.CARD_1 },
      { say: 'group 的用法值得記起來。外層加 group，裡面的元素就能寫 group-hover 冒號，意思是「當外層被滑鼠移上去時」。圖片外面包一層 overflow-hidden，放大後超出的部分才不會跑出來。', slide: ['外層：group', '圖片：group-hover:scale-110　放大', '文字區：group-hover:bg-primary-80　變色', '圖片外層：overflow-hidden　裁掉超出部分'] },
      { say: '最後是 HotProducts 區塊。呼叫 useProducts 加熱賣，拿到商品、讀取中、錯誤。三種情況各有各的畫面：讀取中顯示字，錯誤顯示紅字，沒有資料顯示提示。有資料就用 map 畫出卡片。', file: 'src/components/HotProducts.tsx', code: C.HOT_1 },
      { say: '版面看這一行：手機是 flex 加 overflow-x-auto，卡片橫向排，可以左右滑動；桌面 md 以上改成 grid 四欄。右上角的葉子，也是設計稿裡的裝飾。把它放進 App。', file: 'src/App.tsx', code: C.APP_10 },
      { say: '重新整理，過一下下，四個商品就出現了，圖片、名字、介紹，都是從你的 API 來的。你可以到六角後台改商品名稱，再重新整理，這裡就會跟著變。', web: { url: URL, html: '<b style="font-family:serif;font-size:17px">默默熱賣中</b><div style="color:#575757;font-size:12px;margin:2px 0 8px">用過的人都不想換回去的東西</div><div style="display:flex;gap:8px">' + card('香氛蠟燭', '「不只是香氣…」') + card('擴香瓶', '「不用點燃…」') + card('手工皂套組', '「一塊手工皂…」') + card('精油薰香', '「空氣裡的療癒…」') + '</div>' } },
      { say: '來測試另外兩種畫面。把 .env 裡的 VITE_API_PATH 隨便改成一個不存在的路徑，重開開發伺服器，因為環境變數只在啟動時讀取。你會看到「目前沒有商品」的提示。改回來就恢復。', slide: ['改 .env 後要重開：Ctrl+C → npm run dev', '路徑亂寫 → 空資料 → 顯示「目前沒有商品」', '網址亂寫 → 請求失敗 → 顯示紅色錯誤', '測完記得改回來'] },
      { say: '這一部完成了：用 axios 串 API，用泛型標示回傳型別，用自訂 Hook 管理三種狀態，卡片用 group-hover 做出動態效果。', slide: ['✅ axios.create ＋ baseURL', '✅ api.get<T> 泛型', '✅ useProducts：資料／讀取中／錯誤', '✅ 讀取中、錯誤、空資料 三種畫面'] },
    ],
  },
  {
    title: '購物車 API 與導覽列數字',
    steps: [
      { say: '這一部做購物車。按「加入購物車」，就送一筆資料給 API，然後導覽列上購物車圖示旁邊的數字會跟著增加，對應設計稿「加入購物車」那個狀態。', slide: ['按下加入購物車', '→ POST /cart（送出 商品編號、數量）', '→ GET /cart（拿回目前購物車）', '→ 導覽列數字更新'] },
      { say: '先補型別。在 types.ts 下面，加上購物車的型別：CartItem 是購物車裡的一項，有商品編號、數量、金額，還有整個商品資料；Cart 是整個購物車；CartResponse 是 API 回應的外層。', file: 'src/types.ts', code: C.TYPES_2 },
      { say: '再回到 api.ts，加兩個函式。getCart 讀購物車，回傳的是 res.data.data，因為六角把購物車包在 data 裡面。addToCart 送出商品編號和數量。數量預設是 1，所以呼叫時可以不傳。', file: 'src/api.ts', code: C.API_2 },
      { say: '那購物車數字存在哪裡？導覽列在最上面，卡片的按鈕在很下面，它們兩個不是父子，不能直接傳東西。這時候就要用 Context，把「購物車數量」放在最外層，所有元件都能讀到。', slide: ['Navbar（要顯示數字）', 'ProductCard（要加入購物車）', '兩個沒有直接的親子關係', '→ 用 Context 放在最外層共享'] },
      { say: '新增 context 資料夾，裡面先做 CartContext.ts。CartContextValue 這個型別，描述大家可以從 Context 拿到什麼：count 是數量，adding 是是不是正在加入中，add 是加入購物車的函式。createContext 的預設值是 null。', file: 'src/context/CartContext.ts', code: C.CART_CONTEXT },
      { say: '再做 CartProvider。它先負責一件事：畫面一出現，就去讀購物車，把所有商品的數量加起來，存到 count。reduce 是把陣列「累加」成一個數字的方法。add 先放一個空函式，下一步再補。', file: 'src/context/CartProvider.tsx', code: C.CART_PROVIDER_1 },
      { say: 'React 十九有一個小改變：直接用 CartContext 當標籤，就能提供資料，不用再寫 .Provider。value 是我們要分享出去的東西。', slide: ['<CartContext value={{ count, adding, add }}>', '舊寫法：<CartContext.Provider value=...>', 'React 19：直接寫 <CartContext value=...>'] },
      { say: '要用的時候，每次都寫 useContext 太長，而且可能忘記包 Provider。所以做一個 useCart，如果拿到 null，就丟出清楚的錯誤訊息。以後元件只要寫 const 大括號 count 等於 useCart。', file: 'src/hooks/useCart.ts', code: C.USE_CART },
      { say: '把 CartProvider 包在 App 最外面，裡面所有元件就都能用 useCart 了。', file: 'src/App.tsx', code: C.APP_11 },
      { say: '回到導覽列，在購物車圖示旁邊顯示數字。count 大於 0 才顯示，所以一開始沒有商品，就不會有數字。手機的選單也加一個購物車的連結，顯示數量。', file: 'src/components/Navbar.tsx', code: C.NAV_5 },
      { say: '現在補上 add。按下去的時候，先把 adding 設成 true，防止連點；送出之後，再重新讀一次購物車，更新數字；失敗就跳出提醒；最後不管怎樣都把 adding 關掉。這個 try、catch、finally 的結構，處理 API 時非常常用。', file: 'src/context/CartProvider.tsx', code: C.CART_PROVIDER_2 },
      { say: '最後，在商品卡片加上按鈕。呼叫 useCart 拿到 add 和 adding。按鈕 disabled 等於 adding，加入中的時候不能再按。', file: 'src/components/ProductCard.tsx', code: C.CARD_2 },
      { say: '按一下「加入購物車」，導覽列購物車圖示旁邊出現 1。再按兩次另一個商品，變成 3。重新整理頁面，數字還在，因為購物車資料存在六角的 API，不是存在瀏覽器裡。', web: { url: URL, html: navBarWithCart(3) + '<div style="display:flex;gap:8px;margin-top:10px">' + card('香氛蠟燭', '', '<span style="color:#1d6617">加入購物車</span>') + card('擴香瓶', '', '<span style="color:#1d6617">加入購物車</span>') + '</div>' } },
      { say: '要知道一件事：六角的購物車是跟著 API 路徑走的，不是跟著使用者。所以同一個路徑下，大家看到的是同一台購物車。這是練習用 API 的限制，如果要做真的商店，要有自己的後端和使用者登入。', slide: ['六角購物車 ＝ 每個 API 路徑一台', '不是每個使用者一台', '練習沒問題；正式商店需要自己的後端'] },
      { say: '提醒一下：設計稿裡「加入購物車」按鈕，其實是在商品細節頁。首頁的卡片上，原本沒有這個按鈕。我們放在這裡，是為了讓你能馬上練習。做商品細節頁時，我們再把它搬過去。', slide: ['設計稿：加入購物車在「商品細節」頁', '首頁卡片上的按鈕：暫時放這裡練習', '第二階段做商品細節時，會搬過去'] },
      { say: '這一部完成了：串接購物車 API，用 Context 共享資料，用 useCart 讓元件好用，也學會了 try、catch、finally。', slide: ['✅ POST /cart　GET /cart', '✅ createContext ＋ Provider ＋ useCart', '✅ try / catch / finally', '✅ 導覽列數字即時更新'] },
    ],
  },
  {
    title: '商品分類、企業責任、頁尾',
    steps: [
      { say: '首頁剩下三塊：四張商品分類圖、企業責任的展開式區塊、還有頁尾。另外右邊有一排固定的社群按鈕。這一部把它們全部做完。', slide: ['① 商品分類：4 張圖，2 × 2（手機單欄）', '② 企業責任：三張圖，點／移上去展開', '③ 頁尾＋右側固定社群按鈕'] },
      { say: '分類圖上面有一個白色的按鈕，設計稿 Button 沒有這個款式。所以我們幫 Button 加第三種：white。先只改最上面的型別，加上 white。', file: 'src/components/Button.tsx', code: C.BUTTON_3_BROKEN, broken: true },
      { say: '存檔後，下面的 variants 那一行會出現紅線。TypeScript 告訴你：型別裡有 white，但是 variants 少了 white 這個款式，所以不能這樣寫。這就是前面說的，Record 保證每個款式都有對應的樣式，漏了馬上抓到。', slide: ["❌ Property 'white' is missing in type", "   '{ fill: string; unfill: string; }'", "   but required in type 'Record<Variant, string>'.", '→ 補上 white 的樣式就好'] },
      { say: '補上 white 的樣式：白底、深色字，hover 變淺綠，按下去變中綠。紅線就消失了。', file: 'src/components/Button.tsx', code: C.BUTTON_3 },
      { say: '做分類元件。四張分類的資料放在陣列。每一張，圖片貼滿，上面蓋一層半透明的深色，疊一個白色的細框線，中間放標題和白色按鈕。滑鼠移上去圖片會慢慢放大。', file: 'src/components/Categories.tsx', code: C.CATEGORIES },
      { say: '版面看 section 這一行：grid 加 md:grid-cols-2。手機預設一欄，四張直直排；桌面變兩欄，剛好 2 乘 2。高度手機 250 像素，桌面 480 像素，也是看設計稿。把它放進 App。', file: 'src/App.tsx', code: C.APP_12a },
      { say: '再做企業責任。先做靜態版本，三張圖並排，每張有一個白色的標籤和一段說明。背景圖用 bg 加中括號 url，這是 Tailwind 的自訂值寫法，可以直接用圖片當背景。', file: 'src/components/Responsibility.tsx', code: C.RESP_1 },
      { say: '現在讓它可以展開。用 active 記住哪一張是展開的，滑鼠移上去或點一下，就換成那一張。展開的那張，桌面 flex 是 8，其他是 1，所以展開的比較寬，transition-all 讓寬度變化有動畫。', file: 'src/components/Responsibility.tsx', code: C.RESP_2 },
      { say: '看收合的樣子。沒展開的圖，在桌面只顯示標題，說明文字隱藏；手機版則是三張全部展開、直直排，因為手機寬度不夠並排。這個 flex md:hidden 的組合，就是控制「手機顯示、桌面隱藏」。', slide: ['桌面：展開的顯示標籤＋說明，收合的只顯示標題', '手機：全部展開，上下排', "isActive ? 'flex' : 'flex md:hidden'", '　手機都顯示；桌面只有展開的顯示'] },
      { say: '把兩個元件都放進 App。', file: 'src/App.tsx', code: C.APP_12 },
      { say: '接著做頁尾。三欄的連結資料放在 columns 陣列，社群圖示放在 socials 陣列，一樣用 map 畫出來。背景是草地照片。社群圖示原本是深色，頁尾背景是深綠，所以加上 brightness-0 加 invert，把它變成白色。', file: 'src/components/Footer.tsx', code: C.FOOTER },
      { say: '那兩個 class 的原理：brightness-0 把圖片變成全黑，invert 再把黑色反轉成白色。這個小技巧，不用另外準備白色的圖示檔，非常方便。', slide: ['brightness-0　→　全部變黑', 'invert　→　黑色反轉成白色', '同一張深色圖示，在深色背景變白色'] },
      { say: '最後是右邊固定的社群按鈕。fixed 加 right-10 加 top-1/2，固定在畫面右邊中間，-translate-y-1/2 往上移一半的高度，才會真的置中。手機隱藏，桌面才顯示。', file: 'src/components/SocialBar.tsx', code: C.SOCIAL_BAR },
      { say: '把頁尾和社群按鈕放進 App，首頁就全部完成了。', file: 'src/App.tsx', code: C.APP_13 },
      { say: '從上往下看一遍：導覽列、輪播、兩段限時提案、熱賣商品、四張分類、企業責任、頁尾，右邊還有固定的社群按鈕。跟設計稿首頁一樣的順序。', web: { url: URL, html: '<div style="font-size:12px;line-height:1.9;text-align:center;color:#575757">導覽列　▶　Hero 輪播<br>限時提案 ×2　▶　默默熱賣中（API）<br>商品分類 2×2　▶　企業責任（可展開）<br>頁尾　＋　右側社群按鈕</div>' } },
      { say: '這一部完成了：新增 Button 的白色款式、分類圖、可展開的企業責任、頁尾和固定社群按鈕。首頁全部做完了。', slide: ['✅ Button 加 white，TS 提醒補漏', '✅ grid、overlay、group-hover', '✅ 展開式區塊：useState ＋ flex-8／flex-1', '✅ fixed 定位、brightness-0 invert'] },
    ],
  },
  {
    title: '檢查、型別錯誤整理與上線',
    steps: [
      { say: '最後一部，做檢查和上線準備。先看響應式。打開 Chrome 的開發者工具，按 F12，再按左上角的手機圖示，就能切換成手機大小。', slide: ['F12 → 手機圖示（Toggle device toolbar）', '手機：375 寬（設計稿手機版）', '平板：768 寬', '筆電：1440　桌機：1920（設計稿桌面版）'] },
      { say: '用這幾個寬度逐一檢查：375、768、1024、1440、1920。重點看三件事：有沒有橫向的捲軸、文字有沒有被切到、按鈕是不是夠大好點。', slide: ['① 有沒有橫向捲軸（左右滑動）', '② 文字、圖片有沒有被切掉或蓋住', '③ 按鈕夠大嗎（手機手指好不好按）'] },
      { say: '記住斷點。Tailwind 的 md 是 768 像素，lg 是 1024 像素。我們文字樣式和版面大多用 md，導覽列用 lg，因為導覽列的項目比較多，需要更寬才放得下。設計稿只有 375 和 1920，中間的大小，是我們依照這個規則自己判斷的。', slide: ['sm 640　md 768　lg 1024　xl 1280', '文字樣式、圖文並排：md', '導覽列桌面版：lg', '設計稿只有 375 和 1920，中間尺寸自己判斷'] },
      { say: '再跑程式檢查。npm run lint 會檢查程式寫法有沒有問題。沒有任何警告，就是什麼都不會多印，只有最上面兩行。', term: ['$ npm run lint', '> i-need-this@0.0.0 lint', '> oxlint'] },
      { say: '接著 npm run build。它會先跑 tsc，也就是 TypeScript 的型別檢查，有任何型別錯誤就會停在這裡；通過了才會打包成可以上線的檔案，放在 dist 資料夾。', term: ['$ npm run build', '> tsc -b && vite build', '✓ 90 modules transformed.', 'dist/index.html', 'dist/assets/index-xxxx.css', 'dist/assets/index-xxxx.js', '✓ built in 352ms'] },
      { say: '回頭整理一下，這個系列你遇到的四種 TypeScript 錯誤。第一，型別 import 沒加 type。第二，傳了不存在的選項。第三，少傳必要的屬性。第四，資料欄位打錯字。每一種，錯誤訊息都在告訴你哪裡錯、該怎麼改。', slide: ["TS1484：'Product' is a type and must be imported using a type-only import", "TS2322：Type '\"blue\"' is not assignable to type 'Variant | undefined'", "TS2741：Property 'product' is missing in type '{ key: string }'", "TS2551：Property 'product' does not exist ... Did you mean 'products'?"] },
      { say: '讀錯誤訊息的方法：先看最前面的檔名和括號裡的數字，那是第幾行第幾個字；再看最後面的英文，通常就是原因和提示。慢慢讀，你會發現它非常誠實。', slide: ['src/components/Button.tsx(13,7)　← 第 13 行第 7 個字', 'error TS2741　← 錯誤編號，可以拿去搜尋', '後面的英文　← 原因和建議'] },
      { say: '上線的時候有兩件事要注意。第一，環境變數：.env 不一定會跟著上傳，要在平台的設定頁面，自己把 VITE_API_BASE 和 VITE_API_PATH 填進去。第二，.env.local 裡的密碼，絕對不要放進去，網站上線不需要它。', slide: ['平台設定頁：填 VITE_API_BASE、VITE_API_PATH', '❌ 不要填 HEX_PASSWORD（網站用不到）', '改了環境變數，要重新部署一次才生效'] },
      { say: '要放到哪裡？Vercel 或 Netlify 最簡單，連結 GitHub，每次推上去自動更新，網址在根目錄，我們程式裡的圖片路徑寫斜線 images 開頭，就剛好可以用。如果要放 GitHub Pages，網址會多一層資料夾，要另外設定 base 和圖片路徑，建議等熟悉了再做。', slide: ['Vercel／Netlify：連 GitHub 自動部署（建議）', 'GitHub Pages：網址多一層，要設 base 與圖片路徑', '圖片路徑 /images/... 適合放在網站根目錄'] },
      { say: '這一輯完成了首頁，也學到很多。接下來的第二階段，是產品列表、品牌介紹、商品細節、結帳。每一頁都會用到我們做好的顏色、字型、按鈕、元件、和 API。', slide: ['第二階段：', '產品列表（分類、分頁、搜尋）', '品牌介紹', '商品細節（加入購物車搬到這裡）', '結帳（建立訂單）'] },
      { say: '恭喜你看完全部十三部。請你自己從頭做一次，盡量不要看答案，卡住再回來看那一部。完成之後，你就有一個用 React、TypeScript、Tailwind 做的真實作品，還串了 API，可以放進履歷，面試時也能清楚說明每一個決定。', slide: ['🎉 全部看完了', '現在換你：自己從頭做一次', '作品放上 Vercel，把網址放進履歷', '面試可以說：React ＋ TypeScript ＋ Tailwind ＋ API'] },
    ],
  },
];

function navBarWithCart(n) {
  return `<div style="display:flex;align-items:center;gap:14px;font-size:13px"><span style="font-family:serif;color:#598e71;font-size:18px">I need this</span><span style="flex:1"></span><span>品牌介紹</span><span>所有商品</span><span>🛒${cartBadge(n)}</span></div>`;
}
