import Papa from "papaparse";
import type { Game, LocalizationRow, MetadataRow } from "./types";

async function fetchCsv<T>(url: string): Promise<T[]> {
  if (!url) return [];
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch CSV (${res.status})`);
  const text = await res.text();
  const parsed = Papa.parse<T>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  return (parsed.data || []).filter(Boolean) as T[];
}

export async function fetchGames(url: string): Promise<Game[]> {
  const rows = await fetchCsv<Record<string, string>>(url);
  return rows
    .filter((r) => r.id || r.title)
    .map((r) => ({
      id: String(r.id ?? "").trim(),
      title: String(r.title ?? "").trim(),
      description: String(r.description ?? "").trim(),
      status: String(r.status ?? "Released").trim(),
      play_url: String(r.play_url ?? "").trim(),
      image_url: String(r.image_url ?? "").trim(),
      progress_percent: Number(r.progress_percent ?? 0) || 0,
      genre: String(r.genre ?? "").trim(),
      tags: String(r.tags ?? "")
        .split(/[,;|]/)
        .map((s) => s.trim())
        .filter(Boolean),
    }));
}

export async function fetchLocalization(url: string): Promise<LocalizationRow[]> {
  const rows = await fetchCsv<Record<string, string>>(url);
  return rows
    .filter((r) => r.key)
    .map((r) => ({
      key: String(r.key).trim(),
      id_text: String(r.id_text ?? "").trim(),
      en_text: String(r.en_text ?? "").trim(),
    }));
}

export async function fetchMetadata(url: string): Promise<MetadataRow[]> {
  const rows = await fetchCsv<Record<string, string>>(url);
  return rows
    .filter((r) => r.setting_key)
    .map((r) => ({
      setting_key: String(r.setting_key).trim(),
      setting_value: String(r.setting_value ?? "").trim(),
    }));
}
