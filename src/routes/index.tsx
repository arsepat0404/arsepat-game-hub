import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, ArrowDownUp } from "lucide-react";
import { Layout } from "@/components/Layout";
import { GameCard } from "@/components/GameCard";
import { GameModal } from "@/components/GameModal";
import { GameGridSkeleton } from "@/components/GameGridSkeleton";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useStore } from "@/lib/store";
import type { Game } from "@/lib/types";

type IndexSearch = { game?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): IndexSearch => ({
    game: typeof search.game === "string" ? search.game : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Arsepat — Game Hub" },
      {
        name: "description",
        content: "A curated hub of games and experiments by Arsepat.",
      },
      { property: "og:title", content: "Arsepat Game Hub" },
      { property: "og:description", content: "Releases, experiments, and works in progress." },
    ],
  }),
  component: HomePage,
});

type Filter = "all" | "Released" | "On-going";
type Sort = "title" | "progress" | "status";

const STATUS_RANK: Record<string, number> = {
  Released: 0,
  "On-going": 1,
  "Coming Soon": 2,
};

function HomePage() {
  const { games, t, loading, metadata } = useStore();
  const navigate = useNavigate({ from: "/" });
  const { game: gameParam } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("title");
  const [open, setOpen] = useState<Game | null>(null);

  // Deep-link: open the GameModal for ?game=<id|slug|title>
  useEffect(() => {
    if (!gameParam || games.length === 0) return;
    const needle = gameParam.toLowerCase();
    const match = games.find(
      (g) =>
        g.id?.toLowerCase() === needle ||
        g.title.toLowerCase() === needle ||
        g.title.toLowerCase().replace(/\s+/g, "-") === needle,
    );
    if (match) setOpen(match);
  }, [gameParam, games]);

  const handleOpen = (g: Game) => {
    setOpen(g);
    navigate({ search: { game: g.id || g.title }, replace: false });
  };
  const handleClose = () => {
    setOpen(null);
    navigate({ search: {}, replace: true });
  };

  const filtered = useMemo(() => {
    const list = games.filter((g) => {
      const matchesQ =
        !query.trim() ||
        g.title.toLowerCase().includes(query.toLowerCase()) ||
        g.description.toLowerCase().includes(query.toLowerCase());
      const matchesF = filter === "all" || g.status === filter;
      return matchesQ && matchesF;
    });
    const sorted = [...list];
    if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "progress")
      sorted.sort((a, b) => (b.progress_percent || 0) - (a.progress_percent || 0));
    else if (sort === "status")
      sorted.sort(
        (a, b) =>
          (STATUS_RANK[a.status] ?? 99) - (STATUS_RANK[b.status] ?? 99) ||
          a.title.localeCompare(b.title),
      );
    return sorted;
  }, [games, query, filter, sort]);

  
  const tagline = metadata.hero_tagline || t("hero_subtitle");

  return (
    <Layout>
      <PullToRefresh>
      <section className="text-center pt-6 md:pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-accent mb-5"
        >
          <Sparkles className="size-3.5" />
          {metadata.hero_badge || "Independent. Crafted. Playful."}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl md:text-6xl font-bold tracking-tight"
        >
          {metadata.hero_title || t("hero_title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-xl mx-auto text-foreground/70"
        >
          {tagline}
        </motion.p>
      </section>

      <div className="glass rounded-2xl p-3 md:p-4 mb-8 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-background/40">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_placeholder")}
            className="bg-transparent w-full outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-1.5 p-1 rounded-xl bg-background/40">
          {(
            [
              { v: "all", label: t("filter_all") },
              { v: "Released", label: t("filter_released") },
              { v: "On-going", label: t("filter_ongoing") },
            ] as const
          ).map((opt) => (
            <button
              key={opt.v}
              onClick={() => setFilter(opt.v as Filter)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === opt.v
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background/40">
          <ArrowDownUp className="size-4 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="bg-transparent text-sm outline-none cursor-pointer pr-1"
            aria-label={t("sort_label")}
          >
            <option className="bg-background" value="title">
              {t("sort_title")}
            </option>
            <option className="bg-background" value="progress">
              {t("sort_progress")}
            </option>
            <option className="bg-background" value="status">
              {t("sort_status")}
            </option>
          </select>
        </div>
      </div>

      {loading && filtered.length === 0 ? (
        <GameGridSkeleton />
      ) : games.length === 0 ? (
        <GameGridSkeleton />
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          {t("no_games")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 auto-rows-fr items-stretch">
          {filtered.map((g, i) => (
            <GameCard
              key={g.id || g.title}
              game={g}
              index={i}
              size="md"
              onOpen={handleOpen}
            />
          ))}
        </div>
      )}

      <GameModal game={open} onClose={handleClose} />
      </PullToRefresh>
    </Layout>
  );
}
