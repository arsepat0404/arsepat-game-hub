import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Gamepad2, WifiOff } from "lucide-react";
import { PLACEHOLDER_LOGO } from "@/lib/assets";

export function Navbar() {
  const { t, metadata, lang, setLang } = useStore();
  const title = metadata.site_title || "Arsepat";
  const logo = metadata.app_logo_url || PLACEHOLDER_LOGO;

  const [online, setOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto mt-4 w-[min(1200px,94%)] glass rounded-2xl px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 group min-w-0 shrink">
          {logo ? (
            <img
              src={logo}
              alt={`${title} logo`}
              width={36}
              height={36}
              className="size-9 rounded-xl object-contain bg-primary/40 p-1 accent-glow shrink-0"
            />
          ) : (
            <span className="grid place-items-center size-9 rounded-xl bg-accent text-accent-foreground accent-glow shrink-0">
              <Gamepad2 className="size-5" />
            </span>
          )}
          <span className="hidden sm:inline font-display text-lg font-bold tracking-tight truncate">
            {title}
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1 text-sm shrink-0">
          {[
            { to: "/", label: t("nav_home") },
            { to: "/about", label: t("nav_about") },
            { to: "/settings", label: t("nav_settings") },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-accent/20 text-accent" }}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors text-foreground/80 hover:text-foreground whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => setLang(lang === "id" ? "en" : "id")}
            aria-label="Toggle language"
            className="ml-0.5 sm:ml-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold uppercase hover:bg-accent/10 transition-colors text-foreground/80 hover:text-foreground border border-border/50"
          >
            {lang}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {!online && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-auto w-[min(1200px,94%)] mt-1.5 overflow-hidden"
          >
            <div className="flex items-center justify-center gap-2 rounded-xl bg-accent/10 border border-accent/20 px-4 py-2 text-sm text-accent">
              <WifiOff className="size-4 shrink-0" />
              <span className="font-medium">{t("offline_banner")}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
