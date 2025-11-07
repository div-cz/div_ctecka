# 🎯 START HERE - DIV Čtečka

**Projekt je připraven pro nahrání do https://github.com/div-cz/div_mobile_app**

## ✅ Co je hotové

- ✅ Název aplikace: **DIV Čtečka**
- ✅ Bundle ID: **cz.div.reader**
- ✅ Veškeré konfigurace změněny na DIV.cz
- ✅ README aktualizován
- ✅ GitHub Actions pro automatické buildy
- ✅ Podpora signed AAB pro Google Play

## 🚀 CO UDĚLAT TEĎ (3 kroky)

### Krok 1: Vytvořit nový GitHub repozitář

1. Jít na https://github.com/div-cz
2. Kliknout **New repository**
3. Jméno: `div_mobile_app`
4. **⚠️ NECHAT PRÁZDNÉ** - bez README, bez .gitignore, bez license
5. Kliknout **Create repository**

### Krok 2: Pushnout kód

```bash
cd /home/user/ebook-reader

# Pro ÚPLNĚ ČISTOU historii (doporučeno):
rm -rf .git
git init
git add .
git commit -m "Initial commit: DIV Čtečka - mobilní aplikace pro e-knihy"
git branch -M main
git remote add origin https://github.com/div-cz/div_mobile_app.git
git push -u origin main

# NEBO zachovat historii:
git remote remove origin
git remote add origin https://github.com/div-cz/div_mobile_app.git
git push -u origin main
```

### Krok 3: Vytvořit podepsaný AAB

**Nejrychlejší způsob:**
```bash
./create-signed-release.sh
```

Tento skript:
- Vytvoří keystore (pokud neexistuje)
- Zeptá se na hesla
- Buildne signed AAB pro Google Play
- Ukáže kde najít výsledný soubor

---

## 📱 Upload do Google Play Store

1. Najít soubor: `android/app/build/outputs/bundle/release/app-release.aab`
2. Jít na [Google Play Console](https://play.google.com/console)
3. Vytvořit novou aplikaci nebo vybrat existující
4. **Production** → **Create new release**
5. Nahrát `app-release.aab`
6. Vyplnit release notes
7. **Review** → **Start rollout**

---

## 📚 Dokumentace

- **PUSH_TO_NEW_REPO.md** - detailní návod na push do GitHubu
- **QUICKSTART_SIGNED_AAB.md** - rychlý start pro signed AAB
- **SIGNING.md** - kompletní průvodce podpisováním
- **GITHUB_ACTIONS.md** - automatické buildy
- **DEPLOY.md** - deployment do stores
- **README.md** - hlavní dokumentace

---

## ⚡ Rychlý přehled příkazů

```bash
# Development
npm run dev                    # Spustit dev server

# Build
npm run build                  # Build web aplikace
npx cap sync                   # Sync s Android/iOS

# Android
npx cap open android           # Otevřít v Android Studio
./create-signed-release.sh     # Vytvořit signed AAB

# iOS
npx cap open ios               # Otevřít v Xcode
```

---

## 🔐 Keystore - DŮLEŽITÉ!

Po vytvoření keystore:

```bash
# OKAMŽITĚ zálohovat!
cp android/app/release-key.jks ~/BACKUP/
cp android/keystore.properties ~/BACKUP/

# Nahrát do cloud storage (Google Drive, Dropbox)
# Uložit hesla do password manageru
```

**BEZ KEYSTORE NEMŮŽETE AKTUALIZOVAT APLIKACI!**

---

## ✨ Co je nové

**Bundle ID:** `cz.div.reader` (místo `app.lovable...`)
**Název:** DIV Čtečka
**Organizace:** DIV.cz

**GitHub:** https://github.com/div-cz/div_mobile_app
**Google Play:** (po publikaci)

---

## 📞 Troubleshooting

### Build selže?
```bash
npm install
npm run build
npx cap sync
```

### Problém s keystore?
Viz **SIGNING.md** nebo **QUICKSTART_SIGNED_AAB.md**

### GitHub Actions nefungují?
Zkontrolujte že jsou secrets nastaveny (viz **GITHUB_ACTIONS.md**)

---

## 🎉 Shrnutí

1. ✅ Projekt je připraven
2. 📤 Push do `github.com/div-cz/div_mobile_app`
3. 🔐 Vytvořit signed AAB: `./create-signed-release.sh`
4. 📱 Nahrát do Google Play Console
5. 🚀 Publikovat!

---

**Hotovo? Skvělé! DIV Čtečka je připravena pro uživatele! 🎊**

---

**Organizace:** DIV.cz
**Datum:** 2025-11-07
**Verze:** 1.0.0
