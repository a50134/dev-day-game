// Tailwind v4 + React + TypeScript「I need this」首頁影片式教學（13 部）。
// 程式碼在 tw-react-code.js，講解在 tw-react-1/2/3.js；播放器共用 video-player.js。
import { startPlayer } from './video-player.js';
import { EPISODES_1 } from './tw-react-1.js';
import { EPISODES_2 } from './tw-react-2.js';
import { EPISODES_3 } from './tw-react-3.js';

export const EPISODES = [...EPISODES_1, ...EPISODES_2, ...EPISODES_3];

if (typeof document !== 'undefined') startPlayer(EPISODES, 'twreactvideo');
