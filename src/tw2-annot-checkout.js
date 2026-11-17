// 第 17 部（結帳）的「為什麼」：FILE_WHY4、LINE_NOTES4（新檔案）、INSERTS（插進第一階段既有檔案的逐行說明）、STEP_WHY4。
// INSERTS 的格式：{ 檔名: [[在哪個比對字「後面」, [新的比對字, 說明], …], …] }，由 applyInserts() 插進既有清單（順序要和程式碼出現的順序一致）。

export const FILE_WHY4 = {
  'src/data/checkout.ts': '結帳會用到的固定資料：運費、送貨方式、付款方式，還有把數字變成「NT$ 1,796」的小函式。放在一個地方，三個步驟的頁面都來這裡拿，要改運費只改這一行。',
  'src/components/CheckoutSteps.tsx': '結帳最上面的三步驟列（查看購物車、填寫資料、訂單確認）。三個頁面都會用，只要告訴它「現在是第幾步」。',
  'src/components/OrderSummary.tsx': '「訂單資訊」：總金額、運費、應付金額。購物車頁和填寫資料頁都要顯示同樣的東西，所以做成元件。',
  'src/components/SectionTitle.tsx': '設計稿裡「購物車清單」「選擇送貨及付款方式」「訂單資訊」這些淺綠色標題條，長得都一樣，做成一個小元件。',
  'src/pages/CartPage.tsx': '結帳第 1 步：購物車。列出商品、可以改數量或移除，選送貨與付款方式，右邊算出應付金額。',
  'src/components/FormField.tsx': '表單的一個欄位（標籤＋輸入框＋錯誤訊息）。填寫資料頁有 5 個欄位，長得都一樣，所以只寫一次。',
  'src/pages/CheckoutPage.tsx': '結帳第 2 步：填寫收件資料。檢查格式、送出訂單，成功就跳到第 3 步。',
  'src/hooks/useOrder.ts': '用「訂單編號」讀一筆訂單的 Hook，寫法和 <code>useProduct</code> 一樣。',
  'src/pages/OrderPage.tsx': '結帳第 3 步：訂單確認。顯示訂單內容和付款狀態，可以按「前往付款（模擬）」。',
};

export const LINE_NOTES4 = {
  'src/data/checkout.ts': [
    ['export const SHIPPING_FEE', '運費 60 元（設計稿的數字）。大寫＋底線是「常數」的慣用寫法：這個值不會變。'],
    ['export const deliveryOptions', '送貨方式的選項。設計稿只看得到「蝦皮取貨」，其他兩個是我們加的。六角 API 沒有送貨欄位，所以這只是畫面上的選擇，最後會寫進訂單的備註。'],
    ['export const paymentOptions', '付款方式的選項（設計稿沒有列出，我們自己決定）。'],
    ['export const formatPrice', '把 <code>1796</code> 變成 <code>NT$ 1,796</code>。<code>toLocaleString()</code> 會加千分位逗號。寫成函式，全站的價格格式才會一致。'],
  ],
  'src/components/CheckoutSteps.tsx': [
    ['current: 1 | 2 | 3', '<b>字面值聯集型別</b>：只能是 1、2、3 其中一個。傳 4 或 0，TypeScript 馬上紅線。'],
    ['const steps', '三個步驟的名字。'],
    ['<ol', '<code>ol</code> 是「有順序的清單」，步驟本來就有順序，語意正確。<code>border-b-2</code> 是整條底下的灰線。'],
    ['steps.map((label, index)', '畫出三個步驟。<code>index</code> 從 0 開始，所以 <code>number = index + 1</code>。'],
    ['const active', '這一步是不是「現在這一步」。'],
    ['aria-current', '告訴螢幕閱讀器「這是目前的步驟」。'],
    ['-mb-0.5', '往下移 2px，讓選中的綠色底線蓋住灰線（和商品細節的分頁籤同一招）。'],
    ['pt-4 pb-4.5', '上下內距 16／18px：加上 24px 的圓圈、8px 間距、文字，整列剛好 90px（設計稿量出來的）。'],
    ['active ? \'border-primary-dark', '現在這一步：深綠；其他：灰色。'],
    ['rounded-full', '圓圈：<code>size-6</code>（24px）＋ <code>rounded-full</code>。已完成或進行中的步驟（<code>number &lt;= current</code>）是深綠，還沒到的是灰色。'],
    ['className="h5"', '步驟名稱：18px 粗體。'],
  ],
  'src/components/OrderSummary.tsx': [
    ['import { SHIPPING_FEE', '運費和價格格式都從 <code>data/checkout.ts</code> 拿。'],
    ['total: number', '只收「商品總金額」，運費自己加。'],
    ['<dl', '<code>dl／dt／dd</code> 是「名稱／內容」成對的標籤（<code>dt</code> 名稱、<code>dd</code> 內容），很適合「總金額：1,796」這種一對一對的資料。'],
    ['space-y-4', '每一列之間空 16px。<code>pt-7.5</code> 上面空 30px（設計稿標題條到第一列）。'],
    ['flex justify-between', '名稱靠左、金額靠右。'],
    ['formatPrice(total)', '商品總金額。'],
    ['formatPrice(SHIPPING_FEE)', '運費。'],
    ['border-t-2 border-n-20', '「應付金額」上面一條 2px 淡灰分隔線。'],
    ['formatPrice(total + SHIPPING_FEE)', '應付金額 ＝ 商品總金額 ＋ 運費，用 24px 深綠粗體（<code>h4</code>）強調。'],
  ],
  'src/components/SectionTitle.tsx': [
    ['import type { ReactNode }', '<code>children</code> 的型別。'],
    ['children: ReactNode', '標題條裡面要放什麼，由使用的人決定。'],
    ['bg-primary-100/15', '<b>顏色後面加 <code>/15</code> ＝ 透明度 15%</b>：主綠色淡淡地蓋上去，就是設計稿那條淺灰綠。不用另外定義新顏色。'],
    ['h2', '用 <code>h2</code> 文字樣式（襯線粗體、行高 1.2），桌面再把字級改成 24px（<code>lg:text-[24px]</code>，因為 <code>h2</code> 桌面預設是 32px）。標題條高 45px ＝ 行高 29 ＋ 上下各 8。'],
  ],
  'src/pages/CartPage.tsx': [
    ['import { useState }', '要記住「送貨方式」「付款方式」「有沒有顯示錯誤」。'],
    ['useNavigate', '<code>useNavigate()</code> 讓你用<b>程式</b>換頁（<code>Link</code> 是給使用者點的；這裡要「檢查通過後」才換頁，所以用 <code>navigate</code>）。'],
    ['const columns', '桌面版表格的四欄寬度：商品 416、單價 415、數量 242、小計 剩下的（設計稿量出來）。標題列和每一列共用，欄位才會對齊。<code>[ ]</code> 裡用底線代表空格。'],
    ['useCart()', '拿到整份購物車 <code>cart</code>、改數量 <code>updateQty</code>、移除 <code>remove</code>。'],
    ['useState(deliveryOptions[0])', '送貨方式一開始選第一個（蝦皮取貨）。'],
    ['useState(\'\')', '付款方式一開始<b>沒選</b>（空字串），強迫使用者選一個（設計稿也是「請選擇……」）。'],
    ['useState(false)', '有沒有顯示「請選擇付款方式」的錯誤。一開始不要嚇使用者，按了「下一步」才顯示。'],
    ['if (!cart) return', '還沒讀到購物車：顯示讀取中。提早 return，下面就能放心用 <code>cart</code>。'],
    ['const goNext', '按「下一步」：<b>先檢查再換頁</b>。沒選付款方式就顯示錯誤、不換頁（<code>return</code> 直接結束函式）。'],
    ['navigate(\'/checkout\', { state', '<b>用 <code>state</code> 帶資料到下一頁</b>：把選好的送貨、付款方式一起帶過去。下一頁用 <code>useLocation().state</code> 讀。缺點：重新整理就沒了，所以下一頁要有預設值。'],
    ['pt-8 pb-18 lg:pt-18', '上方：導覽列到步驟列桌面 72px（<code>lg:pt-18</code>）；下方：內容到頁尾 72px（<code>pb-18</code>）。'],
    ['<CheckoutSteps current={1}', '第 1 步。'],
    ['lg:mt-14', '步驟列到「購物車清單」標題條：桌面 56px。'],
    ['<SectionTitle>購物車清單', '淺綠標題條。'],
    ['cart.carts.length === 0 ?', '<b>空購物車</b>也要有畫面：提示＋「看看商品」按鈕，不要留一片空白。三元運算：<code>條件 ? 空的畫面 : 有商品的畫面</code>。'],
    ['hidden border-b-2', '桌面才有的「表格標題列」（商品資訊、單價、數量、小計）。手機沒有欄位，所以 <code>hidden lg:grid</code>。'],
    ['cart.carts.map', '每個購物車項目畫一列。<code>key</code> 用項目的 <code>id</code>。'],
    ['lg:py-5.75', '每列高 148px ＝ 圖 100 ＋ 上下各 23 ＋ 底線 2。'],
    ['size-25', '商品圖 100×100（<code>size-25</code> ＝ 25×4）。'],
    ['item.product.description', '小標（琥珀之夜…），14px 灰字。'],
    ['onClick={() => remove(item.id)}', '「移除」：把這個項目從購物車刪掉。設計稿沒有這個按鈕，但沒有它就不能把商品拿掉（數量最少是 1），所以我們加上去。'],
    ['hidden t-m lg:block', '單價：桌面才顯示（手機直接看「總計」就好）。'],
    ['<QuantityInput', '<b>重用</b>上一部做的數量框。<code>onChange</code> 呼叫 <code>updateQty</code>：把<b>項目編號、商品編號、新數量</b>送給 API，再重新讀購物車，畫面和金額就更新了。'],
    ['lg:hidden">總計', '手機版的「總計」文字（桌面有欄位標題，不需要）。'],
    ['formatPrice(item.final_total)', '這個項目的小計（單價×數量）。'],
    ['cart.carts.length > 0 && (', '購物車有東西，才需要選送貨方式和下一步。<code>&lt;&gt;…&lt;/&gt;</code> 是 Fragment（不多包一層）。'],
    ['lg:grid-cols-2 lg:gap-6', '左右兩欄各 636px、中間 24px；手機上下排。'],
    ['<SectionTitle>選擇送貨及付款方式', '左欄標題條。'],
    ['space-y-8 pt-6 lg:pt-8', '兩個下拉選單之間 32px；標題條到第一個標籤 32px。'],
    ['<select', '原生的下拉選單。<code>value</code> 和 <code>onChange</code> 讓它變成<b>受控</b>：選項由 state 決定。'],
    ['setDelivery(e.target.value)', '<code>e.target.value</code> 是使用者選到的那一項的值。'],
    ['h-12.5', '選單高 50px（設計稿）。手機只有底線（<code>border-b</code>），桌面是整圈框（<code>lg:border</code>）。'],
    ['deliveryOptions.map', '用陣列畫出每個選項。'],
    ['showError && !payment', '按過「下一步」而且還沒選付款方式：框變紅色（<code>border-red-600</code>）。'],
    ['請選擇⋯⋯', '預設的第一項，值是空字串 <code>""</code>，所以「沒選」就是空字串。'],
    ['請選擇付款方式', '錯誤訊息，紅字。'],
    ['<SectionTitle>訂單資訊', '右欄標題條。'],
    ['<OrderSummary total={cart.final_total}', '金額：<code>final_total</code> 是套用折扣後的商品總金額，運費由 OrderSummary 自己加。'],
    ['disabled className="bg-n-20', '「回上一步」：第 1 步沒有上一步，所以停用（灰色）。'],
    ['onClick={goNext}', '按「下一步」才執行 <code>goNext</code>。<code>lg:px-4</code>：桌面左右內距 16px，按鈕寬度才和設計稿一樣。'],
  ],
  'src/components/FormField.tsx': [
    ['type FormFieldProps', '一個欄位要的東西：標籤、欄位名稱、目前的值、錯誤訊息（選填）、輸入類型（選填）、提示字（選填）、改變時通知誰。'],
    ['onChange: (name: string, value: string) => void', '改變時回報「<b>哪個欄位</b>、<b>新的值</b>」。這樣 5 個欄位可以共用同一個處理函式。'],
    ['type = \'text\'', '預設是一般文字框；Email 傳 <code>email</code>、手機傳 <code>tel</code>，手機會跳出對應的鍵盤。'],
    ['<label', '<code>label</code> 包住輸入框：點標籤文字，游標也會跳進輸入框。'],
    ['value={value}', '輸入框的值來自 state（<b>受控</b>）。'],
    ['onChange={(e) => onChange(name, e.target.value)}', '每打一個字就通知外面：欄位名稱、目前輸入的內容。'],
    ['placeholder:text-n-40', '提示字是淺灰色。'],
    ['focus:border-primary-100', '游標在裡面時，框變成綠色。'],
    ['error ? \'border-red-600\'', '有錯誤就紅框，沒有就灰框。'],
    ['{error &&', '有錯誤才顯示紅色訊息。'],
  ],
  'src/pages/CheckoutPage.tsx': [
    ['useLocation', '<code>useLocation()</code>：讀目前網址和<b>帶過來的 state</b>。'],
    ['createOrder', '建立訂單的 API 函式。'],
    ['type Values', '表單五個欄位的型別。'],
    ['type Errors = Partial<Record<keyof Values', '<b>型別組合</b>：<code>keyof Values</code> ＝ 「欄位名稱」（name／email／…）；<code>Record&lt;名稱, string&gt;</code> ＝ 每個名稱對應一個字串；<code>Partial</code> ＝ 每一個都可以沒有。意思就是「哪個欄位有錯，就有那個欄位的錯誤訊息」。'],
    ['const emptyValues', '五個欄位一開始都是空字串。'],
    ['const validate', '<b>檢查函式</b>：收表單的值，回傳「錯誤訊息」物件。沒有錯誤就是空物件。寫成函式放在元件外面，因為它不需要 state。'],
    ['values.name.trim()', '<code>trim()</code> 去掉前後空白，只打空格也算沒填。'],
    ['includes(\'@\')', '簡單檢查 Email：要有 <code>@</code> 和 <code>.</code>。（嚴格的格式檢查很複雜，這裡先求夠用。）'],
    ['values.tel.length !== 10', '手機：要 10 碼、<code>09</code> 開頭、而且是數字（<code>Number()</code> 轉不成數字會得到 <code>NaN</code>）。'],
    ['errors.address', '地址：不能空白。'],
    ['location.state as', '<code>as</code> 是<b>型別斷言</b>：告訴 TypeScript「我知道 state 長這樣」。因為重新整理後 state 會消失，所以型別包含 <code>null</code>，後面用 <code>?.</code> 和 <code>??</code> 處理。'],
    ['useState<Values>(emptyValues)', '表單的值全部放在<b>一個物件</b>裡，不用 5 個 useState。'],
    ['useState<Errors>({})', '錯誤訊息，一開始沒有。'],
    ['useState(false)', '送出中：避免連按兩次送出兩張訂單。'],
    ['useState(\'\')', '送出失敗的訊息。'],
    ['cart.carts.length === 0', '購物車是空的就不能結帳。'],
    ['setValues((previous)', '<b>函式寫法的 setState</b>：拿「最新的值」來改。<code>[name]: value</code> 的中括號是「用變數當屬性名稱」。比 <code>setValues({ ...values, … })</code> 安全，連續更新時不會用到舊資料。'],
    ['const submit = async', '按「送出訂單」。'],
    ['const found = validate(values)', '先檢查。'],
    ['Object.keys(found).length > 0', '只要有任何一個錯誤（物件裡有任何一個屬性）就停下來，不送出。'],
    ['setSubmitting(true)', '開始送：按鈕停用。'],
    ['const note', '六角訂單沒有「送貨方式」欄位，所以把選的送貨、付款方式<b>寫進備註</b>（<code>message</code>）。<code>choice?.delivery ?? \'未選\'</code>：沒有帶過來就寫「未選」。'],
    ['await createOrder(', '建立訂單：送出收件人資料和備註，成功會拿回<b>訂單編號</b>。六角會自動把購物車的商品變成訂單，購物車就清空了。'],
    ['await refresh()', '重新讀購物車（現在是空的），導覽列的數字才會歸零。'],
    ['navigate(\'/order/\' + orderId)', '換到第 3 步，網址帶訂單編號。'],
    ['setFailed(', '失敗：顯示訊息，並讓按鈕恢復可以按。（成功時不用恢復，因為已經換頁了。）'],
    ['<CheckoutSteps current={2}', '第 2 步。'],
    ['<SectionTitle>收件資料', '左欄標題條。'],
    ['<FormField label="姓名"', '五個欄位用同一個元件、同一個 <code>change</code> 函式，只有標籤、名稱、類型不同。'],
    ['error={errors.name}', '把這個欄位的錯誤訊息傳進去（沒有錯誤就是 undefined）。'],
    ['type="email"', '類型傳 <code>email</code>：手機會跳出有 @ 的鍵盤。'],
    ['placeholder="0912345678"', '提示字：告訴使用者手機要怎麼寫。'],
    ['<OrderSummary', '右邊同樣顯示金額，使用者填資料時還看得到要付多少。'],
    ['{failed &&', '送出失敗的紅字訊息。'],
    ['navigate(\'/cart\')', '「回上一步」：回購物車。'],
    ['disabled={submitting}', '送出中不能再按；文字也換成「送出中…」。'],
  ],
  'src/hooks/useOrder.ts': [
    ['type Result', '和 <code>useProduct</code> 一樣：結果包含「是哪個 id 的」。'],
    ['getOrder(id)', '用訂單編號讀訂單。失敗就說「找不到這筆訂單」。'],
    ['const current', '只採用 id 對得上的結果。'],
    ['loading: Boolean(id)', '讀取中是「算出來」的。'],
  ],
  'src/pages/OrderPage.tsx': [
    ['useParams', '讀網址裡的訂單編號（路由是 <code>order/:id</code>）。'],
    ['payOrder', '付款的 API 函式。'],
    ['useOrder(id)', '讀這筆訂單。'],
    ['useState(false)', '這次有沒有按過付款（讓畫面立刻變成「已付款」，不用重新讀一次訂單）。'],
    ['useState(false)', '付款中：按鈕停用。'],
    ['if (loading) return', '讀取中。'],
    ['if (error || !order) return', '失敗或找不到：顯示訊息。通過之後 <code>order</code> 一定有值。'],
    ['const isPaid', '已付款 ＝ 剛剛按過付款，<b>或</b>訂單本來就是已付款（<code>||</code> 是「或」）。'],
    ['Object.values(order.products)', '六角訂單的 <code>products</code> 是<b>物件</b>（用編號當名字），不是陣列。<code>Object.values</code> 把裡面的值取出來變成陣列，才能 <code>map</code>。'],
    ['const pay = async', '按「前往付款」：呼叫付款 API，成功就把 <code>paid</code> 設成 true。（六角的付款是模擬的，不會真的收錢。）'],
    ['<CheckoutSteps current={3}', '第 3 步。'],
    ['<dl', '訂單基本資料：編號、付款狀態、收件人、地址。<code>lg:grid-cols-2</code> 桌面兩欄。'],
    ['break-all', '訂單編號很長，允許在任何地方斷行，不會撐破版面。'],
    ['isPaid ? \'text-primary-dark\'', '已付款綠色、尚未付款紅色。'],
    ['items.map', '訂單裡的每個商品：圖、名稱、單價×數量、小計。'],
    ['order.total + SHIPPING_FEE', '應付金額 ＝ 訂單商品總額 ＋ 運費。'],
    ['<Link to="/"', '回首頁。因為不是按鈕動作，是單純換頁，所以用 <code>Link</code>。'],
    ['{!isPaid && (', '還沒付款才顯示付款按鈕。'],
  ],
};

export const INSERTS = {
  'src/types.ts': [
    ['export type CartResponse', [
      ['export type OrderUser', '收件人的資料：姓名、Email、手機、地址。建立訂單時要送給 API。'],
      ['export type Order =', '一筆訂單。<code>create_at</code> 是時間戳記、<code>is_paid</code> 是否已付款。'],
      ['products: Record<string, CartItem>', '訂單裡的商品是<b>物件</b>（<code>Record&lt;字串, CartItem&gt;</code>：用字串當名字、值是 CartItem），不是陣列。這是六角 API 的寫法。'],
      ['export type OrderResponse', '讀一筆訂單時 API 回來的樣子。'],
      ['export type CreateOrderResponse', '建立訂單後 API 回來的樣子：有新的<b>訂單編號</b> <code>orderId</code>。'],
    ]],
  ],
  'src/api.ts': [
    ['api.post', [
      ['export async function updateCartItem', '改購物車某一項的數量。網址帶<b>購物車項目的編號</b>（不是商品編號）。'],
      ['api.put', '<code>put</code> 是「更新」。要同時送商品編號和新的數量。'],
      ['export async function removeCartItem', '把某一項從購物車移除。'],
      ['api.delete', '<code>delete</code> 是「刪除」，不用送資料。'],
      ['export async function createOrder', '建立訂單：送收件人資料和備註。回傳新的訂單編號。'],
      ['export async function getOrder', '用訂單編號讀訂單，回傳 <code>res.data.order</code>。'],
      ['export async function payOrder', '付款（六角是模擬的）。'],
    ]],
  ],
  'src/context/CartContext.ts': [
    ['export type CartContextValue', [
      ['cart: Cart | null', '整份購物車（商品、金額），不再只放數量。<code>null</code> ＝ 還沒讀到。'],
    ]],
    ['qty?: number', [
      ['updateQty:', '改某一項的數量：要項目編號、商品編號、新數量。'],
      ['remove:', '移除某一項。'],
      ['refresh:', '重新讀一次購物車。'],
    ]],
  ],
  'src/App.tsx': [
    ['path="products/:id"', [
      ['path="cart"', '網址 <code>/cart</code>：結帳第 1 步。'],
      ['path="checkout"', '網址 <code>/checkout</code>：第 2 步。'],
      ['path="order/:id"', '網址 <code>/order/訂單編號</code>：第 3 步，<code>:id</code> 是訂單編號。'],
    ]],
  ],
};
// CartProvider、Navbar 的說明要插在某個比對字「前面」
export const INSERTS_BEFORE = {
  'src/context/CartProvider.tsx': [
    ['const countItems', [['const emptyCart', '購物車是「空的」的樣子。讀取失敗時用它，頁面就會顯示「購物車是空的」，不會一直卡在讀取中。']]],
    ['useState(false)', [['useState<Cart | null>(null)', '現在 state 存<b>整份購物車</b>，不只是數量。一開始 <code>null</code> ＝ 還沒讀到。']]],
    ['const add = async', [['const refresh', '<b>重新讀購物車並放進 state</b>。加入、改數量、移除之後都要做這件事，所以寫成一個函式。']]],
    ['<CartContext value', [
      ['const updateQty', '改數量：先送給 API，再 <code>refresh()</code> 重新讀，畫面和金額就跟著更新。'],
      ['const remove', '移除一項：同樣是送出之後重新讀。'],
    ]],
  ],
  'src/components/Navbar.tsx': [
    ['aria-label="購物車"', [['<Link to="/cart"', '購物車圖示連到 <code>/cart</code>（結帳第 1 步）。']]],
    ['購物車{count > 0', [['              to="/cart"', '手機選單裡的購物車連結，同樣連到 <code>/cart</code>，點了順便關閉選單。']]],
  ],
};
// 另外 CartProvider 的 count 說明放在 <CartContext value 之後
export const INSERTS_AFTER_EXTRA = {
  'src/context/CartProvider.tsx': [
    ['<CartContext value', [['count: countItems(cart)', '數量不再另外存，而是<b>從 cart 算出來</b>：所有項目的數量相加。算出來的值永遠和 cart 一致，不會「忘了更新」。']]],
  ],
};

// 把 INSERTS（插在某個比對字「後面」）與 INSERTS_BEFORE（「前面」）插進清單
export function applyInserts(lines, afterMap = INSERTS, beforeMap = INSERTS_BEFORE, afterExtra = INSERTS_AFTER_EXTRA) {
  const out = { ...lines };
  const place = (file, anchor, items, offset) => {
    const list = [...(out[file] || [])];
    const i = list.findIndex((x) => x[0] === anchor);
    if (i < 0) throw new Error('找不到插入位置：' + file + ' / ' + anchor);
    list.splice(i + offset, 0, ...items);
    out[file] = list;
  };
  for (const [file, groups] of Object.entries(afterMap)) for (const [anchor, items] of groups) place(file, anchor, items, 1);
  for (const [file, groups] of Object.entries(beforeMap)) for (const [anchor, items] of groups) place(file, anchor, items, 0);
  for (const [file, groups] of Object.entries(afterExtra)) for (const [anchor, items] of groups) place(file, anchor, items, 1);
  return out;
}

export const STEP_WHY4 = [
  ['<code>types.ts</code> 新增訂單的型別', '建立、讀取訂單的資料長什麼樣子，先寫成型別，後面寫錯欄位名稱 TypeScript 馬上就會抓到。'],
  ['<code>api.ts</code> 新增五個函式', '改數量（PUT）、移除（DELETE）、建立訂單（POST）、讀訂單（GET）、付款（POST）。所有「跟 API 講話」的事都放這個檔案。'],
  ['<code>CartContext</code> 改成共享整份購物車', '購物車頁需要知道每個商品、每一項的數量，不是只有總數。<b>改了型別之後，CartProvider 會出現紅線</b>（少了 cart、updateQty…）：這是預期的，TypeScript 在告訴你下一步要補什麼。'],
  ['<code>CartProvider</code> 補上 cart、updateQty、remove、refresh', '把整份 cart 存在 state；「加入、改數量、移除」做完都重新讀一次，畫面永遠和 API 一致。數量改成<b>從 cart 算出來</b>，不用另外存。'],
  ['新增 <code>data/checkout.ts</code>', '運費、選項、價格格式是三個頁面共用的資料，放一個地方。'],
  ['新增 <code>CheckoutSteps</code>', '三個頁面最上面都要有同樣的步驟列，只有「現在第幾步」不同。'],
  ['新增 <code>OrderSummary</code>', '購物車頁和填寫資料頁都要顯示金額，所以做成元件。'],
  ['新增 <code>SectionTitle</code>', '設計稿裡一共有 6 個一樣的淺綠標題條。'],
  ['做 <code>CartPage</code>（第 1 步）', '列商品、改數量（重用 QuantityInput）、選送貨付款方式、算金額。<b>按下一步前要先檢查</b>：沒選付款方式就不能往下。'],
  ['新增 <code>FormField</code>', '表單有 5 個欄位，長得一樣：標籤、輸入框、錯誤訊息。'],
  ['做 <code>CheckoutPage</code>（第 2 步）', '收件資料表單：先在瀏覽器檢查格式（Email、手機…），通過才送 API；成功就換到第 3 步。'],
  ['新增 <code>useOrder</code>', '和 <code>useProduct</code> 同一個寫法，用訂單編號讀訂單。'],
  ['做 <code>OrderPage</code>（第 3 步）', '顯示訂單內容與付款狀態；付款按鈕呼叫付款 API。'],
  ['<code>App.tsx</code> 新增三條路由', '<code>/cart</code>、<code>/checkout</code>、<code>/order/:id</code>。'],
  ['導覽列的購物車連到 <code>/cart</code>', '之前購物車圖示是 <code>#</code>（沒有功能），現在有頁面了。'],
  ['<code>npm run build</code>', '最後確認型別和打包。'],
];
