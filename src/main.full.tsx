import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ProductionErrorBoundary from './components/shared/ProductionErrorBoundary'
import './index.css'

// DIAGNOSTIC: Log initialization
console.log('🚀 MyDispatch initializing...')
console.log('📦 React version:', React.version)
console.log('🌍 Environment:', import.meta.env.MODE)

// CRITICAL: Global error handler to catch ALL errors
window.addEventListener('error', (event) => {
  console.error('🔴 GLOBAL ERROR:', event.error || event.message)
  console.error('Stack:', event.error?.stack)
  
  const errorMsg = event.message || ''
  
  // Show error on screen for debugging
  const errorDiv = document.createElement('div')
  errorDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;background:red;color:white;padding:20px;z-index:99999;font-family:monospace;'
  errorDiv.innerHTML = `
    <h1>ERROR DETECTED:</h1>
    <pre>${event.error?.message || errorMsg}</pre>
    <pre>${event.error?.stack || 'No stack trace'}</pre>
  `
  document.body.appendChild(errorDiv)
  
  if (
    errorMsg.includes('Failed to fetch dynamically imported module') ||
    errorMsg.includes('Importing a module script failed') ||
    errorMsg.includes('Failed to load module script')
  ) {
    console.warn('Chunk load error detected, reloading page...')
    setTimeout(() => window.location.reload(), 2000)
    event.preventDefault()
  }
})

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('🔴 UNHANDLED PROMISE REJECTION:', event.reason)
  
  const errorDiv = document.createElement('div')
  errorDiv.style.cssText = 'position:fixed;top:50px;left:0;right:0;background:orange;color:white;padding:20px;z-index:99999;font-family:monospace;'
  errorDiv.innerHTML = `
    <h1>PROMISE REJECTION:</h1>
    <pre>${event.reason?.message || String(event.reason)}</pre>
  `
  document.body.appendChild(errorDiv)
})

console.log('🚀 main.tsx: Starting app initialization...')

// Render app with try-catch
try {
  const rootElement = document.getElementById('root')
  
  if (!rootElement) {
    throw new Error('Root element not found')
  }
  
  console.log('✅ Root element found')
  console.log('🔧 Creating React root...')
  
  const root = createRoot(rootElement)
  
  console.log('✅ React root created')
  console.log('🎨 Rendering App component...')
  
  root.render(
    <StrictMode>
      <ProductionErrorBoundary>
        <App />

      </ProductionErrorBoundary>
    </StrictMode>
  )
  
  console.log('✅ App rendered successfully!')
} catch (error) {
  console.error('🔴 FATAL ERROR in main.tsx:', error)
  
  // Show fatal error on screen
  document.body.innerHTML = `
    <div style="padding:40px;font-family:sans-serif;">
      <h1 style="color:red;">Fatal Error</h1>
      <p>The application failed to start.</p>
      <pre style="background:#f5f5f5;padding:20px;border-radius:8px;overflow:auto;">${error instanceof Error ? error.message : String(error)}\n\n${error instanceof Error ? error.stack : ''}</pre>
      <button onclick="window.location.reload()" style="margin-top:20px;padding:10px 20px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;">Reload Page</button>
    </div>
  `
}
