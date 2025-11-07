# 🚀 Nahrání projektu do div-cz/div_mobile_app

Tento návod popisuje jak nahrát projekt s čistým štítem do nového GitHub repozitáře.

## ✅ Co bylo změněno

Projekt je připraven pro DIV.cz:

- ✅ **Název aplikace:** DIV Čtečka
- ✅ **Bundle ID:** `cz.div.reader` (místo `app.lovable...`)
- ✅ **Package name:** `cz.div.reader`
- ✅ **README:** Aktualizován pro DIV.cz
- ✅ **Všechny konfigurace:** Android, iOS, Capacitor

## 🎯 Krok za krokem

### 1. Vytvořit nový repozitář na GitHubu

1. Jít na https://github.com/div-cz
2. Kliknout **New repository**
3. Nastavit:
   - **Repository name:** `div_mobile_app`
   - **Description:** `Mobilní čtečka elektronických knih pro Android a iOS`
   - **Visibility:** Public nebo Private (podle preference)
   - **⚠️ NEŠKRTÁVEJTE:** "Add a README file" - NECHAT PRÁZDNÉ!
   - **⚠️ NEŠKRTÁVEJTE:** "Add .gitignore" - už máme
   - **⚠️ NEŠKRTÁVEJTE:** "Choose a license" - už máme
4. Kliknout **Create repository**

### 2. Připravit lokální repozitář

```bash
# Přejít do složky projektu (pokud nejste)
cd /home/user/ebook-reader

# Zkontrolovat že všechny změny jsou commitnuty
git status

# Pokud jsou uncommitted změny, commitnout je:
git add .
git commit -m "Rebrand to DIV.cz - change app name and bundle ID"
```

### 3. Změnit remote URL na nový repozitář

```bash
# Odstranit starý remote
git remote remove origin

# Přidat nový remote
git remote add origin https://github.com/div-cz/div_mobile_app.git

# Ověřit nový remote
git remote -v
# Mělo by ukázat:
# origin  https://github.com/div-cz/div_mobile_app.git (fetch)
# origin  https://github.com/div-cz/div_mobile_app.git (push)
```

### 4. Push do nového repozitáře

```bash
# Push main branch
git branch -M main
git push -u origin main
```

**Hotovo!** ✅ Projekt je nyní na `https://github.com/div-cz/div_mobile_app`

---

## 🧹 Alternativa: Čistý start (doporučeno)

Pokud chcete úplně čistou historii bez starých commitů:

```bash
# 1. Backup aktuálního stavu
cd /home/user
cp -r ebook-reader ebook-reader-backup

# 2. Odstranit .git složku (smaže historii)
cd ebook-reader
rm -rf .git

# 3. Vytvořit nový git repozitář
git init

# 4. Přidat všechny soubory
git add .

# 5. První commit
git commit -m "Initial commit: DIV Čtečka - mobilní aplikace pro čtení e-knih

- React 18 + TypeScript + Vite
- Capacitor 7 pro Android a iOS
- Podpora PDF, EPUB, Markdown
- Tmavý režim, vyhledávání, sledování pokroku
- GitHub Actions pro automatické buildy
- Bundle ID: cz.div.reader
- Organizace: DIV.cz"

# 6. Přidat remote a push
git branch -M main
git remote add origin https://github.com/div-cz/div_mobile_app.git
git push -u origin main
```

---

## 🔐 Nastavení GitHub Secrets (pro podepsané AAB)

Po pushnutí nastavit secrets pro automatické buildy:

1. Jít na https://github.com/div-cz/div_mobile_app/settings/secrets/actions
2. Kliknout **New repository secret**
3. Přidat tyto secrets (viz SIGNING.md pro detaily):
   - `ANDROID_KEYSTORE_BASE64`
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_ALIAS`
   - `ANDROID_KEY_PASSWORD`

---

## 📱 GitHub Actions

Po pushnutí:

1. Jít na https://github.com/div-cz/div_mobile_app/actions
2. **Android Release Build** workflow se spustí automaticky
3. Po 3-5 minutách stáhnout AAB/APK z Artifacts

---

## ✅ Ověření

Po pushnutí zkontrolovat:

- [ ] README zobrazuje "DIV Čtečka" a DIV.cz odkazy
- [ ] GitHub Actions workflow běží (Actions tab)
- [ ] Repozitář je na správné adrese: `div-cz/div_mobile_app`
- [ ] Není tam nic o "eKultura" nebo "Lovable"
- [ ] Bundle ID v souborech je `cz.div.reader`

---

## 🎉 Hotovo!

Projekt je nyní čistý a připravený pro DIV.cz na:

**https://github.com/div-cz/div_mobile_app**

### Další kroky:

1. **Nastavit GitHub Secrets** (viz výše)
2. **Spustit první build:** Actions → Android Release Build → Run workflow
3. **Stáhnout AAB** a nahrát do Google Play Console
4. **Publikovat!**

---

## 🔄 Vrácení se k vývoji

```bash
# Naklonovat z nového repozitáře
git clone https://github.com/div-cz/div_mobile_app.git
cd div_mobile_app

# Instalace závislostí
npm install

# Vývoj
npm run dev
```

---

## 📞 Pomoc

Pokud máte problémy s pushem:

```bash
# Kontrola remote
git remote -v

# Kontrola branch
git branch

# Force push (pouze pokud je repo prázdné!)
git push -u origin main --force
```

---

**Datum:** 2025-11-07
**Projekt:** DIV Čtečka
**Organizace:** DIV.cz
