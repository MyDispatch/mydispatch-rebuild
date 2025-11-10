// Minimal client-side fallback without build
// Renders a simple message and guidance into #root

const root = document.getElementById('root');

const style = document.createElement('style');
style.textContent = `
  .wrap { padding: 24px; font-family: Inter, system-ui, -apple-system, Arial, sans-serif; }
  .card { max-width: 840px; margin: 32px auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background: #ffffff; }
  .title { font-size: 20px; font-weight: 600; color: #111827; }
  .subtitle { margin-top: 8px; font-size: 14px; color: #4b5563; }
  .code { background: #f3f4f6; padding: 8px 12px; border-radius: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
  .steps { margin-top: 16px; }
  .steps li { margin: 6px 0; }
  .ok { display: inline-block; margin-top: 12px; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 6px 10px; border-radius: 8px; }
`;
document.head.appendChild(style);

root.innerHTML = `
  <div class="wrap">
    <div class="card">
      <div class="title">MyDispatch – Minimal Fallback</div>
      <div class="subtitle">No production build found at <span class="code">/dist/index.html</span>.</div>

      <div class="steps">
        <ol>
          <li>Install dependencies: <span class="code">npm install --no-audit --no-fund --prefer-offline</span></li>
          <li>Build the app: <span class="code">npm run build</span></li>
          <li>Restart server: <span class="code">npm start</span></li>
        </ol>
      </div>

      <p class="ok">Server is running correctly. Build steps are required to load the full UI.</p>
    </div>
  </div>
`;

