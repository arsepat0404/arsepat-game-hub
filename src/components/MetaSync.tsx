import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { PLACEHOLDER_OG, PLACEHOLDER_LOGO } from "@/lib/assets";

function setMeta(selector: string, attr: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, key, val] = selector.match(/\[(.+?)="(.+?)"\]/) || [];
    if (key && val) el.setAttribute(key, val);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, content);
}

function setLink(rel: string, href: string) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function MetaSync() {
  const { metadata, lang } = useStore();
  useEffect(() => {
    const title = metadata.site_title || "Arsepat";
    const fullTitle = metadata.og_title || `${title} — Game Hub`;
    const desc = metadata.og_description || metadata.site_meta_description || "Kumpulan game seru buatan Arsepat. Langsung main tanpa download!";
    // Language-specific OG image with spreadsheet override
    const ogId = metadata.og_image_id_url || metadata.og_image_url || "/og-image.jpg";
    const ogEn = metadata.og_image_en_url || metadata.og_image_url || "/og-image-en.jpg";
    const og = lang === "id" ? ogId : ogEn;
    const icon = metadata.app_icon_url || metadata.app_logo_url || PLACEHOLDER_LOGO;

    document.title = fullTitle;
    document.documentElement.lang = lang === "id" ? "id" : "en";
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:locale"]', "content", lang === "id" ? "id_ID" : "en_US");
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:image"]', "content", og);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", desc);
    setMeta('meta[name="twitter:image"]', "content", og);
    if (icon) {
      setLink("icon", icon);
      setLink("apple-touch-icon", icon);
    }
    // Reference PLACEHOLDER_OG to avoid unused import warning
    void PLACEHOLDER_OG;
  }, [metadata, lang]);
  return null;
}
