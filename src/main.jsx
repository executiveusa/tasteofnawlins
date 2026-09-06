import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const rootNode = document.getElementById('root')

function BootFallback() {
  return (
    <main id="boot-fallback" aria-label="Taste of Nawlins fallback">
      <small>New Orleans · Pacific Northwest</small>
      <h1>New Orleans food,<br />wherever we pull up.</h1>
      <p>Beignets · Chicory coffee · Red beans</p>
    </main>
  )
}

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    console.error('Taste of Nawlins render failure:', error, info)
    document.documentElement.dataset.appFailed = 'true'
  }

  render() {
    if (this.state.failed) return <BootFallback />
    return this.props.children
  }
}

async function mountApp() {
  try {
    const { default: App } = await import('./App.jsx')
    createRoot(rootNode).render(
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>,
    )
  } catch (error) {
    console.error('Taste of Nawlins failed to load:', error)
    document.documentElement.dataset.appFailed = 'true'
  }
}

mountApp()
