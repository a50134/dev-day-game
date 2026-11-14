// 第二階段（第 14 部起）的教學程式碼：每個常數都是驗證過的版本（用真的 Vite + tsc + vite build 跑過）。
// 注意：教學程式碼裡不能出現反引號與錢字號。
import { EPISODES } from './tw-episodes.js';

// 取得第一階段某個檔案「最後的版本」，第二階段在它上面修改
const finalOf = (file) => {
  let out;
  for (const ep of EPISODES) for (const s of ep.steps) if (s.file === file) out = s.code;
  if (!out) throw new Error('找不到檔案：' + file);
  return out;
};
const swap = (code, from, to) => {
  if (!code.includes(from)) throw new Error('找不到要取代的文字：' + from.slice(0, 40));
  return code.replace(from, to);
};

// ───────────────────────── 第 14 部：路由 ─────────────────────────
// Vite 範本原本的 main.tsx（講義用來標出「這一部新增的行」）
export const MAIN_TSX_TEMPLATE = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`;
export const TEMPLATES = { 'src/main.tsx': MAIN_TSX_TEMPLATE };

export const MAIN_TSX = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
`;

export const HOME_PAGE = `import Categories from '../components/Categories'
import Hero from '../components/Hero'
import HotProducts from '../components/HotProducts'
import PromoSections from '../components/PromoSections'
import Responsibility from '../components/Responsibility'

function HomePage() {
  return (
    <>
      <Hero />
      <PromoSections />
      <HotProducts />
      <Categories />
      <Responsibility />
    </>
  )
}

export default HomePage
`;

export const APP_R1 = `import { Route, Routes } from 'react-router'
import { CartProvider } from './context/CartProvider'
import Layout from './layouts/Layout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}

export default App
`;

export const LAYOUT_1 = `import { Outlet } from 'react-router'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import SocialBar from '../components/SocialBar'

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <SocialBar />
    </>
  )
}

export default Layout
`;

export const LAYOUT_2 = `import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import SocialBar from '../components/SocialBar'

function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <SocialBar />
    </>
  )
}

export default Layout
`;

export const PRODUCTS_PAGE_0 = `function ProductsPage() {
  return (
    <div className="mx-auto max-w-332 px-4 py-20">
      <h1 className="h3">所有商品</h1>
    </div>
  )
}

export default ProductsPage
`;

let nav = finalOf('src/components/Navbar.tsx');
nav = swap(nav, "import { useState } from 'react'\n", "import { useState } from 'react'\nimport { Link } from 'react-router'\n");
nav = swap(nav, "{ label: '品牌介紹', href: '#' }", "{ label: '品牌介紹', href: '/brand' }");
nav = swap(nav, "{ label: '所有商品', href: '#' }", "{ label: '所有商品', href: '/products' }");
nav = swap(
  nav,
  '        <a href="#">\n          <img src="/images/svg/logo_on light.svg" alt="I need this" className="h-9 lg:h-11" />\n        </a>',
  '        <Link to="/">\n          <img src="/images/svg/logo_on light.svg" alt="I need this" className="h-9 lg:h-11" />\n        </Link>',
);
nav = swap(
  nav,
  '            <a key={link.label} href={link.href} className="t-m hover:text-primary-100">\n              {link.label}\n            </a>',
  '            <Link key={link.label} to={link.href} className="t-m hover:text-primary-100">\n              {link.label}\n            </Link>',
);
nav = swap(
  nav,
  '              <a\n                key={link.label}\n                href={link.href}\n                className="block border-b border-n-20 py-4 text-center t-l"\n              >\n                {link.label}\n              </a>',
  '              <Link\n                key={link.label}\n                to={link.href}\n                onClick={() => setMobileOpen(false)}\n                className="block border-b border-n-20 py-4 text-center t-l"\n              >\n                {link.label}\n              </Link>',
);
export const NAV_R = nav;

// ───────────────────────── 第 15 部：產品列表 ─────────────────────────
const OILS = `const LOCAL = '/images/img/'

const oil = (title, label, price, image) => ({
  title,
  category: '精油',
  price,
  origin_price: price + 100,
  unit: '瓶',
  description: label,
  content: label,
  is_enabled: 1,
  imageUrl: LOCAL + image,
  imagesUrl: [LOCAL + image],
})

const oils = [
  oil('森林系木質精油', '森呼吸', 599, '精油產品 01.jpg'),
  oil('助眠放鬆精油', '靜夜語', 599, '精油產品 02.jpg'),
  oil('提振早晨精油', '日光森森', 599, '精油產品 03.jpg'),
  oil('靈感專注精油', '晨光之書', 599, '精油產品 04.jpg'),
  oil('療癒少女系精油', '櫻霞落日', 599, '精油產品 05.jpg'),
  oil('溫感香調精油', '琥珀之夜', 399, '精油產品 06.jpg'),
  oil('清新能量精油', '幻光晨曦', 599, '精油產品 07.jpg'),
  oil('浪漫微甜精油', '清新檸香', 599, '精油產品 08.jpg'),
  oil('冥想放空精油', '琉璃秘境', 599, '精油產品 09.jpg'),
]

`;
let seed = finalOf('scripts/seed.mjs');
seed = swap(seed, 'const products = [', OILS + 'const products = [');
seed = swap(seed, "'product-img-01.jpg'),\n]", "'product-img-01.jpg'),\n  ...oils,\n]");
export const SEED_LIST = seed;

export const API_LIST = swap(
  finalOf('src/api.ts'),
  'export async function getCart',
  `export async function getAllProducts(): Promise<Product[]> {
  const res = await api.get<ProductsResponse>('/products/all')
  return res.data.products
}

export async function getCart`,
);

export const USE_ALL_PRODUCTS = `import { useEffect, useState } from 'react'
import { getAllProducts } from '../api'
import type { Product } from '../types'

export default function useAllProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch(() => setError('商品讀取失敗，請稍後再試'))
      .finally(() => setLoading(false))
  }, [])

  return { products, loading, error }
}
`;

export const CATEGORIES_TS = `export type Category = {
  label: string
  value: string
}

export type Zone = {
  title: string
  items: string[]
}

export const categories: Category[] = [
  { label: '香水', value: '香水' },
  { label: '擴香／香氛蠟燭', value: '擴香' },
  { label: '手工皂／香氛護膚', value: '手工皂' },
  { label: '精油／薰香', value: '精油' },
]

export const zones: Zone[] = [
  { title: '熱門專區', items: ['生活小物的靜謐時光', '仲夏香氛特調節', '來自大自然的香氛防護'] },
  { title: '日常專區', items: ['默默熱賣中', '為日常加點心意', '這個季節剛剛好｜生活選物限時提案'] },
  { title: '風格特色', items: ['日常療癒・文青系', '俐落品味・都會控', '純粹自然・健康派', '溫暖幸福・家居族'] },
]
`;

export const BREADCRUMB = `import { Fragment } from 'react'
import { Link } from 'react-router'

type Crumb = {
  label: string
  to?: string
}

type BreadcrumbProps = {
  items: Crumb[]
}

function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="麵包屑" className="flex flex-wrap items-center gap-x-4 t-m">
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 && <img src="/images/icon/Arrow right.svg" alt="" className="size-6" />}
          {item.to ? (
            <Link to={item.to} className="text-n-40 hover:text-primary-100">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary-dark">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb
`;

export const SIDEBAR = `import { useState } from 'react'
import { Link } from 'react-router'
import { categories, zones } from '../data/categories'

type CategorySidebarProps = {
  current: string
  drawerOpen: boolean
  onClose: () => void
}

const rowClass = (active: boolean) =>
  [
    'block px-6 py-3 t-m transition-colors',
    active ? 'bg-primary-100 text-white' : 'hover:bg-primary-80',
  ].join(' ')

function CategorySidebar({ current, drawerOpen, onClose }: CategorySidebarProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <aside
      className={[
        'bg-white',
        drawerOpen ? 'fixed inset-y-0 right-0 z-50 w-67 overflow-y-auto pt-8 shadow-md' : 'hidden',
        'lg:static lg:block lg:w-76.5 lg:shrink-0 lg:overflow-visible lg:pt-0 lg:shadow-none',
      ].join(' ')}
    >
      <h2 className="h5 mb-4.5 px-6">商品列表</h2>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex h-12 w-full cursor-pointer items-center justify-between px-6 t-m text-primary-100"
      >
        分類
        <img
          src="/images/icon/Arrow right.svg"
          alt=""
          className={['size-6 transition-transform', expanded ? '-rotate-90' : 'rotate-90'].join(' ')}
        />
      </button>

      {expanded && (
        <ul>
          <li>
            <Link to="/products" onClick={onClose} className={rowClass(current === '')}>
              所有商品
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.value}>
              <Link
                to={'/products?category=' + encodeURIComponent(category.value)}
                onClick={onClose}
                className={rowClass(current === category.value)}
              >
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {zones.map((zone) => (
        <div key={zone.title}>
          <p className="flex items-center gap-4 px-6 py-5 t-r text-n-60 after:h-px after:flex-1 after:bg-n-20">
            {zone.title}
          </p>
          <ul>
            {zone.items.map((label) => (
              <li key={label}>
                <a href="#" className={rowClass(false)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  )
}

export default CategorySidebar
`;

export const LIST_ITEM = `import { Link } from 'react-router'
import type { Product } from '../types'

type ProductListItemProps = {
  product: Product
}

function ProductListItem({ product }: ProductListItemProps) {
  return (
    <article className="group">
      <Link to={'/products/' + product.id} className="block">
        <div className="overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="aspect-3/2 w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <p className="mt-2 t-r text-n-60">{product.description}</p>
        <h3 className="h5 mt-1">{product.title}</h3>
        <p className="h6 mt-1 text-primary-dark">NT$ {product.price}</p>
      </Link>
    </article>
  )
}

export default ProductListItem
`;

export const PAGINATION = `type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const box = 'grid size-14 cursor-pointer place-items-center t-m transition-colors disabled:cursor-default disabled:opacity-30'

function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav aria-label="分頁" className="flex justify-center">
      <button aria-label="上一頁" disabled={page === 1} onClick={() => onChange(page - 1)} className={box}>
        <img src="/images/icon/Arrow left.svg" alt="" className="size-6" />
      </button>

      {pages.map((n) => (
        <button
          key={n}
          aria-current={n === page ? 'page' : undefined}
          onClick={() => onChange(n)}
          className={[box, n === page ? 'bg-primary-100 text-white' : 'hover:bg-primary-80'].join(' ')}
        >
          {n}
        </button>
      ))}

      <button aria-label="下一頁" disabled={page === totalPages} onClick={() => onChange(page + 1)} className={box}>
        <img src="/images/icon/Arrow right.svg" alt="" className="size-6" />
      </button>
    </nav>
  )
}

export default Pagination
`;

export const PRODUCTS_PAGE = `import { useState } from 'react'
import { useSearchParams } from 'react-router'
import Breadcrumb from '../components/Breadcrumb'
import CategorySidebar from '../components/CategorySidebar'
import Pagination from '../components/Pagination'
import ProductListItem from '../components/ProductListItem'
import { categories } from '../data/categories'
import useAllProducts from '../hooks/useAllProducts'

const PAGE_SIZE = 9

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? ''
  const page = Number(searchParams.get('page')) || 1

  const { products, loading, error } = useAllProducts()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filtered = category ? products.filter((product) => product.category === category) : products
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const categoryLabel = categories.find((item) => item.value === category)?.label

  const goPage = (n: number) => {
    setSearchParams(category ? { category, page: String(n) } : { page: String(n) })
    window.scrollTo(0, 0)
  }

  return (
    <div className="mx-auto max-w-332 px-4 pt-13.5 pb-18">
      <Breadcrumb
        items={[
          { label: '首頁', to: '/' },
          categoryLabel ? { label: '所有商品', to: '/products' } : { label: '所有商品' },
          ...(categoryLabel ? [{ label: categoryLabel }] : []),
        ]}
      />

      <div className="mt-6 flex flex-col gap-6 lg:mt-10 lg:flex-row">
        {drawerOpen && (
          <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setDrawerOpen(false)} />
        )}
        <CategorySidebar current={category} drawerOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

        <section className="min-w-0 flex-1">
          <div className="mb-6 flex items-end justify-between lg:mb-10.5">
            <h1 className="h3">{categoryLabel ?? '所有商品'}</h1>
            <p className="t-m text-n-60">共有 {filtered.length.toLocaleString()} 項</p>
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            className="mb-6 w-full cursor-pointer border border-n-40 py-2 t-m lg:hidden"
          >
            商品分類
          </button>

          {loading && <p className="py-20 text-center t-m text-n-60">商品讀取中…</p>}
          {error && <p className="py-20 text-center t-m text-red-600">{error}</p>}
          {!loading && !error && filtered.length === 0 && (
            <p className="py-20 text-center t-m text-n-60">這個分類目前沒有商品</p>
          )}

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8">
            {visible.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12">
            <Pagination page={current} totalPages={totalPages} onChange={goPage} />
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProductsPage
`;
