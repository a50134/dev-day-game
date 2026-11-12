// 每一部開始之前，專案裡已經有哪些檔案 ＝ 把前面每一部劇本的 code 動作依序套用的結果。

// 剛用 Vite 範本建好、清掉預設樣式之後的樣子（第 1 部之後）
export const SCAFFOLD = {
  'vite.config.ts': "import react from '@vitejs/plugin-react'\nimport { defineConfig } from 'vite'\n\n// https://vite.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n})\n",
  'src/index.css': '',
};

export function filesAfter(scripts, upto) {
  const files = { ...SCAFFOLD };
  for (let e = 0; e < upto; e++) {
    const sc = scripts[e];
    for (const b of sc.beats) if (b.code) files[b.code.file] = b.code.text;
  }
  return files;
}
