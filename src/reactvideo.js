// React 影片式教學的內容（7 部）。順序照六角 React 班的課綱：
// 認識 React／環境建置 → JSX → 狀態與事件 → 元件化 → 串接 API → React Router → 進階語法。
// 每一步的欄位說明見 video-player.js。裡面的程式要能真的用 Vite 建置成功。
import { startPlayer } from './video-player.js';

const LIST = `  { id: 1, name: '咖啡', price: 80 },
  { id: 2, name: '蛋糕', price: 120 },
  { id: 3, name: '紅茶', price: 50 },`;

// ── 第 1、2 部：JSX ──
const APP1 = `function App() {
  return <h1>哈囉，React！</h1>;
}

export default App;`;
const APP2 = `function App() {
  const shop = '小明的店';

  return <h1>{shop}</h1>;
}

export default App;`;
const APP3 = `function App() {
  const shop = '小明的店';

  return (
    <>
      <h1 className="title">{shop}</h1>
      <p>歡迎光臨</p>
    </>
  );
}

export default App;`;
const jsxList = (hot) => `function App() {
  const shop = '小明的店';
  const products = [
${LIST.replace(/^/gm, '  ')}
  ];

  return (
    <>
      <h1 className="title">{shop}</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name}：{p.price} 元${hot ? `
            {p.price >= 100 && <span> 🔥 人氣</span>}` : ''}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;`;
const APP4 = jsxList(false);
const APP5 = jsxList(true);

// ── 第 3 部：狀態與事件 ──
const COUNT = `import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>你按了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>按我</button>
    </>
  );
}

export default App;`;
const shop3 = (search) => `import { useState } from 'react';

const products = [
${LIST}
];

function App() {
  const [cart, setCart] = useState([]);${search ? `
  const [keyword, setKeyword] = useState('');
  const shown = products.filter((p) => p.name.includes(keyword));` : ''}

  return (
    <>
      <h1>小明的店</h1>
      <p>購物車：{cart.length} 件</p>${search ? `
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="搜尋商品"
      />` : ''}
      <ul>
        {${search ? 'shown' : 'products'}.map((p) => (
          <li key={p.id}>
            {p.name}：{p.price} 元
            <button onClick={() => setCart([...cart, p])}>加入購物車</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;`;
const SHOP1 = shop3(false);
const SHOP2 = shop3(true);

// ── 第 4 部：元件化 ──
const CARD1 = `function ProductCard({ product }) {
  return (
    <li>
      {product.name}：{product.price} 元
    </li>
  );
}

export default ProductCard;`;
const CARD2 = `function ProductCard({ product, onAdd }) {
  return (
    <li>
      {product.name}：{product.price} 元
      <button onClick={() => onAdd(product)}>加入購物車</button>
    </li>
  );
}

export default ProductCard;`;
const INPUT = `      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="搜尋商品"
      />`;
const SHOP3 = `import { useState } from 'react';
import ProductCard from './ProductCard.jsx';

const products = [
${LIST}
];

function App() {
  const [cart, setCart] = useState([]);
  const [keyword, setKeyword] = useState('');
  const shown = products.filter((p) => p.name.includes(keyword));
  const addToCart = (product) => setCart([...cart, product]);

  return (
    <>
      <h1>小明的店</h1>
      <p>購物車：{cart.length} 件</p>
${INPUT}
      <ul>
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={addToCart} />
        ))}
      </ul>
    </>
  );
}

export default App;`;

// ── 第 5 部：串接 API ──
const JSON5 = `[
  { "id": 1, "name": "咖啡", "price": 80 },
  { "id": 2, "name": "蛋糕", "price": 120 },
  { "id": 3, "name": "紅茶", "price": 50 }
]`;
const FETCH = `  useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setError('讀取失敗，請稍後再試'))
      .finally(() => setLoading(false));
  }, []);`;
const shop5 = (full) => `import { useState, useEffect } from 'react';
import ProductCard from './ProductCard.jsx';

function App() {
  const [products, setProducts] = useState([]);${full ? `
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');` : ''}
  const [cart, setCart] = useState([]);
  const [keyword, setKeyword] = useState('');
  const shown = products.filter((p) => p.name.includes(keyword));
  const addToCart = (product) => setCart([...cart, product]);

${full ? FETCH : FETCH.replace(/\n      \.catch.*\n      \.finally.*;/, ';')}
${full ? `
  if (loading) return <p>讀取中…</p>;
  if (error) return <p>{error}</p>;
` : ''}
  return (
    <>
      <h1>小明的店</h1>
      <p>購物車：{cart.length} 件</p>
${INPUT}
      <ul>
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={addToCart} />
        ))}
      </ul>
    </>
  );
}

export default App;`;
const SHOP4 = shop5(false);
const SHOP5 = shop5(true);

// ── 第 6 部：React Router ──
const MAIN = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);`;
const HOME = `function Home() {
  return (
    <>
      <h1>小明的店</h1>
      <p>歡迎光臨，請到商品頁逛逛。</p>
    </>
  );
}

export default Home;`;
const PRODUCTS = `import { useState, useEffect } from 'react';
import ProductCard from '../ProductCard.jsx';

function Products({ onAdd }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const shown = products.filter((p) => p.name.includes(keyword));

${FETCH}

  if (loading) return <p>讀取中…</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <h1>商品</h1>
${INPUT}
      <ul>
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </ul>
    </>
  );
}

export default Products;`;
const app6 = (detail) => `import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';${detail ? `
import ProductDetail from './pages/ProductDetail.jsx';` : ''}

function App() {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => setCart([...cart, product]);

  return (
    <>
      <nav>
        <Link to="/">首頁</Link> | <Link to="/products">商品</Link> | 購物車：
        {cart.length} 件
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products onAdd={addToCart} />} />${detail ? `
        <Route path="/products/:id" element={<ProductDetail />} />` : ''}
      </Routes>
    </>
  );
}

export default App;`;
const APP6 = app6(false);
const APP7 = app6(true);
const DETAIL1 = `import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const product = products.find((p) => p.id === Number(id));
  if (!product) return <p>找不到這個商品</p>;

  return (
    <>
      <h1>{product.name}</h1>
      <p>價格：{product.price} 元</p>
      <Link to="/products">← 回商品列表</Link>
    </>
  );
}

export default ProductDetail;`;
const CARD3 = `import { Link } from 'react-router-dom';

function ProductCard({ product, onAdd }) {
  return (
    <li>
      <Link to={\`/products/\${product.id}\`}>{product.name}</Link>：{product.price} 元
      <button onClick={() => onAdd(product)}>加入購物車</button>
    </li>
  );
}

export default ProductCard;`;

// ── 第 7 部：自訂 Hook ──
const HOOK = `import { useState, useEffect } from 'react';

function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

${FETCH}

  return { products, loading, error };
}

export default useProducts;`;
const PRODUCTS2 = `import { useState } from 'react';
import ProductCard from '../ProductCard.jsx';
import useProducts from '../useProducts.js';

function Products({ onAdd }) {
  const { products, loading, error } = useProducts();
  const [keyword, setKeyword] = useState('');
  const shown = products.filter((p) => p.name.includes(keyword));

  if (loading) return <p>讀取中…</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <h1>商品</h1>
${INPUT}
      <ul>
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </ul>
    </>
  );
}

export default Products;`;
const DETAIL2 = `import { useParams, Link } from 'react-router-dom';
import useProducts from '../useProducts.js';

function ProductDetail() {
  const { id } = useParams();
  const { products, loading, error } = useProducts();

  if (loading) return <p>讀取中…</p>;
  if (error) return <p>{error}</p>;

  const product = products.find((p) => p.id === Number(id));
  if (!product) return <p>找不到這個商品</p>;

  return (
    <>
      <h1>{product.name}</h1>
      <p>價格：{product.price} 元</p>
      <Link to="/products">← 回商品列表</Link>
    </>
  );
}

export default ProductDetail;`;

// 瀏覽器畫面的示意圖
const fake = (t, cls = '') => `<span class="fake ${cls}">${t}</span>`;
const row = (name, price, { btn = true, hot = false, link = false } = {}) => `<li>${link ? `<u style="color:#2563eb">${name}</u>` : name}：${price} 元${hot ? ' 🔥 人氣' : ''} ${btn ? fake('加入購物車', 'btn') : ''}</li>`;
const ul = (rows) => `<ul style="margin:6px 0;padding-left:22px">${rows.join('')}</ul>`;
const h = (t) => `<h3 style="margin:0 0 6px">${t}</h3>`;
const ALL = [['咖啡', 80], ['蛋糕', 120], ['紅茶', 50]];
const nav = (n) => `<p style="margin:0 0 8px;font-size:14px"><u style="color:#2563eb">首頁</u> | <u style="color:#2563eb">商品</u> | 購物車：${n} 件</p>`;
const shopView = (n, rows, search = true) => `${h('小明的店')}<p style="margin:0 0 6px">購物車：${n} 件</p>${search ? fake('搜尋商品') : ''}${ul(rows)}`;

export const EPISODES = [
  { title: '認識 React 與環境建置', steps: [
    { say: '歡迎來到 React 教學。一共七部，順序照你課程的大綱走：先認識 React，再學狀態、元件、串接 API、路由。', slide: ['⚛️ React 入門', '一共 7 部・一步一步走'] },
    { say: '你之前學過用 DOM 選取元素，再自己去改畫面。資料一多，就要記得每個地方都改，很容易漏掉。', slide: ['以前：資料變了 → 自己找元素 → 自己改畫面', '缺點：地方一多就容易漏改'] },
    { say: 'React 的想法不一樣：你只要管好資料，畫面交給 React 自動更新。這就是關注點分離，資料歸資料，畫面歸畫面。', slide: ['React：資料變了 → 畫面自動跟著變', '你只管資料，不用自己動畫面'] },
    { say: '現在建立專案。Vite 是建立 React 專案的工具，速度很快。輸入這行指令，它會幫你產生一個叫 my-shop 的資料夾。', term: ['$ npm create vite@latest my-shop -- --template react', 'Scaffolding project in my-shop...', 'Done.'] },
    { say: '走進資料夾，用 npm install 把需要的套件裝起來。', term: ['$ cd my-shop', '$ npm install', 'added 150 packages in 8s'] },
    { say: '輸入 npm run dev 啟動開發伺服器。它會給你一個網址，通常是 localhost 5173。', term: ['$ npm run dev', '  VITE ready in 300 ms', '  ➜  Local:   http://localhost:5173/'] },
    { say: '打開 src 資料夾裡的 App.jsx，把內容全部換成這樣。這個 App 函式就是一個元件，它回傳什麼，畫面就顯示什麼。', file: 'src/App.jsx', code: APP1 },
    { say: '存檔之後不用重新整理，瀏覽器會自己更新。看到這行字，你的第一個 React 畫面就完成了。', web: { url: 'http://localhost:5173', html: h('哈囉，React！') } },
    { say: '這一部學會了：React 幫你自動更新畫面，用 Vite 建專案，還有元件就是一個回傳畫面的函式。', slide: ['✅ 資料變，畫面自動變', '✅ npm create vite → npm run dev', '✅ 元件 = 回傳畫面的函式'] },
  ] },
  { title: 'JSX：在 JavaScript 裡寫畫面', steps: [
    { say: '剛剛那段長得像 HTML 的東西叫做 JSX。它其實是 JavaScript，只是寫起來像 HTML。這一部學它的四個規則。', slide: ['JSX = 寫在 JavaScript 裡的「HTML」', '這一部：4 個規則'] },
    { say: '規則一：用大括號放 JavaScript。這裡把店名存在變數裡，再用大括號放進標題。', file: 'src/App.jsx', code: APP2 },
    { say: '規則二和三：只能回傳一個最外層，所以用空的角括號把它們包起來。另外 class 要寫成 className，因為 class 是 JavaScript 的保留字。', file: 'src/App.jsx', code: APP3 },
    { say: '規則四：要顯示很多筆資料，就用陣列的 map，把每一筆資料變成一段畫面。每一項都要給一個不重複的 key，React 才分得出誰是誰。', file: 'src/App.jsx', code: APP4 },
    { say: '畫面上就出現三個商品了。之後商品變成一百個，這段程式也不用改。', web: { url: 'http://localhost:5173', html: h('小明的店') + ul(ALL.map(([n, p]) => row(n, p, { btn: false }))) } },
    { say: '想要「符合條件才顯示」，可以用兩個 and 符號。這行的意思是：價格大於等於一百，才顯示人氣標籤。', file: 'src/App.jsx', code: APP5 },
    { say: '只有蛋糕超過一百元，所以只有它出現人氣標籤。', web: { url: 'http://localhost:5173', html: h('小明的店') + ul(ALL.map(([n, p]) => row(n, p, { btn: false, hot: p >= 100 }))) } },
    { say: '這一部的四個規則：大括號放 JavaScript，只能有一個最外層，class 寫成 className，清單用 map 加 key。', slide: ['✅ { } 放 JavaScript', '✅ 一個最外層　✅ className', '✅ map + key 顯示清單'] },
  ] },
  { title: '狀態 useState 與事件', steps: [
    { say: '這一部是 React 最重要的觀念：狀態。狀態就是「會改變、而且改變時畫面要跟著更新」的資料。', slide: ['狀態（state）', '= 會變的資料，變了畫面就更新'] },
    { say: '先做一個計數器。useState 會給你兩個東西：count 是現在的值，setCount 是用來改它的函式。括號裡的 0 是一開始的值。', file: 'src/App.jsx', code: COUNT },
    { say: '按鈕的 onClick 是「被點的時候要做什麼」。每按一次，就用 setCount 把數字加一，畫面自動更新。', web: { url: 'http://localhost:5173', html: `<p style="margin:0 0 6px">你按了 3 次</p>${fake('按我', 'btn')}` } },
    { say: '為什麼不直接用一般的變數？因為你改了一般變數，React 不會知道，畫面就不會動。一定要用 set 開頭的那個函式來改。', slide: ['❌ count = count + 1　→ 畫面不會動', '✅ setCount(count + 1)　→ 畫面更新'] },
    { say: '把它用到商店上。購物車是一個陣列狀態。按「加入購物車」時，不要用 push 去改原本的陣列，而是做一個新的陣列：把舊的展開，再加上新的。', file: 'src/App.jsx', code: SHOP1 },
    { say: '這是很重要的觀念：物件和陣列的狀態，要給 React 一個「新的」，它才知道有變。三個點點就是把舊的內容複製過來。', slide: ['❌ cart.push(p)　　→ 還是同一個陣列', '✅ setCart([...cart, p])　→ 新的陣列'] },
    { say: '再加搜尋。輸入框的值綁在 keyword 這個狀態上，打字的時候用 onChange 更新它。下面再用 filter，只留下名字包含關鍵字的商品。', file: 'src/App.jsx', code: SHOP2 },
    { say: '在搜尋框打「茶」，清單馬上只剩紅茶。按加入購物車，上面的數量也會跟著變。', web: { url: 'http://localhost:5173', html: shopView(1, [row('紅茶', 50)]).replace('搜尋商品', '茶') } },
    { say: '這一部學會了：useState 建立狀態，用 set 函式修改，事件用 onClick 和 onChange，陣列要給新的。', slide: ['✅ const [值, set值] = useState(初始值)', '✅ onClick、onChange', '✅ 陣列／物件要給「新的」'] },
  ] },
  { title: '元件化與 props', steps: [
    { say: '程式越寫越長，就要拆成小元件。好處是每一塊都很小、好讀，而且可以重複使用。', slide: ['元件化 = 把畫面拆成一塊一塊', '好讀、好改、可以重複用'] },
    { say: '在 src 裡新增 ProductCard.jsx，把「一個商品」的畫面搬過來。括號裡的 product 叫做 props，是外面傳進來的資料。', file: 'src/ProductCard.jsx', code: CARD1 },
    { say: '按鈕也搬進來。但購物車的狀態在 App 那邊，所以讓 App 傳一個函式 onAdd 進來。按鈕被按的時候，呼叫它來通知 App。', file: 'src/ProductCard.jsx', code: CARD2 },
    { say: '回到 App.jsx。最上面把 ProductCard 引入，然後把原本那一大段 li，換成一行 ProductCard，並且把商品和函式傳進去。', file: 'src/App.jsx', code: SHOP3 },
    { say: '這就是 React 的資料流向：資料用 props 從上往下傳；下面要通知上面，就呼叫上面傳下來的函式。', slide: ['⬇️ 資料：父元件用 props 傳給子元件', '⬆️ 通知：子元件呼叫父元件給的函式'] },
    { say: '畫面看起來和剛剛一模一樣，但是程式變得更清楚了。這種「功能不變、整理程式」的動作叫做重構。', web: { url: 'http://localhost:5173', html: shopView(0, ALL.map(([n, p]) => row(n, p))) } },
    { say: '這一部學會了：拆元件、用 props 傳資料、傳函式讓子元件通知父元件。', slide: ['✅ 一個檔案一個元件', '✅ props 往下傳資料', '✅ 傳函式往上通知'] },
  ] },
  { title: '串接 API：useEffect', steps: [
    { say: '真實的網站，商品資料不會寫死在程式裡，而是去跟後端的 API 要。這一部讓商店從 API 拿資料。', slide: ['畫面出現 → 去 API 拿資料 → 存進狀態 → 畫面更新'] },
    { say: '我們先用一個 JSON 檔案當作 API。在 public 資料夾新增 products.json。之後換成真的後端，只要改網址就好。', file: 'public/products.json', code: JSON5 },
    { say: '回到 App.jsx。商品改成狀態，一開始是空陣列。useEffect 的意思是「畫面出現之後，去做這件事」。這裡用 fetch 拿資料，拿到就存進狀態。', file: 'src/App.jsx', code: SHOP4 },
    { say: '最後面那個空的中括號很重要，意思是「只在第一次出現時做一次」。如果忘了寫，它會一直重複抓資料，停不下來。', slide: ['useEffect(() => { ... }, [])', '[ ] = 只做一次', '忘記寫 = 一直重複抓 ⚠️'] },
    { say: '資料回來需要時間，也可能失敗。所以再加兩個狀態：loading 代表還在讀，error 放錯誤訊息。讀取中和失敗時，各顯示不同的畫面。', file: 'src/App.jsx', code: SHOP5 },
    { say: '重新整理，會先閃過「讀取中」，然後商品出現。畫面和之前一樣，但資料已經是從外面拿來的了。', web: { url: 'http://localhost:5173', html: shopView(0, ALL.map(([n, p]) => row(n, p))) } },
    { say: '你的課程用的是 axios。它和 fetch 做的事一樣，只是寫法短一點，會自動幫你轉 JSON。兩個都看得懂就好。', slide: ['fetch(網址).then((res) => res.json())', 'axios.get(網址).then((res) => res.data)'] },
    { say: '這一部學會了：useEffect 在畫面出現後抓資料，空的中括號代表只做一次，還要處理讀取中和失敗。', slide: ['✅ useEffect + fetch', '✅ [ ] 只做一次', '✅ loading、error 三種畫面'] },
  ] },
  { title: 'React Router：多個頁面', steps: [
    { say: '現在只有一頁。真的網站會有首頁、商品頁、商品內頁。React Router 讓你換網址、換畫面，但是不用整頁重新載入。', slide: ['/　　　　　　→ 首頁', '/products　　→ 商品列表', '/products/2　→ 2 號商品'] },
    { say: '先安裝 React Router。', term: ['$ npm install react-router-dom', 'added 4 packages in 2s'] },
    { say: '打開 main.jsx，用 BrowserRouter 把 App 包起來。這樣整個網站才能使用路由功能。', file: 'src/main.jsx', code: MAIN },
    { say: '在 src 裡建立 pages 資料夾，新增首頁 Home.jsx。', file: 'src/pages/Home.jsx', code: HOME },
    { say: '再新增 Products.jsx，把原本 App 裡面抓資料、搜尋、商品清單的程式搬過來。加入購物車的函式，改成從 props 的 onAdd 拿。', file: 'src/pages/Products.jsx', code: PRODUCTS },
    { say: 'App.jsx 變成整個網站的外框。Link 是換頁用的連結。Routes 裡面一條一條寫：什麼網址，顯示哪個元件。購物車留在 App，所以換頁也不會消失。', file: 'src/App.jsx', code: APP6 },
    { say: '現在上面有導覽列。點「商品」，網址變成 products，畫面換成商品列表，而且沒有整頁重新載入。', web: { url: 'http://localhost:5173/products', html: nav(0) + h('商品') + fake('搜尋商品') + ul(ALL.map(([n, p]) => row(n, p))) } },
    { say: '接著做商品內頁。網址裡的冒號 id 是會變的部分，用 useParams 可以拿到它。再用它從商品裡找出對應的那一個。', file: 'src/pages/ProductDetail.jsx', code: DETAIL1 },
    { say: '在 App.jsx 加上內頁的路由。冒號 id 代表這一段可以是任何編號。', file: 'src/App.jsx', code: APP7 },
    { say: '最後讓商品名稱變成連結，點了就到那個商品的內頁。反引號裡面把商品編號放進網址。', file: 'src/ProductCard.jsx', code: CARD3 },
    { say: '在商品頁點「蛋糕」，網址變成 products 斜線 2，畫面顯示蛋糕的資料。', web: { url: 'http://localhost:5173/products/2', html: `${nav(0)}${h('蛋糕')}<p style="margin:0 0 6px">價格：120 元</p><u style="color:#2563eb">← 回商品列表</u>` } },
    { say: '這一部學會了：用 Routes 設定網址對應的頁面，用 Link 換頁，用 useParams 拿網址裡的編號。', slide: ['✅ <Route path element>', '✅ <Link to>', '✅ useParams() 拿網址參數'] },
  ] },
  { title: '進階：自訂 Hook 與上線', steps: [
    { say: '你有沒有發現，商品頁和內頁都寫了一次抓資料的程式？重複的程式，改的時候很容易只改到一邊。', slide: ['Products.jsx：抓商品資料', 'ProductDetail.jsx：又抓一次', '→ 重複了，應該收在一起'] },
    { say: '把它收成一個自訂 Hook。新增 useProducts.js，把三個狀態和抓資料的程式搬進來，最後把結果回傳。名字用 use 開頭是 React 的規定。', file: 'src/useProducts.js', code: HOOK },
    { say: '商品頁就可以改得很短：一行 useProducts，就拿到商品、讀取中、錯誤三個東西。', file: 'src/pages/Products.jsx', code: PRODUCTS2 },
    { say: '內頁也一樣改用它，還順便多了讀取中和錯誤的處理。', file: 'src/pages/ProductDetail.jsx', code: DETAIL2 },
    { say: '元件是把「畫面」收起來重複用，自訂 Hook 是把「邏輯」收起來重複用。這是 React 很常見的整理方式。', slide: ['元件 → 重複使用「畫面」', '自訂 Hook → 重複使用「邏輯」'] },
    { say: '最後是上線。npm run build 會把專案打包成可以放上網路的檔案，放在 dist 資料夾裡。', term: ['$ npm run build', 'vite v7 building for production...', '✓ built in 1.2s', 'dist/index.html', 'dist/assets/index.js'] },
    { say: '把它放到 GitHub Pages 或 Vercel，就有一個別人打得開的網址。面試時能直接給人看，比講再多都有用。', slide: ['npm run build → dist 資料夾', '放上 GitHub Pages／Vercel', '有網址的作品 = 最好的履歷'] },
    { say: '恭喜看完七部。請自己從頭做一次這個小商店，不要看答案。也可以把商品網址換成 Node.js 教學裡你自己寫的 API，前後端就接起來了。', slide: ['🎉 全部看完了', '現在換你：自己從頭做一次', '進階：接上自己寫的 Node.js API'] },
  ] },
];

if (typeof document !== 'undefined') startPlayer(EPISODES, 'reactvideo');
