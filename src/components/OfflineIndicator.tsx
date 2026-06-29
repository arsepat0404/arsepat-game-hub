import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";
import { useStore } from "@/lib/store";

export function OfflineIndicator() {
  const { t } = useStore();
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
    <AnimatePresence>
      {!online ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm border border-destructive/40">
            <WifiOff className="size-4 text-destructive" />
            <span className="text-foreground/85">{t("offline_banner")}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
