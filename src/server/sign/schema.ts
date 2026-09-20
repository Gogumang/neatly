// LLM 에 강제할 strict JSON schema. 장면마다 한국수어 어순 단어 배열을 받는다.

export const glossSchema = {
  type: "object",
  properties: {
    scenes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          words: { type: "array", items: { type: "string" } },
        },
        required: ["id", "words"],
        additionalProperties: false,
      },
    },
  },
  required: ["scenes"],
  additionalProperties: false,
};

export type RawGloss = { scenes: { id: string; words: string[] }[] };
