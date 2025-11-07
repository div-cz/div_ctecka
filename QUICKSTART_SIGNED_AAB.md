# ⚡ RYCHLÝ START - Podepsaný AAB pro Google Play

**Problém:** Google Play Store hlásí "Všechny nahrané balíčky musí být podepsány"

**Řešení:** Vytvořit podepsaný AAB v 5 krocích (15 minut)

---

## 🚀 Metoda 1: Automatický skript (NEJRYCHLEJŠÍ)

```bash
# Spusťte tento skript - udělá všechno za vás!
./create-signed-release.sh
```

Skript:
1. ✅ Vytvoří keystore (pokud neexistuje)
2. ✅ Vytvoří keystore.properties
3. ✅ Zeptá se na verzi aplikace
4. ✅ Buildne podepsaný AAB
5. ✅ Ukáže cestu k AAB souboru

**Výsledek:** `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🔨 Metoda 2: Manuálně (krok za krokem)

### 1️⃣ Vytvořit Keystore (jednorázově)

```bash
cd android/app

keytool -genkey -v -keystore release-key.jks \
  -alias ekultura-release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Co vyplnit:**
- Keystore password: `VašeSilnéHeslo123!` (uložte si!)
- Jméno: `eKultura Team`
- Organizace: `eKultura`
- Město: `Prague`
- Stát: `Czech Republic`
- Kód země: `CZ`

```bash
cd ../..
```

### 2️⃣ Vytvořit keystore.properties

```bash
cd android
cat > keystore.properties << 'EOF'
storePassword=VašeSilnéHeslo123!
keyPassword=VašeSilnéHeslo123!
keyAlias=ekultura-release
storeFile=app/release-key.jks
EOF
cd ..
```

**NAHRAĎTE** `VašeSilnéHeslo123!` skutečným heslem!

### 3️⃣ Build AAB

```bash
# Build web aplikace
npm run build

# Sync s Android
npx cap sync android

# Build signed AAB
cd android
./gradlew bundleRelease
cd ..
```

### 4️⃣ Najít AAB soubor

```bash
# Zobrazit cestu k AAB
ls -lh android/app/build/outputs/bundle/release/app-release.aab
```

### 5️⃣ Nahrát do Google Play

1. Otevřít [Google Play Console](https://play.google.com/console)
2. Vybrat aplikaci
3. **Production** → **Create new release**
4. Nahrát `android/app/build/outputs/bundle/release/app-release.aab`
5. Vyplnit "What's new" (release notes)
6. **Save** → **Review release** → **Start rollout to Production**

---

## 📋 Checklist

- [ ] Keystore vytvořen: `android/app/release-key.jks`
- [ ] Hesla uložena v: `android/keystore.properties`
- [ ] Build úspěšný bez chyb
- [ ] AAB soubor existuje: `android/app/build/outputs/bundle/release/app-release.aab`
- [ ] AAB nahrán do Google Play Console
- [ ] Keystore zálohován na bezpečné místo!

---

## ⚠️ DŮLEŽITÉ - Záloha Keystore

**OKAMŽITĚ po vytvoření keystore:**

```bash
# 1. Zkopírovat keystore na bezpečné místo
cp android/app/release-key.jks ~/Desktop/BACKUP-release-key.jks
cp android/keystore.properties ~/Desktop/BACKUP-keystore.properties

# 2. Nahrát do cloud storage (Google Drive, Dropbox)
#    nebo uložit na USB disk

# 3. Uložit hesla do password manageru (1Password, Bitwarden)
```

**BEZ KEYSTORE NEMŮŽETE AKTUALIZOVAT APLIKACI!**

---

## 🐛 Problémy?

### "Command not found: keytool"

```bash
# Nainstalovat Java JDK 21
# Ubuntu/Debian:
sudo apt install openjdk-21-jdk

# macOS:
brew install openjdk@21

# Windows: Stáhnout z https://adoptium.net/
```

### "Keystore was tampered with, or password was incorrect"

Špatné heslo v `keystore.properties`. Zkontrolujte hesla!

### "Task :app:packageRelease FAILED"

```bash
# Vyčistit build cache
cd android
./gradlew clean
./gradlew bundleRelease
```

### Build trvá příliš dlouho

```bash
# Přidat do android/gradle.properties:
echo "org.gradle.parallel=true" >> android/gradle.properties
echo "org.gradle.caching=true" >> android/gradle.properties
```

---

## 🔄 Aktualizace aplikace

Pro novou verzi:

1. **Zvýšit verzi** v `android/app/build.gradle`:
   ```gradle
   versionCode 2      // bylo 1
   versionName "1.0.1"  // bylo "1.0"
   ```

2. **Build nový AAB**:
   ```bash
   ./create-signed-release.sh
   # NEBO
   npm run build && npx cap sync && cd android && ./gradlew bundleRelease
   ```

3. **Nahrát do Google Play** jako novou verzi

---

## 📱 Testování před publikací

### Test APK (ne AAB):

```bash
cd android
./gradlew assembleRelease
```

**APK soubor:** `android/app/build/outputs/apk/release/app-release.apk`

**Instalace na zařízení:**
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 📚 Detailní dokumentace

- **Kompletní návod:** [SIGNING.md](./SIGNING.md)
- **GitHub Actions:** [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md)
- **Deployment:** [DEPLOY.md](./DEPLOY.md)

---

## ✅ Úspěch!

Pokud máte **app-release.aab** a Google Play přijímá soubor → **Hotovo!** 🎉

Aplikace bude zveřejněna během 1-7 dní po schválení Google.

---

**Poslední aktualizace:** 2025-11-06
**Pro projekt:** Čtečka Knih eKultura
