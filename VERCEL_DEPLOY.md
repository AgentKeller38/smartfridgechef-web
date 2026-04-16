# SmartFridgeChef - Vercel Deploy Anleitung

## Option 1: Ein-Klick Deploy (empfohlen)

1. Gehe zu: https://vercel.com/new
2. Klicke auf **"Clone and Deploy"** oder **"Import Git Repository"**
3. Lade die `SmartFridgeChef_Web_Deploy.zip` hoch oder clone von GitHub
4. Vercel erkennt automatisch React + Vite
5. Klicke **"Deploy"**

**Ergebnis:** `https://smartfridgechef-xxx.vercel.app` (in 2 Minuten)

---

## Option 2: Manuelles Deploy (ohne ZIP)

### Schritt 1: Dateien hochladen
```bash
# Auf deinem Computer:
cd ~/Downloads
unzip SmartFridgeChef_Web_Deploy.zip
cd SmartFridgeChef_Web_Deploy

# Oder direkt von GitHub (falls du einen Account hast):
git clone https://github.com/dein-user/smartfridgechef-web
```

### Schritt 2: Vercel CLI (optional)
```bash
npm install -g vercel
vercel --prod
```

### Schritt 3: Über das Web-Interface
1. Gehe zu: https://vercel.com/new
2. Ziehe den Ordner `SmartFridgeChef_Web_Deploy` in das Browser-Fenster
3. Vercel deployt automatisch

---

## Option 3: Netlify (einfacher)

1. Gehe zu: https://app.netlify.com/drop
2. Ziehe den Ordner `SmartFridgeChef_Web_Deploy` hinein
3. Sofortiger Link: `https://smartfridgechef-xxx.netlify.app`

---

## Was du bekommst

✅ **Dauerhafter Link** (z.B. `smartfridgechef.vercel.app`)
✅ **HTTPS automatisch**
✅ **Funktioniert von überall** (Mobilfunk, WLAN, etc.)
✅ **Kostenlos**
✅ **Keine Tunnel nötig**

---

## Dateien im Paket

- `index.html` - Einstiegspunkt
- `package.json` - Dependencies
- `vite.config.js` - Build-Konfiguration
- `tailwind.config.js` - Styling
- `src/` - React Components
  - `App.jsx` - Haupt-App
  - `components/ItemRow.jsx`
  - `components/ItemForm.jsx`
  - `components/CategoryBadge.jsx`
  - `main.jsx`
- `dist/` - Build-Artifakte (nach `npm run build`)

---

## Nach dem Deploy

Öffne den Vercel/Netlify-Link auf deinem Handy:
- `https://smartfridgechef-xxx.vercel.app`
- App sollte sofort laden! 🚀
