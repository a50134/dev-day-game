// 假 API 資料：預覽 iframe 內的 fetch 會依路徑回傳這裡的內容
const rows = ['A', 'B', 'C', 'D'];
const sold = ['A2', 'B3', 'B4', 'C1', 'D5'];

export const FIXTURES = {
  '/api/events': [
    { id: 1, title: '星光巡迴演唱會', date: '2026-12-20', venue: '台北大巨蛋', price: 3800 },
    { id: 2, title: '回到那一天 2027', date: '2027-01-10', venue: '高雄巨蛋', price: 2800 },
    { id: 3, title: '交響樂之夜', date: '2027-02-14', venue: '國家音樂廳', price: 1800 },
  ],
  '/api/seats': rows.flatMap((r) =>
    [1, 2, 3, 4, 5].map((n) => ({ id: r + n, sold: sold.includes(r + n) }))
  ),
  '/api/cart': { count: 2, price: 1800 },
};
