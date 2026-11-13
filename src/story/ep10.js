// 第 10 部「串接商品 API：熱賣商品」：
//   做錯 ①：res.data.product（少打 s）→ TS2551（Did you mean 'products'?）
//   做錯 ②：Product 是型別卻用一般 import → TS1484（呼應第 1 部的 import type 規則）
// npm install axios 的輸出是在 Vite＋Tailwind 專案裡真的跑出來的。
import { T, R, chapter, type, open, view, hl, unhl, float, unfloat, fx, confetti, term, list, card, wait, err, noerr } from './dsl.js';
import * as C from '../tw-react-code.js';

const API_BAD = C.API_1.replace('res.data.products', 'res.data.product');
const HOOK_BAD = C.USE_PRODUCTS.replace("import type { Product } from '../types'", "import { Product } from '../types'");
const ERR_PROD = "Property 'product' does not exist on type 'ProductsResponse'. Did you mean 'products'?";
const ERR_IMPORT = "'Product' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.";

const layers = `<div style="font:13px/2;text-align:center">🃏 ProductCard<br>⬇ 要資料<br>🪝 useProducts<br>⬇ 呼叫<br>📡 api.ts（axios）<br>⬇ 發請求<br>☁️ 六角 API</div>`;
const why = list(['每一層只做一件事', '換 API 網址 → 只改 <code>api.ts</code>', '改讀取中的畫面 → 只改元件']);
const group = list(['外層加 <code>group</code>', '裡面的元素寫 <code>group-hover:</code>：外層被滑鼠移上去時才生效', '圖片外包一層 <code>overflow-hidden</code>，放大才不會跑出來']);

const beats = [
  chapter('開場', ['第 10 部', '串接商品 API', '📡']),
  T('這部讓「默默熱賣中」顯示真的 API 資料！先看資料怎麼流動～'),
  float(card('📡 資料的旅程', layers)),
  R('拆這麼多層，會不會太麻煩？', 'worried'),
  T('每一層只做一件事，以後才好改。', 'happy'),
  float(card('🧩 為什麼要拆層', why)),
  wait(3600),
  unfloat,
  T('先安裝 axios，它是專門發請求的套件。', 'happy'),
  term('npm install axios', ['', 'added 31 packages, and audited 82 packages in 924ms', '', '18 packages are looking for funding', '  run `npm fund` for details', '', 'found 0 vulnerabilities']),

  chapter('型別與資料'),
  T('先處理環境變數的型別。新增 `src/vite-env.d.ts`，告訴 TypeScript：我們的兩個變數都是字串。', 'happy'),
  type('src/vite-env.d.ts', C.ENV_DTS),
  T('這樣你打 `import.meta.env.` 的時候會有自動建議，打錯名字也會報錯。', 'normal'),
  T('接著用 `src/types.ts` 描述一個商品長什麼樣子。這些欄位名稱，是從六角的 API 文件讀來的。', 'happy'),
  type('src/types.ts', C.TYPES_1),
  T('小提醒：文件範例把商品列表畫成物件，但我們實際呼叫確認過，回來的是「陣列」。寫型別要以真正回來的資料為準！', 'happy', { fx: '💡' }),

  chapter('新人先試'),
  T('新增 `src/api.ts`。`axios.create` 設好網址前半段，每次只要寫後面不一樣的部分。換你寫 `getProducts`～', 'happy'),
  R('我來！呼叫 `/products`，然後回傳商品～', 'happy', { jump: 'rookie' }),
  type('src/api.ts', API_BAD, { broken: true }),
  err(10, 'res.data.product', ERR_PROD),
  { fx: 'shake' },
  R('紅線！它說 `product` 不存在，是不是想打 `products`？', 'surprised', { fx: '❗' }),

  chapter('老師點醒'),
  T('這就是 `api.get<ProductsResponse>` 尖括號的用處：告訴 TypeScript「回來的資料長這樣」。', 'happy'),
  hl(9, 9),
  R('所以它知道有 `products`、沒有 `product`！還提醒我是不是打錯字！', 'surprised', { jump: 'rookie' }),
  unhl,
  T('對！不用等到畫面壞掉才發現。這種尖括號叫「泛型」。', 'happy', { fx: '💡' }),
  type('src/api.ts', C.API_1, { slow: true }),
  noerr,

  chapter('自訂 Hook'),
  T('接著做 `useProducts`，一個自訂的 Hook。它管理三個狀態：商品、是不是還在讀取、有沒有錯誤。', 'happy'),
  R('我來試試！`Product` 型別要從 `types` 匯入～', 'happy', { jump: 'rookie' }),
  type('src/hooks/useProducts.ts', HOOK_BAD, { broken: true }),
  err(3, 'Product', ERR_IMPORT),
  R('又是紅線…它說 `Product` 是型別，要用「型別專用的 import」？', 'surprised', { fx: '❗' }),
  T('還記得第 1 部那兩個嚴格規則嗎？只當型別用的 import，要寫什麼？', 'normal'),
  R('`import type`！', 'happy', { fx: '💡' }),
  type('src/hooks/useProducts.ts', C.USE_PRODUCTS, { slow: true }),
  noerr,
  hl(10, 15),
  T('`useEffect` 在畫面出現時呼叫 `getProducts`：成功就存起來、失敗記錄錯誤，最後不管成功失敗都關掉「讀取中」。', 'happy'),
  unhl,
  T('最後面的 `[category]`：分類換了就重新讀取，之後做產品列表可以直接重用。', 'normal'),

  chapter('卡片與熱賣區'),
  T('接著做商品卡片。滑鼠移上去，圖片放大、文字區變淺綠色，這是設計稿的 hover 效果。', 'happy'),
  type('src/components/ProductCard.tsx', C.CARD_1, { bulk: true }),
  float(card('🖱️ group-hover', group)),
  wait(4200),
  unfloat,
  T('最後是 `HotProducts` 區塊：三種情況各有畫面，讀取中、錯誤、沒有資料；有資料就 `map` 畫出卡片。', 'happy'),
  type('src/components/HotProducts.tsx', C.HOT_1, { bulk: true }),
  type('src/App.tsx', C.APP_10),
  view(4200, 'ok', '默默熱賣中'),
  R('四個商品出現了！圖片、名字、介紹，都是從 API 來的！', 'happy', { fx: '✨' }),
  T('手機是橫向左右滑，桌面（md 以上）是四欄 grid。你也可以到六角後台改商品名稱，重新整理就會跟著變。', 'happy'),

  chapter('今天學到'),
  T('來，換你當小老師～'),
  R('我來整理！', 'happy'),
  float(card('📝 今天學到', list(['<code>api.get&lt;型別&gt;</code> 泛型：讓 <code>res.data</code> 有型別，打錯欄位馬上紅線', '只當型別用的 import 要寫 <code>import type</code>（第 1 部的規則）', '自訂 Hook 管理三種狀態：資料、讀取中、錯誤']))),
  wait(6000),
  T('太棒了！下一部做購物車～', 'happy', { fx: '🎉' }),
  confetti,
  unfloat,
  wait(1500),
];

export default {
  title: '串接商品 API：熱賣商品',
  endSub: '下一部：購物車 API 與導覽列數字',
  beats,
};
