// 第二階段：第 14 部起（講義用；每個步驟的程式碼都用真的 Vite + tsc + vite build 驗證過）。
import * as K from './tw2-code.js';

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
export const EPISODES2 = [...EPISODES_4];
