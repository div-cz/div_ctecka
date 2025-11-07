# ⚡ RYCHLÝ NÁVOD - 2 KROKY

## Krok 1: Vytvořte repozitář na GitHubu (1 minuta)

1. Jděte na: **https://github.com/div-cz**
2. Klikněte: **New repository**
3. Repository name: **`div_ctecka`**
4. ⚠️ **DŮLEŽITÉ:** NECHAT PRÁZDNÉ!
   - ❌ NEŠKRTÁVAT "Add a README file"
   - ❌ NEŠKRTÁVAT "Add .gitignore"
   - ❌ NEŠKRTÁVAT "Choose a license"
5. Klikněte: **Create repository**

## Krok 2: Spusťte skript (30 sekund)

```bash
cd /home/user/ebook-reader
./push-to-div-ctecka.sh
```

**Hotovo!** 🎉

---

## Co skript udělá?

1. ✅ Vytvoří čistou git historii (bez starých commitů z eKultura)
2. ✅ Pushne projekt do `div-cz/div_ctecka`
3. ✅ Ukáže odkaz na nový repozitář

---

## Po úspěšném push:

### Vytvořit signed AAB pro Google Play:

```bash
./create-signed-release.sh
```

Tento příkaz:
- Vytvoří keystore (pokud neexistuje)
- Zeptá se na hesla
- Buildne podepsaný AAB
- Řekne kde je soubor

### Nahrát do Google Play Console:

1. Najít: `android/app/build/outputs/bundle/release/app-release.aab`
2. Otevřít: https://play.google.com/console
3. Production → Create new release
4. Upload AAB
5. Publikovat!

---

## ❌ Pokud push selže

**Chyba: "repository not found"**
→ Repozitář `div-cz/div_ctecka` ještě neexistuje. Vytvořte na GitHubu (Krok 1).

**Chyba: "permission denied"**
→ Zkontrolujte že máte přístup k organizaci `div-cz`.

---

## 📚 Další dokumentace

- **START_HERE.md** - Kompletní návod
- **SIGNING.md** - Podpisování AAB
- **GITHUB_ACTIONS.md** - Automatické buildy
- **DEPLOY.md** - Deployment do stores

---

**Projekt:** DIV Čtečka
**Bundle ID:** cz.div.reader
**GitHub:** https://github.com/div-cz/div_ctecka
**Organizace:** DIV.cz 🇨🇿
