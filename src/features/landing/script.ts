import type { Template } from "@/entities/talk/model";

/** 소개 화면에서 "글 → 나레이션" 변환을 보여줄 예시. 왼쪽 문장이 오른쪽 장면이 된다 */
export const DEMO_STEPS: { source: string; subtitle: string; template: Template }[] = [
  {
    source: "고객센터 문의를 매일 아침 손으로 분류했다. 담당자 두 명이 오전 내내 엑셀에 옮겨 적었다.",
    subtitle: "아침마다 문의가 ⭐엑셀 작업⭐에 묶였어요.",
    template: {
      type: "chat",
      messages: [
        { name: "담당자", text: "오전 내내 엑셀에 옮겨 적어요" },
        { name: "팀장", text: "급한 결제 문의는요?", mine: true },
      ],
    },
  },
  {
    source: "키워드 규칙으로 나눠봤지만 문장을 읽지 못해 정확도가 60%에 그쳤다.",
    subtitle: "키워드 규칙은 ⭐문장을 읽지 못했어요.⭐",
    template: { type: "keywords", keywords: ["키워드 규칙", "오분류", "재확인"] },
  },
  {
    source: "LLM에 예시 500건과 카테고리 설명을 주고, 긴급도까지 함께 판단하게 했다.",
    subtitle: "그래서 ⭐긴급도까지⭐ 같이 판단하게 했어요.",
    template: {
      type: "mockup",
      screen: {
        title: "슬랙 분류 봇",
        items: [
          { title: "새 문의 도착", description: "들어오자마자 분류" },
          { title: "긴급도 표시", description: "높으면 바로 멘션" },
        ],
      },
    },
  },
  {
    source: "결과적으로 오전 3시간 걸리던 분류가 10분 검수로 줄었다.",
    subtitle: "오전 3시간이 ⭐10분⭐으로 줄었어요.",
    template: { type: "rollingNumber", from: 180, to: 10, suffix: "분", caption: "3시간 → 10분" },
  },
];
