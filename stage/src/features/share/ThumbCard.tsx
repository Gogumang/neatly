import { ThumbScene } from "./ThumbScene";
import type { Highlight } from "./thumbHighlight";

// 목록 카드용 세로 썸네일(4:5) 한 장. Satori 가 그리므로 flex 레이아웃과 인라인 스타일만 쓴다

// 사진 위에서는 진하게, 그라데이션 위에서는 아래쪽만 살짝 눌러 글자를 읽히게 한다
const SCRIM = "linear-gradient(180deg, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.58) 55%, rgba(0,0,0,0.82) 100%)";
const SOFT_SCRIM = "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.3) 100%)";
const WHITE = "#FFFFFF";
const DIM = "rgba(255,255,255,0.76)";

/** 겹쳐 그리는 레이어. Satori 는 z-index 를 안 보므로 순서대로 쌓는다 */
const layer = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex" } as const;

export function ThumbCard({
  title,
  author,
  role,
  gradient,
  background,
  avatar,
  highlight,
}: {
  title: string;
  author?: string;
  role?: string;
  gradient: string;
  background?: string | null;
  avatar?: string | null;
  highlight?: Highlight | null;
}) {
  return (
    <div style={{ ...layer, backgroundImage: gradient, fontFamily: "Pretendard" }}>
      {background && (
        // biome-ignore lint/performance/noImgElement: Satori 는 next/image 를 그리지 못한다
        <img src={background} alt="" style={{ ...layer, objectFit: "cover", opacity: 0.5 }} />
      )}
      <div style={{ ...layer, backgroundImage: background ? SCRIM : SOFT_SCRIM }} />
      <div style={{ ...layer, flexDirection: "column", justifyContent: "space-between", padding: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: DIM, letterSpacing: -0.5 }}>또박</div>
          <Title text={title} />
        </div>
        {/* 가운데: 발표자 사진 → 숫자·키워드 → (둘 다 없으면 빈칸) */}
        <div style={{ display: "flex", width: "100%", justifyContent: avatar ? "flex-end" : "flex-start" }}>
          {avatar ? <Avatar src={avatar} size={300} /> : highlight ? <ThumbScene highlight={highlight} /> : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: WHITE, letterSpacing: -0.6 }}>{author}</div>
          {role && <div style={{ fontSize: 26, fontWeight: 500, color: DIM }}>{role}</div>}
        </div>
      </div>
    </div>
  );
}

function Title({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "block",
        lineClamp: 3,
        fontSize: 62,
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: -2,
        wordBreak: "keep-all",
        color: WHITE,
      }}
    >
      {text}
    </div>
  );
}

/** 동그랗게 오려 붙인 발표자 사진 */
function Avatar({ src, size }: { src: string; size: number }) {
  return (
    // biome-ignore lint/performance/noImgElement: Satori 는 next/image 를 그리지 못한다
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        objectFit: "cover",
        border: "6px solid rgba(255,255,255,0.85)",
      }}
    />
  );
}

/** 목록 한 줄에 쓰는 작은 정사각 썸네일. 사진이 있으면 사진, 없으면 숫자만 크게 */
export function ThumbSquare({ gradient, image, number }: { gradient: string; image?: string | null; number?: string }) {
  const style = { ...layer, backgroundImage: gradient, alignItems: "center", justifyContent: "center" } as const;
  return (
    <div style={{ ...style, fontFamily: "Pretendard" }}>
      {image ? (
        // biome-ignore lint/performance/noImgElement: Satori 는 next/image 를 그리지 못한다
        <img src={image} alt="" style={{ ...layer, objectFit: "cover" }} />
      ) : (
        number && (
          <div style={{ fontSize: number.length > 4 ? 84 : 120, fontWeight: 700, letterSpacing: -4, color: WHITE }}>
            {number}
          </div>
        )
      )}
    </div>
  );
}
