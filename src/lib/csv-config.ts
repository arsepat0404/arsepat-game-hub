// ============================================================================
// ARSEPAT — Internal CSV configuration (developer-only)
// ----------------------------------------------------------------------------
// These URLs are hardcoded on purpose. End users do NOT see or edit them.
// To update the data source, edit this file and redeploy.
//
// See ARSEPAT_GUIDE.md (project root) for instructions on how to obtain
// "Publish to web" CSV URLs and the required column structure for each tab.
// ============================================================================

export type SheetKey = "games" | "localization" | "metadata";

const BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOqjkvAFy7qU8NEZcIJubfGkPi6dm8sdgdp2La126hWaTYAxs3nYMzMpq9BHyHdoiC4qXC-aDqUyZH/pub";

export const CSV_URLS: Record<SheetKey, string> = {
  games: `${BASE}?gid=0&single=true&output=csv`,
  localization: `${BASE}?gid=2118621333&single=true&output=csv`,
  metadata: `${BASE}?gid=744840316&single=true&output=csv`,
};
