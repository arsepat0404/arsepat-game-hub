export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  const inIframe = (() => { try { return window.self !== window.top; } catch { return true; } })();
  const isDevHost = ["localhost","127.0.0.1"].includes(window.location.hostname);
  if (inIframe || isDevHost) {
    navigator.serviceWorker.getRegistrations().then(r => r.forEach(s => s.unregister()));
    return;
  }
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
