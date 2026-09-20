// 나레이션 = 장면(Segment)의 목록. 장면마다 자막 한 문장 + 화면 템플릿 하나.

export type Template =
  | { type: "title"; title: string; subtitle?: string }
  | { type: "keywords"; keywords: string[] }
  | {
      type: "rollingNumber";
      from?: number;
      to: number;
      prefix?: string;
      suffix?: string;
      caption?: string;
    }
  | {
      type: "mockup";
      media?: { kind: "image" | "video"; src: string };
      screen?: {
        title: string;
        items: { title: string; description?: string }[];
      };
    }
  | {
      type: "chat";
      messages: { name: string; text: string; mine?: boolean }[];
    }
  /** 발표자 프로필 사진 (Talk.author.avatarUrl) */
  | { type: "speaker" }
  /** 사용자가 올린 이미지 한 장 */
  | { type: "image"; src: string; caption?: string };

/** 받아쓰기로 얻은 단어별 발화 시간 (초) */
export type SpokenWord = { text: string; start: number; end: number };

export type Segment = {
  id: string;
  text: string;
  template: Template;
  theme?: "light" | "dark";
  size?: "large" | "small";
  audioUrl?: string;
  words?: SpokenWord[];
  /** 나레이션 길이 (초) */
  duration?: number;
  /** 이 장면을 한국수어 어순으로 옮긴 단어들 */
  sign?: string[];
  /** 웹툰으로 볼 때 이 장면에 그린 그림 */
  panelUrl?: string;
};

export type Talk = {
  id: string;
  /** 나레이션 목소리 (VoiceId) */
  voice?: string;
  /** 나레이션 장르 (GenreId) */
  genre?: string;
  /** 보여 주는 방식 (FormatId): 나레이션·수어·웹툰·숏폼 */
  format?: string;
  /** 누가 볼 수 있나 (VisibilityId). 없으면 공개 */
  visibility?: "public" | "private";
  /** 비공개 나레이션의 비밀번호. 서버에만 둔다 — 브라우저로 내보내면 안 된다 */
  pass?: { salt: string; hash: string };
  title: string;
  summary: string;
  author: { name: string; role?: string; avatarUrl?: string };
  /** AI 가 그린 표지 그림 */
  coverUrl?: string;
  segments: Segment[];
};
