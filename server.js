import express from 'express';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
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

// Google Sheets API proxy (service-account based)
function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error('Google service account env not set');
  }
  // Handle newline-escaped private key
  privateKey = privateKey.replace(/\\n/g, '\n');
  const jwt = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({ version: 'v4', auth: jwt });
}

app.post('/api/google/sheets/read', async (req, res) => {
  try {
    const { spreadsheetId, range } = req.body || {};
    if (!spreadsheetId || !range) return res.status(400).json({ error: 'spreadsheetId and range required' });
    const sheets = getSheetsClient();
    const resp = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    res.json({ values: resp.data.values || [] });
  } catch (e) {
    res.status(500).json({ error: (e && e.message) || 'Unknown error' });
  }
});

app.post('/api/google/sheets/append', async (req, res) => {
  try {
    const { spreadsheetId, range, values } = req.body || {};
    if (!spreadsheetId || !range || !Array.isArray(values)) return res.status(400).json({ error: 'spreadsheetId, range, values required' });
    const sheets = getSheetsClient();
    const resp = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });
    res.json({ updatedRange: resp.data.updates?.updatedRange || null, totalUpdatedCells: resp.data.updates?.updatedCells || 0 });
  } catch (e) {
    res.status(500).json({ error: (e && e.message) || 'Unknown error' });
  }
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
