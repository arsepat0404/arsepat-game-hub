import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Announcement } from "./Announcement";
import { OfflineIndicator } from "./OfflineIndicator";
import { InstallPrompt } from "./InstallPrompt";
import { useStore } from "@/lib/store";

export function Layout({ children }: { children: ReactNode }) {
  const { loading } = useStore();
  return (
    <div className="min-h-screen flex flex-col">
      {loading ? (
        <div
          aria-hidden
          className="fixed top-0 left-0 right-0 h-0.5 z-50 overflow-hidden"
        >
          <div className="h-full w-1/3 bg-accent animate-[loadingbar_1.1s_ease-in-out_infinite] shadow-[0_0_12px_var(--color-accent)]" />
        </div>
      ) : null}
      <Navbar />
      <Announcement />
      <main className="flex-1 mx-auto w-[min(1200px,94%)] mt-8">{children}</main>
      <Footer />
      <OfflineIndicator />
      <InstallPrompt />
    </div>
  );
}
