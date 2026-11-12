// 第 6～9 部：導覽列、首頁 Hero、限時提案、建立商品資料（seed）
import * as C from './tw-react-code.js';

const URL = 'http://localhost:5173';
const G = '#1d6617';
const navBar = (right) => `<div style="display:flex;align-items:center;gap:14px;font-size:13px"><span style="font-family:serif;color:#598e71;font-size:18px">I need this</span><span style="flex:1"></span>${right}</div>`;

export const EPISODES_2 = [
  {
    title: '導覽列（四種狀態）',
    steps: [
      { say: '這一部做導覽列。看設計稿的 Components 那一頁，導覽列有四種狀態：未登入、已登入、展開使用者選單、購物車裡有東西。桌面版和手機版長得不太一樣。', slide: ['① 未登入：右邊是綠色「註冊／登入」按鈕', '② 已登入：頭像和名字', '③ 展開選單：個人資訊、我的收藏、訂單狀態', '④ 購物車有商品：圖示旁出現數字'] },
      { say: '導覽列要用到 logo、搜尋、購物車等圖片。你之前做切版時已經有這些素材了。打開你之前的專案，把 assets 裡的 images 整個資料夾複製起來。', slide: ['① 打開你之前的切版專案（I need this）', '② 複製 assets/images 整個資料夾', '③ 貼到新專案的 public 資料夾底下'] },
      { say: '貼好後，路徑會是 public 斜線 images。放在 public 的檔案，網址會直接從根目錄開始，所以程式裡寫 斜線 images 斜線 svg 斜線 logo，就找得到。要確認 public/images/svg 裡有 logo、Cart、Search、Menu、Close 這幾個檔案。', slide: ['public/images/hero-01.png ...', 'public/images/svg/logo_on light.svg', 'public/images/svg/Cart.svg　Search.svg　Menu.svg　Close.svg', '程式裡寫成：/images/svg/Cart.svg'] },
      { say: '先做最簡單的：只有 logo。新增 components/Navbar.tsx。header 加上 sticky 和 top-0，捲動時會固定在最上面。z-50 讓它蓋在其他東西上面。', file: 'src/components/Navbar.tsx', code: C.NAV_1 },
      { say: '看 nav 這一行。mx-auto 加 max-w-7xl，讓內容最寬 1280 像素並置中。flex 加 items-center 加 justify-between，左右兩邊分開、上下置中。高度手機是 h-18，也就是 72 像素；桌面 lg 以上是 h-22，88 像素，剛好對應設計稿。', slide: ['h-18　＝ 72px（手機）', 'lg:h-22　＝ 88px（桌面）', 'Tailwind 的數字：1 ＝ 4px', 'lg ＝ 螢幕寬 ≥ 1024px'] },
      { say: '把導覽列放進畫面。App.tsx 改成放 Navbar，下面放一個很高的區塊，方便等一下測試固定在上方的效果。', file: 'src/App.tsx', code: C.APP_6 },
      { say: '現在左上角有 logo，往下捲，導覽列會一直固定在最上方，還有淡淡的陰影，這是 shadow-sm 的效果。', web: { url: URL, html: navBar('') + '<p style="margin:14px 0 0;color:#575757">往下捲，導覽列會固定在上面。</p>' } },
      { say: '接著加桌面版右邊的內容：搜尋框、兩個連結、購物車圖示、登入按鈕。連結的資料先放在 links 陣列，再用 map 一個一個畫出來，這樣之後想增加連結，只要加一行資料。', file: 'src/components/Navbar.tsx', code: C.NAV_2 },
      { say: '注意 hidden 加 lg:flex 這兩個 class。hidden 是預設隱藏，所以手機看不到；到了 lg，也就是 1024 像素以上，才改成 flex 顯示。這就是手機優先：先寫手機的樣子，再往大螢幕調整。', slide: ['hidden lg:flex', '手機：hidden（不顯示）', '桌面 ≥1024px：flex（顯示）', '手機的版本，我們等一下另外做'] },
      { say: '登入按鈕現在還不會動。我們用 useState 記住「現在是誰登入」。尖括號裡寫 string 直線 null，這叫聯集型別，意思是：可能是一個字串，也可能是 null，代表沒登入。一開始是 null。', file: 'src/components/Navbar.tsx', code: C.NAV_3a },
      { say: '下面那個問號冒號，是 JavaScript 的三元運算。有 user 就顯示名字，沒有就顯示登入按鈕。因為 TypeScript 有看懂這個判斷，在有 user 的那一邊，它知道 user 一定是字串，不可能是 null，這叫做型別縮小。', slide: ['user ? <顯示名字> : <登入按鈕>', '有 user 的那一邊：TypeScript 知道它是 string', '沒 user 的那一邊：它是 null', '→ 不會有「對 null 取值」的錯誤'] },
      { say: '設計稿登入後有頭像、名字，點了會展開選單。我們再加一個 userMenuOpen 狀態，記住選單有沒有打開。頭像因為沒有真的照片，先用名字第一個字當圓形頭像。選單最下面加一個登出，讓你可以回到未登入。', file: 'src/components/Navbar.tsx', code: C.NAV_3 },
      { say: '這裡的登入是假的：按一下就當作 Alice 登入。因為六角 API 沒有一般顧客的登入功能，只有後台管理員登入。所以商品、購物車、結帳會用真的 API，登入只用假的畫面。', slide: ['六角 API：有商品、購物車、結帳', '六角 API：沒有一般顧客登入', '所以：登入狀態用 useState 假裝', '之後有自己的後端，再換成真的'] },
      { say: '接著做手機版。小於 lg 的螢幕，右邊只放兩個圖示：搜尋和選單。點搜尋會蓋上一個搜尋列，點選單會打開滿版的選單。兩個都用一個 true 或 false 的狀態控制。', file: 'src/components/Navbar.tsx', code: C.NAV_4 },
      { say: '看滿版選單：fixed 加 inset-0，意思是固定在畫面上，四邊都貼齊，整個蓋住畫面。flex-col 加 justify-between，連結在上面，登入按鈕被推到最下面，剛好是設計稿手機選單的樣子。', slide: ['fixed inset-0　＝ 蓋滿整個畫面', 'flex flex-col justify-between', '連結在上、按鈕在下', 'lg:hidden　桌面不會出現'] },
      { say: '縮小瀏覽器寬度到手機大小，桌面的選項消失，換成搜尋和選單圖示。點選單，滿版的選單打開，有關閉按鈕。登入後，上面會出現「嗨，Alice」。', web: { url: URL, html: navBar('<span>🔍</span><span>☰</span>') + '<hr style="margin:10px 0;border:0;border-top:1px solid #ddd"><div style="text-align:center;line-height:2.4;font-size:15px">嗨，Alice<br>品牌介紹<br>所有商品</div><div style="margin-top:8px;background:' + G + ';color:#fff;text-align:center;padding:8px">登出</div>' } },
      { say: '這一部完成了：導覽列的桌面版、手機版，加上假的登入狀態。購物車的數字先不管，等串購物車 API 的時候再回來加。', slide: ['✅ sticky 固定導覽列', '✅ hidden lg:flex ／ lg:hidden 切換桌面手機', '✅ useState<string | null> 假登入', '⏳ 購物車數字：第 11 部再加'] },
    ],
  },
  {
    title: '首頁 Hero 輪播',
    steps: [
      { say: '這一部做首頁最上面的大圖輪播。設計稿高度 740 像素，左邊有一塊半透明的文字框，下面有三個指示點，桌面是長條，手機是圓點。', slide: ['高度 740px、滿版大圖', '文字框 636 × 304，半透明、模糊背景', '指示點：桌面長條、手機圓點'] },
      { say: '先做一張靜態的。新增 Hero.tsx。section 用 relative，因為裡面的圖片要用 absolute 疊在它上面。高度 h-185，也就是 740 像素。overflow-hidden 把超出的部分裁掉。', file: 'src/components/Hero.tsx', code: C.HERO_1 },
      { say: '圖片用 absolute 加 inset-0，貼滿整個區塊，size-full 是寬高都百分之百，object-cover 讓圖片填滿不變形，超出的地方裁掉。這個組合很常用，要記起來。', slide: ['absolute inset-0 size-full object-cover', '＝ 圖片貼滿、不變形、多的裁掉', '桌面常用：圖片當背景'] },
      { say: '文字框是 bg-n-60 斜線 40，就是 n-60 灰色、透明度百分之四十。backdrop-blur-sm 讓後面的圖片有一點模糊。md:w-159 是桌面寬度 636 像素，手機則是滿寬。位置：手機放在下面，桌面垂直置中。', slide: ['bg-n-60/40　半透明灰', 'backdrop-blur-sm　背景模糊', 'md:w-159　＝ 636px', 'items-end → md:items-center　手機在下、桌面置中'] },
      { say: '把 Hero 放進 App。Navbar 下面放一個 main，裡面是 Hero。', file: 'src/App.tsx', code: C.APP_7 },
      { say: '畫面出現滿版大圖，導覽列在上面，左邊有半透明的文字框，裡面有標題、副標、和有箭頭的按鈕。這個箭頭，就是上一部在 Button 做的 arrow 屬性。', web: { url: URL, html: navBar('') + '<div style="position:relative;margin-top:8px;height:120px;background:linear-gradient(135deg,#c9bfb1,#9d9d9d);overflow:hidden"><div style="position:absolute;left:12px;top:14px;background:rgba(87,87,87,.4);padding:10px 14px;color:#fff"><b style="font-family:serif;font-size:18px">生活小物的靜謐時光</b><div style="font-size:12px;margin:2px 0 8px">用小物打造專屬的心靈港灣</div><span style="background:#1d6617;padding:3px 10px;font-size:12px">看看商品 ▶</span></div></div>' } },
      { say: '現在讓它變成輪播。先把三張圖的資料整理成陣列，每一張有圖片、標題、副標。type Slide 是我們自己定義的型別，描述每一張長什麼樣，slides 後面的 Slide 加中括號，代表是「Slide 的陣列」。', file: 'src/components/Hero.tsx', code: C.HERO_2 },
      { say: '這個版本做了三件事。第一，用 current 記住現在是第幾張。第二，三張圖全部疊在一起，只有目前這張 opacity 是 100，其他是 0，transition-opacity 讓切換有淡入淡出。第三，下面的圓點可以點，點了就切換到那一張。', slide: ['current ＝ 目前第幾張（0、1、2）', '全部疊在一起，用 opacity 決定誰顯示', 'transition-opacity duration-700　淡入淡出', '點圓點 → setCurrent(index)'] },
      { say: '指示點的大小要看設計稿。size-2.5 是 10 像素的圓點，給手機用。md:h-2 加 md:w-18 是桌面的長條，高 8 像素、寬 72 像素。目前這一張是 primary-100 綠色，其他是淺灰 n-20。', slide: ['手機：size-2.5 ＋ rounded-full　＝ 10px 圓點', '桌面：md:h-2 md:w-18　＝ 72 × 8 長條', '目前：bg-primary-100　其他：bg-n-20'] },
      { say: '最後讓它自己換頁。用 useEffect 設定一個計時器，每五秒把 current 加一，到最後一張再回到第一張，這裡用「除以張數取餘數」做到。注意 return 那一行：離開畫面時要把計時器清掉，不然會一直累積。', file: 'src/components/Hero.tsx', code: C.HERO_3 },
      { say: 'useEffect 最後的中括號放 current，意思是「current 變了就重新計時」。所以你手動點了圓點之後，會重新計五秒，不會剛點完馬上又被自動換掉。', slide: ['useEffect(() => { 計時器 ; return 清除 }, [current])', '[current]：current 變了就重新計時', '清除計時器：避免重複累積'] },
      { say: '這一部完成了：三張輪播、淡入淡出、圓點、自動播放。圖片和文字寫成資料，之後要換圖或加第四張，只要改陣列。', slide: ['✅ 滿版 Hero 與半透明文字框', '✅ type Slide ＋ Slide[]', '✅ useState ＋ useEffect 自動輪播', '✅ 桌面長條、手機圓點'] },
    ],
  },
  {
    title: '首頁：限時提案',
    steps: [
      { say: '這一部做首頁的兩段「圖文並排」。第一段圖在左、文字在右；第二段反過來。背景是由白變淺綠再變白的漸層，中間有葉子的分隔線，旁邊有葉子裝飾。', slide: ['① 圖左文右：這個季節剛剛好', '② 圖右文左：為日常加點新意', '背景：白 → 淺綠 → 白　＋　葉子裝飾'] },
      { say: '兩段長得一樣，只是方向不同，所以做成一個共用元件，叫 FeatureSection。它接受圖片網址、圖片說明、還有 children。children 就是「包在元件標籤中間的內容」，型別是 ReactNode。', file: 'src/components/FeatureSection.tsx', code: C.FEATURE_1 },
      { say: '版面部分：手機是上下排，flex-col；到 md 以上改成左右排，md:flex-row。圖片和文字各占一半，md:w-1/2。lg:my-30 是桌面上下留 120 像素的空間。', slide: ['flex flex-col　手機上下排', 'md:flex-row　≥768px 左右排', 'md:w-1/2　各占一半', 'lg:my-30　＝ 上下 120px'] },
      { say: '再新增 PromoSections.tsx，用這個元件放兩段內容。標題裡的「剛剛好」用 span 加上 text-primary-dark，只讓這幾個字變深綠色。最外層是漸層背景。', file: 'src/components/PromoSections.tsx', code: C.PROMO_V1 },
      { say: '漸層的寫法。bg-linear-to-b 是由上往下的漸層，from-white 是起點的顏色，via-primary-80 是中間的顏色，to-white 是終點。三個顏色，都是我們之前設定的。', slide: ['bg-linear-to-b　由上到下', 'from-white　起點', 'via-primary-80　中間', 'to-white　終點'] },
      { say: '放進 App。', file: 'src/App.tsx', code: C.APP_8 },
      { say: '現在第二段也要圖在右邊。我們幫 FeatureSection 加兩個選用的屬性：reverse 決定方向反過來，leaf 是葉子裝飾。leaf 的型別也是 ReactNode，也就是可以直接放一個圖片元素進去。', file: 'src/components/FeatureSection.tsx', code: C.FEATURE_2 },
      { say: '看 reverse 怎麼用。是 true 的時候，class 換成 md:flex-row-reverse，左右就反過來了。文字那一欄在桌面的左邊多留一些空間，避免被左邊的葉子蓋到，這是看設計稿調整出來的。', slide: ["reverse ? 'md:flex-row-reverse' : 'md:flex-row'", 'class 用陣列組合，再 join(" ") 接起來', 'lg:pl-[20%]　中括號＝自訂數值'] },
      { say: '回到 PromoSections，給兩段加上葉子。葉子用 absolute 定位，hidden 加 md:block，手機看不到，桌面才出現。pointer-events-none 讓滑鼠可以穿過它，不會擋到下面的按鈕。', file: 'src/components/PromoSections.tsx', code: C.PROMO_V2 },
      { say: '這是完成的樣子：兩段圖文交錯、漸層背景、葉子分隔線和裝飾。手機的時候圖片在上、文字在下，葉子裝飾隱藏。', web: { url: URL, html: '<div style="background:linear-gradient(#fff,#e3efe8,#fff);padding:10px"><div style="display:flex;gap:10px;align-items:center"><div style="width:48%;height:80px;background:#b9a58f"></div><div style="font-size:13px"><b style="font-family:serif;font-size:16px">這個季節<span style="color:#1d6617">剛剛好</span><br>生活選物<span style="color:#1d6617">限時提案</span></b><p style="margin:4px 0;color:#575757">繁忙中也能片刻沉靜…</p></div></div><div style="text-align:center;color:#598e71;margin:8px 0">🍃🍃🍃🍃🍃🍃🍃🍃</div><div style="display:flex;gap:10px;align-items:center;flex-direction:row-reverse"><div style="width:48%;height:80px;background:#c9c9b3"></div><div style="font-size:13px"><b style="font-family:serif;font-size:16px">為日常<span style="color:#1d6617">加點新意</span></b><p style="margin:4px 0;color:#575757">用香氣與觸感…</p></div></div></div>' } },
      { say: '這一部完成了：一個共用的圖文元件，用 reverse 控制方向，用 ReactNode 放任意內容，並且學到漸層、手機優先的上下排與左右排。', slide: ['✅ children: ReactNode', '✅ 選用屬性 reverse?、leaf?', '✅ bg-linear-to-b from／via／to', '✅ flex-col → md:flex-row'] },
    ],
  },
  {
    title: '先建立商品資料（seed）',
    steps: [
      { say: '下一部要把「默默熱賣中」換成真的 API 資料。但是你的 API 一開始是空的，沒有任何商品。所以這一部，我們先把設計稿裡的商品放進你的 API。', slide: ['API 一開始是空的', '→ 先把商品資料放進去', '→ 下一部才有東西可以顯示'] },
      { say: '如果你還沒有六角的 API，先到 ec-course-api.hexschool.io 申請。流程是：註冊帳號、登入、再申請一個 API 路徑。路徑是你自己取的名字，之後所有網址都會用到它。', web: { url: 'https://ec-course-api.hexschool.io', html: '<b>六角學院課程練習 API 申請</b><ol style="margin:6px 0;padding-left:20px"><li>註冊／登入帳號</li><li>申請 API 路徑</li><li>測試 API</li></ol>' } },
      { say: '這裡有個重要的提醒。API 路徑底下的資料，是任何知道這個路徑的人都能讀寫的。所以請不要放真實的姓名、電話、地址。我們只放練習用的假資料。', slide: ['⚠️ 知道你的 API 路徑，就能讀寫你的資料', '不要放真實個人資料', '練習用：用假名字、假電話'] },
      { say: '在專案最外層，也就是跟 package.json 同一層，新增一個檔案叫 .env，點開頭，env 結尾。這是放設定值的檔案。VITE_API_BASE 是六角 API 的網址，VITE_API_PATH 填入你剛剛申請的路徑。', file: '.env', code: C.ENV_FILE },
      { say: 'Vite 有個規則：只有 VITE 底線開頭的變數，才會被打包進網頁給瀏覽器用。所以，千萬不要把密碼取名成 VITE 開頭，不然任何人打開開發者工具都看得到。', slide: ['VITE_ 開頭　→　會被打包進網頁（公開）', '其他名字　→　不會被打包', '❌ VITE_PASSWORD　絕對不要這樣取名'] },
      { say: '所以密碼放在另一個檔案，叫 .env.local。裡面的名字不是 VITE 開頭，所以不會被打包。而且範本的 .gitignore 已經有一行「星號 點 local」，這種檔案不會被上傳到 GitHub。把你的六角登入 Email 和密碼填進去。', file: '.env.local', code: C.ENV_LOCAL },
      { say: '接下來寫一支建商品的小程式。新增 scripts 資料夾，裡面放 seed.mjs。seed 是「播種」的意思。這支程式跑在你的電腦上，用 Node.js 執行，不是在網頁裡。第一段先檢查設定有沒有填。', file: 'scripts/seed.mjs', code: C.SEED_1 },
      { say: '再加商品資料。四個「熱賣」商品，名稱、價格、一句介紹，都照設計稿首頁的文字。圖片用你之前切版專案放在 GitHub 的圖片網址。sample 這個小函式，是把重複的欄位先補好，讓資料看起來整齊。', file: 'scripts/seed.mjs', code: C.SEED_2 },
      { say: '六角規定的欄位很重要：category 是分類，我們用「熱賣」；imageUrl 是主圖；imagesUrl 一定要是陣列，不然 API 會回「imagesUrl 格式不正確」。is_enabled 是 1，代表上架。', slide: ['category: 熱賣　← 下一部用它篩選', 'imageUrl: 主圖網址', 'imagesUrl: [ ... ]　必須是陣列', 'is_enabled: 1　上架'] },
      { say: '再加一個小函式 request，專門發請求。它用 fetch 呼叫 API，把回來的資料轉成 JSON。如果失敗，就丟出錯誤，並且把 API 回覆的訊息顯示出來，除錯時才知道哪裡錯了。', file: 'scripts/seed.mjs', code: C.SEED_3 },
      { say: '最後是主流程。第一步，用帳號密碼登入，拿到 token。第二步，把已經存在的商品讀出來。第三步，一個一個建立，已經有同名的就略過。這樣重複執行也不會建立兩份。', file: 'scripts/seed.mjs', code: C.SEED_4 },
      { say: '執行它。node 加兩個 env-file，一個是 .env，一個是 .env.local，這樣程式就拿得到所有的變數。看到四行「已建立」，就成功了。', term: ['$ node --env-file=.env --env-file=.env.local scripts/seed.mjs', '已建立：香氛蠟燭', '已建立：擴香瓶', '已建立：手工皂套組', '已建立：精油薰香（兩入）'] },
      { say: '再執行一次試試看。因為我們有檢查，所以每一個都會顯示「已存在，略過」，不會重複建立。這種「重複做也沒關係」的寫法，在寫這類程式時很重要。', term: ['$ node --env-file=.env --env-file=.env.local scripts/seed.mjs', '已存在，略過：香氛蠟燭', '已存在，略過：擴香瓶', '已存在，略過：手工皂套組', '已存在，略過：精油薰香（兩入）'] },
      { say: '驗證一下。把這個網址貼到瀏覽器，換成你的 API 路徑，後面加 products 問號 category 等於 熱賣，就會看到剛剛建的四個商品的 JSON 資料。', web: { url: 'https://ec-course-api.hexschool.io/v2/api/你的API路徑/products?category=熱賣', html: '<code style="font-size:11px;word-break:break-all">{"success":true,"products":[{"title":"香氛蠟燭","category":"熱賣","price":480, ... },{"title":"擴香瓶", ... }, ... ]}</code>' } },
      { say: '這一部完成了：申請了 API 路徑、用環境變數存設定、把商品資料放進 API。而且我們也看到怎麼保護密碼。下一部，把這些資料顯示在首頁。', slide: ['✅ .env：公開的設定（VITE_ 開頭）', '✅ .env.local：密碼，不上傳、不打包', '✅ seed.mjs：登入 → 建立商品（可重複執行）'] },
    ],
  },
];
