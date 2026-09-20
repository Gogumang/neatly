import { describe, expect, it } from "vitest";
import type { Template } from "@/entities/talk/model";
import { enforceRules } from "./rules";

const scene = (template: Template, text = "⭐핵심⭐ 문장") => ({ text, template });
const num = (to: number): Template => ({ type: "rollingNumber", to, caption: `${to}` });
const types = (scenes: { template: Template }[]) => scenes.map((s) => s.template.type);

describe("enforceRules", () => {
  it("같은 장면이 연속되면 뒤 장면을 바꾼다", () => {
    const out = enforceRules([scene({ type: "title", title: "a" }), scene({ type: "title", title: "b" })], {
      hasAvatar: false,
    });
    expect(types(out)).toEqual(["title", "keywords"]);
    expect(out[1]?.template).toEqual({ type: "keywords", keywords: ["핵심"] });
  });

  it("롤링넘버는 3개까지만", () => {
    const chat: Template = { type: "chat", messages: [] };
    const out = enforceRules(
      [scene(num(1)), scene(chat), scene(num(2)), scene(chat), scene(num(3)), scene(chat), scene(num(4))],
      { hasAvatar: false },
    );
    expect(types(out).filter((t) => t === "rollingNumber")).toHaveLength(3);
    expect(out[6]?.template).toEqual({ type: "keywords", keywords: ["4"] });
  });

  it("사진이 있는데 발표자 장면이 없으면 마지막 장면을 발표자로", () => {
    const out = enforceRules([scene(num(1)), scene({ type: "keywords", keywords: ["x"] })], { hasAvatar: true });
    expect(types(out)).toEqual(["rollingNumber", "speaker"]);
  });

  it("원본은 건드리지 않는다", () => {
    const input = [scene({ type: "title", title: "a" }), scene({ type: "title", title: "b" })];
    enforceRules(input, { hasAvatar: false });
    expect(types(input)).toEqual(["title", "title"]);
  });

  it("타이틀은 3번까지만", () => {
    const title = (t: string): Template => ({ type: "title", title: t });
    const kw: Template = { type: "keywords", keywords: ["k"] };
    const out = enforceRules(
      [scene(title("a")), scene(kw), scene(title("b")), scene(num(1)), scene(title("c")), scene(kw), scene(title("d"))],
      { hasAvatar: false },
    );
    expect(types(out).filter((t) => t === "title")).toHaveLength(3);
  });

  it("같은 이미지는 한 번만", () => {
    const img: Template = { type: "image", src: "/a.png" };
    const out = enforceRules([scene(img), scene(num(1)), scene(img)], { hasAvatar: false });
    expect(types(out)).toEqual(["image", "rollingNumber", "keywords"]);
  });
});
