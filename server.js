import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;
const HOST = process.env.HOST || '127.0.0.1';
const BASE_PATH = process.env.BASE_PATH || process.env.VITE_BASE_PATH || "/";
const DIST_PATH = join(__dirname, 'dist');
const HAS_BUILD = fs.existsSync(join(DIST_PATH, 'index.html'));

// Serve static files
if (HAS_BUILD) {
  // Built assets
  if (BASE_PATH !== "/") {
    app.use(BASE_PATH, express.static(DIST_PATH));
  } else {
    app.use(express.static(DIST_PATH));
  }
} else {
  // Fallback: serve public assets and minimal index for development without build
  app.use(express.static(join(__dirname, 'public')));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle SPA routing
if (HAS_BUILD) {
  // All routes serve built index.html
  if (BASE_PATH !== "/") {
    app.get(BASE_PATH + '*', (req, res) => {
      res.sendFile(join(DIST_PATH, 'index.html'));
    });
  } else {
    app.get('*', (req, res) => {
      res.sendFile(join(DIST_PATH, 'index.html'));
    });
  }
} else {
  // Fallback minimal index (static) when no build exists
  if (BASE_PATH !== "/") {
    app.get(BASE_PATH + '*', (req, res) => {
      res.sendFile(join(__dirname, 'index.minimal.html'));
    });
  } else {
    app.get('*', (req, res) => {
      res.sendFile(join(__dirname, 'index.minimal.html'));
    });
  }
}

app.listen(PORT, HOST, () => {
  const base = `${BASE_PATH !== "/" ? BASE_PATH : ""}`;
  console.log(`✅ MyDispatch Server running on http://${HOST}:${PORT}${base}`);
  console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
  if (!HAS_BUILD) {
    console.log('⚠️  No build found. Serving minimal index. Run "npm install" then "npm run build" to enable full app.');
  }
});
