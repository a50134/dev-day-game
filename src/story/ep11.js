// 第 11 部「購物車 API 與導覽列數字」：
//   做錯 ①：useCart 用了，但 App 沒有包 CartProvider → 預覽真的丟出「useCart 必須放在 CartProvider 裡面使用」
//   做錯 ②：add(product) 傳整個商品，但函式要的是商品編號（字串）→ TS2345
import { T, R, chapter, type, open, view, hl, unhl, float, unfloat, fx, confetti, list, card, wait, err, noerr } from './dsl.js';
import * as C from '../tw-react-code.js';

const NAV_5a = C.NAV_4.replace("import Button from './Button'", "import { useCart } from '../hooks/useCart'\nimport Button from './Button'").replace('  const [user, setUser]', '  const { count } = useCart()\n  const [user, setUser]');
const NAV_5b = C.NAV_5.replace(/\n *<a href="#" className="block border-b border-n-20 py-4 text-center t-l">\n *購物車[^\n]*\n *<\/a>/, '');
const CARD_BAD = C.CARD_2.replace('add(product.id)', 'add(product)');
const ERR_ARG = "Argument of type 'Product' is not assignable to parameter of type 'string'.";

const states = list(['按「加入購物車」→ 送一筆資料給 API', '導覽列購物車圖示旁出現數字', '數量是 0 的時候不顯示數字']);
const ctx = `<div style="font:13px/1.9;text-align:center">🧭 導覽列（最上面）　　🃏 商品卡片（很下面）<br>⬇　　　　　　⬇<br><b>📦 CartProvider（最外層）</b><br>count、adding、add<br><span style="color:#666">兩邊都能用 useCart() 讀到，不用一層一層傳</span></div>`;
const tcf = list(['<code>try</code>：試著做（送出、重新讀購物車）', '<code>catch</code>：失敗了怎麼辦（跳提醒）', '<code>finally</code>：不管成功失敗，最後都做（關掉「加入中」）']);
const limit = list(['六角的購物車是跟著 API 路徑走，不是跟著使用者', '同一個路徑下，大家看到同一台購物車', '真的商店要有自己的後端和使用者登入']);

const beats = [
  chapter('開場', ['第 11 部', '購物車', '🛒']),
  T('這部做購物車：按下「加入購物車」，導覽列的購物車數字就會增加～'),
  float(card('🛒 要做到的事', states)),
  R('導覽列在最上面，按鈕在很下面，它們怎麼互相通知？', 'worried'),
  unfloat,
  T('好問題！先補型別和 API 函式，再回答你。', 'happy'),
  type('src/types.ts', C.TYPES_2, { bulk: true }),
  T('`CartItem` 是購物車裡的一項，`Cart` 是整個購物車，`CartResponse` 是 API 回應的外層。', 'normal'),
  type('src/api.ts', C.API_2),
  T('注意 `getCart` 回傳的是 `res.data.data`，因為六角把購物車包在 `data` 裡面。`qty = 1` 是預設值，呼叫時可以不傳。', 'happy'),

  chapter('共享資料'),
  T('導覽列和按鈕不是父子，不能直接傳東西。這時候用 Context：把「購物車數量」放在最外層，大家都讀得到。', 'happy', { fx: '💡' }),
  float(card('📦 Context 的概念', ctx)),
  wait(4200),
  unfloat,
  type('src/context/CartContext.ts', C.CART_CONTEXT, { bulk: true }),
  T('`CartContextValue` 描述大家能拿到什麼：`count` 數量、`adding` 是不是加入中、`add` 加入購物車的函式。', 'happy'),
  type('src/context/CartProvider.tsx', C.CART_PROVIDER_1, { bulk: true }),
  T('`CartProvider` 畫面一出現，就去讀購物車，用 `reduce` 把所有商品數量加起來。`add` 先放空函式，等一下再補。', 'happy'),

  chapter('新人先試'),
  T('用的時候每次都寫 `useContext` 太長，所以包成 `useCart`。', 'happy'),
  type('src/hooks/useCart.ts', C.USE_CART),
  hl(6, 6),
  T('如果拿到 `null`，就丟出清楚的錯誤訊息，這樣忘了包 Provider 馬上知道。', 'normal'),
  unhl,
  R('換我！導覽列直接用 `useCart` 拿數量，在購物車圖示旁顯示～', 'happy', { jump: 'rookie' }),
  type('src/components/Navbar.tsx', NAV_5a, { noCheck: true }),
  R('數量大於 0 才顯示，這樣空的購物車就不會有數字～', 'happy'),
  type('src/components/Navbar.tsx', NAV_5b),
  T('手機的選單也要加一個購物車連結，同樣顯示數量。', 'normal'),
  type('src/components/Navbar.tsx', C.NAV_5),
  view(2800),
  { fx: 'shake' },
  R('哇，整個畫面壞掉了！寫著「useCart 必須放在 CartProvider 裡面使用」…', 'surprised', { fx: '❗' }),

  chapter('老師點醒'),
  T('這個訊息是我們自己寫的，它在告訴你什麼？', 'normal'),
  R('`Navbar` 用 `useCart`，可是…誰「提供」資料？我還沒有把 `CartProvider` 放進去！', 'surprised', { jump: 'rookie', fx: '❗' }),
  T('對！要把 `CartProvider` 包在最外面，裡面所有元件才用得到。', 'happy', { fx: '💡' }),
  type('src/App.tsx', C.APP_11),
  view(2800),
  R('畫面回來了！購物車目前是空的，所以沒有數字～', 'happy', { fx: '✨' }),
  T('小知識：React 19 可以直接把 `CartContext` 當標籤，不用再寫 `.Provider`。', 'normal'),

  chapter('加入購物車'),
  T('現在補上 `add`。先把 `adding` 設成 `true` 防止連點，送出後重新讀購物車更新數字。', 'happy'),
  type('src/context/CartProvider.tsx', C.CART_PROVIDER_2),
  float(card('🧱 try / catch / finally', tcf)),
  wait(4800),
  unfloat,
  R('最後在商品卡片放按鈕！按下去就 `add` 這個商品～', 'happy', { jump: 'rookie' }),
  type('src/components/ProductCard.tsx', CARD_BAD, { broken: true, bulk: true }),
  err(24, 'add(product)', ERR_ARG),
  { fx: 'shake' },
  R('紅線！`Product` 不能給 `string`…', 'surprised', { fx: '❗' }),
  T('`add` 要的是什麼？看一下 `CartContextValue`。', 'normal'),
  open('src/context/CartContext.ts'),
  hl(6, 6),
  R('`productId: string`，是「商品編號」，不是整個商品！', 'surprised', { jump: 'rookie', fx: '❗' }),
  unhl,
  open('src/components/ProductCard.tsx'),
  type('src/components/ProductCard.tsx', C.CARD_2, { slow: true }),
  noerr,
  view(4200, 'ok', '默默熱賣中'),
  R('每個卡片都有「加入購物車」按鈕了！', 'happy', { fx: '✨' }),
  T('按下去導覽列就會出現數字；重新整理還在，因為購物車存在六角的 API，不是瀏覽器裡。', 'happy'),
  float(card('⚠️ 練習用 API 的限制', limit)),
  wait(4600),
  unfloat,
  T('另外提醒：設計稿的「加入購物車」其實在商品細節頁，放在首頁是讓你先練習，之後做細節頁再搬過去。', 'normal'),

  chapter('今天學到'),
  T('來，換你當小老師～'),
  R('我來整理！', 'happy'),
  float(card('📝 今天學到', list(['Context 讓遠處的元件共享資料；<code>useCart</code> 沒包 Provider 會丟出明確的錯誤', '<code>try / catch / finally</code>：處理 API 失敗最常用的結構', '函式要什麼型別，就傳什麼（商品編號 <code>string</code>，不是整個商品）']))),
  wait(6000),
  T('太棒了！下一部做分類、企業責任和頁尾～', 'happy', { fx: '🎉' }),
  confetti,
  unfloat,
  wait(1500),
];

export default {
  title: '購物車 API 與導覽列數字',
  endSub: '下一部：商品分類、企業責任、頁尾',
  beats,
};
