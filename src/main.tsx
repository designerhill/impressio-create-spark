import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initTheme } from './hooks/useTheme'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'

const CHUNK_RELOAD_KEY = 'lovable:chunk-reload-at'
const CHUNK_RELOAD_INTERVAL = 10_000

const reloadForFreshChunks = () => {
  try {
    const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0)
    const now = Date.now()

    if (now - lastReload < CHUNK_RELOAD_INTERVAL) return false

    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now))
  } catch {
    // If storage is unavailable, still try the safest recovery.
  }

  window.location.reload()
  return true
}

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  reloadForFreshChunks()
})

initTheme();

createRoot(document.getElementById("root")!).render(<App />);
