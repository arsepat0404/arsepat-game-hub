// ============================================================================
// ARSEPAT — Internal CSV configuration (developer-only)
// ----------------------------------------------------------------------------
// These URLs are hardcoded on purpose. End users do NOT see or edit them.
// To update the data source, edit this file and redeploy.
// ============================================================================

export type SheetKey = "games" | "localization" | "metadata";

// Using a Google Apps Script Web App as a proxy instead of the "Publish to
// web" CSV export. This avoids CORS/403 issues when fetched from a hosted
// domain (e.g. Cloudflare Pages/Workers) and reads directly from the active
// spreadsheet via SpreadsheetApp, so no spreadsheet ID/URL needs to be
// embedded here.
const APPS_SCRIPT_BASE =
  "https://script.google.com/macros/s/AKfycbzvHe_ZBWZURHzvlwXZa6GXsBkOXCpYdgozFKVHPeQMaWctZsWyhunI4Bvr2ek_DpG0sw/exec";

export const CSV_URLS: Record<SheetKey, string> = {
  games: `${APPS_SCRIPT_BASE}?sheet=games`,
  localization: `${APPS_SCRIPT_BASE}?sheet=localization`,
  metadata: `${APPS_SCRIPT_BASE}?sheet=metadata`,
};
