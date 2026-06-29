import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "arsepat:install-dismissed";
const INSTALLED_KEY = "arsepat:installed";

export function InstallPrompt() {
  const { t } = useStore();
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS
      window.navigator.standalone === true;
    if (standalone || localStorage.getItem(INSTALLED_KEY)) {
      setInstalled(true);
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      if (!localStorage.getItem(DISMISS_KEY)) setShow(true);
    };
    const onInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, "1");
      setInstalled(true);
      setShow(false);
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 4000);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    if (outcome === "dismissed") {
      localStorage.setItem(DISMISS_KEY, "1");
    }
    setShow(false);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {justInstalled ? (
        <motion.div
          key="installed"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-4 right-4 z-50 max-w-xs"
        >
          <div className="glass rounded-xl p-3 flex items-center gap-2 text-sm">
            <CheckCircle2 className="size-4 text-accent" />
            <span>{t("install_done")}</span>
          </div>
        </motion.div>
      ) : null}

      {show && !installed ? (
        <motion.div
          key="install"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="glass rounded-2xl p-4 border border-accent/30">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center size-10 rounded-xl bg-accent text-accent-foreground shrink-0">
                <Download className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm">{t("install_title")}</p>
                <p className="text-xs text-foreground/70 mt-0.5">
                  {t("install_body")}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={install}
                    className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-semibold hover:opacity-90 transition"
                  >
                    {t("install_yes")}
                  </button>
                  <button
                    onClick={dismiss}
                    className="px-3 py-1.5 rounded-lg text-xs text-foreground/70 hover:text-foreground transition"
                  >
                    {t("install_later")}
                  </button>
                </div>
              </div>
              <button
                onClick={dismiss}
                aria-label="Tutup"
                className="text-foreground/50 hover:text-foreground transition"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
