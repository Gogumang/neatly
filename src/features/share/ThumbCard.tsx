// 표지 썸네일. Satori 가 그리므로 flex 레이아웃과 인라인 스타일만 쓴다

// 아래쪽만 살짝 눌러 제목이 읽히게 한다
const SCRIM = "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)";
const WHITE = "#FFFFFF";
const DIM = "rgba(255,255,255,0.76)";

/** 겹쳐 그리는 레이어. Satori 는 z-index 를 안 보므로 순서대로 쌓는다 */
const layer = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex" } as const;

type Props = { image?: string | null; gradient: string };

/** 목록 카드(4:5). AI 가 그린 표지 위에 제목과 만든이만 얹는다 */
export function ThumbCard({
  title,
  author,
  role,
  image,
  gradient,
}: Props & { title: string; author?: string; role?: string }) {
  return (
    <div style={{ ...layer, backgroundImage: gradient, fontFamily: "Pretendard" }}>
      <Art image={image} />
      <div style={{ ...layer, backgroundImage: SCRIM }} />
      <div style={{ ...layer, flexDirection: "column", justifyContent: "flex-end", alignItems: "center", padding: 56 }}>
        <div
          style={{
            display: "block",
            lineClamp: 3,
            fontSize: 58,
            fontWeight: 700,
            lineHeight: 1.28,
            letterSpacing: -2,
            textAlign: "center",
            wordBreak: "keep-all",
            color: WHITE,
          }}
        >
          {title}
        </div>
        {author && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: WHITE, letterSpacing: -0.4 }}>{author}</div>
            {role && <div style={{ fontSize: 26, fontWeight: 500, color: DIM }}>{`· ${role}`}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

/** 글자 없이 그림만 (목록보기 썸네일) */
export function ThumbSquare({ image, gradient }: Props) {
  return (
    <div style={{ ...layer, backgroundImage: gradient }}>
      <Art image={image} />
    </div>
  );
}

function Art({ image }: { image?: string | null }) {
  if (!image) return null;
  // biome-ignore lint/performance/noImgElement: Satori 는 next/image 를 그리지 못한다
  return <img src={image} alt="" style={{ ...layer, objectFit: "cover" }} />;
}
