const CHUNK_RELOAD_KEY = "lovable:chunk-reload-at";
const CHUNK_RELOAD_INTERVAL = 10_000;

export const isChunkLoadError = (error: unknown) =>
  /dynamically imported module|Failed to fetch dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(
    String((error as Error)?.message || error)
  );

/**
 * Reload the page at most once per interval to pick up fresh chunks after a
 * redeploy. Returns true if a reload was triggered.
 */
export const reloadForFreshChunks = (): boolean => {
  try {
    const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
    const now = Date.now();
    if (now - lastReload < CHUNK_RELOAD_INTERVAL) return false;
    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now));
  } catch {
    // Storage unavailable — still attempt the safest recovery once.
  }
  window.location.reload();
  return true;
};