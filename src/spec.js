// 設計規格頁（Figma Dev Mode / Stitch 風格）：色彩、字體、間距、元件規格
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Tailwind 速查：規格上的數字 → class。1 單位 = 4px
export function twHtml(lv) {
  const row = (a, b) => `<tr><td>${a}</td><td><code>${esc(b)}</code></td></tr>`;
  return `<div class="spec">
  <h4>Tailwind 對照 <small>在 className 裡寫，例如 className="p-3 text-sm"</small></h4>
  <h5>先記這個</h5>
  <p>數字 × 4 = px：<code>p-3</code> = 12px、<code>gap-2</code> = 8px、<code>mt-4</code> = 16px。<code>p</code> 內距、<code>m</code> 外距、<code>gap</code> 間隔；加 <code>x/y/t/b</code> 指定方向（<code>px-4</code> 左右、<code>mt-2</code> 上）。</p>
  <h5>字級與粗細</h5>
  <table>${row('28px', 'text-[28px]')}${row('20px', 'text-xl')}${row('18px', 'text-lg')}${row('16px', 'text-base')}${row('14px', 'text-sm')}
  ${row('粗體 700', 'font-bold')}${row('半粗 600', 'font-semibold')}${row('一般 400', 'font-normal')}</table>
  <h5>間距（內距 p / 外距 m / gap）</h5>
  <table>${row('4px', '1')}${row('8px', '2')}${row('12px', '3')}${row('16px', '4')}${row('24px', '6')}</table>
  <h5>色彩、圓角、狀態</h5>
  <table>${row('主色底', 'bg-[var(--primary)]')}${row('白字', 'text-white')}${row('文字 #666', 'text-[#666]')}${row('邊框 1px #ddd', 'border border-[#ddd]')}${row('圓角（設計變數）', 'rounded-[var(--radius)]')}
  ${row('停用時', 'disabled:bg-[#ccc]')}${row('被按下 (aria-pressed)', 'aria-[pressed=true]:bg-[var(--primary)]')}${row('滑過', 'hover:opacity-90')}</table>
  <p>中括號 <code>[ ]</code> = 自己指定的值，不在內建刻度裡時用。</p>
  <h5>${esc(lv.title)}：每個元件可直接用</h5>
  ${lv.components.filter((c) => c.tw).map((c) => `<div class="comp"><b>${esc(c.name)}</b><br><code>${esc(c.tw)}</code></div>`).join('')}
  <p>styles.css 和 Tailwind class 可以混用；同一個屬性兩邊都寫時，以 class 為準。</p>
</div>`;
}

export function specHtml(lv, t) {
  const colors = [
    ['Primary 主色', t.primary, 'var(--primary)'],
    ['Text 文字', '#222222', 'body'],
    ['Text Muted 次要', '#666666', '14px 說明'],
    ['Border 邊框', '#dddddd', 'card / input'],
    ['Disabled 停用', '#cccccc', '已售座位'],
    ['Error 錯誤', '#dc2626', '.error'],
  ];
  const type = [['H1', 28, 700], ['Heading 3', 18, 600], ['Body', 16, 400], ['Caption', 14, 400]];
  return `<div class="spec">
  <h4>Frame · ${esc(lv.title)} <small>桌面 / 內距 24px</small></h4>
  <h5>Colors</h5>
  <div class="sw">${colors.map(([n, hex, use]) => `<div><i style="background:${hex}"></i><b>${n}</b><code>${hex.toUpperCase()}</code><small>${use}</small></div>`).join('')}</div>
  <h5>Typography</h5>
  <p><code>font-family: ${esc(t.font)}</code></p>
  <table>${type.map(([n, s, w]) => `<tr><td style="font-family:${esc(t.font)};font-size:${s}px;font-weight:${w}">Aa 活動</td><td>${n}</td><td>${s}px / ${w}</td></tr>`).join('')}</table>
  <h5>Spacing & Radius</h5>
  <p>間距刻度 <code>4 · 8 · 12 · 16 · 24</code>　圓角 <code>--radius: ${t.radius}px</code></p>
  <h5>Components</h5>
  ${lv.components.map((c) => `<div class="comp"><b>${esc(c.name)}</b>
    ${c.cls ? `<code>${esc(c.cls)}</code>` : ''}${c.testid ? `<code>data-testid="${esc(c.testid)}"</code>` : ''}
    <ul>${c.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>`).join('')}
  <h5>Data</h5>
  <p><code>${esc(lv.api)}</code></p>
</div>`;
}

// Bootstrap 速查：規格上的數字 → class
export function bsHtml(lv) {
  const row = (a, b) => `<tr><td>${a}</td><td><code>${esc(b)}</code></td></tr>`;
  return `<div class="spec">
  <h4>Bootstrap 對照 <small>在 className 裡寫，例如 className="btn text-white"</small></h4>
  <h5>先記這個</h5>
  <p>Bootstrap 提供「現成元件」（<code>btn</code> 按鈕、<code>form-control</code> 輸入框）和小工具 class。主色與圓角要用我們的設計變數，所以寫在 styles.css（<code>background: var(--primary)</code>），不要用 <code>btn-primary</code>（那是 Bootstrap 自己的藍色）。</p>
  <h5>字級（fs-數字）</h5>
  <table>${row('28px', 'fs-3')}${row('20px', 'fs-5')}${row('16px', 'fs-6')}${row('14px', 'small')}${row('粗體 700', 'fw-bold')}${row('半粗 600', 'fw-semibold')}</table>
  <h5>間距（p 內距 / m 外距 / gap）</h5>
  <table>${row('4px', '1')}${row('8px', '2')}${row('16px', '3')}${row('24px', '4')}${row('48px', '5')}</table>
  <p>例：<code>mt-3</code> = 上外距 16px、<code>p-2</code> = 內距 8px。刻度沒有 12px，要 12px 就寫在 styles.css。</p>
  <h5>版面與色彩</h5>
  <table>${row('橫排 / 直排', 'd-flex / d-flex flex-column')}${row('格狀', 'd-grid')}${row('邊框 / 圓角', 'border / rounded')}${row('白字', 'text-white')}${row('灰字', 'text-secondary')}${row('紅字', 'text-danger')}</table>
  <h5>${esc(lv.title)}：每個元件可直接用</h5>
  ${lv.components.filter((c) => c.bs).map((c) => `<div class="comp"><b>${esc(c.name)}</b><br><code>${esc(c.bs)}</code></div>`).join('')}
  <p>styles.css 和 Bootstrap class 可以混用；同一個屬性兩邊都寫時，styles.css 會蓋過 Bootstrap。</p>
</div>`;
}
