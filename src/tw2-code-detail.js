// 第 16 部：商品細節頁（教學程式碼；不能出現反引號與錢字號）
import { finalOf, swap, API_LIST, APP_R1 } from './tw2-code.js';

export const TYPES_DETAIL = swap(
  finalOf('src/types.ts'),
  'export type CartItem',
  `export type ProductResponse = {
  success: boolean
  product: Product
}

export type CartItem`,
);

export const API_DETAIL = swap(
  swap(API_LIST, "import type { Cart, CartResponse, Product, ProductsResponse } from './types'", "import type { Cart, CartResponse, Product, ProductResponse, ProductsResponse } from './types'"),
  'export async function getCart',
  `export async function getProduct(id: string): Promise<Product> {
  const res = await api.get<ProductResponse>('/product/' + id)
  return res.data.product
}

export async function getCart`,
);

// addToCart 本來就有 qty 參數；只要讓 Context 的 add 也接 qty
export const CART_CONTEXT_QTY = swap(finalOf('src/context/CartContext.ts'), 'add: (productId: string) => Promise<void>', 'add: (productId: string, qty?: number) => Promise<void>');
export const CART_PROVIDER_QTY = swap(
  swap(finalOf('src/context/CartProvider.tsx'), 'const add = async (productId: string) => {', 'const add = async (productId: string, qty = 1) => {'),
  'await addToCart(productId)',
  'await addToCart(productId, qty)',
);

// 首頁商品卡：按鈕搬去細節頁（設計稿首頁的卡片本來就沒有按鈕），整張卡片改成連到細節頁
let card = finalOf('src/components/ProductCard.tsx');
card = swap(card, "import { useCart } from '../hooks/useCart'\nimport type { Product } from '../types'\nimport Button from './Button'\n", "import { Link } from 'react-router'\nimport type { Product } from '../types'\n");
card = swap(card, '  const { adding, add } = useCart()\n\n', '');
card = swap(card, '<a href="#" className="block overflow-hidden">', "<Link to={'/products/' + product.id} className=\"block overflow-hidden\">");
card = swap(card, '      </a>\n', '      </Link>\n');
card = swap(
  card,
  '\n        <Button variant="unfill" className="mt-2" disabled={adding} onClick={() => add(product.id)}>\n          加入購物車\n        </Button>',
  '',
);
export const CARD_NO_BUTTON = card;

export const USE_PRODUCT = `import { useEffect, useState } from 'react'
import { getProduct } from '../api'
import type { Product } from '../types'

type Result = {
  id: string
  product?: Product
  error?: string
}

export default function useProduct(id: string | undefined) {
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    if (!id) return
    getProduct(id)
      .then((product) => setResult({ id, product }))
      .catch(() => setResult({ id, error: '商品讀取失敗，請稍後再試' }))
  }, [id])

  const current = result?.id === id ? result : null

  return {
    product: current?.product ?? null,
    loading: Boolean(id) && !current,
    error: current?.error ?? '',
  }
}
`;

export const GALLERY = `import { useState } from 'react'

type ProductGalleryProps = {
  images: string[]
  alt: string
}

function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)

  return (
    <div>
      <img src={images[selected]} alt={alt} className="aspect-636/526 w-full object-cover" />

      <div className="mt-4 grid grid-cols-3 gap-4 lg:mt-6 lg:gap-6">
        {images.map((src, index) => (
          <button
            key={src + index}
            aria-label={'看第 ' + (index + 1) + ' 張圖'}
            onClick={() => setSelected(index)}
            className={[
              'cursor-pointer overflow-hidden transition-opacity',
              index === selected ? 'opacity-100' : 'opacity-60 hover:opacity-100',
            ].join(' ')}
          >
            <img src={src} alt="" className="aspect-196/150 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductGallery
`;

export const QUANTITY = `type QuantityInputProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

const step = 'grid size-14 cursor-pointer place-items-center text-2xl leading-none disabled:cursor-default disabled:text-n-40'

function QuantityInput({ value, onChange, min = 1, max = 99 }: QuantityInputProps) {
  return (
    <div className="flex w-full items-center border border-n-40 lg:w-60.5">
      <button aria-label="減少數量" disabled={value <= min} onClick={() => onChange(value - 1)} className={step}>
        −
      </button>
      <span className="flex-1 text-center t-m">{value}</span>
      <button aria-label="增加數量" disabled={value >= max} onClick={() => onChange(value + 1)} className={step}>
        +
      </button>
    </div>
  )
}

export default QuantityInput
`;

export const INTRO = `import { Fragment } from 'react'

type ProductIntroProps = {
  sections: string[]
}

const specs = [
  ['容量', '10ml / 20ml 滴瓶裝'],
  ['用法', '搭配擴香石、水氧機或手帕滴香使用'],
  ['保存期限', '三年，建議半年內使用完最佳'],
  ['保存方式', '避免陽光直射、高溫潮濕'],
]

function ProductIntro({ sections }: ProductIntroProps) {
  return (
    <div className="grid gap-8 pt-8 lg:grid-cols-[1fr_526px] lg:gap-6 lg:pt-10 lg:pl-6">
      <div>
        <p className="mb-3 t-m text-primary-100">#一開門就想到的味道</p>

        {sections.length === 0 && <p className="t-m text-n-60">這個商品還沒有更多介紹。</p>}
        {sections.map((block, index) =>
          block.startsWith('## ') ? (
            <Fragment key={block}>
              {index > 0 && <img src="/images/svg/graphic-07.svg" alt="" className="my-10" />}
              <h3 className="h5 mb-3">{block.slice(3)}</h3>
            </Fragment>
          ) : (
            <p key={block} className="t-m whitespace-pre-line text-n-60">
              {block}
            </p>
          ),
        )}
      </div>

      <aside className="self-start bg-primary-80 p-6">
        <h3 className="h5 border-b-2 border-n-40 pb-3">規格說明（範例）</h3>
        <ul className="mt-4 space-y-4">
          {specs.map(([label, value]) => (
            <li key={label} className="t-m">
              {label}：<b className="text-primary-dark">{value}</b>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

export default ProductIntro
`;

export const TABS = `import { useState, type ReactNode } from 'react'

type ProductTabsProps = {
  intro: ReactNode
}

const tabs = ['商品介紹', '顧客評價', '售後服務']

function ProductTabs({ intro }: ProductTabsProps) {
  const [active, setActive] = useState(0)

  return (
    <div>
      <div role="tablist" className="flex overflow-x-auto border-b-2 border-n-40">
        {tabs.map((label, index) => (
          <button
            key={label}
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
            className={[
              'h5 -mb-0.5 h-14 w-37 shrink-0 cursor-pointer border-b-2 transition-colors lg:w-auto lg:flex-1',
              index === active
                ? 'border-primary-dark text-primary-dark'
                : 'border-transparent text-n-40 hover:text-primary-100',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {active === 0 && intro}
      {active === 1 && <p className="py-20 text-center t-m text-n-60">目前還沒有顧客評價。</p>}
      {active === 2 && (
        <p className="py-20 text-center t-m text-n-60">收到商品 7 天內，未拆封可以申請退換貨。</p>
      )}
    </div>
  )
}

export default ProductTabs
`;

export const DETAIL_PAGE = `import { useState } from 'react'
import { useParams } from 'react-router'
import Breadcrumb from '../components/Breadcrumb'
import Button from '../components/Button'
import ProductGallery from '../components/ProductGallery'
import ProductIntro from '../components/ProductIntro'
import ProductTabs from '../components/ProductTabs'
import QuantityInput from '../components/QuantityInput'
import { categories } from '../data/categories'
import { useCart } from '../hooks/useCart'
import useProduct from '../hooks/useProduct'

const sizes = ['10ml', '20ml']

function ProductDetailPage() {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)
  const { adding, add } = useCart()
  const [size, setSize] = useState(sizes[0])
  const [qty, setQty] = useState(1)
  const [favorite, setFavorite] = useState(false)

  if (loading) return <p className="py-40 text-center t-m text-n-60">商品讀取中…</p>
  if (error || !product) return <p className="py-40 text-center t-m text-n-60">{error || '找不到這個商品'}</p>

  const title = '「' + product.description + '」' + product.title
  const category = categories.find((item) => item.value === product.category)
  const images = (product.imagesUrl ?? []).filter(Boolean)
  const [summary, ...sections] = product.content.split('\\n\\n')

  return (
    <div className="mx-auto max-w-332 px-4 pt-13.5 pb-29">
      <Breadcrumb
        items={[
          { label: '首頁', to: '/' },
          { label: '所有商品', to: '/products' },
          ...(category
            ? [{ label: category.label, to: '/products?category=' + encodeURIComponent(category.value) }]
            : []),
          { label: title },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:mt-20.5 lg:grid-cols-2 lg:gap-6">
        <ProductGallery images={images.length > 0 ? images : [product.imageUrl]} alt={product.title} />

        <div>
          <h1 className="h3 border-b-2 border-n-20 pb-3 lg:h2">{title}</h1>
          <p className="mt-5 h5 lg:h4">NT$ {product.price}</p>
          <p className="mt-4 t-r whitespace-pre-line text-n-60 lg:mt-9 lg:t-m">{summary}</p>

          <div className="mt-10 flex items-center gap-4 lg:gap-0">
            <span className="h7 w-15">規格</span>
            <div className="flex gap-5.5">
              {sizes.map((item) => (
                <button
                  key={item}
                  onClick={() => setSize(item)}
                  className={[
                    'cursor-pointer border px-6 py-3 t-m transition-colors',
                    item === size
                      ? 'border-primary-100 bg-primary-80 text-primary-dark'
                      : 'border-n-40 hover:border-primary-100',
                  ].join(' ')}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-9.5 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-0">
            <span className="h7 w-15">數量</span>
            <QuantityInput value={qty} onChange={setQty} />
          </div>

          <div className="mt-8 grid gap-4 lg:mt-15 lg:grid-cols-2 lg:gap-6">
            <Button disabled={adding} onClick={() => add(product.id, qty)}>
              加入購物車
            </Button>
            <Button
              variant="unfill"
              aria-pressed={favorite}
              onClick={() => setFavorite(!favorite)}
              className="border border-primary-dark"
            >
              {favorite ? '已收藏' : '加入收藏'} {favorite ? '♥' : '♡'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <ProductTabs intro={<ProductIntro sections={sections} />} />
      </div>
    </div>
  )
}

export default ProductDetailPage
`;

export const APP_DETAIL = swap(
  swap(APP_R1, "import ProductsPage from './pages/ProductsPage'", "import ProductDetailPage from './pages/ProductDetailPage'\nimport ProductsPage from './pages/ProductsPage'"),
  '          <Route path="products" element={<ProductsPage />} />',
  '          <Route path="products" element={<ProductsPage />} />\n          <Route path="products/:id" element={<ProductDetailPage />} />',
);
