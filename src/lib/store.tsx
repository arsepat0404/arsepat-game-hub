import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { CSV_URLS } from "./csv-config";
import { fetchGames, fetchLocalization, fetchMetadata } from "./sheets";
import { REQUIRED_LOCALIZATION_KEYS } from "./sheet-schema";
import type { Game, Lang, LocalizationRow, MetadataRow } from "./types";

const DEFAULT_STRINGS: Record<string, { id: string; en: string }> = {
  nav_home: { id: "Beranda", en: "Home" },
  nav_about: { id: "Tentang", en: "About" },
  nav_settings: { id: "Pengaturan", en: "Settings" },
  hero_title: { id: "Pusat Permainan Arsepat", en: "Arsepat Game Hub" },
  hero_subtitle: {
    id: "Koleksi karya, eksperimen, dan game yang sedang dikembangkan.",
    en: "A curated collection of releases, experiments, and works in progress.",
  },
  search_placeholder: { id: "Cari permainan...", en: "Search games..." },
  filter_all: { id: "Semua", en: "All" },
  filter_released: { id: "Rilis", en: "Released" },
  filter_ongoing: { id: "Berjalan", en: "On-going" },
  sort_title: { id: "Judul A-Z", en: "Title A-Z" },
  sort_progress: { id: "Progres %", en: "Progress %" },
  sort_status: { id: "Status", en: "Status" },
  sort_label: { id: "Urutkan", en: "Sort" },
  play_now: { id: "Mainkan Sekarang", en: "Play Now" },
  share: { id: "Bagikan", en: "Share" },
  copy_link: { id: "Salin Tautan", en: "Copy Link" },
  link_copied: { id: "Tautan disalin!", en: "Link copied!" },
  progress: { id: "Progres", en: "Progress" },
  refresh_data: { id: "Muat Ulang Data", en: "Refresh Data" },
  loading: { id: "Memuat...", en: "Loading..." },
  no_games: { id: "Belum ada permainan.", en: "No games yet." },
  fetch_error: {
    id: "Gagal memuat data dari spreadsheet.",
    en: "Failed to load data from the spreadsheet.",
  },
  offline: { id: "Anda sedang offline.", en: "You appear to be offline." },
  refresh_success: { id: "Data diperbarui.", en: "Data refreshed." },
  appearance: { id: "Tampilan", en: "Appearance" },
  language: { id: "Bahasa", en: "Language" },
  about: { id: "Tentang", en: "About" },
  theme_dark: { id: "Gelap", en: "Dark" },
  theme_light: { id: "Terang", en: "Light" },
  about_arsepat: { id: "Tentang Arsepat", en: "About Arsepat" },
  footer_tagline: { id: "Dibuat dengan teliti.", en: "Crafted with care." },
  install_title: { id: "Pasang Arsepat", en: "Install Arsepat" },
  install_body: {
    id: "Pasang aplikasi ke layar utama untuk akses cepat.",
    en: "Add the app to your home screen for quick access.",
  },
  install_yes: { id: "Pasang", en: "Install" },
  install_later: { id: "Nanti saja", en: "Maybe later" },
  install_done: { id: "Arsepat terpasang!", en: "Arsepat installed!" },
  offline_banner: {
    id: "Offline — menampilkan data tersimpan",
    en: "Offline — showing cached data",
  },
  empty_title: { id: "Belum ada data", en: "No data yet" },
  empty_body: {
    id: "Tidak dapat memuat permainan dari spreadsheet. Coba muat ulang.",
    en: "Could not load games from the spreadsheet. Try refreshing.",
  },
  pull_to_refresh: { id: "Tarik untuk memuat ulang", en: "Pull to refresh" },
  release_to_refresh: { id: "Lepas untuk memuat ulang", en: "Release to refresh" },
  developer_tools: { id: "Alat Pengembang", en: "Developer Tools" },
  copy_headers_games: { id: "Salin Header: Games", en: "Copy Headers: Games" },
  copy_headers_localization: {
    id: "Salin Header: Localization",
    en: "Copy Headers: Localization",
  },
  copy_headers_metadata: { id: "Salin Header: Metadata", en: "Copy Headers: Metadata" },
  headers_copied: { id: "Header disalin ke clipboard", en: "Headers copied to clipboard" },
  in_development: {
    id: "Game ini masih dalam tahap pengembangan.",
    en: "This game is still in development.",
  },
  in_development_short: { id: "Dalam Pengembangan", en: "In Development" },
};

const CACHE_KEY = "arsepat:cache:v1";

interface CachePayload {
  games: Game[];
  localization: LocalizationRow[];
  metadata: MetadataRow[];
  ts: number;
}

function loadCache(): CachePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachePayload;
  } catch {
    return null;
  }
}

function saveCache(p: CachePayload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(p));
  } catch {
    /* ignore quota */
  }
}

interface DataState {
  games: Game[];
  localization: LocalizationRow[];
  metadata: Record<string, string>;
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  refresh: (opts?: { silent?: boolean }) => Promise<void>;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
}

const Ctx = createContext<DataState | null>(null);

function metadataToRecord(rows: MetadataRow[]) {
  const md: Record<string, string> = {};
  for (const r of rows) md[r.setting_key] = r.setting_value;
  return md;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const cached = typeof window !== "undefined" ? loadCache() : null;

  const [games, setGames] = useState<Game[]>(cached?.games ?? []);
  const [localization, setLocalization] = useState<LocalizationRow[]>(
    cached?.localization ?? [],
  );
  const [metadataRows, setMetadataRows] = useState<MetadataRow[]>(cached?.metadata ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(cached?.ts ?? null);

  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "id";
    return (localStorage.getItem("arsepat:lang") as Lang) || "id";
  });
  const [theme, setThemeState] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("arsepat:theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    localStorage.setItem("arsepat:theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("arsepat:lang", lang);
  }, [lang]);

  const tRef = useCallback(
    (key: string) => {
      const def = DEFAULT_STRINGS[key];
      return def ? def[lang] : key;
    },
    [lang],
  );

  const refresh = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent === true;
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      if (!silent) toast.error(tRef("offline"));
      return;
    }
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [g, l, m] = await Promise.all([
        fetchGames(CSV_URLS.games),
        fetchLocalization(CSV_URLS.localization),
        fetchMetadata(CSV_URLS.metadata),
      ]);
      setGames(g);
      setLocalization(l);
      setMetadataRows(m);
      const ts = Date.now();
      setLastFetchedAt(ts);
      saveCache({ games: g, localization: l, metadata: m, ts });
      toast.success(tRef("refresh_success"));

      // Localization debugger (dev only)
      if (import.meta.env.DEV) {
        const have = new Set(l.map((r) => r.key));
        const missing = REQUIRED_LOCALIZATION_KEYS.filter((k) => !have.has(k));
        if (missing.length) {
          // eslint-disable-next-line no-console
          console.warn(
            `[Arsepat i18n] Missing ${missing.length} localization key(s) in spreadsheet:`,
            missing,
          );
        } else {
          // eslint-disable-next-line no-console
          console.info("[Arsepat i18n] All required localization keys present.");
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      if (!silent) toast.error(tRef("fetch_error"));
    } finally {
      if (!silent) setLoading(false);
    }
  }, [tRef]);

  useEffect(() => {
    // Initial load: silent if we already have cached data, visible otherwise.
    refresh({ silent: games.length > 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metadata = useMemo(() => metadataToRecord(metadataRows), [metadataRows]);

  const t = useCallback(
    (key: string, fallback?: string) => {
      const row = localization.find((r) => r.key === key);
      if (row) return lang === "id" ? row.id_text || row.en_text : row.en_text || row.id_text;
      const def = DEFAULT_STRINGS[key];
      if (def) return def[lang];
      return fallback ?? key;
    },
    [localization, lang],
  );

  const value = useMemo<DataState>(
    () => ({
      games,
      localization,
      metadata,
      loading,
      error,
      lastFetchedAt,
      refresh,
      lang,
      setLang: setLangState,
      t,
      theme,
      setTheme: setThemeState,
    }),
    [games, localization, metadata, loading, error, lastFetchedAt, refresh, lang, t, theme],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within StoreProvider");
  return v;
}
