// 第二階段：第 14 部起（講義用；每個步驟的程式碼都用真的 Vite + tsc + vite build 驗證過）。
import * as K from './tw2-code.js';
import * as D from './tw2-code-detail.js';
import * as O from './tw2-code-checkout.js';

export const EPISODES_4 = [
  {
    title: '路由：用 React Router 切換頁面',
    steps: [
      { say: '安裝 react-router。', term: ['$ npm install react-router', '', 'added 4 packages, and audited 200 packages in 3s', '', 'found 0 vulnerabilities'] },
      { say: '用 BrowserRouter 包住 App。', file: 'src/main.tsx', code: K.MAIN_TSX },
      { say: '把首頁的內容搬進 HomePage。', file: 'src/pages/HomePage.tsx', code: K.HOME_PAGE },
      { say: '先做一個空的 ProductsPage。', file: 'src/pages/ProductsPage.tsx', code: K.PRODUCTS_PAGE_0 },
      { say: 'Layout：每一頁共用的導覽列與頁尾。', file: 'src/layouts/Layout.tsx', code: K.LAYOUT_1 },
      { say: 'App 改成 Routes。', file: 'src/App.tsx', code: K.APP_R1 },
      { say: '換頁後回到最上面。', file: 'src/layouts/Layout.tsx', code: K.LAYOUT_2 },
      { say: '導覽列的連結改用 Link。', file: 'src/components/Navbar.tsx', code: K.NAV_R },
      { say: '確認可以建置。', term: ['$ npm run build', '', '> tsc -b && vite build', '', '✓ built'] },
    ],
  },
  {
    title: '產品列表頁',
    steps: [
      { say: '多放 9 個精油商品到 API。', file: 'scripts/seed.mjs', code: K.SEED_LIST },
      { say: '執行 seed。', term: ['$ node --env-file=.env --env-file=.env.local scripts/seed.mjs', '已建立：森林系木質精油', '已建立：助眠放鬆精油', '已建立：提振早晨精油', '（其餘 6 個同樣顯示「已建立」，已經有的會顯示「已存在，略過」）'] },
      { say: 'api.ts 新增 getAllProducts。', file: 'src/api.ts', code: K.API_LIST },
      { say: '新的 Hook：useAllProducts。', file: 'src/hooks/useAllProducts.ts', code: K.USE_ALL_PRODUCTS },
      { say: '側欄的資料。', file: 'src/data/categories.ts', code: K.CATEGORIES_TS },
      { say: '麵包屑。', file: 'src/components/Breadcrumb.tsx', code: K.BREADCRUMB },
      { say: '分類側欄。', file: 'src/components/CategorySidebar.tsx', code: K.SIDEBAR },
      { say: '商品卡片（列表版）。', file: 'src/components/ProductListItem.tsx', code: K.LIST_ITEM },
      { say: '分頁。', file: 'src/components/Pagination.tsx', code: K.PAGINATION },
      { say: '組裝成產品列表頁。', file: 'src/pages/ProductsPage.tsx', code: K.PRODUCTS_PAGE },
      { say: '確認可以建置。', term: ['$ npm run build', '', '> tsc -b && vite build', '', '✓ built'] },
    ],
  },
];
export const EPISODES_5 = [
  {
    title: '商品細節頁',
    steps: [
      { say: 'types.ts 新增 ProductResponse。', file: 'src/types.ts', code: D.TYPES_DETAIL },
      { say: 'api.ts 新增 getProduct。', file: 'src/api.ts', code: D.API_DETAIL },
      { say: '新的 Hook：useProduct。', file: 'src/hooks/useProduct.ts', code: D.USE_PRODUCT },
      { say: 'Context 的 add 可以指定數量。', file: 'src/context/CartContext.ts', code: D.CART_CONTEXT_QTY },
      { say: 'Provider 的 add 傳 qty。', file: 'src/context/CartProvider.tsx', code: D.CART_PROVIDER_QTY },
      { say: '圖片區：大圖＋縮圖。', file: 'src/components/ProductGallery.tsx', code: D.GALLERY },
      { say: '數量加減。', file: 'src/components/QuantityInput.tsx', code: D.QUANTITY },
      { say: '商品介紹分頁的內容。', file: 'src/components/ProductIntro.tsx', code: D.INTRO },
      { say: '三個分頁籤。', file: 'src/components/ProductTabs.tsx', code: D.TABS },
      { say: '組裝商品細節頁。', file: 'src/pages/ProductDetailPage.tsx', code: D.DETAIL_PAGE },
      { say: 'App 新增 products/:id 路由。', file: 'src/App.tsx', code: D.APP_DETAIL },
      { say: '首頁商品卡：按鈕搬走、改成連到細節頁。', file: 'src/components/ProductCard.tsx', code: D.CARD_NO_BUTTON },
      { say: '確認可以建置。', term: ['$ npm run build', '', '> tsc -b && vite build', '', '✓ built'] },
    ],
  },
];
export const EPISODES_6 = [
  {
    title: '結帳：購物車、填寫資料、訂單確認',
    steps: [
      { say: 'types.ts 新增訂單的型別。', file: 'src/types.ts', code: O.TYPES_ORDER },
      { say: 'api.ts：改數量、移除、建立訂單、讀訂單、付款。', file: 'src/api.ts', code: O.API_ORDER },
      { say: 'CartContext：共享整份購物車。', file: 'src/context/CartContext.ts', code: O.CART_CONTEXT_FULL, broken: true },
      { say: 'CartProvider：整份 cart、改數量、移除。', file: 'src/context/CartProvider.tsx', code: O.CART_PROVIDER_FULL },
      { say: '結帳用的固定資料。', file: 'src/data/checkout.ts', code: O.CHECKOUT_DATA },
      { say: '三步驟列。', file: 'src/components/CheckoutSteps.tsx', code: O.STEPS },
      { say: '訂單金額（總金額、運費、應付）。', file: 'src/components/OrderSummary.tsx', code: O.SUMMARY },
      { say: '區塊標題。', file: 'src/components/SectionTitle.tsx', code: O.SECTION_TITLE },
      { say: '第 1 步：購物車頁。', file: 'src/pages/CartPage.tsx', code: O.CART_PAGE },
      { say: '表單欄位。', file: 'src/components/FormField.tsx', code: O.FORM_FIELD },
      { say: '第 2 步：填寫資料頁。', file: 'src/pages/CheckoutPage.tsx', code: O.CHECKOUT_PAGE },
      { say: '讀訂單的 Hook。', file: 'src/hooks/useOrder.ts', code: O.USE_ORDER },
      { say: '第 3 步：訂單確認頁。', file: 'src/pages/OrderPage.tsx', code: O.ORDER_PAGE },
      { say: 'App 新增三條路由。', file: 'src/App.tsx', code: O.APP_CHECKOUT },
      { say: '導覽列購物車連到 /cart。', file: 'src/components/Navbar.tsx', code: O.NAV_CART },
      { say: '確認可以建置。', term: ['$ npm run build', '', '> tsc -b && vite build', '', '✓ built'] },
    ],
  },
];
export const EPISODES2 = [...EPISODES_4, ...EPISODES_5, ...EPISODES_6];
