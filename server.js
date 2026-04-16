import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SmartFridgeChef running at http://0.0.0.0:${PORT}`);
  console.log(`📱 Access from phone: http://31.97.77.175:${PORT}`);
});
