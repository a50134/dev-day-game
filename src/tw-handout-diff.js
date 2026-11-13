// 講義用：比較「同一個檔案」前後兩個版本，找出新版裡「新增或修改」的行（用最長共同子序列，不需要外部套件）。
// 沒有用到瀏覽器功能，可以直接用 node 測試。
export function addedLines(oldCode, newCode) {
  const a = oldCode.replace(/\n+$/, '').split('\n'), b = newCode.replace(/\n+$/, '').split('\n');
  const n = a.length, m = b.length;
  // dp[i][j]：a 從 i 開始、b 從 j 開始的最長共同子序列長度
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const same = new Set();
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { same.add(j); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
  }
  const added = new Set();
  for (let k = 0; k < m; k++) if (!same.has(k) && b[k].trim() !== '') added.add(k);   // 空行不標
  return added;
}

// 圖片路徑：從程式碼裡找出所有 "/images/…"（含檔名有空白的，例如 logo_on light.svg）
export function imagePathsOf(code) {
  const out = new Set();
  for (const m of code.matchAll(/["'(`]\/(images\/[^"'`)\n]+)["'`)]/g)) out.add(m[1]);
  return [...out];
}
