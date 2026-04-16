# SmartFridgeChef Web App

## Tech Stack
- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **State:** React Hooks (useState, useEffect)
- **Deployment:** Vercel / Node.js Server (lokal)

## Features
- ✅ Responsive Design (Mobile-first)
- ✅ Items hinzufügen/löschen
- ✅ Kategorien mit Farben
- ✅ Ablaufdatum-Anzeige
- ✅ Suchfunktion
- ✅ Handy-Zugriff über IP oder Vercel URL

## Projekt-Struktur
```
SmartFridgeChef_Web/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── ItemRow.jsx
│   │   ├── ItemForm.jsx
│   │   └── CategoryBadge.jsx
│   └── styles/
│       └── index.css
└── server.js (optional Node.js Backend)
```

## Launch (Lokal)
```bash
npm install
npm run dev
```

Handy-Zugriff: `http://<IP>:5173`

## Deploy auf Vercel
Das Repo ist bereits auf GitHub: https://github.com/AgentKeller38/smartfridgechef-web

1. Auf https://vercel.com gehen
2. "Add New Project" → GitHub Repo auswählen
3. Deploy!
