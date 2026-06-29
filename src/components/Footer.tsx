import { useStore } from "@/lib/store";
import { isMetadataEnabled } from "@/lib/badges";

export function Footer() {
  const { metadata, t } = useStore();
  const year = new Date().getFullYear();
  const brand = metadata.site_title || "Arsepat";
  // Tagline is optional. Leave the `footer_tagline` cell empty in the
  // Metadata sheet to hide the "— ..." suffix entirely.
  const taglineRaw = metadata.footer_tagline;
  const tagline =
    taglineRaw === undefined ? t("footer_tagline") : taglineRaw.trim();
  const links = [
    { label: "Twitter", url: metadata.social_twitter, flag: "social_twitter_enabled" },
    { label: "Instagram", url: metadata.social_instagram, flag: "social_instagram_enabled" },
    { label: "GitHub", url: metadata.social_github, flag: "social_github_enabled" },
    { label: "Website", url: metadata.social_website, flag: "social_website_enabled" },
  ].filter((l) => l.url && isMetadataEnabled(metadata, l.flag, true));

  return (
    <footer className="mt-24 pb-10">
      <div className="mx-auto w-[min(1200px,94%)] glass rounded-2xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          © {year}{" "}
          <span className="font-display font-bold text-accent">{brand}</span>
          {tagline ? <> — {tagline}</> : null}
        </div>
        {links.length > 0 ? (
          <div className="flex items-center gap-3 text-sm">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="text-foreground/70 hover:text-accent transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
