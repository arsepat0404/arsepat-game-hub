import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Moon, Sun, RefreshCw, Languages, Info, Download } from "lucide-react";
import { Layout } from "@/components/Layout";
import { InstallGuide } from "@/components/InstallGuide";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Arsepat" },
      { name: "description", content: "Configure language and theme for the Arsepat Game Hub." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme, lang, setLang, refresh, loading, t, metadata } = useStore();
  const about = metadata.about_text || t("about_arsepat");

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-bold"
        >
          {t("nav_settings")}
        </motion.h1>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold mb-4">{t("appearance")}</h2>
          <div className="flex gap-2 p-1 rounded-xl bg-background/40 w-fit">
            <button
              onClick={() => setTheme("dark")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                theme === "dark" ? "bg-accent text-accent-foreground" : "text-foreground/70"
              }`}
            >
              <Moon className="size-4" /> {t("theme_dark")}
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                theme === "light" ? "bg-accent text-accent-foreground" : "text-foreground/70"
              }`}
            >
              <Sun className="size-4" /> {t("theme_light")}
            </button>
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Download className="size-5 text-accent" />
            {t("install_title")}
          </h2>
          <InstallGuide />
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Languages className="size-5 text-accent" /> {t("language")}
          </h2>
          <div className="flex gap-2 p-1 rounded-xl bg-background/40 w-fit">
            {(["en", "id"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase transition ${
                  lang === l ? "bg-accent text-accent-foreground" : "text-foreground/70"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
            <Info className="size-5 text-accent" /> {t("about")}
          </h2>
          <p className="text-foreground/80 leading-relaxed">{about}</p>
        </section>

        <div className="flex justify-end">
          <button
            onClick={() => refresh()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-accent text-accent-foreground font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            {t("refresh_data")}
          </button>
        </div>
      </div>
    </Layout>
  );
}
