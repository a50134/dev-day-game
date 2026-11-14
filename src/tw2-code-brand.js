// 第 18 部：品牌介紹頁。教學程式碼不能出現反引號與錢字號。
import { swap } from './tw2-code.js';
import { APP_CHECKOUT } from './tw2-code-checkout.js';

// 頁面上的文字與圖片資料：文字改了不用動版面
export const BRAND_DATA = `export type BrandTopic = {
  title: string
  lines: string[]
}

export type BrandBlockData = {
  image: string
  alt: string
  topics: BrandTopic[]
}

export const brandIntro = [
  '是一個關於渴望、關於選擇的品牌。',
  '我們相信，生活中的每一個物件都應該是你的心之所向，發自內心的一句「我想要這個」。',
  '我們致力於為你挑選、打造那些能點亮日常、提升生活品質，並能讓你產生強烈共鳴的質感好物。',
]

export const brandBlocks: BrandBlockData[] = [
  {
    image: '/images/img/hero img-01.jpg',
    alt: '擴香瓶與香氛蠟燭',
    topics: [
      {
        title: '生活小物，點亮日常生活',
        lines: [
          '在喧囂的世界裡，總有那麼一刻，你需要一個專屬於自己的寧靜港灣。',
          'I need this 透過一系列精心挑選的生活小物，為你創造這樣的時刻。',
        ],
      },
      {
        title: '療癒時光',
        lines: [
          '我們選品的核心理念，是讓每一件商品都能成為你心靈的撫慰。',
          '無論是一盞溫暖的香氛蠟燭、一個觸感溫潤的陶器，或是能為空間帶來清新氣息的擴香瓶，這些小物都承載著我們對美好生活的期盼，讓你能在忙碌之餘，找到片刻的寧靜與平衡。',
        ],
      },
    ],
  },
  {
    image: '/images/img/hero img-02.jpg',
    alt: '森林裡的精油瓶',
    topics: [
      {
        title: '匠人精神，注入溫暖與細緻',
        lines: [
          'I need this 崇尚手作的溫度與匠人的堅持。',
          '我們相信，當一件商品注入了創作者的心血，它就不再只是單純的物件，而是一個有故事、有靈魂的藝術品。',
        ],
      },
      {
        title: '感官體驗',
        lines: [
          '從嗅覺到觸覺，我們的產品旨在提供全面的感官享受。',
          '我們的香氛系列，使用天然精油與高品質原料，調配出獨特而迷人的香氣；',
          '手工皂則由工匠精心製作，保留天然油脂的滋潤，讓每一次使用都成為一場溫暖的享受。',
        ],
      },
    ],
  },
]

export const brandClosing = [
  '在 I need this，',
  '我們的商品、憑藉著使用者口耳相傳的口碑，',
  '成為了許多人生活中「用過就不想換回去」的必備好物。',
]
`;

// 一行一行的文字，行與行之間換行
export const BRAND_LINES = `import { Fragment } from 'react'

type BrandLinesProps = {
  lines: string[]
}

function BrandLines({ lines }: BrandLinesProps) {
  return lines.map((line, index) => (
    <Fragment key={line}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ))
}

export default BrandLines
`;

// 一塊「圖＋文字」，reverse 讓桌面版圖片換到左邊
export const BRAND_BLOCK = `import type { BrandBlockData } from '../data/brand'
import BrandLines from './BrandLines'

type BrandBlockProps = BrandBlockData & {
  reverse?: boolean
}

function BrandBlock({ image, alt, topics, reverse = false }: BrandBlockProps) {
  return (
    <div
      className={
        'grid items-center gap-4.5 lg:gap-6 ' + (reverse ? 'lg:grid-cols-[526px_1fr]' : 'lg:grid-cols-[1fr_526px]')
      }
    >
      <div className="space-y-4.5 lg:space-y-6">
        {topics.map((topic) => (
          <div key={topic.title}>
            <h3 className="h5 text-primary-dark">{topic.title}</h3>
            <p className="mt-2.5 t-m lg:mt-4.5">
              <BrandLines lines={topic.lines} />
            </p>
          </div>
        ))}
      </div>
      <img
        src={image}
        alt={alt}
        className={'aspect-343/240 w-full object-cover lg:aspect-526/264 ' + (reverse ? 'lg:order-first' : '')}
      />
    </div>
  )
}

export default BrandBlock
`;

// 品牌介紹頁
export const BRAND_PAGE = `import Breadcrumb from '../components/Breadcrumb'
import BrandBlock from '../components/BrandBlock'
import BrandLines from '../components/BrandLines'
import { brandBlocks, brandClosing, brandIntro } from '../data/brand'

function BrandPage() {
  return (
    <>
      <div className="mx-auto max-w-332 px-4 pt-6 pb-6 lg:pt-10.5 lg:pb-9.5">
        <Breadcrumb items={[{ label: '首頁', to: '/' }, { label: '品牌介紹' }]} />
      </div>

      <img
        src="/images/img/work space.png"
        alt="明亮的辦公空間"
        className="aspect-75/32 w-full object-cover lg:aspect-4/1"
      />

      <section className="bg-[url(/images/bgc-img.png)] bg-cover bg-center pt-11 pb-24 lg:pt-24 lg:pb-41">
        <div className="mx-auto max-w-332 px-4">
          <h1 className="h3 text-center">品牌故事</h1>

          <div className="mt-9.5 flex items-center justify-center gap-5 lg:mt-21">
            <img src="/images/svg/graphic-05.svg" alt="" className="hidden w-29.5 lg:block" />
            <div className="max-w-170">
              <h2 className="h5 text-center text-primary-dark lg:h4">I need this.</h2>
              <p className="mt-4 t-m lg:text-center">
                <BrandLines lines={brandIntro} />
              </p>
            </div>
            <img src="/images/svg/graphic-06.svg" alt="" className="hidden w-29.5 lg:block" />
          </div>

          <div className="mt-14.5 flex flex-col gap-16 lg:mt-23.5 lg:gap-24">
            {brandBlocks.map((block, index) => (
              <BrandBlock key={block.image} {...block} reverse={index % 2 === 1} />
            ))}
          </div>

          <p className="mt-26 text-center t-m lg:mt-39 lg:t-l">
            <BrandLines lines={brandClosing} />
          </p>
        </div>
      </section>
    </>
  )
}

export default BrandPage
`;

// App：新增 brand 路由
export const APP_BRAND = swap(
  swap(APP_CHECKOUT, "import CartPage from './pages/CartPage'", "import BrandPage from './pages/BrandPage'\nimport CartPage from './pages/CartPage'"),
  '          <Route path="order/:id" element={<OrderPage />} />',
  '          <Route path="order/:id" element={<OrderPage />} />\n          <Route path="brand" element={<BrandPage />} />',
);
