// 「I need this」Tailwind + React + TypeScript 教學用的程式碼。
// 每個常數都是「某一步完成後，整個檔案的內容」。教學步驟（tw-react-*.js）只負責引用。
// 注意：這裡的程式碼要能真的用 Vite 建置成功（verify 時會逐部抽出來跑），所以程式碼裡不能出現反引號與 $ 符號。

// ───────────────────────── 第 1 部：建專案 ─────────────────────────
export const APP_1 = `function App() {
  return <h1>I need this</h1>
}

export default App
`;

export const INDEX_HTML_1 = `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>I need this</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

// ───────────────────────── 第 2 部：安裝 Tailwind v4 ─────────────────────────
export const VITE_CONFIG = `import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
`;

export const CSS_1 = `@import "tailwindcss";
`;

export const APP_2 = `function App() {
  return <h1 className="text-3xl font-bold text-red-500">I need this</h1>
}

export default App
`;

// ───────────────────────── 第 3 部：共用顏色 ─────────────────────────
const THEME_PRIMARY = `  /* 主色 */
  --color-primary-80: #e3efe8;
  --color-primary-100: #598e71;
  --color-primary-dark: #1d6617;
`;
const THEME_NEUTRAL = `
  /* 中性色（白色直接用 Tailwind 內建的 white） */
  --color-n-20: #e8e8e8;
  --color-n-40: #9d9d9d;
  --color-n-60: #575757;
  --color-n-80: #1e1e1e;
`;
const THEME_OTHER = `
  /* 其他 */
  --color-bgc-green: #f6f9eb;
`;
const THEME_COLORS = THEME_PRIMARY + THEME_NEUTRAL + THEME_OTHER;

export const CSS_2a = `@import "tailwindcss";

@theme {
${THEME_PRIMARY}}
`;
export const CSS_2b = `@import "tailwindcss";

@theme {
${THEME_PRIMARY}${THEME_NEUTRAL}}
`;
export const CSS_2 = `@import "tailwindcss";

@theme {
${THEME_COLORS}}
`;

export const APP_3 = `function App() {
  return (
    <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-4">
      <div className="bg-primary-80 p-4">primary-80</div>
      <div className="bg-primary-100 p-4 text-white">primary-100</div>
      <div className="bg-primary-dark p-4 text-white">primary-dark</div>
      <div className="bg-bgc-green p-4">bgc-green</div>
      <div className="bg-n-20 p-4">n-20</div>
      <div className="bg-n-40 p-4">n-40</div>
      <div className="bg-n-60 p-4 text-white">n-60</div>
      <div className="bg-n-80 p-4 text-white">n-80</div>
    </div>
  )
}

export default App
`;

// ───────────────────────── 第 4 部：字型與文字樣式 ─────────────────────────
export const INDEX_HTML_2 = INDEX_HTML_1.replace(
  '    <title>I need this</title>',
  `    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&family=Noto+Serif+TC:wght@700&display=swap"
      rel="stylesheet"
    />
    <title>I need this</title>`,
);

const THEME_FONTS = `
  /* 字型：標題用 Noto Serif TC，內文用 Noto Sans TC */
  --font-serif-tc: "Noto Serif TC", serif;
  --font-sans: "Noto Sans TC", sans-serif;
`;

export const CSS_3 = `@import "tailwindcss";

@theme {
${THEME_COLORS}${THEME_FONTS}}

@layer base {
  body {
    color: var(--color-n-80);
  }
}
`;

// 文字樣式：[名稱, 是否用襯線, 粗細, 行高, 手機字級 px, 桌面字級 px]
const STYLES = [
  ['h1', true, 700, 1.2, 32, 48],
  ['h2', true, 700, 1.2, 24, 32],
  ['h3', true, 700, 1.2, 20, 28],
  ['h4', false, 700, 1.2, 20, 24],
  ['h5', false, 700, 1.2, 18, 18],
  ['h6', false, 700, 1.2, 16, 16],
  ['h7', false, 700, 1.2, 12, 14],
  ['t-l', false, 400, 1.5, 18, 20],
  ['t-m', false, 400, 1.5, 16, 16],
  ['t-r', false, 400, 1.5, 14, 14],
  ['t-s', false, 700, 1.2, 12, 12],
];
const rem = (px) => px / 16 + 'rem';
export const textUtility = ([name, serif, weight, lh, mobile, desktop]) =>
  `@utility ${name} {
${serif ? '  font-family: var(--font-serif-tc);\n' : ''}  font-weight: ${weight};
  line-height: ${lh};
  font-size: ${rem(mobile)};${
    mobile === desktop
      ? ''
      : `
  @media (min-width: 48rem) {
    font-size: ${rem(desktop)};
  }`
  }
}
`;
const cssWith = (n) => `${CSS_3}\n${STYLES.slice(0, n).map(textUtility).join('\n')}`;
export const CSS_4a = cssWith(1); // 只有 h1
export const CSS_4b = cssWith(3); // h1～h3（襯線標題）
export const CSS_4c = cssWith(7); // h1～h7
export const CSS_4d = cssWith(11); // 全部（含內文）

export const APP_4 = `function App() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="h1">生活小物的靜謐時光</h1>
      <h2 className="h2">這個季節剛剛好</h2>
      <h3 className="h3">默默熱賣中</h3>
      <h4 className="h4">日常療癒・文青系</h4>
      <h5 className="h5">香氛蠟燭</h5>
      <p className="t-l">Body T-L：繁忙中也能片刻沉靜</p>
      <p className="t-m">Body T-M：挑一款剛剛好的香氛</p>
      <p className="t-r text-n-60">Body T-R：隨時專注於自己的步調</p>
    </div>
  )
}

export default App
`;

// ───────────────────────── 第 5 部：Button 元件 ─────────────────────────
const BUTTON_BASE = `const base =
  'inline-flex cursor-pointer items-center justify-center gap-1 px-6 py-3 t-m transition-colors md:px-8 md:py-4'
`;

export const BUTTON_0 = `function Button() {
  return <button>按鈕</button>
}

export default Button
`;

export const BUTTON_0b = `import type { ComponentProps } from 'react'

function Button(props: ComponentProps<'button'>) {
  return <button {...props} />
}

export default Button
`;

export const BUTTON_1 = `import type { ComponentProps } from 'react'

type Variant = 'fill' | 'unfill'

type ButtonProps = ComponentProps<'button'> & {
  variant?: Variant
}

${BUTTON_BASE}
const variants: Record<Variant, string> = {
  fill: 'bg-primary-dark text-white hover:bg-transparent hover:text-primary-100 active:bg-primary-80 active:text-primary-dark',
  unfill: 'text-primary-dark hover:text-primary-100 active:bg-primary-80',
}

function Button({ variant = 'fill', className = '', ...props }: ButtonProps) {
  return <button className={[base, variants[variant], className].join(' ')} {...props} />
}

export default Button
`;

export const BUTTON_2 = `import type { ComponentProps } from 'react'

type Variant = 'fill' | 'unfill'

type ButtonProps = ComponentProps<'button'> & {
  variant?: Variant
  arrow?: boolean
}

${BUTTON_BASE}
const variants: Record<Variant, string> = {
  fill: 'bg-primary-dark text-white hover:bg-transparent hover:text-primary-100 active:bg-primary-80 active:text-primary-dark',
  unfill: 'text-primary-dark hover:text-primary-100 active:bg-primary-80',
}

function Button({ variant = 'fill', arrow = false, className = '', children, ...props }: ButtonProps) {
  return (
    <button className={[base, variants[variant], className].join(' ')} {...props}>
      {children}
      {arrow && <img src="/images/svg/Arrow right.svg" alt="" className="size-6" />}
    </button>
  )
}

export default Button
`;

export const BUTTON_3 = BUTTON_2.replace("type Variant = 'fill' | 'unfill'", "type Variant = 'fill' | 'unfill' | 'white'").replace(
  "  unfill: 'text-primary-dark hover:text-primary-100 active:bg-primary-80',\n",
  "  unfill: 'text-primary-dark hover:text-primary-100 active:bg-primary-80',\n  white: 'bg-white text-n-80 hover:bg-primary-80 active:bg-primary-100 active:text-white',\n",
);
// 只改了型別、還沒補上 white 的版本（TypeScript 會在 variants 底下報錯，教學用來示範）
export const BUTTON_3_BROKEN = BUTTON_2.replace("type Variant = 'fill' | 'unfill'", "type Variant = 'fill' | 'unfill' | 'white'");

export const APP_5 = `import Button from './components/Button'

function App() {
  return (
    <div className="flex flex-wrap items-center gap-4 p-8">
      <Button>實心按鈕</Button>
      <Button variant="unfill">空心按鈕</Button>
      <Button arrow>看看商品</Button>
      <Button disabled className="opacity-50">停用中</Button>
    </div>
  )
}

export default App
`;

// ───────────────────────── 第 6 部：導覽列 ─────────────────────────
const NAV_LOGO = `        <a href="#">
          <img src="/images/svg/logo_on light.svg" alt="I need this" className="h-9 lg:h-11" />
        </a>
`;
const NAV_LINKS = `const links = [
  { label: '品牌介紹', href: '#' },
  { label: '所有商品', href: '#' },
]
`;
const NAV_SEARCH = `          <label className="flex w-44 items-center border-b border-n-40">
            <input
              type="text"
              placeholder="輸入商品名稱"
              className="w-full py-1 t-r outline-none placeholder:text-n-40"
            />
            <img src="/images/svg/Search.svg" alt="搜尋" className="size-5" />
          </label>

          {links.map((link) => (
            <a key={link.label} href={link.href} className="t-m hover:text-primary-100">
              {link.label}
            </a>
          ))}
`;
const NAV_CART = (withCount) => `          <a href="#" aria-label="購物車" className="flex items-center gap-1">
            <img src="/images/svg/Cart.svg" alt="" className="size-6" />${
              withCount ? '\n            {count > 0 && <span className="t-r text-primary-dark">{count}</span>}' : ''
            }
          </a>
`;
const USER_DROPDOWN = `            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex cursor-pointer items-center gap-2 t-r"
              >
                <span className="grid size-8 place-items-center rounded-full bg-primary-80 text-primary-dark">
                  {user[0]}
                </span>
                {user}
              </button>

              {userMenuOpen && (
                <ul className="absolute top-full right-0 mt-6 w-40 bg-white py-2 text-center shadow-md">
                  {userLinks.map((label) => (
                    <li key={label}>
                      <a href="#" className="block px-4 py-3 t-r hover:text-primary-100">
                        {label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={logout}
                      className="w-full cursor-pointer px-4 py-3 t-r text-n-60 hover:text-primary-100"
                    >
                      登出
                    </button>
                  </li>
                </ul>
              )}
            </div>
`;
const MOBILE_BLOCK = (withCount) => `        <div className="flex items-center lg:hidden">
          <button aria-label="搜尋" onClick={() => setSearchOpen(true)} className="cursor-pointer p-4">
            <img src="/images/svg/Search.svg" alt="" className="size-6" />
          </button>
          <button aria-label="開啟選單" onClick={() => setMobileOpen(true)} className="cursor-pointer p-4">
            <img src="/images/svg/Menu.svg" alt="" className="size-6" />
          </button>
        </div>
      </nav>

      {searchOpen && (
        <div className="absolute inset-0 flex items-center gap-2 bg-white px-4 lg:hidden">
          <input
            autoFocus
            type="text"
            placeholder="輸入商品名稱"
            className="w-full border-b border-n-40 py-2 t-m outline-none"
          />
          <button aria-label="關閉搜尋" onClick={() => setSearchOpen(false)} className="cursor-pointer p-2">
            <img src="/images/svg/Close.svg" alt="" className="size-6" />
          </button>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-white lg:hidden">
          <div>
            <div className="flex h-18 items-center justify-between px-4">
              <img src="/images/svg/logo_on light.svg" alt="I need this" className="h-9" />
              <button aria-label="關閉選單" onClick={() => setMobileOpen(false)} className="cursor-pointer p-4">
                <img src="/images/svg/Close.svg" alt="" className="size-6" />
              </button>
            </div>

            {user && <p className="px-4 py-4 text-center t-m text-primary-dark">嗨，{user}</p>}

            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block border-b border-n-20 py-4 text-center t-l"
              >
                {link.label}
              </a>
            ))}${
              withCount
                ? `
            <a href="#" className="block border-b border-n-20 py-4 text-center t-l">
              購物車{count > 0 && '（' + count + '）'}
            </a>`
                : ''
            }
          </div>

          <div className="p-4">
            {user ? (
              <Button variant="unfill" className="w-full" onClick={logout}>
                登出
              </Button>
            ) : (
              <Button className="w-full" onClick={() => setUser('Alice')}>
                註冊 / 登入
              </Button>
            )}
          </div>
        </div>
      )}
`;
const LOGIN_BLOCK = `          {user ? (
${USER_DROPDOWN}          ) : (
            <Button className="h-22" onClick={() => setUser('Alice')}>
              註冊 / 登入
            </Button>
          )}
`;

export const NAV_1 = `function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 lg:h-22">
${NAV_LOGO}      </nav>
    </header>
  )
}

export default Navbar
`;

export const NAV_2 = `import Button from './Button'

${NAV_LINKS}
function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 lg:h-22">
${NAV_LOGO}
        <div className="hidden items-center gap-8 lg:flex">
${NAV_SEARCH}
${NAV_CART(false)}
          <Button className="h-22">註冊 / 登入</Button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
`;

export const NAV_3a = `import { useState } from 'react'
import Button from './Button'

${NAV_LINKS}
function Navbar() {
  const [user, setUser] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 lg:h-22">
${NAV_LOGO}
        <div className="hidden items-center gap-8 lg:flex">
${NAV_SEARCH}
${NAV_CART(false)}
          {user ? (
            <span className="t-r">{user}</span>
          ) : (
            <Button className="h-22" onClick={() => setUser('Alice')}>
              註冊 / 登入
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
`;

export const NAV_3 = `import { useState } from 'react'
import Button from './Button'

${NAV_LINKS}const userLinks = ['個人資訊', '我的收藏', '查看訂單狀態']

function Navbar() {
  const [user, setUser] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const logout = () => {
    setUser(null)
    setUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 lg:h-22">
${NAV_LOGO}
        <div className="hidden items-center gap-8 lg:flex">
${NAV_SEARCH}
${NAV_CART(false)}
${LOGIN_BLOCK}        </div>
      </nav>
    </header>
  )
}

export default Navbar
`;

const navFull = (withCount) => `import { useState } from 'react'
${withCount ? "import { useCart } from '../hooks/useCart'\n" : ''}import Button from './Button'

${NAV_LINKS}const userLinks = ['個人資訊', '我的收藏', '查看訂單狀態']

function Navbar() {
${withCount ? '  const { count } = useCart()\n' : ''}  const [user, setUser] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const logout = () => {
    setUser(null)
    setUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 lg:h-22">
${NAV_LOGO}
        <div className="hidden items-center gap-8 lg:flex">
${NAV_SEARCH}
${NAV_CART(withCount)}
${LOGIN_BLOCK}        </div>

${MOBILE_BLOCK(withCount)}    </header>
  )
}

export default Navbar
`;
export const NAV_4 = navFull(false);
export const NAV_5 = navFull(true);

export const APP_6 = `import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <main className="h-[200vh] bg-bgc-green p-8">
        <p className="t-m">往下捲，導覽列會固定在上面。</p>
      </main>
    </>
  )
}

export default App
`;

// ───────────────────────── 第 7 部：首頁 Hero ─────────────────────────
const HERO_BOX = (indent, title, subtitle) => `${indent}<div className="w-full bg-n-60/40 px-4 py-8 text-white backdrop-blur-sm md:w-159 md:px-12 md:py-16">
${indent}  <h1 className="h1 mb-3 md:mb-4">${title}</h1>
${indent}  <p className="h3 mb-6 md:mb-10">${subtitle}</p>
${indent}  <Button arrow>看看商品</Button>
${indent}</div>
`;

export const HERO_1 = `import Button from './Button'

function Hero() {
  return (
    <section className="relative h-185 overflow-hidden">
      <img src="/images/hero-03.png" alt="" className="absolute inset-0 size-full object-cover" />

      <div className="relative mx-auto flex h-full max-w-7xl items-end px-3 pb-15 md:items-center md:px-4 md:pb-0">
${HERO_BOX('        ', '生活小物的靜謐時光', '用小物打造專屬的心靈港灣')}      </div>
    </section>
  )
}

export default Hero
`;

const SLIDES = `type Slide = {
  image: string
  title: string
  subtitle: string
}

const slides: Slide[] = [
  {
    image: '/images/hero-03.png',
    title: '生活小物的靜謐時光',
    subtitle: '用小物打造專屬的心靈港灣',
  },
  {
    image: '/images/hero-01.png',
    title: '仲夏香氛特調節',
    subtitle: '特調仲夏香氛，沈浸自然的清涼氣息',
  },
  {
    image: '/images/hero-02.png',
    title: '來自大自然的香氣防護',
    subtitle: '純植物精油，無化學添加，適合全家大小使用',
  },
]
`;

export const HERO_2 = `import { useState } from 'react'
import Button from './Button'

${SLIDES}
function Hero() {
  const [current, setCurrent] = useState(0)

  return (
    <section className="relative h-185 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={[
            'absolute inset-0 transition-opacity duration-700',
            index === current ? 'opacity-100' : 'pointer-events-none opacity-0',
          ].join(' ')}
        >
          <img src={slide.image} alt="" className="size-full object-cover" />

          <div className="absolute inset-0 mx-auto flex max-w-7xl items-end px-3 pb-15 md:items-center md:px-4 md:pb-0">
            <div className="w-full bg-n-60/40 px-4 py-8 text-white backdrop-blur-sm md:w-159 md:px-12 md:py-16">
              <h1 className="h1 mb-3 md:mb-4">{slide.title}</h1>
              <p className="h3 mb-6 md:mb-10">{slide.subtitle}</p>
              <Button arrow>看看商品</Button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3 md:gap-8">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            aria-label={'第 ' + (index + 1) + ' 張'}
            onClick={() => setCurrent(index)}
            className={[
              'size-2.5 cursor-pointer rounded-full md:h-2 md:w-18',
              index === current ? 'bg-primary-100' : 'bg-n-20',
            ].join(' ')}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
`;

export const HERO_3 = HERO_2.replace("import { useState } from 'react'", "import { useEffect, useState } from 'react'").replace(
  '  const [current, setCurrent] = useState(0)\n',
  `  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((n) => (n + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [current])
`,
);

export const APP_7 = `import Hero from './components/Hero'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
      </main>
    </>
  )
}

export default App
`;

// ───────────────────────── 第 8 部：限時提案 ─────────────────────────
export const FEATURE_1 = `import type { ReactNode } from 'react'

type FeatureSectionProps = {
  image: string
  imageAlt: string
  children: ReactNode
}

function FeatureSection({ image, imageAlt, children }: FeatureSectionProps) {
  return (
    <section className="relative">
      <div className="flex flex-col items-center md:my-8 md:flex-row lg:my-30">
        <img src={image} alt={imageAlt} className="w-full px-3 pt-8 md:w-1/2 md:p-0" />
        <div className="w-full px-4 py-8 md:w-1/2 lg:p-20">{children}</div>
      </div>
    </section>
  )
}

export default FeatureSection
`;

export const FEATURE_2 = FEATURE_1.replace(
  '  imageAlt: string\n  children: ReactNode',
  '  imageAlt: string\n  reverse?: boolean\n  leaf?: ReactNode\n  children: ReactNode',
)
  .replace(
    'function FeatureSection({ image, imageAlt, children }: FeatureSectionProps) {',
    'function FeatureSection({ image, imageAlt, reverse = false, leaf, children }: FeatureSectionProps) {',
  )
  .replace(
    '      <div className="flex flex-col items-center md:my-8 md:flex-row lg:my-30">',
    `      <div
        className={[
          'flex flex-col items-center md:my-8 lg:my-30',
          reverse ? 'md:flex-row-reverse' : 'md:flex-row',
        ].join(' ')}
      >`,
  )
  .replace(
    '        <div className="w-full px-4 py-8 md:w-1/2 lg:p-20">{children}</div>',
    `        <div
          className={[
            'w-full px-4 py-8 md:w-1/2',
            reverse ? 'lg:py-20 lg:pr-20 lg:pl-[20%]' : 'lg:p-20',
          ].join(' ')}
        >
          {children}
        </div>`,
  )
  .replace('      </div>\n    </section>', '      </div>\n      {leaf}\n    </section>');

const PROMO_1 = `      <FeatureSection image="/images/section-01.png" imageAlt="香水與織品">
        <h2 className="h2 mb-1 lg:mb-2">
          這個季節<span className="text-primary-dark">剛剛好</span>
        </h2>
        <h2 className="h2 mb-4 lg:mb-7">
          生活選物<span className="text-primary-dark">限時提案</span>
        </h2>
        <p className="t-m mb-4 text-n-60 lg:mb-7">繁忙中也能片刻沉靜，挑一款剛好的香氛，隨時專注於自己的步調。</p>
        <Button arrow>看看商品</Button>
      </FeatureSection>
`;
const PROMO_2 = `      <FeatureSection image="/images/section-02.png" imageAlt="手工皂與刷具" reverse>
        <h2 className="h2 mb-4 lg:mb-7">
          為日常<span className="text-primary-dark">加點新意</span>
        </h2>
        <p className="t-m mb-4 text-n-60 lg:mb-7">用香氣與觸感，輕輕刷新你的生活節奏。</p>
        <Button arrow>看看商品</Button>
      </FeatureSection>
`;
const LEAF_1 = `        leaf={
          <img
            src="/images/svg/graphic-01.svg"
            alt=""
            className="pointer-events-none absolute -top-24 right-6 hidden md:block"
          />
        }
`;
const LEAF_3 = `        leaf={
          <img
            src="/images/svg/graphic-03.svg"
            alt=""
            className="pointer-events-none absolute bottom-0 left-6 hidden md:block"
          />
        }
`;
const DIVIDER = `      <img src="/images/svg/graphic-02.svg" alt="" className="mx-auto w-full max-w-7xl px-3 lg:py-10" />
`;
export const PROMO_V1 = `import Button from './Button'
import FeatureSection from './FeatureSection'

function PromoSections() {
  return (
    <div className="bg-linear-to-b from-white via-primary-80 to-white">
${PROMO_1}
${DIVIDER}
${PROMO_2.replace(' reverse>', '>')}    </div>
  )
}

export default PromoSections
`;

const FS1_WITH_LEAF = `      <FeatureSection
        image="/images/section-01.png"
        imageAlt="香水與織品"
${LEAF_1}      >
${PROMO_1.split('\n').slice(1).join('\n')}`;
const FS2_WITH_LEAF = `      <FeatureSection
        image="/images/section-02.png"
        imageAlt="手工皂與刷具"
        reverse
${LEAF_3}      >
${PROMO_2.split('\n').slice(1).join('\n')}`;

export const PROMO_V2 = `import Button from './Button'
import FeatureSection from './FeatureSection'

function PromoSections() {
  return (
    <div className="bg-linear-to-b from-white via-primary-80 to-white">
${FS1_WITH_LEAF}
${DIVIDER}
${FS2_WITH_LEAF}    </div>
  )
}

export default PromoSections
`;

export const APP_8 = `import Hero from './components/Hero'
import Navbar from './components/Navbar'
import PromoSections from './components/PromoSections'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PromoSections />
      </main>
    </>
  )
}

export default App
`;

// ───────────────────────── 第 9 部：建立商品資料（seed） ─────────────────────────
export const ENV_FILE = `VITE_API_BASE=https://ec-course-api.hexschool.io/v2
VITE_API_PATH=你的API路徑
`;
export const ENV_LOCAL = `HEX_USERNAME=你的六角登入Email
HEX_PASSWORD=你的六角密碼
`;

export const SEED_1 = `// 用法：node --env-file=.env --env-file=.env.local scripts/seed.mjs
const base = process.env.VITE_API_BASE
const apiPath = process.env.VITE_API_PATH
const { HEX_USERNAME, HEX_PASSWORD } = process.env

if (!base || !apiPath || !HEX_USERNAME || !HEX_PASSWORD) {
  console.error('缺少環境變數：請確認 .env 和 .env.local 都填好了')
  process.exit(1)
}
`;

const SEED_PRODUCTS = `const IMG = 'https://raw.githubusercontent.com/a50134/I-need-this/main/assets/images/'

const sample = (title, category, price, originPrice, description, image) => ({
  title,
  category,
  price,
  origin_price: originPrice,
  unit: '件',
  description,
  content: description,
  is_enabled: 1,
  imageUrl: IMG + image,
  imagesUrl: [IMG + image],
})

const products = [
  sample('香氛蠟燭', '熱賣', 480, 580, '「不只是香氣，還是生活裡的儀式感。」', 'product-img-04.jpg'),
  sample('擴香瓶', '熱賣', 680, 780, '「不用點燃，就能為家帶來溫柔香氣。」', 'product-img-03.jpg'),
  sample('手工皂套組', '熱賣', 360, 420, '「一塊手工皂，洗去一天的疲憊。」', 'product-img-02.jpg'),
  sample('精油薰香（兩入）', '熱賣', 520, 620, '「空氣裡的療癒魔法。」', 'product-img-01.jpg'),
]
`;
export const SEED_2 = `${SEED_1}
${SEED_PRODUCTS}`;

const SEED_REQUEST = `async function request(url, options = {}) {
  const res = await fetch(base + url, options)
  const data = await res.json()
  if (!res.ok) throw new Error(url + ' 失敗：' + data.message)
  return data
}
`;
export const SEED_3 = `${SEED_2}
${SEED_REQUEST}`;

const SEED_RUN = `const signin = await request('/admin/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: HEX_USERNAME, password: HEX_PASSWORD }),
})
const headers = { 'Content-Type': 'application/json', Authorization: signin.token }

const existing = await request('/api/' + apiPath + '/admin/products/all', { headers })
const titles = new Set(Object.values(existing.products).map((p) => p.title))

for (const product of products) {
  if (titles.has(product.title)) {
    console.log('已存在，略過：' + product.title)
    continue
  }
  await request('/api/' + apiPath + '/admin/product', {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: product }),
  })
  console.log('已建立：' + product.title)
}
`;
export const SEED_4 = `${SEED_3}
${SEED_RUN}`;

// ───────────────────────── 第 10 部：商品 API（熱賣商品） ─────────────────────────
export const ENV_DTS = `/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_API_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
`;

export const TYPES_1 = `export type Product = {
  id: string
  title: string
  category: string
  description: string
  content: string
  origin_price: number
  price: number
  unit: string
  is_enabled: number
  imageUrl: string
  imagesUrl?: string[]
}

export type ProductsResponse = {
  success: boolean
  products: Product[]
}
`;

export const TYPES_2 = `${TYPES_1}
export type CartItem = {
  id: string
  product_id: string
  qty: number
  total: number
  final_total: number
  product: Product
}

export type Cart = {
  carts: CartItem[]
  total: number
  final_total: number
}

export type CartResponse = {
  success: boolean
  data: Cart
}
`;

export const API_1 = `import axios from 'axios'
import type { Product, ProductsResponse } from './types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE + '/api/' + import.meta.env.VITE_API_PATH,
})

export async function getProducts(category?: string): Promise<Product[]> {
  const res = await api.get<ProductsResponse>('/products', { params: { category } })
  return res.data.products
}
`;

export const API_2 = `import axios from 'axios'
import type { Cart, CartResponse, Product, ProductsResponse } from './types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE + '/api/' + import.meta.env.VITE_API_PATH,
})

export async function getProducts(category?: string): Promise<Product[]> {
  const res = await api.get<ProductsResponse>('/products', { params: { category } })
  return res.data.products
}

export async function getCart(): Promise<Cart> {
  const res = await api.get<CartResponse>('/cart')
  return res.data.data
}

export async function addToCart(productId: string, qty = 1) {
  await api.post('/cart', { data: { product_id: productId, qty } })
}
`;

export const USE_PRODUCTS = `import { useEffect, useState } from 'react'
import { getProducts } from '../api'
import type { Product } from '../types'

export default function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProducts(category)
      .then(setProducts)
      .catch(() => setError('商品讀取失敗，請稍後再試'))
      .finally(() => setLoading(false))
  }, [category])

  return { products, loading, error }
}
`;

const CARD_BODY = (withAdd) => `    <article className="group w-64 shrink-0 md:w-auto">
      <a href="#" className="block overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </a>
      <div className="px-2 py-4 text-center transition-colors group-hover:bg-primary-80">
        <h3 className="h5 mb-2">{product.title}</h3>
        <p className="t-r text-primary-dark">{product.description}</p>${
          withAdd
            ? `
        <Button variant="unfill" className="mt-2" disabled={adding} onClick={() => add(product.id)}>
          加入購物車
        </Button>`
            : ''
        }
      </div>
    </article>
`;

export const CARD_1 = `import type { Product } from '../types'

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
${CARD_BODY(false)}  )
}

export default ProductCard
`;

export const CARD_2 = `import { useCart } from '../hooks/useCart'
import type { Product } from '../types'
import Button from './Button'

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const { adding, add } = useCart()

  return (
${CARD_BODY(true)}  )
}

export default ProductCard
`;

const HOT_STATES = `        {loading && <p className="t-m text-n-60">讀取中…</p>}
        {error && <p className="t-m text-red-700">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="t-m text-n-60">目前沒有商品，請先執行 seed 建立資料。</p>
        )}
`;
export const HOT_1 = `import useProducts from '../hooks/useProducts'
import ProductCard from './ProductCard'

function HotProducts() {
  const { products, loading, error } = useProducts('熱賣')

  return (
    <section className="relative py-20 lg:py-30">
      <div className="mx-auto max-w-7xl px-3 md:px-4">
        <h2 className="h2 mb-4">默默熱賣中</h2>
        <p className="t-m mb-8 text-n-60">用過的人都不想換回去的東西</p>

${HOT_STATES}
        <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-4 md:overflow-visible">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <img
        src="/images/svg/graphic-04.svg"
        alt=""
        className="pointer-events-none absolute -top-15 right-0 w-21 lg:w-63"
      />
    </section>
  )
}

export default HotProducts
`;

export const APP_10 = `import Hero from './components/Hero'
import HotProducts from './components/HotProducts'
import Navbar from './components/Navbar'
import PromoSections from './components/PromoSections'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PromoSections />
        <HotProducts />
      </main>
    </>
  )
}

export default App
`;

// ───────────────────────── 第 11 部：購物車 ─────────────────────────
export const CART_CONTEXT = `import { createContext } from 'react'

export type CartContextValue = {
  count: number
  adding: boolean
  add: (productId: string) => Promise<void>
}

export const CartContext = createContext<CartContextValue | null>(null)
`;

export const CART_PROVIDER_1 = `import { useEffect, useState, type ReactNode } from 'react'
import { getCart } from '../api'
import type { Cart } from '../types'
import { CartContext } from './CartContext'

const countItems = (cart: Cart) => cart.carts.reduce((sum, item) => sum + item.qty, 0)

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    getCart()
      .then((cart) => setCount(countItems(cart)))
      .catch(() => setCount(0))
  }, [])

  const add = async () => {}

  return <CartContext value={{ count, adding: false, add }}>{children}</CartContext>
}
`;

export const CART_PROVIDER_2 = `import { useEffect, useState, type ReactNode } from 'react'
import { addToCart, getCart } from '../api'
import type { Cart } from '../types'
import { CartContext } from './CartContext'

const countItems = (cart: Cart) => cart.carts.reduce((sum, item) => sum + item.qty, 0)

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    getCart()
      .then((cart) => setCount(countItems(cart)))
      .catch(() => setCount(0))
  }, [])

  const add = async (productId: string) => {
    setAdding(true)
    try {
      await addToCart(productId)
      setCount(countItems(await getCart()))
    } catch {
      window.alert('加入購物車失敗，請稍後再試')
    } finally {
      setAdding(false)
    }
  }

  return <CartContext value={{ count, adding, add }}>{children}</CartContext>
}
`;

export const USE_CART = `import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart 必須放在 CartProvider 裡面使用')
  return value
}
`;

export const APP_11 = `import Hero from './components/Hero'
import HotProducts from './components/HotProducts'
import Navbar from './components/Navbar'
import PromoSections from './components/PromoSections'
import { CartProvider } from './context/CartProvider'

function App() {
  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        <PromoSections />
        <HotProducts />
      </main>
    </CartProvider>
  )
}

export default App
`;

// ───────────────────────── 第 12 部：分類、企業責任、頁尾 ─────────────────────────
const CAT_DATA = `type Category = {
  title: string
  image: string
}

const categories: Category[] = [
  { title: '日常療癒・文青系', image: '/images/category-04.png' },
  { title: '俐落品味・都會控', image: '/images/category-03.png' },
  { title: '純粹自然・健康派', image: '/images/category-02.png' },
  { title: '溫暖幸福・家居族', image: '/images/category-01.png' },
]
`;
export const CATEGORIES = `import Button from './Button'

${CAT_DATA}
function Categories() {
  return (
    <section className="grid md:grid-cols-2">
      {categories.map((category) => (
        <div key={category.title} className="group relative h-62.5 overflow-hidden md:h-120">
          <img
            src={category.image}
            alt=""
            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-n-80/50">
            <h3 className="h4 text-white">{category.title}</h3>
            <Button variant="white">看看商品</Button>
          </div>

          <div className="pointer-events-none absolute inset-6 border border-white md:inset-8" />
        </div>
      ))}
    </section>
  )
}

export default Categories
`;

const RESP_DATA = `type Item = {
  title: string
  image: string
  text: string
}

const items: Item[] = [
  {
    title: '環境責任',
    image: '/images/slider-02.jpg',
    text: '時尚不該為地球造成負擔。我們選擇永續材質、減少過度生產，讓每一件作品都能兼顧風格與環境。',
  },
  {
    title: '社會責任',
    image: '/images/slider-03.jpg',
    text: '從原料採購到製造過程，我們與合作夥伴建立互信關係，不只創造產品，也共同守護勞動尊嚴。',
  },
  {
    title: '道德責任',
    image: '/images/slider-01.jpg',
    text: '我們定期支持公益項目，關注婦女、弱勢、教育議題，讓時尚成為推動改變的力量。',
  },
]
`;
export const RESP_1 = `${RESP_DATA}
function Responsibility() {
  return (
    <section className="bg-[url(/images/bgc-img.png)] bg-cover bg-center py-20 lg:py-30">
      <div className="mx-auto max-w-7xl px-3 md:px-4">
        <h2 className="h2 mb-6 lg:mb-10">企業責任</h2>

        <div className="flex flex-col gap-2 md:h-120 md:flex-row">
          {items.map((item) => (
            <div key={item.title} className="relative h-100 flex-1 overflow-hidden md:h-auto">
              <img src={item.image} alt="" className="size-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-n-80/20 to-n-80/60" />

              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-4 text-white md:p-8">
                <span className="h6 rounded-full bg-white px-4 py-2 text-primary-dark">{item.title}</span>
                <p className="t-m">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Responsibility
`;

export const RESP_2 = `import { useState } from 'react'

${RESP_DATA}
function Responsibility() {
  const [active, setActive] = useState(0)

  return (
    <section className="bg-[url(/images/bgc-img.png)] bg-cover bg-center py-20 lg:py-30">
      <div className="mx-auto max-w-7xl px-3 md:px-4">
        <h2 className="h2 mb-6 lg:mb-10">企業責任</h2>

        <div className="flex flex-col gap-2 md:h-120 md:flex-row">
          {items.map((item, index) => {
            const isActive = index === active

            return (
              <div
                key={item.title}
                onMouseEnter={() => setActive(index)}
                onClick={() => setActive(index)}
                className={[
                  'relative h-100 cursor-pointer overflow-hidden transition-all duration-500 md:h-auto',
                  isActive ? 'md:flex-8' : 'md:flex-1',
                ].join(' ')}
              >
                <img src={item.image} alt="" className="size-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-n-80/20 to-n-80/60" />

                <h3
                  className={[
                    'h4 absolute inset-0 hidden items-center justify-center text-white',
                    isActive ? '' : 'md:flex',
                  ].join(' ')}
                >
                  {item.title}
                </h3>

                <div
                  className={[
                    'absolute inset-x-0 bottom-0 flex-col items-start gap-4 p-4 text-white md:p-8',
                    isActive ? 'flex' : 'flex md:hidden',
                  ].join(' ')}
                >
                  <span className="h6 rounded-full bg-white px-4 py-2 text-primary-dark">{item.title}</span>
                  <p className="t-m">{item.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Responsibility
`;

const SOCIALS = `const socials = [
  { name: 'instagram', icon: '/images/svg/instagram.svg' },
  { name: 'youtube', icon: '/images/svg/youtube.svg' },
  { name: 'facebook', icon: '/images/svg/facebook.svg' },
  { name: 'tiktok', icon: '/images/svg/tiktok.svg' },
]
`;
export const FOOTER = `const columns = [
  { title: '關於', items: ['關於我們', '隱私權政策', '免責申明'] },
  { title: '服務', items: ['廣告合作'] },
  { title: '聯絡方式', items: ['電話號碼：0900-000-000', '信箱：B9.ineedthat@gmail.com'] },
]

${SOCIALS}
function Footer() {
  return (
    <footer className="bg-[url(/images/footer-bgc.jpg)] bg-cover bg-center text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 text-center lg:flex-row lg:justify-between lg:text-left">
        <div>
          <img src="/images/svg/logo_on dark.svg" alt="I need this" className="mx-auto h-12 lg:mx-0" />

          <ul className="mt-8 flex justify-center gap-6 lg:justify-start">
            {socials.map((social) => (
              <li key={social.name}>
                <a
                  href="#"
                  aria-label={social.name}
                  className="grid size-10 place-items-center rounded-full border border-white hover:bg-white/20"
                >
                  <img src={social.icon} alt="" className="size-6 brightness-0 invert" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-20">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="h3 mb-4 lg:mb-6">{column.title}</h3>
              <ul className="space-y-2 t-m">
                {column.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:underline">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="border-t border-white/60 py-2 text-center t-r">B-9 © 2025 All Rights Reserved</p>
    </footer>
  )
}

export default Footer
`;

export const SOCIAL_BAR = `${SOCIALS}
function SocialBar() {
  return (
    <aside className="fixed top-1/2 right-10 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
      <div className="h-31 w-0.75 bg-white shadow-[0_0_10px_rgba(30,30,30,0.3)]" />

      {socials.map((social) => (
        <a
          key={social.name}
          href="#"
          aria-label={social.name}
          className="grid size-10 place-items-center rounded-full bg-white shadow-[0_0_10px_rgba(30,30,30,0.3)] hover:bg-primary-80"
        >
          <img src={social.icon} alt="" className="size-6" />
        </a>
      ))}
    </aside>
  )
}

export default SocialBar
`;

export const APP_12a = `import Categories from './components/Categories'
import Hero from './components/Hero'
import HotProducts from './components/HotProducts'
import Navbar from './components/Navbar'
import PromoSections from './components/PromoSections'
import { CartProvider } from './context/CartProvider'

function App() {
  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        <PromoSections />
        <HotProducts />
        <Categories />
      </main>
    </CartProvider>
  )
}

export default App
`;

export const APP_12 = `import Categories from './components/Categories'
import Hero from './components/Hero'
import HotProducts from './components/HotProducts'
import Navbar from './components/Navbar'
import PromoSections from './components/PromoSections'
import Responsibility from './components/Responsibility'
import { CartProvider } from './context/CartProvider'

function App() {
  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        <PromoSections />
        <HotProducts />
        <Categories />
        <Responsibility />
      </main>
    </CartProvider>
  )
}

export default App
`;

export const APP_13 = `import Categories from './components/Categories'
import Footer from './components/Footer'
import Hero from './components/Hero'
import HotProducts from './components/HotProducts'
import Navbar from './components/Navbar'
import PromoSections from './components/PromoSections'
import Responsibility from './components/Responsibility'
import SocialBar from './components/SocialBar'
import { CartProvider } from './context/CartProvider'

function App() {
  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        <PromoSections />
        <HotProducts />
        <Categories />
        <Responsibility />
      </main>
      <Footer />
      <SocialBar />
    </CartProvider>
  )
}

export default App
`;
