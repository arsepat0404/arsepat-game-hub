import type { CSSProperties } from "react";

export function badgeShapeClass(shape?: string): string {
  switch ((shape || "pill").toLowerCase()) {
    case "square":
      return "rounded-none";
    case "rounded":
      return "rounded-md";
    case "pill":
    default:
      return "rounded-full";
  }
}

function safeColor(v?: string): string | undefined {
  if (!v) return undefined;
  const s = v.trim();
  if (!s) return undefined;
  // basic guard: only allow css color-ish values
  if (/^[#a-zA-Z0-9(),.\s%-]+$/.test(s)) return s;
  return undefined;
}

export function genreBadgeStyle(metadata: Record<string, string>): CSSProperties {
  const bg = safeColor(metadata.genre_bg);
  const fg = safeColor(metadata.genre_fg);
  return {
    backgroundColor: bg,
    color: fg,
  };
}

export function tagBadgeStyle(metadata: Record<string, string>): CSSProperties {
  const bg = safeColor(metadata.tag_bg);
  const fg = safeColor(metadata.tag_fg);
  const border = safeColor(metadata.tag_border);
  return {
    backgroundColor: bg,
    color: fg,
    borderColor: border,
    borderWidth: border ? 1 : undefined,
    borderStyle: border ? "solid" : undefined,
  };
}

export function tagMaxCount(metadata: Record<string, string>, fallback = 2): number {
  const n = Number(metadata.tag_max);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/**
 * Interpret a spreadsheet flag cell as a boolean.
 * Truthy: "true", "yes", "y", "1", "on", "active", "enabled", "show".
 * If the cell is missing/empty, returns `fallback` (default true) so that
 * forgetting to add a flag column does not hide existing content.
 */
export function isMetadataEnabled(
  metadata: Record<string, string>,
  key: string,
  fallback = true,
): boolean {
  const raw = metadata[key];
  if (raw === undefined || raw === null) return fallback;
  const v = String(raw).trim().toLowerCase();
  if (!v) return fallback;
  if (["false", "no", "n", "0", "off", "inactive", "disabled", "hide"].includes(v)) return false;
  if (["true", "yes", "y", "1", "on", "active", "enabled", "show"].includes(v)) return true;
  return fallback;
}
