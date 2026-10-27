// 存檔：進度、選擇與每一關的程式都放在瀏覽器 localStorage
export const store = {
  get: (k) => { try { return JSON.parse(localStorage.getItem('ddg-' + k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem('ddg-' + k, JSON.stringify(v)); } catch {} },
  clear: () => { try { Object.keys(localStorage).filter((k) => k.startsWith('ddg-')).forEach((k) => localStorage.removeItem(k)); } catch {} },
};
