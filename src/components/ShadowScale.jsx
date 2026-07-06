import { useState } from 'react';

// 반지름을 키우면 그림자의 "실제 길이"는 r배로 출렁이지만,
// 그림자 ÷ 반지름 = cosθ, sinθ 는 꿈쩍 안 한다.
// → 어차피 크기와 무관하니, 제일 깔끔한 반지름 1(단위원)을 고르면
//   분모가 사라져 그림자가 곧 값이 된다. 이게 단위원을 쓰는 진짜 이유.
const GREEN = '#4a7a5a';   // sin
const ORANGE = '#c0562f';  // cos
const INK = '#3a352c';
const SOFT = '#7a7259';
const LINE = '#cdbfa0';
const YELLOW = '#f2d675';

const ox = 150, oy = 165, Rb = 58;  // Rb = 반지름 1일 때 픽셀

function buildScene(th, r) {
  const R = Rb * r;
  const c = Math.cos(th), s = Math.sin(th);
  const px = ox + R * c, py = oy - R * s;
  const fx = ox + R * c, wy = oy - R * s;
  let g = '';

  // 축
  g += '<line x1="20" y1="' + oy + '" x2="300" y2="' + oy + '" stroke="' + LINE + '" stroke-width="1.3"/>';
  g += '<line x1="' + ox + '" y1="20" x2="' + ox + '" y2="310" stroke="' + LINE + '" stroke-width="1.3"/>';
  // 원
  g += '<circle cx="' + ox + '" cy="' + oy + '" r="' + R.toFixed(1) + '" fill="none" stroke="' + LINE + '" stroke-width="1.5"/>';
  // 드롭 점선
  g += '<line x1="' + px.toFixed(1) + '" y1="' + py.toFixed(1) + '" x2="' + fx.toFixed(1) + '" y2="' + oy + '" stroke="' + ORANGE + '" stroke-width="1.3" stroke-dasharray="4 3" stroke-opacity="0.8"/>';
  g += '<line x1="' + px.toFixed(1) + '" y1="' + py.toFixed(1) + '" x2="' + ox + '" y2="' + wy.toFixed(1) + '" stroke="' + GREEN + '" stroke-width="1.3" stroke-dasharray="4 3" stroke-opacity="0.8"/>';
  // 그림자 (가로=cos, 세로=sin)
  g += '<line x1="' + ox + '" y1="' + oy + '" x2="' + fx.toFixed(1) + '" y2="' + oy + '" stroke="' + ORANGE + '" stroke-width="5" stroke-linecap="round"/>';
  g += '<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="' + wy.toFixed(1) + '" stroke="' + GREEN + '" stroke-width="5" stroke-linecap="round"/>';
  // 반지름 · 점
  g += '<line x1="' + ox + '" y1="' + oy + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="' + INK + '" stroke-width="1.8"/>';
  g += '<circle cx="' + ox + '" cy="' + oy + '" r="3" fill="' + INK + '"/>';
  g += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="4.5" fill="' + INK + '"/>';
  g += '<text x="' + ((ox + px) / 2 + 6).toFixed(1) + '" y="' + ((oy + py) / 2 - 6).toFixed(1) + '" font-size="12" fill="' + SOFT + '">반지름 ' + r.toFixed(2) + '</text>';

  // 오른쪽 막대 비교
  const rx = 340, rw = 280, k = 150;  // k: 값 1 당 픽셀
  const cAbs = Math.abs(c), sAbs = Math.abs(s);
  g += '<text x="' + rx + '" y="42" font-size="14" font-weight="700" fill="' + SOFT + '">① 그림자 실제 길이 — 변한다</text>';
  g += '<rect x="' + rx + '" y="56" width="' + (r * sAbs * k).toFixed(1) + '" height="13" rx="3" fill="' + GREEN + '" fill-opacity="0.9"/>';
  g += '<text x="' + rx + '" y="86" font-size="13" fill="' + GREEN + '">세로 그림자 = r·sinθ = ' + (r * s).toFixed(2) + '</text>';
  g += '<rect x="' + rx + '" y="96" width="' + (r * cAbs * k).toFixed(1) + '" height="13" rx="3" fill="' + ORANGE + '" fill-opacity="0.9"/>';
  g += '<text x="' + rx + '" y="126" font-size="13" fill="' + ORANGE + '">가로 그림자 = r·cosθ = ' + (r * c).toFixed(2) + '</text>';

  g += '<line x1="' + rx + '" y1="146" x2="' + (rx + rw) + '" y2="146" stroke="' + LINE + '" stroke-width="1"/>';
  g += '<text x="' + rx + '" y="174" font-size="14" font-weight="700" fill="' + SOFT + '">② 그림자 ÷ 반지름 — 안 변한다</text>';
  g += '<rect x="' + rx + '" y="188" width="' + (sAbs * k).toFixed(1) + '" height="13" rx="3" fill="' + GREEN + '" fill-opacity="0.9"/>';
  g += '<text x="' + rx + '" y="218" font-size="13" fill="' + GREEN + '">sin θ = ' + s.toFixed(2) + ' (r 무관)</text>';
  g += '<rect x="' + rx + '" y="228" width="' + (cAbs * k).toFixed(1) + '" height="13" rx="3" fill="' + ORANGE + '" fill-opacity="0.9"/>';
  g += '<text x="' + rx + '" y="258" font-size="13" fill="' + ORANGE + '">cos θ = ' + c.toFixed(2) + ' (r 무관)</text>';
  g += '<text x="' + rx + '" y="292" font-size="14" font-weight="700" fill="' + INK + '">→ 반지름 1로 두면 ①=②. 그림자 = 값.</text>';
  return g;
}

export default function ShadowScale() {
  const [th, setTh] = useState(Math.PI / 3);
  const [pct, setPct] = useState(100);
  const r = pct / 100;
  const c = Math.cos(th), s = Math.sin(th);
  const btn = {
    fontFamily: 'var(--font-hand), cursive', fontSize: '1rem',
    background: '#fffdf6', border: '1.5px solid ' + LINE, borderRadius: 8,
    padding: '3px 12px', color: INK, cursor: 'pointer',
  };
  return (
    <div style={{ fontFamily: 'var(--font-hand), cursive', margin: '0.4rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{ color: SOFT, fontSize: '1rem', whiteSpace: 'nowrap', minWidth: 78 }}>각 θ</span>
        <input type="range" min={0} max={2 * Math.PI} step={0.01} value={th}
          onChange={(e) => setTh(parseFloat(e.target.value))} style={{ flex: 1, accentColor: INK }} />
        <b style={{ minWidth: 66, fontSize: '1rem' }}>{th.toFixed(2)} rad</b>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ color: INK, fontSize: '1rem', whiteSpace: 'nowrap', minWidth: 78 }}>반지름 크기</span>
        <input type="range" min={40} max={220} step={1} value={pct}
          onChange={(e) => setPct(parseFloat(e.target.value))} style={{ flex: 1, accentColor: INK }} />
        <b style={{ minWidth: 66, fontSize: '1rem' }}>{r.toFixed(2)}배</b>
        <button type="button" style={btn} onClick={() => setPct(100)}>반지름=1</button>
      </div>
      <div style={{ background: YELLOW, borderRadius: 10, padding: '8px 14px', marginBottom: 12, textAlign: 'center', color: INK }}>
        반지름을 1로 두면 <b>sin θ = {s.toFixed(2)}</b>, <b>cos θ = {c.toFixed(2)}</b> — 그림자 길이가 곧 값. 그래서 <b>단위원</b>을 쓴다.
      </div>
      <svg viewBox="0 0 640 320" style={{ width: '100%', height: 'auto' }}
        role="img" aria-label="반지름을 바꿔도 그림자÷반지름은 sin, cos로 일정함을 보이는 그림"
        dangerouslySetInnerHTML={{ __html: buildScene(th, r) }} />
    </div>
  );
}
