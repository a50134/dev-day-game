// 第 6 部「導覽列」：
//   做錯 ①：右邊內容忘了 hidden lg:flex → 手機版全部擠在一起、橫向爆版
//   做錯 ②：useState(null)，TypeScript 推成「只能是 null」→ TS2345
import { T, R, chapter, type, open, view, vp, hl, unhl, float, unfloat, fx, confetti, list, card, wait, err, noerr, lineOf } from './dsl.js';
import * as C from '../tw-react-code.js';

const NAV_2_BAD = C.NAV_2.replace('hidden items-center gap-8 lg:flex', 'flex items-center gap-8');
const NAV_3_BAD = C.NAV_3a.replace('useState<string | null>(null)', 'useState(null)');
const ERR_NULL = "Argument of type '\"Alice\"' is not assignable to parameter of type 'SetStateAction<null>'.";

const states = list(['① 未登入：右邊是綠色「註冊／登入」按鈕', '② 已登入：頭像和名字', '③ 展開選單：個人資訊、我的收藏、訂單狀態', '④ 購物車有商品：圖示旁出現數字（第 11 部再做）']);
const images = list(['打開你之前的切版專案', '複製 <code>assets/images</code> 整個資料夾', '貼到新專案的 <code>public</code> 資料夾底下', '程式裡寫 <code>/images/svg/logo_on light.svg</code> 就找得到']);
const spacing = list(['<code>h-18</code> ＝ 72px（手機）', '<code>lg:h-22</code> ＝ 88px（桌面，≥1024px）', 'Tailwind 的數字：1 ＝ 4px']);

const beats = [
  chapter('開場', ['第 6 部', '導覽列', '🧭']),
  T('今天做網站最上面的「導覽列」。設計稿裡它有四種狀態喔～'),
  float(card('🧭 導覽列四種狀態', states)),
  R('桌面版和手機版長得也不一樣欸…', 'worried'),
  T('對，所以我們一步一步來。先把 logo、購物車這些圖片放進專案。', 'happy'),
  unfloat,
  float(card('🖼️ 放圖片', images)),
  wait(4200),
  unfloat,

  chapter('先做 logo'),
  T('先做最簡單的：只有 logo。新增 `components/Navbar.tsx`～', 'happy'),
  R('我來！`sticky top-0`，捲動時就會固定在最上面對不對？', 'happy', { jump: 'rookie' }),
  type('src/components/Navbar.tsx', C.NAV_1),
  hl(3, 4),
  T('`sticky top-0` 固定在上方，`z-50` 讓它蓋在其他東西上面，`shadow-sm` 是淡淡的陰影。', 'happy'),
  unhl,
  float(card('📏 高度怎麼算', spacing)),
  wait(3200),
  unfloat,
  type('src/App.tsx', C.APP_6),
  view(2400),
  R('左上角有 logo，往下捲導覽列也留在上面！', 'happy', { fx: '✨' }),

  chapter('新人先試'),
  T('接著加桌面版的右邊：搜尋框、連結、購物車、登入按鈕。換你囉！', 'happy'),
  R('好～我把它們全部放進一個 `flex` 裡就好！', 'happy', { jump: 'rookie' }),
  type('src/components/Navbar.tsx', NAV_2_BAD, { bulk: true }),
  vp('desktop'),
  view(2200),
  R('桌面版很漂亮！那…看一下手機版～', 'normal'),
  vp('mobile'),
  wait(2200),
  { fx: 'shake' },
  R('哇！手機版全部擠成一團，還跑出橫向捲軸…', 'surprised', { fx: '💦' }),

  chapter('老師點醒'),
  T('手機螢幕這麼窄，搜尋框、連結、按鈕全部塞在一排，放得下嗎？', 'normal'),
  R('放不下…手機應該只留 logo 和簡單的圖示？', 'worried'),
  T('沒錯！那桌面這整排，在手機上應該要「藏起來」。你覺得該用哪個 class？', 'happy'),
  hl(1, 1),
  R('先藏起來（`hidden`），到大螢幕再變回 `flex`…是 `hidden lg:flex`！', 'surprised', { jump: 'rookie', fx: '❗' }),
  unhl,
  type('src/components/Navbar.tsx', C.NAV_2, { slow: true }),
  view(2200),
  R('手機版乾淨了！只剩 logo。', 'happy', { fx: '✨' }),
  T('這就是「手機優先」：先寫手機的樣子（`hidden`），螢幕 1024px 以上（`lg`）再換成桌面的樣子（`flex`）。', 'happy', { fx: '💡' }),
  vp('desktop'),
  wait(2000),

  chapter('假登入'),
  T('登入按鈕現在按了沒反應。我們用 `useState` 記住「現在是誰」，一開始沒人登入。', 'happy'),
  R('我知道！`useState(null)`，登入就變成名字～', 'happy', { jump: 'rookie' }),
  type('src/components/Navbar.tsx', NAV_3_BAD, { broken: true }),
  err(lineOf(NAV_3_BAD, "setUser('Alice')"), "'Alice'", ERR_NULL),
  { fx: 'shake' },
  R('紅色波浪線！它說 `"Alice"` 不能給 `SetStateAction<null>`…', 'surprised', { fx: '❗' }),
  T('讀讀看：那個狀態被推測成什麼型別？', 'normal'),
  hl(5, 5),
  R('只有 `null`！所以字串放不進去…', 'worried'),
  T('對！TypeScript 只看到 `null`，就以為它永遠是 `null`。我們要明確告訴它：可能是字串，也可能是 `null`。', 'happy', { fx: '💡' }),
  unhl,
  type('src/components/Navbar.tsx', C.NAV_3a, { slow: true }),
  noerr,
  view(2400),
  R('紅線不見了！按下去就變成 Alice～', 'happy', { fx: '✨' }),
  T('`string | null` 叫聯集型別。下面的 `user ? … : …`，在有 `user` 那邊 TypeScript 知道它一定是字串，這叫「型別縮小」。', 'happy'),

  chapter('選單與手機版'),
  T('設計稿登入後有頭像，點了會展開選單。再加一個狀態記住選單有沒有打開。', 'happy'),
  type('src/components/Navbar.tsx', C.NAV_3, { bulk: true }),
  float(card('⚠️ 登入是假的', list(['六角 API 沒有一般顧客登入', '所以登入狀態用 useState 假裝', '商品、購物車、結帳才用真的 API']))),
  wait(3600),
  unfloat,
  T('最後做手機版：小螢幕右邊只放搜尋和選單兩個圖示，點選單會打開滿版的選單。', 'happy'),
  type('src/components/Navbar.tsx', C.NAV_4, { bulk: true }),
  vp('mobile'),
  view(2600),
  hl(1, 1),
  unhl,
  R('手機版有搜尋和選單圖示！點選單就蓋滿整個畫面～', 'happy', { fx: '✨' }),
  T('滿版靠 `fixed inset-0`：固定在畫面上，四邊都貼齊。`lg:hidden` 讓桌面不會出現它。', 'happy'),

  chapter('今天學到'),
  T('來，換你當小老師～'),
  R('我來整理！', 'happy'),
  float(card('📝 今天學到', list(['<code>sticky top-0</code> 固定導覽列；<code>hidden lg:flex</code> 手機藏、桌面顯示（手機優先）', '<code>useState&lt;string | null&gt;</code>：不寫型別，TypeScript 只會當成 <code>null</code>', '登入是假的（useState 假裝），購物車數字第 11 部再加']))),
  wait(6000),
  T('太棒了！下一部做首頁大圖輪播～', 'happy', { fx: '🎉' }),
  confetti,
  unfloat,
  wait(1500),
];

export default {
  title: '導覽列（四種狀態）',
  endSub: '下一部：首頁 Hero 輪播',
  beats,
};
