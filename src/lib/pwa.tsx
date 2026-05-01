'use client'

import { useEffect } from 'react'

export function usePWAInstall() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration)
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission)
      })
    }

    // Store PWA deferral event
    let deferredPrompt: any

    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault()
      deferredPrompt = e
      // Show install button if needed
      const installButton = document.getElementById('install-pwa-button')
      if (installButton) {
        installButton.style.display = 'block'
        installButton.addEventListener('click', () => {
          if (deferredPrompt) {
            deferredPrompt.prompt()
            deferredPrompt.userChoice.then((choiceResult: any) => {
              if (choiceResult.outcome === 'accepted') {
                console.log('User installed PWA')
              }
              deferredPrompt = null
            })
          }
        })
      }
    })

    // Handle app installed event
    window.addEventListener('appinstalled', () => {
      console.log('ATLAS LifeOS installed as PWA')
      // Hide install button after installation
      const installButton = document.getElementById('install-pwa-button')
      if (installButton) {
        installButton.style.display = 'none'
      }
    })
  }, [])
}

export function PWAInstallButton() {
  return (
    <button
      id="install-pwa-button"
      style={{ display: 'none' }}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Install App
    </button>
  )
}
