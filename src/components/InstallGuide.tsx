import { useEffect, useState } from "react";
import { ChevronDown, Download, Smartphone, Apple, Monitor } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function Accordion({
  icon,
  title,
  children,
  defaultOpen,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-xl border border-border/60 bg-background/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/5 transition"
        aria-expanded={open}
      >
        <span className="grid place-items-center size-8 rounded-lg bg-accent/15 text-accent shrink-0">
          {icon}
        </span>
        <span className="flex-1 font-medium text-sm">{title}</span>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div className="px-4 pb-4 pt-1 text-sm text-foreground/80 leading-relaxed">{children}</div>
      ) : null}
    </div>
  );
}

export function InstallGuide() {
  const { t, lang } = useStore();
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const standalone =
        window.matchMedia?.("(display-mode: standalone)").matches ||
        // @ts-expect-error iOS
        window.navigator.standalone === true;
      if (standalone) setInstalled(true);
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!evt) {
      toast.info(
        lang === "id"
          ? "Browser ini belum siap memasang. Coba ikuti panduan di bawah."
          : "Browser not ready to install. Follow the guide below.",
      );
      return;
    }
    await evt.prompt();
    await evt.userChoice;
    setEvt(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={install}
          disabled={installed}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold accent-glow hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Download className="size-4" />
          {installed
            ? lang === "id"
              ? "Sudah Terpasang"
              : "Already Installed"
            : t("install_yes")}
        </button>
        {!evt && !installed ? (
          <span className="text-xs text-muted-foreground">
            {lang === "id"
              ? "Jika tombol tidak aktif, gunakan panduan di bawah."
              : "If the button is disabled, follow the guide below."}
          </span>
        ) : null}
      </div>

      <div className="space-y-2.5">
        <Accordion icon={<Smartphone className="size-4" />} title={lang === "id" ? "Chrome di Android" : "Chrome on Android"} defaultOpen>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>{lang === "id" ? "Buka situs ini di Chrome." : "Open this site in Chrome."}</li>
            <li>
              {lang === "id"
                ? "Ketuk menu titik tiga (⋮) di pojok kanan atas."
                : "Tap the three-dot menu (⋮) in the top right."}
            </li>
            <li>
              {lang === "id"
                ? 'Pilih "Tambahkan ke Layar Utama" atau "Pasang aplikasi".'
                : 'Choose "Add to Home screen" or "Install app".'}
            </li>
            <li>
              {lang === "id"
                ? "Konfirmasi dengan ketuk Pasang. Ikon Arsepat akan muncul di layar utama."
                : "Confirm by tapping Install. The Arsepat icon appears on your home screen."}
            </li>
          </ol>
        </Accordion>

        <Accordion icon={<Apple className="size-4" />} title={lang === "id" ? "Safari di iPhone / iPad" : "Safari on iPhone / iPad"}>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>{lang === "id" ? "Buka situs ini di Safari (bukan Chrome)." : "Open this site in Safari (not Chrome)."}</li>
            <li>
              {lang === "id"
                ? "Ketuk ikon Share (kotak dengan panah ke atas) di bilah bawah."
                : "Tap the Share icon (square with up arrow) in the bottom bar."}
            </li>
            <li>
              {lang === "id"
                ? 'Gulir dan pilih "Tambahkan ke Layar Utama" / "Add to Home Screen".'
                : 'Scroll and choose "Add to Home Screen".'}
            </li>
            <li>{lang === "id" ? "Ketuk Tambah. Arsepat akan terbuka layaknya aplikasi native." : "Tap Add. Arsepat will open like a native app."}</li>
          </ol>
        </Accordion>

        <Accordion icon={<Monitor className="size-4" />} title={lang === "id" ? "Desktop (Chrome / Edge)" : "Desktop (Chrome / Edge)"}>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>
              {lang === "id"
                ? "Perhatikan ikon Install (komputer dengan panah ke bawah) di ujung kanan address bar."
                : "Look for the Install icon (monitor with down arrow) at the right of the address bar."}
            </li>
            <li>
              {lang === "id"
                ? "Klik ikon tersebut, lalu klik Pasang. Atau buka menu ⋮ → Pasang Arsepat."
                : "Click it and confirm Install. Or open ⋮ menu → Install Arsepat."}
            </li>
            <li>
              {lang === "id"
                ? "Arsepat akan terbuka di jendela terpisah dan menambahkan ikon ke Start / Dock."
                : "Arsepat opens in its own window and adds an icon to Start / Dock."}
            </li>
          </ol>
        </Accordion>
      </div>
    </div>
  );
}
