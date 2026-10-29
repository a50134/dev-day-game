import { FIXTURES } from './fixtures.js';

// QA 檢查：回傳失敗訊息陣列，空陣列＝通過
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function makeCtx(iframe, tokens) {
  const win = iframe.contentWindow;
  const doc = iframe.contentDocument;
  const t = (id) => doc.querySelector(`[data-testid="${id}"]`);
  const ta = (id) => [...doc.querySelectorAll(`[data-testid="${id}"]`)];
  const rgb = (c) => {
    const s = doc.createElement('span');
    s.style.color = c;
    doc.body.append(s);
    const v = win.getComputedStyle(s).color;
    s.remove();
    return v;
  };
  const bg = (el) => win.getComputedStyle(el).backgroundColor;
  const type = async (el, v) => {
    Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set.call(el, v);
    el.dispatchEvent(new win.Event('input', { bubbles: true }));
    await wait(60);
  };
  const click = async (el) => { el.click(); await wait(60); };
  // 等到 fn() 為真（最多 ms 毫秒）；串接真的 API 要等網路，所以檢查前先等
  const waitFor = async (fn, ms = 7000) => { for (let t0 = Date.now(); Date.now() - t0 < ms; await wait(150)) { try { if (fn()) return true; } catch (e) { /* 元素還沒出現 */ } } return false; };
  return { win, doc, t, ta, rgb, bg, type, click, tokens, wait, waitFor };
}

const num = (el) => Number((el?.textContent.match(/\d+/) || [NaN])[0]);

const checks = {
  async list(c) {
    const f = [];
    const cards = c.ta('event-card');
    const evs = FIXTURES['/api/events'];
    if (cards.length !== evs.length) return [`活動列表應有 ${evs.length} 張卡片（data-testid="event-card"），目前 ${cards.length} 張`];
    evs.forEach((e, i) => {
      const txt = cards[i].textContent.replace(/,/g, '');
      if (!txt.replace(/\s/g, '').includes(e.title.replace(/\s/g, ''))) f.push(`第 ${i + 1} 張卡片缺少標題「${e.title}」（你的卡片內容：「${txt.trim().slice(0, 40)}」）`);
      if (!txt.includes(String(e.price))) f.push(`第 ${i + 1} 張卡片缺少價格 ${e.price}`);
    });
    const btns = c.ta('book-btn');
    if (btns.length !== evs.length) f.push(`每張卡片都要有購票按鈕（data-testid="book-btn"），目前 ${btns.length} 個`);
    else if (btns.some((b) => c.bg(b) !== c.rgb(c.tokens.primary))) f.push(`購票按鈕背景應為設計師的主色 ${c.tokens.primary}（試試 var(--primary)）`);
    const font = c.win.getComputedStyle(c.doc.body).fontFamily.replace(/["']/g, '');
    if (!font.startsWith(c.tokens.font.replace(/["']/g, '').split(',')[0])) f.push('頁面字體跟設計稿不一致，不要刪掉 css 裡的設計變數');
    return f;
  },

  async seats(c) {
    const f = [];
    const seats = c.ta('seat');
    const all = FIXTURES['/api/seats'];
    if (seats.length !== all.length) return [`應有 ${all.length} 個座位（data-testid="seat"），目前 ${seats.length} 個`];
    const soldN = all.filter((s) => s.sold).length;
    if (seats.filter((s) => s.disabled).length !== soldN) f.push(`已售出的 ${soldN} 個座位必須 disabled`);
    const free = seats.filter((s) => !s.disabled);
    await c.click(free[0]);
    if (free[0].getAttribute('aria-pressed') !== 'true') f.push('點選座位後 aria-pressed 應為 true');
    else if (c.bg(free[0]) !== c.rgb(c.tokens.primary)) f.push('已選座位背景應為主色（var(--primary)）');
    await c.click(free[1]);
    if (num(c.t('selected-count')) !== 2) f.push('選兩個座位後，selected-count 應顯示 2');
    await c.click(free[0]);
    if (free[0].getAttribute('aria-pressed') === 'true' || num(c.t('selected-count')) !== 1) f.push('再點一次已選座位應取消選取');
    return f;
  },

  async checkout(c) {
    const f = [];
    const { count, price } = FIXTURES['/api/cart'];
    if (!c.t('total')?.textContent.replace(/,/g, '').includes(String(count * price))) return [`總額應顯示 ${count * price}（data-testid="total"）`];
    const form = c.t('checkout-form'), name = c.t('name'), email = c.t('email');
    if (!form || !name || !email) return ['缺少 checkout-form / name / email（data-testid）'];
    form.requestSubmit(); await wait(60);
    if (!c.t('error')?.textContent.trim()) f.push('姓名空白送出時，應顯示錯誤訊息（data-testid="error"）');
    await c.type(name, '小明'); await c.type(email, 'abc');
    form.requestSubmit(); await wait(60);
    if (!c.t('error')?.textContent.trim() || c.t('success')) f.push('Email 沒有 @ 時應顯示錯誤，且不能成功');
    await c.type(email, 'a@b.co');
    form.requestSubmit(); await wait(60);
    if (!c.t('success')) f.push('資料正確時應顯示 data-testid="success"');
    else if (c.t('error')) f.push('成功後不應還有錯誤訊息');
    return f;
  },
};

export async function runCheck(id, iframe, tokens) {
  await wait(600); // 等 React 掛載與假 fetch
  if (iframe.contentWindow.__error) return [`程式錯誤：${iframe.contentWindow.__error}`];
  try {
    return await checks[id](makeCtx(iframe, tokens));
  } catch (e) {
    return [`檢查時出錯（通常是缺少必要元素）：${e.message}`];
  }
}
