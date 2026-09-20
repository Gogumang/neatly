import type { Highlight } from "./thumbHighlight";

// 카드 가운데를 채우는 핵심 장면. 플레이어의 숫자·키워드 장면을 썸네일 크기로 옮겨 왔다
const CHIP_COLORS = ["#CAAEFF", "#7AEA8F", "#FF8FAA", "#86B4FF", "#FFD66B"];

export function ThumbScene({ highlight }: { highlight: Highlight }) {
  if (highlight.kind === "number") return <BigNumber value={highlight.value} caption={highlight.caption} />;
  return <Chips items={highlight.items} />;
}

/** 숫자 장면: 값은 크게, 설명은 아래에 작게 */
function BigNumber({ value, caption }: { value: string; caption?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          fontSize: value.length > 5 ? 108 : 150,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: -5,
          color: "rgba(255,255,255,0.95)",
        }}
      >
        {value}
      </div>
      {caption && <div style={{ fontSize: 30, fontWeight: 500, color: "rgba(255,255,255,0.68)" }}>{caption}</div>}
    </div>
  );
}

/** 키워드 장면: 파스텔 칩 위에 검은 글씨 */
function Chips({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, maxWidth: 560 }}>
      {items.map((item, i) => (
        <div
          key={item}
          style={{
            display: "flex",
            padding: "14px 28px",
            borderRadius: 999,
            backgroundColor: CHIP_COLORS[i % CHIP_COLORS.length],
            color: "#000000",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: -1.2,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
