// 우리 색·리듬에 맞는 Lottie 애니메이션을 직접 만든다 (외부 에셋 라이선스 문제 없이).
// 사용: node scripts/make-lottie.mjs  →  public/lottie/wave.json
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const FPS = 30;
const FRAMES = 60; // 2초 반복
const BARS = 7;
const WIDTH = 120;
const HEIGHT = 48;
const BAR_W = 8;
const GAP = (WIDTH - BARS * BAR_W) / (BARS - 1);
const BLUE = [0.192, 0.51, 0.965, 1]; // #3182F6

/** 막대 하나의 높이가 오르내리는 키프레임 */
function heights(seed) {
  const steps = [0.35, 1, 0.55, 0.85, 0.35];
  return steps.map((ratio, i) => ({
    t: Math.round((i / (steps.length - 1)) * FRAMES),
    // 막대마다 리듬을 조금씩 어긋나게 해서 파형처럼 보이게
    v: Math.max(6, Math.round(HEIGHT * ratio * (0.6 + 0.4 * Math.sin(seed + i)))),
  }));
}

function bar(index) {
  const frames = heights(index * 1.7);
  const x = index * (BAR_W + GAP) + BAR_W / 2;
  const size = (key) => ({
    a: 1,
    k: frames.map((f, i) => ({
      t: f.t,
      s: [BAR_W, f.v],
      ...(i < frames.length - 1 ? { i: { x: [0.4, 0.4], y: [1, 1] }, o: { x: [0.6, 0.6], y: [0, 0] } } : {}),
    })),
    ix: key,
  });
  return {
    ty: 4,
    nm: `bar-${index}`,
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      p: { a: 0, k: [x, HEIGHT / 2, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    ao: 0,
    ip: 0,
    op: FRAMES,
    st: 0,
    bm: 0,
    shapes: [
      {
        ty: "gr",
        it: [
          { ty: "rc", d: 1, s: size(2), p: { a: 0, k: [0, 0] }, r: { a: 0, k: BAR_W / 2 }, nm: "rect" },
          { ty: "fl", c: { a: 0, k: BLUE }, o: { a: 0, k: 100 }, r: 1, nm: "fill" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, o: { a: 0, k: 100 } },
        ],
        nm: `group-${index}`,
      },
    ],
  };
}

const animation = {
  v: "5.7.4",
  fr: FPS,
  ip: 0,
  op: FRAMES,
  w: WIDTH,
  h: HEIGHT,
  nm: "voice-wave",
  ddd: 0,
  assets: [],
  layers: Array.from({ length: BARS }, (_, i) => bar(i)),
};

const out = path.resolve("public/lottie/wave.json");
await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, JSON.stringify(animation));
console.log(`Wrote ${out}`);
