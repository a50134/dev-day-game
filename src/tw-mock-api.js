// 預覽用的「假六角 API」：欄位與回應格式照六角 swagger 與實際回應（products 是陣列）。
// 只在教學預覽裡使用；教學的程式碼本身仍然是呼叫真的 API。
import axios from 'axios';

const IMG = new URL('../tw-assets/images/', import.meta.url).href;
const HOT = [
  ['香氛蠟燭', '「不只是香氣，還是生活裡的儀式感。」', 480, 580, 'product-img-04.jpg'],
  ['擴香瓶', '「不用點燃，就能為家帶來溫柔香氣。」', 680, 780, 'product-img-03.jpg'],
  ['手工皂套組', '「一塊手工皂，洗去一天的疲憊。」', 360, 420, 'product-img-02.jpg'],
  ['精油薰香（兩入）', '「空氣裡的療癒魔法。」', 520, 620, 'product-img-01.jpg'],
];
const products = HOT.map(([title, description, price, origin_price, img], i) => ({
  id: 'p' + (i + 1), title, category: '熱賣', description, content: description, price, origin_price,
  unit: '件', is_enabled: 1, num: 1, imageUrl: IMG + img, imagesUrl: [IMG + img],
}));

// mode：ok 正常、empty 沒有商品、error 連線失敗、slow 很慢（看得到「讀取中」）
export function installMock(mode = 'ok') {
  const carts = [];
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  axios.defaults.adapter = async (config) => {
    await delay(mode === 'slow' ? 4000 : 500);
    const url = (config.url || '').replace(/^\//, '');
    const reply = (data, status = 200) => ({ data, status, statusText: 'OK', headers: {}, config, request: {} });
    if (mode === 'error') throw Object.assign(new Error('Network Error'), { config, isAxiosError: true });
    if (url === 'products') {
      const category = config.params?.category || '';
      const list = mode === 'empty' ? [] : products.filter((p) => !category || p.category === category);
      return reply({ success: true, products: list, pagination: { total_pages: list.length ? 1 : 0, current_page: list.length ? 1 : 0, has_pre: false, has_next: false, category } });
    }
    if (url === 'cart' && (config.method || 'get') === 'get') {
      return reply({ success: true, data: { carts, total: carts.reduce((s, c) => s + c.total, 0), final_total: carts.reduce((s, c) => s + c.final_total, 0) }, messages: [] });
    }
    if (url === 'cart' && config.method === 'post') {
      const { product_id, qty } = JSON.parse(config.data).data;
      const product = products.find((p) => p.id === product_id);
      const hit = carts.find((c) => c.product_id === product_id);
      if (hit) { hit.qty += qty; hit.total = hit.final_total = hit.qty * product.price; }
      else carts.push({ id: 'c' + (carts.length + 1), product_id, qty, total: qty * product.price, final_total: qty * product.price, product });
      return reply({ success: true, message: '已加入購物車', data: carts.at(-1) });
    }
    return reply({ success: false, message: 'not found' }, 404);
  };
}
