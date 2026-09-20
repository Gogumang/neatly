import type { Template } from "@/entities/talk/model";

// LLM 에 강제할 strict JSON schema. strict 모드라 선택값은 null 로 받는다.

const str = { type: "string" };
const nullableStr = { type: ["string", "null"] };
const obj = (properties: Record<string, unknown>) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

const templateSchema = {
  anyOf: [
    obj({ type: { type: "string", enum: ["title"] }, eyebrow: nullableStr, title: str, subtitle: nullableStr }),
    obj({ type: { type: "string", enum: ["keywords"] }, keywords: { type: "array", items: str } }),
    obj({
      type: { type: "string", enum: ["rollingNumber"] },
      from: { type: ["number", "null"] },
      to: { type: "number" },
      prefix: nullableStr,
      suffix: nullableStr,
      caption: nullableStr,
    }),
    obj({
      type: { type: "string", enum: ["mockup"] },
      imageIndex: { type: ["integer", "null"] },
      screen: {
        anyOf: [
          obj({
            title: str,
            items: { type: "array", items: obj({ title: str, description: nullableStr }) },
          }),
          { type: "null" },
        ],
      },
    }),
    obj({
      type: { type: "string", enum: ["chat"] },
      messages: {
        type: "array",
        items: obj({ name: str, text: str, mine: { type: "boolean" } }),
      },
    }),
    obj({ type: { type: "string", enum: ["speaker"] } }),
    obj({ type: { type: "string", enum: ["image"] }, imageIndex: { type: "integer" }, caption: nullableStr }),
  ],
};

export const talkSchema = obj({
  title: str,
  summary: str,
  segments: {
    type: "array",
    items: obj({
      text: str,
      theme: { type: "string", enum: ["light", "dark"] },
      size: { type: "string", enum: ["large", "small"] },
      template: templateSchema,
    }),
  },
});

export type RawTemplate = Record<string, unknown> & { type: Template["type"] };
export type RawTalk = {
  title: string;
  summary: string;
  segments: { text: string; theme: "light" | "dark"; size: "large" | "small"; template: RawTemplate }[];
};
