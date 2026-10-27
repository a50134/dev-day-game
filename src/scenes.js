// 遊戲文字與選項資料。效果 fx 的鍵：progress 進度 / quality 品質 / stress 壓力 / team 同事關係
export const COMPANIES = [
  { id: 'ticket', name: '搶票通 TixRush', desc: '演唱會與展演售票平台。開賣日流量像海嘯。', open: true },
  { id: 'shop', name: '購購購 ShopGo', desc: '電商平台（尚未開放）', open: false },
  { id: 'bank', name: '穩穩 SteadyPay', desc: '金融服務（尚未開放）', open: false },
  { id: 'search', name: '找找看 FindIt', desc: '搜尋網站（尚未開放）', open: false },
];

export const COLORS = [
  { id: 'red', name: '熱血紅', value: '#e11d48' },
  { id: 'blue', name: '沉穩藍', value: '#2563eb' },
  { id: 'green', name: '清新綠', value: '#059669' },
];

export const FONTS = [
  { id: 'sans', name: '黑體（俐落現代）', value: '"Noto Sans TC", sans-serif' },
  { id: 'serif', name: '明體（質感文藝）', value: '"Noto Serif TC", serif' },
];

export const PAGES = [
  { id: 'list', name: '活動列表頁' },
  { id: 'seats', name: '座位選擇頁' },
  { id: 'checkout', name: '結帳頁' },
];

// 設計稿來回修改：每輪設計師提出一個問題
export const REVIEWS = [
  {
    who: 'designer', mood: 'happy',
    text: '我覺得購票按鈕可以再圓一點、更醒目，你覺得呢？',
    options: [
      { label: '同意，圓角加大', fx: { team: 8, quality: 3 }, radius: 14 },
      { label: '先維持原樣，因為座位小格子太圓會擠', fx: { quality: 5, team: -3 } },
      { label: '問她：有沒有 hover 和 disabled 狀態的設計？', fx: { quality: 8, team: 3 } },
    ],
  },
  {
    who: 'designer', mood: 'worried',
    text: '結帳頁的錯誤提示我還沒畫……你先自己決定吧？',
    options: [
      { label: '好，我先做紅色文字，之後再對', fx: { progress: 3, quality: -3, stress: -3 } },
      { label: '請她補畫錯誤狀態，再開工', fx: { quality: 8, team: 2, stress: 5 } },
    ],
  },
];

// 上線前後的突發事件，隨機抽 2 個
export const EVENTS = [
  {
    who: 'lead', mood: 'surprised',
    text: '不好了！開賣瞬間流量暴增，頁面載入變很慢，客服電話被打爆！',
    options: [
      { label: '加載入骨架畫面與重試按鈕，緊急上線', fx: { quality: 8, stress: 10 } },
      { label: '先觀察，等後端擴容', fx: { quality: -8, stress: 5, team: -3 } },
    ],
  },
  {
    who: 'qa', mood: 'worried',
    text: '有兩位使用者同時搶到同一個座位，其中一人結帳失敗在客訴……',
    options: [
      { label: '提交前再向後端確認座位，並提示「座位已被選走」', fx: { quality: 10, stress: 8 } },
      { label: '先回覆客服說是個案', fx: { quality: -10, team: -5 } },
    ],
  },
  {
    who: 'designer', mood: 'happy',
    text: '上線前再改一下，主按鈕換位置好嗎？拜託拜託～',
    options: [
      { label: '接受，加班改完', fx: { team: 8, stress: 12, progress: -3 } },
      { label: '協商：放下個 sprint', fx: { team: -5, stress: -5 } },
    ],
  },
  {
    who: 'pm', mood: 'happy',
    text: '臨時插單！加一顆分享到社群的按鈕，今天要上喔～',
    options: [
      { label: '用最簡單的分享連結做完', fx: { progress: 5, quality: -3, stress: 6 } },
      { label: '評估後說明風險，排到明天', fx: { quality: 5, team: -3, stress: -3 } },
    ],
  },
];

export const RANKS = [
  [85, '🏆 王牌工程師', '你把訂票網站穩穩地上線了，團隊都想跟你共事。'],
  [65, '👍 可靠的前端', '大部分事情都處理得不錯，還有進步空間。'],
  [40, '😅 還在適應中', '這一天很混亂，但你學到不少。'],
  [0, '🚨 需要喘口氣', '壓力太大或品質掉太多，下次試試更早溝通。'],
];
