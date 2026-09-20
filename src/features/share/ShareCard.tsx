import type { TalkCover } from "@/entities/talk/cover";

// 링크 미리보기 이미지(1200×630) 한 장. Satori 가 그리므로 flex 레이아웃과 인라인 스타일만 쓴다

const BG = "#17171C";
const GREY = "#8B95A1";

export function ShareCard({ title, author, cover }: { title: string; author?: string; cover: TalkCover }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        gap: 56,
        padding: 72,
        background: BG,
        fontFamily: "Pretendard",
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: "#FFFFFF", letterSpacing: -0.5 }}>또박</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "block",
              lineClamp: 2,
              fontSize: 60,
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: -1.5,
              wordBreak: "keep-all",
              color: "#FFFFFF",
            }}
          >
            {title}
          </div>
          {author && <div style={{ fontSize: 30, fontWeight: 500, color: GREY }}>{author}</div>}
        </div>
      </div>
      <CoverBlock cover={cover} />
    </div>
  );
}

function CoverBlock({ cover }: { cover: TalkCover }) {
  const box = { width: 360, height: 486, borderRadius: 32, display: "flex" } as const;
  if (cover.kind === "image") {
    // biome-ignore lint/performance/noImgElement: Satori 는 next/image 를 그리지 못한다
    return <img src={cover.src} alt="" style={{ ...box, objectFit: "cover" }} />;
  }
  return <div style={{ ...box, backgroundImage: cover.background }} />;
}
