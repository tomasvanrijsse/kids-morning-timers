import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

// Register service worker for PWA updates
const updateSW = registerSW({
  onNeedRefresh() {
    // Auto-reload when new version is available
    updateSW(true)
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

createApp(App).mount('#app')
