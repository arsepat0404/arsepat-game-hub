import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Arsepat" },
      { name: "description", content: "About the Arsepat Game Hub and its creator." },
      { property: "og:title", content: "About — Arsepat" },
      { property: "og:description", content: "About the Arsepat Game Hub and its creator." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { metadata, t } = useStore();
  const about = metadata.about_text || t("about_arsepat");
  const brand = metadata.site_title || "Arsepat";
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 md:p-12 max-w-3xl mx-auto"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-5">
          {t("nav_about")} <span className="text-accent">{brand}</span>
        </h1>
        <p className="text-foreground/80 text-lg leading-relaxed whitespace-pre-line">{about}</p>
      </motion.div>
    </Layout>
  );
}
