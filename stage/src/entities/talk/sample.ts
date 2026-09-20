import type { Talk } from "@/entities/talk/model";

// 플레이어 확인용 샘플 대본. 수치와 대화는 예시다.
export const sampleTalk: Talk = {
  id: "sample",
  title: "읽히지 않는 글을, 보고 싶은 나레이션으로",
  summary: "줄글 한 편이 나레이션이 되기까지",
  author: { name: "또박 팀", role: "AI Championship 2026" },
  segments: [
    {
      id: "s1",
      theme: "dark",
      size: "large",
      text: "안녕하세요. 오늘은 ⭐읽히지 않는 글⭐에 대한 이야기를 해볼게요.",
      template: {
        type: "title",
        eyebrow: "AI Championship 2026",
        title: "읽히지 않는 글을\n보고 싶은 나레이션으로",
        subtitle: "줄글 한 편이 나레이션이 되기까지",
      },
    },
    {
      id: "s2",
      text: "해커톤이 끝나면, 이런 대화가 ⭐정말 자주⭐ 오가요.",
      template: {
        type: "chat",
        messages: [
          { name: "심사위원", avatar: "🧑‍⚖️", text: "제출물이 너무 많네요… 설명은 첫 줄만 볼게요." },
          { name: "우리 팀", avatar: "🧑‍💻", text: "설명 2,000자 열심히 썼는데 😢", mine: true },
          { name: "심사위원", avatar: "🧑‍⚖️", text: "그래서 이게 무슨 문제를 푸는 거죠?" },
        ],
      },
    },
    {
      id: "s3",
      size: "large",
      text: "잘 쓴 글도, ⭐끝까지 읽히지 않으면⭐ 전해지지 않아요.",
      template: {
        type: "rollingNumber",
        to: 2000,
        suffix: "자",
        caption: "아무도 끝까지 읽지 않은 설명",
      },
    },
    {
      id: "s4",
      text: "좋은 나레이션에는 세 가지가 있어요. ⭐짧은 문장⭐, ⭐한 장면 한 메시지⭐, 그리고 ⭐목소리⭐.",
      template: { type: "keywords", keywords: ["짧은 문장", "한 장면 한 메시지", "목소리"] },
    },
    {
      id: "s5",
      theme: "dark",
      size: "large",
      text: "그래서 만들었어요. ⭐글을 붙여넣으면, AI가 나레이션을 만들어요.⭐",
      template: {
        type: "title",
        eyebrow: "해결",
        title: "글을 붙여넣으면\nAI가 나레이션을 만들어요",
      },
    },
    {
      id: "s6",
      text: "쓰던 글을 ⭐그대로 붙여넣기만⭐ 하면 돼요.",
      template: {
        type: "mockup",
        screen: {
          title: "새 나레이션 만들기",
          items: [
            { emoji: "📝", title: "원고 붙여넣기", description: "AI로 문제를 해결한 이야기를 그대로" },
            { emoji: "🖼️", title: "스크린샷 추가", description: "있으면 장면에 넣어드려요" },
            { emoji: "🎙️", title: "목소리 고르기", description: "차분한 목소리 · 밝은 목소리" },
          ],
        },
      },
    },
    {
      id: "s7",
      text: "AI가 글을 읽고 ⭐문제, 시도, 해결, 성과⭐로 흐름을 다시 짜요.",
      template: { type: "keywords", keywords: ["문제", "시도", "해결", "성과"] },
    },
    {
      id: "s8",
      text: "문장마다 ⭐가장 잘 어울리는 장면⭐을 골라주고요.",
      template: {
        type: "mockup",
        screen: {
          title: "장면 12개를 만들었어요",
          items: [
            { emoji: "💬", title: "문제 상황", description: "대화 장면으로 재현" },
            { emoji: "🔢", title: "성과 수치", description: "숫자가 올라가는 장면" },
            { emoji: "✨", title: "핵심 키워드", description: "큰 글씨로 강조" },
          ],
        },
      },
    },
    {
      id: "s9",
      text: "빠진 내용이 있으면 ⭐먼저 물어봐요.⭐",
      template: {
        type: "chat",
        messages: [
          { name: "AI 코치", avatar: "🤖", text: "성과를 숫자로 말할 수 있을까요? 예를 들면 처리 시간이요." },
          { name: "나", avatar: "🙂", text: "3시간 걸리던 일이 10분으로 줄었어요!", mine: true },
          { name: "AI 코치", avatar: "🤖", text: "좋아요, 숫자 장면으로 넣을게요 ✨" },
        ],
      },
    },
    {
      id: "s10",
      size: "large",
      text: "그러면 ⭐3시간 걸리던 일이 10분⭐으로 줄었다는 이야기가, 이렇게 보여요.",
      template: {
        type: "rollingNumber",
        from: 180,
        to: 10,
        suffix: "분",
        caption: "3시간 → 10분",
      },
    },
    {
      id: "s11",
      text: "만든 나레이션은 ⭐갤러리⭐에서 서로 볼 수 있어요.",
      template: {
        type: "mockup",
        screen: {
          title: "모두의 나레이션",
          items: [
            { emoji: "🚨", title: "새벽 장애를 AI가 먼저 알려줬어요", description: "♥ 128" },
            { emoji: "🧾", title: "영수증 정리를 10분 만에", description: "♥ 96" },
            { emoji: "📚", title: "논문 읽기 모임을 AI와 함께", description: "♥ 71" },
          ],
        },
      },
    },
    {
      id: "s12",
      theme: "dark",
      size: "large",
      text: "이제 여러분의 글은 ⭐읽히는 대신, 들려요.⭐",
      template: {
        type: "title",
        eyebrow: "또박",
        title: "읽는 대신,\n들려주세요",
        subtitle: "지금 내 글로 나레이션 만들기",
      },
    },
  ],
};
