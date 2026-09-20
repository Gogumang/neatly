// 고를 수 있는 나레이션 목소리. 제공자마다 목소리 id 가 다르므로 우리 id 로 묶는다.
// colors 는 목소리 구슬 그라데이션.
export const VOICES = [
  {
    id: "jini",
    name: "지니",
    description: "또렷하고 신뢰감 있는 목소리",
    tags: ["또렷함", "정보 전달"],
    colors: ["#3182F6", "#9FD0FF"],
    elevenlabs: "0oqpliV6dVSr9XomngOW",
    openai: "nova",
  },
  {
    id: "yooni",
    name: "유니",
    description: "자연스럽고 차분한 목소리",
    tags: ["차분함", "내레이션"],
    colors: ["#03B26C", "#B7F0D8"],
    elevenlabs: "n2fbxG88jqAoaVPUy3IG",
    openai: "marin",
  },
  {
    id: "eunha",
    name: "은하",
    description: "단정하고 우아한 목소리",
    tags: ["단정함", "발표"],
    colors: ["#A234C7", "#EDCCF8"],
    elevenlabs: "cBOtnpVZNlQ5VJygXGB8",
    openai: "sage",
  },
  {
    id: "kai",
    name: "카이",
    description: "안정적이고 믿음직한 목소리",
    tags: ["안정감", "설명"],
    colors: ["#1B64DA", "#86B4FF"],
    elevenlabs: "3M7YFUPVEFXk4trCZwLh",
    openai: "cedar",
  },
  {
    id: "minho",
    name: "민호",
    description: "또박또박 말하는 단정한 목소리",
    tags: ["또박또박", "격식"],
    colors: ["#F04452", "#FFC2A8"],
    elevenlabs: "U1cJYS4EdbaHmfR7YzHd",
    openai: "coral",
  },
  {
    id: "gyeol",
    name: "결",
    description: "낮고 묵직한 목소리",
    tags: ["묵직함", "다큐"],
    colors: ["#191F28", "#8B95A1"],
    elevenlabs: "aQzFKIjVemqRAhfd9est",
    openai: "onyx",
  },
] as const;

export type Voice = (typeof VOICES)[number];
export type VoiceId = Voice["id"];

export const DEFAULT_VOICE: VoiceId = "yooni";

export const isVoiceId = (v: unknown): v is VoiceId => VOICES.some((voice) => voice.id === v);

export const voiceOf = (id: unknown): Voice => VOICES.find((v) => v.id === id) ?? VOICES[1];
