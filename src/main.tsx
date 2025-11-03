import React from 'react'
import { createRoot } from 'react-dom/client'

console.log('🚀 MINIMAL APP STARTING...')
console.log('React version:', React.version)

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('No root element!')
}

console.log('✅ Root element found')

const root = createRoot(rootElement)

console.log('✅ Root created')

root.render(
  <div style={{ 
    padding: '40px', 
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center'
  }}>
    <h1 style={{ color: '#10b981', marginBottom: '20px' }}>
      ✅ REACT IS WORKING!
    </h1>
    <p style={{ fontSize: '18px', marginBottom: '10px' }}>
      If you see this, React is rendering correctly.
    </p>
    <p style={{ color: '#666', fontSize: '14px' }}>
      React version: {React.version}
    </p>
    <p style={{ color: '#666', fontSize: '14px' }}>
      Environment: {import.meta.env.MODE}
    </p>
    <div style={{ 
      marginTop: '30px', 
      padding: '20px', 
      background: '#f0f0f0',
      borderRadius: '8px'
    }}>
      <p><strong>This means:</strong></p>
      <ul style={{ textAlign: 'left', marginTop: '10px' }}>
        <li>✅ JavaScript is loading</li>
        <li>✅ React is initializing</li>
        <li>✅ Rendering is working</li>
        <li>✅ Build system is OK</li>
      </ul>
    </div>
  </div>
)

console.log('✅ Render called')

setTimeout(() => {
  console.log('✅ App fully loaded')
}, 100)
