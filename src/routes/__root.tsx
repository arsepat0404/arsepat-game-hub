import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { useEffect } from "react";
import appCss from "../styles.css?url";
import { StoreProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";
import { registerServiceWorker } from "@/lib/register-sw";
import { MetaSync } from "@/components/MetaSync";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Arsepat — Game Hub" },
      { name: "description", content: "Hub game kurasi Arsepat — bikin tongkrongan jadi rame." },
      { name: "author", content: "Arsepat" },
      { name: "theme-color", content: "#062c16" },
      { name: "application-name", content: "Arsepat" },
      { name: "apple-mobile-web-app-title", content: "Arsepat" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "format-detection", content: "telephone=no" },
      { property: "og:title", content: "Arsepat — Game Hub" },
      { property: "og:description", content: "Hub game kurasi Arsepat — bikin tongkrongan jadi rame." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Arsepat" },
      { property: "og:url", content: "https://arsepat-game.web.id" },
      { property: "og:image", content: "https://arsepat-game.web.id/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Arsepat — Game Hub" },
      { name: "twitter:description", content: "Hub game kurasi Arsepat — bikin tongkrongan jadi rame." },
      { name: "twitter:image", content: "https://arsepat-game.web.id/og-image.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "apple-touch-icon", sizes: "57x57", href: "/apple-touch-icon-57.png" },
      { rel: "apple-touch-icon", sizes: "60x60", href: "/apple-touch-icon-60.png" },
      { rel: "apple-touch-icon", sizes: "72x72", href: "/apple-touch-icon-72.png" },
      { rel: "apple-touch-icon", sizes: "76x76", href: "/apple-touch-icon-76.png" },
      { rel: "apple-touch-icon", sizes: "114x114", href: "/apple-touch-icon-114.png" },
      { rel: "apple-touch-icon", sizes: "120x120", href: "/apple-touch-icon-120.png" },
      { rel: "apple-touch-icon", sizes: "144x144", href: "/apple-touch-icon-144.png" },
      { rel: "apple-touch-icon", sizes: "152x152", href: "/apple-touch-icon-152.png" },
      { rel: "apple-touch-icon", sizes: "167x167", href: "/apple-touch-icon-167.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon-180.png" },
      { rel: "apple-touch-startup-image", href: "/icon-512.png" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('arsepat:theme')||'dark';document.documentElement.classList.remove('dark','light');document.documentElement.classList.add(t);}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <MetaSync />
        <Outlet />
        <Toaster
          position="top-center"
          theme="dark"
          toastOptions={{
            style: {
              background: "color-mix(in oklab, var(--color-popover) 85%, transparent)",
              border: "1px solid color-mix(in oklab, var(--color-accent) 30%, transparent)",
              color: "var(--color-foreground)",
              backdropFilter: "blur(18px)",
            },
          }}
        />
      </StoreProvider>
    </QueryClientProvider>
  );
}
