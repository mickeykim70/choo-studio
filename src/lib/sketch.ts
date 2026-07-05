import rough from 'roughjs';

// 빌드 타임 손그림 렌더러 — Rough.js 제너레이터로 도형→SVG path 문자열을 만든다.
// 클라이언트 JS 없이 정적 SVG에 심는다. seed를 고정하면 새로고침해도 흔들리지 않는다.
export const gen = rough.generator();

// 하나의 rough Drawable을 <path> 문자열들로 변환
export function draw(drawable: any, opts: { dash?: string } = {}): string {
  const o = drawable.options;
  let out = '';
  for (const set of drawable.sets) {
    const d = gen.opsToPath(set);
    if (set.type === 'path') {
      out += `<path d="${d}" fill="none" stroke="${o.stroke}" stroke-width="${o.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${
        opts.dash ? ` stroke-dasharray="${opts.dash}"` : ''
      }/>`;
    } else if (set.type === 'fillPath') {
      out += `<path d="${d}" fill="${o.fill}" stroke="none"/>`;
    } else if (set.type === 'fillSketch') {
      let fw = o.fillWeight;
      if (!fw || fw < 0) fw = (o.strokeWidth || 1) / 2;
      out += `<path d="${d}" fill="none" stroke="${o.fill}" stroke-width="${fw}"/>`;
    }
  }
  return out;
}
