import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const rootNode = document.getElementById('root')

async function mountApp() {
  try {
    const { default: App } = await import('./App.jsx')
    createRoot(rootNode).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  } catch (error) {
    console.error('Taste of Nawlins failed to mount:', error)
    document.documentElement.dataset.appFailed = 'true'
  }
}

mountApp()
