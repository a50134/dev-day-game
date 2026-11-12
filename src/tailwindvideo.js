// Tailwind v4 + React + TypeScript「I need this」首頁影片式教學（13 部）。
// 程式碼在 tw-react-code.js，講解在 tw-react-1/2/3.js（由 tw-episodes.js 合併）；播放器共用 video-player.js，
// 概念動畫在 video-anim.js，即時預覽是 tw-preview.html（會在 iframe 裡真的執行教學的程式碼）。
import { startPlayer } from './video-player.js';
import { ANIMS } from './video-anim.js';
import { EPISODES } from './tw-episodes.js';

export { EPISODES };

if (typeof document !== 'undefined') startPlayer(EPISODES, 'twreactvideo', { preview: 'tw-preview.html', anims: ANIMS });
