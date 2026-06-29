import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Share2, Link as LinkIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import type { Game } from "@/lib/types";
import { useStore } from "@/lib/store";
import { badgeShapeClass, genreBadgeStyle, tagBadgeStyle } from "@/lib/badges";

interface Props {
  game: Game | null;
  onClose: () => void;
}

function DescriptionList({ text }: { text: string }) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const items: string[] = [];
  const paragraphs: string[] = [];
  for (const line of lines) {
    if (line.startsWith("- ") || line.startsWith("-")) {
      items.push(line.replace(/^-+\s?/, ""));
    } else {
      paragraphs.push(line);
    }
  }
  return (
    <div className="space-y-3 text-foreground/85 leading-relaxed">
      {paragraphs.map((p, i) => (
        <p key={`p-${i}`}>{p}</p>
      ))}
      {items.length > 0 ? (
        <ul className="space-y-1.5 pl-1">
          {items.map((it, i) => (
            <li key={`i-${i}`} className="flex gap-2">
              <span className="text-accent mt-1.5 size-1.5 rounded-full bg-accent shrink-0" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function GameModal({ game, onClose }: Props) {
  const { t, metadata } = useStore();
  const shape = badgeShapeClass(metadata.badge_shape);
  const genreStyle = genreBadgeStyle(metadata);
  const tagStyle = tagBadgeStyle(metadata);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const buildShareMessage = (g: Game) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/?game=${encodeURIComponent(g.id || g.title)}`;
    return { title: g.title, text: `${g.title} — ${t("share")} via Arsepat`, url };
  };

  const copyLink = async (url: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      toast.success(t("link_copied"));
    } catch {
      toast.error("Could not copy link");
    }
  };

  const share = async () => {
    if (!game) return;
    const data = buildShareMessage(game);
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(data);
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }
    await copyLink(data.url);
  };

  return (
    <AnimatePresence>
      {game ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl glass-strong rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div
              className="relative h-56 md:h-72 bg-cover bg-center shrink-0"
              style={{
                backgroundImage: game.image_url
                  ? `url(${game.image_url})`
                  : "linear-gradient(135deg, var(--primary), var(--accent))",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 size-9 grid place-items-center rounded-full bg-background/60 backdrop-blur hover:bg-background/80 transition"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-accent text-accent-foreground">
                  {game.status}
                </span>
                <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold drop-shadow">
                  {game.title}
                </h2>
                {(game.genre || game.tags.length > 0) ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {game.genre ? (
                      <span
                        style={genreStyle}
                        className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-accent text-accent-foreground ${shape}`}
                      >
                        {game.genre}
                      </span>
                    ) : null}
                    {game.tags.map((tag) => (
                      <span
                        key={tag}
                        style={tagStyle}
                        className={`px-2.5 py-1 text-[11px] font-medium bg-accent/15 text-accent border border-accent/40 ${shape}`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto">
              {game.status === "On-going" ? (
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>{t("progress")}</span>
                    <span className="text-accent font-semibold">{game.progress_percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, Math.max(0, game.progress_percent))}%`,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ) : null}

              <DescriptionList text={game.description} />

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {game.status === "Released" && game.play_url ? (
                  <a
                    href={game.play_url}
                    rel="noopener"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold accent-glow hover:opacity-90 transition"
                  >
                    {t("play_now")}
                    <ExternalLink className="size-4" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => toast.info(t("in_development"))}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold accent-glow hover:opacity-90 transition"
                  >
                    {t("play_now")}
                  </button>
                )}
                <button
                  onClick={share}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:bg-accent/10 transition"
                >
                  <Share2 className="size-4" />
                  {t("share")}
                </button>
                <button
                  onClick={() => {
                    const origin = typeof window !== "undefined" ? window.location.origin : "";
                    copyLink(`${origin}/?game=${encodeURIComponent(game.id || game.title)}`);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-foreground/80 hover:text-accent transition"
                >
                  <LinkIcon className="size-4" />
                  {t("copy_link")}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
