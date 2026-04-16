# SmartFridgeChef Web App v2.0 🧊📸

**KI-gestützte Kühlschrank-App mit Bilderkennung und Rezeptvorschlägen**

## Neue Features v2.0
- 📷 **Kamera-Integration** - Mache Fotos direkt im Browser
- 🤖 **Google Vision API** - Automatische Zutaten-Erkennung
- 🍳 **Spoonacular API** - Intelligente Rezeptvorschläge basierend auf erkannten Zutaten
- 📱 **Mobile-First Design** - Funktioniert perfekt auf dem Handy

## Tech Stack
- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Backend:** Node.js + Express
- **AI:** Google Cloud Vision API
- **Recipes:** Spoonacular API

## Setup

### 1. API Keys erstellen

**Google Vision API:**
1. Gehe zu https://console.cloud.google.com
2. Erstelle ein neues Projekt (oder wähle existentes)
3. Aktiviere "Cloud Vision API"
4. Erstelle API Key unter "Credentials"
5. Kopiere den API Key

**Spoonacular API:**
1. Gehe zu https://spoonacular.com/food-api
2. Klicke "Sign Up" (kostenlos)
3. Erhalte deinen API Key im Dashboard

### 2. Environment Variables setzen

Erstelle eine `.env` Datei im Projekt-Root:

```bash
GOOGLE_VISION_API_KEY=dein_google_vision_key
SPOONACULAR_API_KEY=dein_spoonacular_key
```

### 3. Dependencies installieren

```bash
npm install
```

### 4. Starten

```bash
npm run dev
```

Handy-Zugriff: `http://<DEINE-IP>:5173`

## Deployment auf Vercel

Die App ist bereits auf GitHub: https://github.com/AgentKeller38/smartfridgechef-web

**Vercel Setup:**
1. Gehe zu https://vercel.com
2. "Add New Project" → GitHub Repo auswählen
3. **Umweltvariablen hinzufügen:**
   - `GOOGLE_VISION_API_KEY`
   - `SPOONACULAR_API_KEY`
4. Deploy!

**Wichtig:** Die Backend-APIs laufen auf dem Server. Vercel unterstützt Node.js Serverless Functions automatisch.

## Projekt-Struktur
```
SmartFridgeChef_Web/
├── server.js              # Express Backend (API Endpoints)
├── .env                   # API Keys (nicht commiten!)
├── .env.example           # Template für .env
├── package.json
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── App.jsx            # Haupt-App mit Kamera & UI
│   ├── main.jsx
│   ├── components/
│   │   └── ...
│   └── styles/
│       └── index.css
└── dist/                  # Build output
```

## API Endpoints

### POST /api/analyze-image
- **Input:** Bild-Upload (multipart/form-data)
- **Output:** Erkannte Zutaten (Labels + Text)

### POST /api/get-recipes
- **Input:** `{ ingredients: ["tomato", "cheese", ...] }`
- **Output:** Rezeptvorschläge mit Bildern, Zubereitungszeit, etc.

## Features im Detail

### Kamera
- Nutzt HTML5 MediaDevices API
- Back-Kamera auf Mobile (`facingMode: 'environment'`)
- Sofortige Vorschau nach dem Foto

### Bilderkennung
- Google Vision API für präzise Objekterkennung
- Erkennt: Lebensmittel, Getränke, Verpackungen
- Text-OCR für Produkt-Etiketten

### Rezept-Empfehlungen
- Spoonacular "Complex Search" API
- Rangiert Rezepte nach Übereinstimmung
- Zeigt fehlende Zutaten an
- Direktlink zum Original-Rezept

## Kosten

**Free Tiers:**
- Google Vision: 1.000 Bilder/Monat kostenlos
- Spoonacular: 150 Requests/Tag kostenlos

Für den privaten Gebrauch völlig ausreichend! 🎉

---

**Entwickelt mit ❤️ für den Smart Fridge Chef**
