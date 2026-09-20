import { describe, expect, it } from "vitest";
import { DEFAULT_VOICE, isVoiceId, VOICES, voiceOf } from "./voices";

describe("VOICES", () => {
  it("목소리 목록은 비어 있지 않다", () => {
    expect(VOICES.length).toBeGreaterThan(0);
  });

  it("목소리 id 는 겹치지 않는다", () => {
    const ids = VOICES.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("기본 목소리는 목록에 있다", () => {
    expect(VOICES.some((v) => v.id === DEFAULT_VOICE)).toBe(true);
  });

  it.each(VOICES.map((v) => [v.id, v] as const))("%s 는 이름과 설명이 비어 있지 않다", (_id, voice) => {
    expect(voice.name.trim()).not.toBe("");
    expect(voice.description.trim()).not.toBe("");
  });

  it.each(VOICES.map((v) => [v.id, v] as const))("%s 는 태그가 하나 이상 있다", (_id, voice) => {
    expect(voice.tags.length).toBeGreaterThan(0);
    for (const tag of voice.tags) expect(tag.trim()).not.toBe("");
  });

  it.each(VOICES.map((v) => [v.id, v] as const))("%s 는 구슬 색 두 개가 hex 다", (_id, voice) => {
    expect(voice.colors).toHaveLength(2);
    for (const color of voice.colors) expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it.each(VOICES.map((v) => [v.id, v] as const))("%s 는 제공자 목소리 id 가 채워져 있다", (_id, voice) => {
    expect(voice.elevenlabs.trim()).not.toBe("");
    expect(voice.openai.trim()).not.toBe("");
  });

  it("제공자 목소리 id 도 서로 겹치지 않는다", () => {
    const eleven = VOICES.map((v) => v.elevenlabs);
    const openai = VOICES.map((v) => v.openai);
    expect(new Set(eleven).size).toBe(eleven.length);
    expect(new Set(openai).size).toBe(openai.length);
  });
});

describe("isVoiceId", () => {
  it.each(VOICES.map((v) => v.id))("목록에 있는 %s 는 목소리 id 다", (id) => {
    expect(isVoiceId(id)).toBe(true);
  });

  it.each([
    ["없는 id", "nova"],
    ["빈 문자열", ""],
    ["대문자", "JINI"],
    ["null", null],
    ["undefined", undefined],
    ["숫자", 2],
  ])("%s 는 목소리 id 가 아니다", (_label, value) => {
    expect(isVoiceId(value)).toBe(false);
  });
});

describe("voiceOf", () => {
  it.each(VOICES.map((v) => v.id))("%s 를 주면 그 목소리를 돌려준다", (id) => {
    expect(voiceOf(id).id).toBe(id);
  });

  it.each([
    ["없는 id", "nova"],
    ["빈 문자열", ""],
    ["null", null],
    ["undefined", undefined],
    ["숫자", 2],
  ])("%s 를 주면 기본 목소리를 돌려준다", (_label, value) => {
    expect(voiceOf(value).id).toBe(DEFAULT_VOICE);
  });
});
