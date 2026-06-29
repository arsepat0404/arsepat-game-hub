import { useStore } from "@/lib/store";
import { Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isMetadataEnabled } from "@/lib/badges";

export function Announcement() {
  const { metadata } = useStore();
  const msg = metadata.announcement;
  const enabled = isMetadataEnabled(metadata, "announcement_enabled", true);
  return (
    <AnimatePresence>
      {msg && enabled ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mx-auto mt-3 w-[min(1200px,94%)]"
        >
          <div className="glass rounded-xl px-4 py-2.5 text-sm flex items-center gap-2">
            <Megaphone className="size-4 text-accent shrink-0" />
            <span className="text-foreground/85">{msg}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
