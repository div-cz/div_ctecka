# 📚 DIV Čtečka

Mobilní aplikace pro čtení elektronických knih pro Android a iOS od DIV.cz.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-blue)
![DIV.cz](https://img.shields.io/badge/DIV.cz-green)

## 🎯 O projektu

**DIV Čtečka** je cross-platform mobilní aplikace od **DIV.cz** určená pro pohodlné čtení elektronických knih. Aplikace podporuje nejběžnější formáty e-knih a nabízí intuitivní uživatelské rozhraní optimalizované pro mobilní zařízení.

- **Bundle ID:** `cz.div.reader`
- **Název aplikace:** DIV Čtečka
- **Pro:** Android a iOS
- **Organizace:** DIV.cz

### ✨ Hlavní funkce

- 📖 **Podpora formátů:** PDF, EPUB, Markdown
- 🌙 **Tmavý režim** - pohodlné čtení i v noci
- 🔍 **Fulltextové vyhledávání** - najděte text v knize
- 📊 **Sledování pokroku** - pamatuje si, kde jste skončili
- 📏 **Nastavitelná velikost písma** - 12px až 24px
- 📄 **Stránkování** - plynulé listování po stránkách
- 🎨 **Moderní UI** - čistý design inspirovaný DIV.cz
- 💾 **Knihovna** - správa všech vašich knih na jednom místě

## 🏗️ Technologie

### Frontend
- **React** 18.3.1 - UI framework
- **TypeScript** 5.5.3 - typová bezpečnost
- **Vite** 5.4.1 - build tool
- **Tailwind CSS** 3.4.11 - styling
- **shadcn/ui** - komponenty (Radix UI)

### Mobile
- **Capacitor** 7.4.2 - native wrapper pro Android/iOS
- **@capacitor/filesystem** - přístup k souborovému systému

### Knihovny pro čtení
- **pdfjs-dist** - extrakce textu z PDF
- **JSZip** 3.10.1 - zpracování EPUB formátu

### State Management & Utils
- **React Query** (TanStack Query) - data fetching
- **React Router DOM** - routing
- **React Hook Form** - formuláře
- **Zod** - validace

## 🚀 Rychlý start

### Předpoklady

- Node.js 18+ a npm
- Pro Android: Android Studio + JDK 21
- Pro iOS: macOS s Xcode a CocoaPods

### Instalace

```bash
# Klonovat repozitář
git clone https://github.com/div-cz/div_mobile_app.git
cd div_mobile_app

# Nainstalovat závislosti
npm install

# Spustit dev server
npm run dev
```

Aplikace poběží na `http://localhost:5173`

### Build pro produkci

```bash
# Build webové aplikace
npm run build

# Synchronizovat s mobilními platformami
npx cap sync

# Otevřít v Android Studio
npx cap open android

# Nebo otevřít v Xcode (pouze macOS)
npx cap open ios
```

## 📱 Mobilní vývoj

### 🤖 GitHub Actions (Doporučeno)

Projekt podporuje **automatický build pomocí GitHub Actions** - nejjednodušší způsob!

```bash
# 1. Push kódu do GitHubu
git push origin main

# 2. GitHub Actions automaticky builduje AAB a APK
# 3. Stáhnout hotové soubory z GitHub Actions Artifacts
```

**📖 Kompletní návod:** [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md)

#### Rychlý start s GitHub Actions:

1. **Automatický build** - každý push do `main` spustí build
2. **Stáhnout artifacts** - GitHub → Actions → vybrat run → Artifacts
3. **Upload do Play Store** - stáhnout AAB a nahrát

#### Signed release (produkce):

1. GitHub → **Actions** → **Android Signed Release**
2. Kliknout **Run workflow**
3. Zadat verzi (např. `1.0.0`)
4. Stáhnout signed AAB ready pro Google Play

### 🔨 Lokální Build (alternativa)

#### Android Build

```bash
# Build aplikace
npm run build

# Sync s Android
npx cap sync android

# Otevřít v Android Studio
npx cap open android

# Build APK/AAB v Android Studio nebo:
cd android
./gradlew assembleRelease  # APK
./gradlew bundleRelease    # AAB pro Google Play
```

#### iOS Build

```bash
# Build aplikace
npm run build

# Instalace CocoaPods závislostí
cd ios/App
pod install
cd ../..

# Sync s iOS
npx cap sync ios

# Otevřít v Xcode
npx cap open ios

# Build v Xcode: Product → Archive
```

**📖 Detailní návod:** Viz [DEPLOY.md](./DEPLOY.md)

## 📦 Struktura projektu

```
div_mobile_app/
├── src/
│   ├── components/       # React komponenty
│   │   ├── Reader.tsx    # Čtecí rozhraní
│   │   ├── Library.tsx   # Knihovna knih
│   │   ├── BookCard.tsx  # Karta knihy
│   │   └── ui/           # shadcn/ui komponenty
│   ├── lib/
│   │   ├── fileReaders.ts  # PDF/EPUB/MD parsing
│   │   └── utils.ts        # Utility funkce
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Stránky aplikace
│   └── App.tsx           # Hlavní komponenta
├── android/              # Android native projekt
├── ios/                  # iOS native projekt
├── public/               # Statické assety
├── capacitor.config.ts   # Capacitor konfigurace
├── vite.config.ts        # Vite konfigurace
├── tailwind.config.ts    # Tailwind konfigurace
└── package.json          # NPM závislosti
```

## 🎨 Design

Aplikace využívá vlastní design system založený na:
- **Primární barva:** DIV.cz Green (#80AE2E)
- **Pozadí:** Teplý krémový odstín (#f7f3ee)
- **Typografie:** System font stack pro optimální čitelnost
- **Responzivní layout:** 2 sloupce (mobil) → 3 (tablet) → 4 (desktop)

## 🔒 Konfigurace

### App ID a název

- **App ID:** `cz.div.reader`
- **Název:** DIV Čtečka
- **Bundle:** `cz.div.reader`

Změnit lze v `capacitor.config.ts`:
```typescript
{
  appId: 'cz.div.reader',
  appName: 'DIV Čtečka',
  ...
}
```

## 📝 Skripty

```bash
# Development
npm run dev              # Spustit dev server

# Build
npm run build            # Production build
npm run build:dev        # Development build
npm run preview          # Preview production buildu

# Linting
npm run lint             # Spustit ESLint

# Capacitor
npx cap sync             # Sync web → native
npx cap open android     # Otevřít Android Studio
npx cap open ios         # Otevřít Xcode

# Signing (pro Google Play)
./create-signed-release.sh   # Vytvořit podepsaný AAB
```

## 🐛 Známé problémy a omezení

- PDF s ochranou heslem nelze načíst
- Skenované PDF (pouze obrázky) nemají extrahovatelný text
- EPUB s komplexním CSS může mít odlišné formátování
- Velké knihy (>100 MB) mohou být pomalé při načítání

## 🤝 Přispívání

Příspěvky jsou vítány! Postupujte následovně:

1. Forkněte projekt
2. Vytvořte feature branch (`git checkout -b feature/AmazingFeature`)
3. Commitněte změny (`git commit -m 'Add some AmazingFeature'`)
4. Pushněte do branch (`git push origin feature/AmazingFeature`)
5. Otevřete Pull Request

## 📄 Licence

Tento projekt je licencován pod MIT licencí.

## 🔗 Užitečné odkazy

- **Repository:** https://github.com/div-cz/div_mobile_app
- **Issues:** https://github.com/div-cz/div_mobile_app/issues
- **DIV.cz:** https://www.div.cz
- **Capacitor Docs:** https://capacitorjs.com/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com

## 👥 Autoři

- **DIV.cz Team**

## 🙏 Poděkování

- [Capacitor](https://capacitorjs.com) - cross-platform framework
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering
- [shadcn/ui](https://ui.shadcn.com/) - UI komponenty

---

**DIV.cz - Digitální informace a vzdělávání**

**Vytvořeno v České republice** 🇨🇿
