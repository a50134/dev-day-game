// 3D 可愛辦公室（Three.js，低多邊形）。格子座標 (x, y) 對應世界座標 (x, 0, y)。
// 角色用球體、膠囊與小零件組成，會走路、擺手、跳一下；頭上有 ❗／💬 標記與名牌。
import { ROLES } from './chars.js';

let T; // three 模組
const load = () => (T ? Promise.resolve(T) : import('https://esm.sh/three@0.160.0').then((m) => (T = m)));

const css = (c) => c; // 顏色字串直接給 three 使用

export async function createOffice3D(box, { W, H, OBJ, DECOR, marks, nameOf, start, zoom = 1 }) {
  const THREE = await load();
  const canvas = document.createElement('canvas');
  box.prepend(canvas);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch (e) { canvas.remove(); throw e; }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0xfff3e6);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
  const lookAt = new THREE.Vector3((W - 1) / 2, zoom < 1 ? 0.8 : 0.3, (H - 1) / 2 + 0.3);
  const CAM = new THREE.Vector3((W - 1) / 2, 8.9, H + 5.9).sub(lookAt).multiplyScalar(zoom).add(lookAt); // zoom<1：小舞台拉近鏡頭

  // 光線：柔和半球光 + 一盞帶陰影的主光
  scene.add(new THREE.HemisphereLight(0xffffff, 0xffe3d0, 1.25));
  const sun = new THREE.DirectionalLight(0xffffff, 0.5);
  sun.position.set(W / 2 + 4, 12, H / 2 + 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 10, bottom: -10, near: 1, far: 40 });
  sun.target.position.set((W - 1) / 2, 0, (H - 1) / 2);
  scene.add(sun, sun.target);

  // 卡通色階
  const gm = new THREE.DataTexture(new Uint8Array([165, 215, 255]), 3, 1, THREE.RedFormat);
  gm.minFilter = gm.magFilter = THREE.NearestFilter; gm.needsUpdate = true;
  const toon = (color, extra = {}) => new THREE.MeshToonMaterial({ color: css(color), gradientMap: gm, ...extra });
  const mesh = (geo, color, x = 0, y = 0, z = 0, opt = {}) => {
    const m = new THREE.Mesh(geo, opt.mat || toon(color));
    m.position.set(x, y, z);
    m.castShadow = opt.cast !== false; m.receiveShadow = true;
    return m;
  };
  const box3 = (w, h, d, color, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), color, x, y, z);
  const sph = (r, color, x, y, z, sx = 1, sy = 1, sz = 1) => { const m = mesh(new THREE.SphereGeometry(r, 20, 14), color, x, y, z); m.scale.set(sx, sy, sz); return m; };
  const cyl = (rt, rb, h, color, x, y, z) => mesh(new THREE.CylinderGeometry(rt, rb, h, 16), color, x, y, z);

  // 文字／emoji 貼圖（名牌、標記、招牌）
  const textSprite = (text, { size = 64, w = 256, h = 80, bg = null, color = '#444', font = 'bold 34px "Noto Sans TC", sans-serif', scale = 1 } = {}) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d');
    if (bg) { g.fillStyle = bg; g.beginPath(); g.roundRect(4, 8, w - 8, h - 16, 24); g.fill(); }
    g.font = size ? font : font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = color;
    g.fillText(text, w / 2, h / 2 + 2);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    sp.scale.set((w / 100) * scale, (h / 100) * scale, 1); sp.renderOrder = 10;
    return sp;
  };

  /* ---------------- 房間 ---------------- */
  const cx = (W - 1) / 2, cz = (H - 1) / 2;
  const floorTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'); g.fillStyle = '#ffe9d6'; g.fillRect(0, 0, 128, 128);
    g.fillStyle = '#fff4e8'; g.fillRect(0, 0, 64, 64); g.fillRect(64, 64, 64, 64);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(W / 2, H / 2); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const floor = mesh(new THREE.BoxGeometry(W + 1, 0.3, H + 1), 0xffffff, cx, -0.15, cz, { mat: toon(0xffffff, { map: floorTex }), cast: false });
  scene.add(floor);
  // 後牆與左牆（右牆留出教室門，前面不擋視線）
  const wallColor = '#ffe3da';
  scene.add(box3(W + 1.4, 2.4, 0.3, wallColor, cx, 1.2, -0.65));
  scene.add(box3(0.3, 2.4, H + 1, wallColor, -0.65, 1.2, cz));
  scene.add(box3(0.3, 2.4, H + 1, wallColor, W - 0.35, 1.2, cz));
  scene.add(box3(W + 1.4, 0.18, 0.34, '#ffb7a5', cx, 0.09, -0.62)); // 踢腳板
  for (const wx of [2.2, 6.4, 10.6]) { // 窗戶
    scene.add(box3(1.9, 1.05, 0.06, '#bfe6ff', wx, 1.35, -0.47));
    scene.add(box3(1.98, 0.08, 0.1, '#fff', wx, 1.35, -0.45), box3(0.06, 1.05, 0.1, '#fff', wx, 1.35, -0.45));
  }
  const rug = cyl(2.2, 2.2, 0.03, '#ffc2d1', cx, 0.02, cz + 0.4); rug.scale.z = 0.7; rug.castShadow = false; scene.add(rug);

  /* ---------------- 擺設 ---------------- */
  const props = [];
  const at = (g, x, z) => { g.position.x += x; g.position.z += z; scene.add(g); props.push(g); return g; };
  const plant = () => { const g = new THREE.Group(); g.add(cyl(0.2, 0.15, 0.3, '#e08e6b', 0, 0.15, 0), sph(0.28, '#6cc788', 0, 0.55, 0), sph(0.2, '#8adba0', 0.12, 0.78, 0.04)); return g; };
  const coffee = () => { const g = new THREE.Group(); g.add(cyl(0.34, 0.34, 0.05, '#ffffff', 0, 0.5, 0), cyl(0.05, 0.05, 0.5, '#d9a47a', 0, 0.25, 0), cyl(0.09, 0.07, 0.14, '#ffffff', 0.08, 0.59, 0), cyl(0.075, 0.075, 0.02, '#7b4a2d', 0.08, 0.655, 0)); return g; };
  const shelf = () => { const g = new THREE.Group(); g.add(box3(0.8, 1.7, 0.4, '#d9a47a', 0, 0.85, 0)); ['#ff8fa3', '#7c9cff', '#ffd166', '#6ccf9c'].forEach((c, i) => { g.add(box3(0.16, 0.34, 0.08, c, -0.27 + i * 0.18, 1.2, 0.2)); g.add(box3(0.16, 0.3, 0.08, c, -0.27 + i * 0.18, 0.7, 0.2)); }); return g; };
  const printer = () => { const g = new THREE.Group(); g.add(box3(0.8, 0.4, 0.6, '#c9c3e0', 0, 0.55, 0), box3(0.9, 0.7, 0.6, '#9aa0c8', 0, 0.35, 0), box3(0.5, 0.03, 0.3, '#fff', 0, 0.78, 0.1)); return g; };
  const sofa = () => { const g = new THREE.Group(); g.add(box3(1.1, 0.35, 0.6, '#9fd3c7', 0, 0.2, 0), box3(1.1, 0.5, 0.15, '#7fbfb0', 0, 0.5, -0.22), box3(0.15, 0.45, 0.6, '#7fbfb0', -0.5, 0.3, 0), box3(0.15, 0.45, 0.6, '#7fbfb0', 0.5, 0.3, 0)); return g; };
  const maker = { '🪴': plant, '☕': coffee, '📚': shelf, '🖨️': printer, '🛋️': sofa };
  DECOR.forEach(([x, y, e]) => maker[e] && at(maker[e](), x, y));

  const desk = (withLaptop) => {
    const g = new THREE.Group();
    g.add(box3(1.0, 0.08, 0.62, '#e3b48a', 0, 0.62, 0), box3(0.08, 0.6, 0.5, '#d19f74', -0.42, 0.3, 0), box3(0.08, 0.6, 0.5, '#d19f74', 0.42, 0.3, 0));
    if (withLaptop) { g.add(box3(0.4, 0.02, 0.28, '#cfd8e6', 0, 0.67, 0.05), box3(0.4, 0.28, 0.02, '#4a5a78', 0, 0.82, -0.08), box3(0.34, 0.22, 0.01, '#8fd3ff', 0, 0.82, -0.065)); }
    return g;
  };

  /* ---------------- 角色 ---------------- */
  const makeChar = (role) => {
    const r = ROLES[role] || ROLES.me;
    const g = new THREE.Group(); const rig = new THREE.Group(); g.add(rig);
    const body = mesh(new THREE.CapsuleGeometry(0.2, 0.22, 6, 12), r.shirt, 0, 0.5, 0);
    const head = new THREE.Group(); head.position.set(0, 0.98, 0);
    head.add(sph(0.3, '#ffe3cf', 0, 0, 0));
    // 髮型
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), toon(r.hair));
    cap.position.set(0, 0.03, -0.02); cap.castShadow = true; head.add(cap);
    const eye = (sx) => { const e = sph(0.045, '#2b2b2b', sx * 0.11, 0.02, 0.28); return e; };
    head.add(eye(-1), eye(1));
    head.add(sph(0.05, '#ffb3b3', -0.19, -0.07, 0.24, 1, 0.7, 0.4), sph(0.05, '#ffb3b3', 0.19, -0.07, 0.24, 1, 0.7, 0.4));
    const mouth = sph(0.035, '#d9546a', 0, -0.1, 0.285, 1.5, 0.6, 0.5); head.add(mouth);
    const ring = (x) => { const t = mesh(new THREE.TorusGeometry(0.075, 0.012, 8, 20), '#333', x, 0.03, 0.3, { cast: false }); return t; };
    switch (r.extra) {
      case 'headphones': { const t = mesh(new THREE.TorusGeometry(0.33, 0.03, 8, 24, Math.PI), '#444', 0, 0.02, 0); t.rotation.z = 0; head.add(t, cyl(0.07, 0.07, 0.07, '#444', -0.33, 0, 0), cyl(0.07, 0.07, 0.07, '#444', 0.33, 0, 0)); head.children.slice(-2).forEach((c) => (c.rotation.z = Math.PI / 2)); break; }
      case 'bun': head.add(sph(0.12, r.hair, 0, 0.33, -0.05)); break;
      case 'beret': { const b = sph(0.3, '#e8445c', 0, 0.22, 0, 1.1, 0.35, 1.1); head.add(b, sph(0.04, '#e8445c', 0, 0.36, 0)); break; }
      case 'glasses': head.add(ring(-0.11), ring(0.11)); break;
      case 'glassesBeard': head.add(ring(-0.11), ring(0.11), sph(0.14, '#b8b8c8', 0, -0.2, 0.2, 1.1, 0.8, 0.7)); break;
      case 'ponytail': head.add(sph(0.12, r.hair, 0.2, 0.05, -0.25)); break;
      default: break;
    }
    const arm = (sx) => { const a = new THREE.Group(); a.position.set(sx * 0.27, 0.68, 0); a.add(mesh(new THREE.CapsuleGeometry(0.06, 0.2, 4, 8), r.shirt, 0, -0.14, 0), sph(0.07, '#ffe3cf', 0, -0.3, 0)); return a; };
    const leg = (sx) => { const l = new THREE.Group(); l.position.set(sx * 0.1, 0.3, 0); l.add(cyl(0.07, 0.07, 0.22, '#5a6a8a', 0, -0.1, 0), sph(0.09, '#fff', 0, -0.22, 0.03, 1, 0.6, 1.3)); return l; };
    const aL = arm(-1), aR = arm(1), lL = leg(-1), lR = leg(1);
    rig.add(body, head, aL, aR, lL, lR);
    g.scale.setScalar(1.3); // 大頭小身體的可愛比例
    g.userData = { rig, head, aL, aR, lL, lR, role };
    return g;
  };
  const animate = (g, t, { walking, hop, seed }) => {
    const u = g.userData, w = t * 11, s = t * 1.7 + seed, p = u.pose;
    hop = hop || p === 'wave';
    u.lL.rotation.x = walking ? Math.sin(w) * 0.7 : 0; u.lR.rotation.x = walking ? -Math.sin(w) * 0.7 : 0;
    u.aL.rotation.x = walking ? -Math.sin(w) * 0.8 : Math.sin(s) * 0.05; u.aR.rotation.x = walking ? Math.sin(w) * 0.8 : -Math.sin(s) * 0.05;
    if (hop) u.aR.rotation.z = -2.4 + Math.sin(t * 9) * 0.35; else u.aR.rotation.z = 0; // 要找的人會揮手
    u.rig.position.y = walking ? Math.abs(Math.sin(w)) * 0.07 : hop ? Math.abs(Math.sin(t * 3 + seed)) * 0.1 : Math.sin(s) * 0.012;
    u.head.rotation.z = Math.sin(s * 0.8) * 0.05;
    // 姿勢：type 打字、cheer 歡呼、sad 垂頭喪氣、wave 揮手
    u.head.rotation.x = p === 'sad' ? 0.35 : 0; u.aL.rotation.z = 0;
    if (p === 'type' && !walking) { u.aL.rotation.x = -1.2 + Math.sin(t * 13) * 0.12; u.aR.rotation.x = -1.2 + Math.sin(t * 13 + 2) * 0.12; }
    else if (p === 'cheer') { u.aL.rotation.z = 2.4 + Math.sin(t * 8) * 0.3; u.aR.rotation.z = -2.4 - Math.sin(t * 8) * 0.3; u.rig.position.y = Math.abs(Math.sin(t * 6)) * 0.15; }
    else if (p === 'sad') { u.aL.rotation.x = u.aR.rotation.x = 0.1; u.rig.position.y = -0.02; }
  };

  /* ---------------- 放置物件與人物 ---------------- */
  const npcs = [], byId = {};
  OBJ.forEach((o, i) => {
    if (o.role) {
      const g = new THREE.Group(); g.position.set(o.x, 0, o.y); scene.add(g);
      const d = desk(true); d.position.z = 0.28; g.add(d);
      const c = makeChar(o.role); c.position.z = -0.12; g.add(c);
      const lbl = textSprite(nameOf(o), { w: 200, h: 64, size: 1, font: 'bold 30px "Noto Sans TC", sans-serif', bg: 'rgba(255,255,255,.92)', scale: 0.72 }); lbl.position.set(0, 2.0, 0.1); g.add(lbl);
      const mk = marks[o.id];
      let mark = null;
      if (mk) { mark = textSprite(mk, { w: 96, h: 96, font: '60px "Noto Color Emoji", "Segoe UI Emoji", sans-serif', bg: 'rgba(255,255,255,.95)', scale: 0.55 }); mark.position.set(0, 2.5, 0.1); g.add(mark); }
      byId[o.id] = npcs[npcs.push({ g, c, mark, base: 2.5, hop: mk === '❗', seed: i * 1.3 }) - 1];
    } else if (o.id === 'desk') {
      const g = new THREE.Group(); g.position.set(o.x, 0, o.y); scene.add(g);
      const d = desk(true); g.add(d);
      g.add(box3(0.4, 0.06, 0.4, '#9ec1ff', 0, 0.4, 0.55), box3(0.38, 0.4, 0.06, '#9ec1ff', 0, 0.62, 0.74)); // 椅子
      const lbl = textSprite('我的座位', { w: 200, h: 64, size: 1, font: 'bold 30px "Noto Sans TC", sans-serif', bg: 'rgba(255,255,255,.92)', scale: 0.72 }); lbl.position.set(0, 1.35, 0.2); g.add(lbl);
      if (marks[o.id]) { const m = textSprite(marks[o.id], { w: 96, h: 96, font: '60px "Noto Color Emoji", "Segoe UI Emoji", sans-serif', bg: 'rgba(255,255,255,.95)', scale: 0.55 }); m.position.set(0, 1.85, 0.2); g.add(m); npcs.push({ g: new THREE.Group(), mark: m, base: 1.85, seed: 0 }); }
    } else if (o.id === 'class') {
      const g = new THREE.Group(); g.position.set(o.x + 0.2, 0, o.y); scene.add(g);
      g.add(box3(0.16, 1.8, 1.2, '#8c6a4f', 0, 0.9, 0), box3(0.2, 1.6, 0.9, '#c98f5e', -0.04, 0.8, 0), sph(0.05, '#ffd166', -0.16, 0.8, 0.28));
      const s = textSprite('🏫 教室', { w: 220, h: 72, size: 1, font: 'bold 32px "Noto Sans TC", "Noto Color Emoji", sans-serif', bg: 'rgba(255,255,255,.95)', scale: 0.6 }); s.position.set(-0.3, 2.0, 0); g.add(s);
    } else if (o.id === 'board') {
      const g = new THREE.Group(); g.position.set(o.x, 0, o.y); scene.add(g);
      g.add(box3(1.5, 0.95, 0.06, '#ffffff', 0, 1.0, 0), box3(1.56, 0.04, 0.08, '#c9a98f', 0, 1.5, 0), box3(1.56, 0.04, 0.08, '#c9a98f', 0, 0.52, 0), box3(0.06, 0.55, 0.06, '#c9a98f', -0.6, 0.27, 0), box3(0.06, 0.55, 0.06, '#c9a98f', 0.6, 0.27, 0));
      [['#ffd166', -0.5, 1.2], ['#ff8fa3', -0.1, 1.2], ['#9fd3c7', 0.3, 1.2], ['#9ec1ff', -0.3, 0.85], ['#ffd166', 0.2, 0.85]].forEach(([c, x, y]) => g.add(box3(0.3, 0.26, 0.02, c, x, y, 0.045)));
      const s = textSprite('📋 任務看板', { w: 240, h: 72, size: 1, font: 'bold 32px "Noto Sans TC", "Noto Color Emoji", sans-serif', bg: 'rgba(255,255,255,.95)', scale: 0.6 }); s.position.set(0, 1.85, 0.1); g.add(s);
    }
  });

  // 主角
  const player = makeChar('me');
  player.position.set(start.x, 0, start.y);
  scene.add(player);
  byId.me = { g: player, c: player, mark: null, base: 1.9, seed: 0 };
  const tgt = { x: start.x, z: start.y };
  let face = 0;

  /* ---------------- 尺寸、迴圈 ---------------- */
  const resize = () => {
    const w = box.clientWidth || 720, h = box.clientHeight || 460;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize); ro.observe(box);

  const stats = { frames: 0, x: start.x, z: start.y, walking: false };
  window.__o3d = stats;
  let raf = 0, t = 0, last = performance.now(), dead = false;
  const camPos = CAM.clone(), camLook = lookAt.clone();
  const update = (dt) => {
    t += dt;
    // 主角往目標格子滑過去
    const dx = tgt.x - player.position.x, dz = tgt.z - player.position.z, dist = Math.hypot(dx, dz);
    const walking = dist > 0.02;
    if (walking) {
      const step = Math.min(dist, 6.5 * dt);
      player.position.x += (dx / dist) * step; player.position.z += (dz / dist) * step;
      face = Math.atan2(dx, dz);
    } else { player.position.x = tgt.x; player.position.z = tgt.z; }
    let d = face - player.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); player.rotation.y += d * Math.min(1, dt * 14);
    animate(player, t, { walking, hop: false, seed: 0 });
    const pm = byId.me.mark; if (pm) pm.position.y = 1.9 + Math.sin(t * 4) * 0.05;
    npcs.forEach((n) => {
      if (n.c) animate(n.c, t, { walking: false, hop: n.hop, seed: n.seed });
      if (n.mark) n.mark.position.y = n.base + Math.sin(t * 4 + n.seed) * 0.06;
    });
    // 鏡頭：微微跟著主角，並有一點呼吸般的晃動，增加立體感
    camPos.set(CAM.x + (player.position.x - cx) * 0.18 + Math.sin(t * 0.35) * 0.18, CAM.y + Math.sin(t * 0.5) * 0.06, CAM.z + (player.position.z - cz) * 0.1);
    camLook.set(lookAt.x + (player.position.x - cx) * 0.12, lookAt.y, lookAt.z + (player.position.z - cz) * 0.08);
    camera.position.lerp(camPos, Math.min(1, dt * 4)); camera.lookAt(camLook);
    renderer.render(scene, camera);
    stats.frames++; stats.x = player.position.x; stats.z = player.position.z; stats.walking = walking;
  };
  const tick = (now) => {
    if (dead) return;
    raf = requestAnimationFrame(tick);
    update(Math.min(0.05, (now - last) / 1000)); last = now;
  };
  stats.step = (dt) => update(dt); // 測試用：手動推進動畫（無頭瀏覽器不會自動播放影格）
  camera.position.copy(CAM); camera.lookAt(lookAt); renderer.render(scene, camera);
  raf = requestAnimationFrame(tick);

  return {
    setPlayer(x, y) { tgt.x = x; tgt.z = y; },
    setMark(id, emoji) { // 頭上的小標記（id 'me' 是主角），空字串清除
      const n = byId[id]; if (!n) return;
      if (n.mark) { n.g.remove(n.mark); n.mark = null; }
      if (emoji) { n.mark = textSprite(emoji, { w: 96, h: 96, font: '60px "Noto Color Emoji", "Segoe UI Emoji", sans-serif', bg: 'rgba(255,255,255,.95)', scale: 0.55 }); n.mark.position.set(0, n.base, 0.1); n.g.add(n.mark); }
    },
    setPose(id, pose) { const n = byId[id]; if (n) n.c.userData.pose = pose; },
    dispose() {
      dead = true; cancelAnimationFrame(raf); ro.disconnect();
      scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach((mm) => { mm.map?.dispose?.(); mm.dispose?.(); }); });
      renderer.dispose(); renderer.forceContextLoss?.(); canvas.remove();
    },
  };
}
