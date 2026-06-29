import { motion } from "framer-motion";
import type { Game } from "@/lib/types";
import { useStore } from "@/lib/store";
import {
  badgeShapeClass,
  genreBadgeStyle,
  tagBadgeStyle,
  tagMaxCount,
} from "@/lib/badges";

interface Props {
  game: Game;
  index: number;
  size?: "sm" | "md" | "lg";
  onOpen: (g: Game) => void;
}

const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
  sm: "aspect-[4/3]",
  md: "aspect-[4/3]",
  lg: "aspect-[4/3]",
};

export function GameCard({ game, index, size = "md", onOpen }: Props) {
  const { t, metadata } = useStore();
  const shape = badgeShapeClass(metadata.badge_shape);
  const maxTags = tagMaxCount(metadata, 2);
  const genreStyle = genreBadgeStyle(metadata);
  const tagStyle = tagBadgeStyle(metadata);
  const status = game.status;
  const statusColor =
    status === "Released"
      ? "bg-accent text-accent-foreground"
      : status === "On-going"
        ? "bg-accent/20 text-accent border border-accent/40"
        : "bg-muted text-muted-foreground";

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(game)}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-3xl glass text-left w-full h-full ${sizeClasses[size]}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: game.image_url
            ? `url(${game.image_url})`
            : "linear-gradient(135deg, var(--primary), var(--accent))",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="relative h-full w-full p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${statusColor}`}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {status}
          </span>
        </div>
        <div className="text-white">
          <h3 className="font-display text-xl md:text-2xl font-bold leading-tight drop-shadow">
            {game.title}
          </h3>
          {(game.genre || game.tags.length > 0) ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {game.genre ? (
                <span
                  style={genreStyle}
                  className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-accent text-accent-foreground ${shape}`}
                >
                  {game.genre}
                </span>
              ) : null}
              {game.tags.slice(0, maxTags).map((tag) => (
                <span
                  key={tag}
                  style={tagStyle}
                  className={`px-2 py-0.5 text-[10px] font-medium bg-accent/15 text-accent border border-accent/30 ${shape}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          {game.status === "On-going" ? (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-white/80 mb-1">
                <span>{t("progress")}</span>
                <span>{game.progress_percent}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${Math.min(100, Math.max(0, game.progress_percent))}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </motion.button>
  );
}
