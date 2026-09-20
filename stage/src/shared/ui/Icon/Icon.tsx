// 선 아이콘 모음. 24x24 기준 path.
const PATHS = {
  prev: "M7 6v12M18 6l-8 6 8 6V6z",
  next: "M17 6v12M6 6l8 6-8 6V6z",
  play: "M8 5v14l11-7z",
  pause: "M8 5h3v14H8zM13 5h3v14h-3z",
  sound: "M4 9h4l5-4v14l-5-4H4zM17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12",
  mute: "M4 9h4l5-4v14l-5-4H4zM17 9l5 6M22 9l-5 6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  heart: "M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z",
  back: "M15 5l-7 7 7 7",
  replay: "M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5",
  sign: "M8 13V5.5a1.5 1.5 0 0 1 3 0V11m0-6.5a1.5 1.5 0 0 1 3 0V11m0-5a1.5 1.5 0 0 1 3 0v6.5c0 4-2.5 7.5-6.5 7.5S5 17 4 14.5l-.6-1.6a1.4 1.4 0 0 1 2.5-1.2L8 14",
} as const;

const FILLED = new Set<IconName>(["play", "pause"]);

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, filled }: { name: IconName; size?: number; filled?: boolean }) {
  const fill = filled ?? FILLED.has(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
