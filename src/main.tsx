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
import { reloadForFreshChunks } from './lib/chunkReload'

window.addEventListener('vite:preloadError', (event) => {
  // Only swallow the error if we actually reload. Calling preventDefault()
  // makes Vite's preload helper RESOLVE the import with `undefined`, which
  // corrupts React.lazy ("_result is undefined") if no reload happens.
  if (reloadForFreshChunks()) {
    event.preventDefault()
  }
})

initTheme();

createRoot(document.getElementById("root")!).render(<App />);
