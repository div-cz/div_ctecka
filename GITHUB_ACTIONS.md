# 🤖 GitHub Actions - Automatický Android Build

Tento projekt používá GitHub Actions pro automatické buildování Android aplikace (AAB a APK).

## 📋 Dostupné Workflows

### 1. **Android Release Build** (`android-build.yml`)
Automaticky se spouští při:
- Push do `main`, `master` nebo `claude/**` větví
- Pull requestech do `main` nebo `master`
- Manuálně přes "Run workflow" tlačítko

**Výstup:**
- ✅ Unsigned AAB soubor (pro Google Play)
- ✅ Unsigned APK soubor (pro testování)

**Použití:**
1. Push kódu nebo otevření PR automaticky spustí build
2. Nebo jít do GitHub → Actions → "Android Release Build" → "Run workflow"
3. Stáhnout artefakty po dokončení buildu

### 2. **Android Signed Release** (`android-release-signed.yml`)
Vytváří podepsanou verzi pro publikaci.

**Výstup:**
- ✅ Signed AAB (ready pro Google Play Store)
- ✅ Signed APK (ready pro distribuci)

**Vyžaduje:** GitHub Secrets pro podepsání (viz níže)

---

## 🔐 Nastavení GitHub Secrets (pro podepsaný build)

Pro vytvoření signed release potřebujete nastavit GitHub Secrets.

### Krok 1: Vytvoření Keystore

Pokud ještě nemáte keystore:

```bash
keytool -genkey -v -keystore release-keystore.jks -alias release -keyalg RSA -keysize 2048 -validity 10000

# Vyplnit:
# - Heslo keystore (např. MojeSilneHeslo123)
# - Heslo klíče (může být stejné)
# - Jméno, organizace, atd.
```

**⚠️ DŮLEŽITÉ:** Keystore a hesla si bezpečně uložte! Bez nich nemůžete aktualizovat aplikaci v Google Play!

### Krok 2: Převod Keystore na Base64

```bash
base64 release-keystore.jks > keystore-base64.txt

# Na macOS/Linux:
base64 -i release-keystore.jks -o keystore-base64.txt

# Nebo online nástroj (méně bezpečné)
```

### Krok 3: Přidání Secrets do GitHub

1. Jít do GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Kliknout **New repository secret**
4. Přidat následující secrets:

| Secret Name | Hodnota | Příklad |
|-------------|---------|---------|
| `ANDROID_KEYSTORE_BASE64` | Obsah `keystore-base64.txt` | `/u3+7QAA...` (dlouhý text) |
| `ANDROID_KEYSTORE_PASSWORD` | Heslo keystore | `MojeSilneHeslo123` |
| `ANDROID_KEY_ALIAS` | Alias klíče | `release` |
| `ANDROID_KEY_PASSWORD` | Heslo klíče | `MojeSilneHeslo123` |

**Screenshot návod:**
```
GitHub Repo → Settings → Secrets and variables → Actions → New repository secret
┌─────────────────────────────────────┐
│ Name: ANDROID_KEYSTORE_BASE64       │
│                                      │
│ Secret: /u3+7QAAAA... (paste here) │
│                                      │
│         [Add secret]                 │
└─────────────────────────────────────┘
```

---

## 🚀 Jak používat workflows

### A) Unsigned Build (testování)

**Automaticky:**
```bash
git add .
git commit -m "Update app"
git push origin main
```
→ GitHub Actions automaticky spustí build
→ Stáhnout APK/AAB z Artifacts

**Manuálně:**
1. Jít na GitHub → **Actions**
2. Vybrat **Android Release Build**
3. Kliknout **Run workflow** → **Run workflow**
4. Počkat na dokončení (~3-5 minut)
5. Stáhnout artifacts

### B) Signed Build (produkce)

1. Jít na GitHub → **Actions**
2. Vybrat **Android Signed Release**
3. Kliknout **Run workflow**
4. Vyplnit:
   - **Version Name:** `1.0.0` (nebo aktuální verze)
   - **Version Code:** `1` (inkrementovat s každou verzí)
5. Kliknout **Run workflow**
6. Po dokončení stáhnout signed AAB/APK

---

## 📥 Stažení výsledků

### Způsob 1: GitHub UI
1. Jít na **Actions** tab
2. Kliknout na konkrétní workflow run
3. Scrollovat dolů k **Artifacts**
4. Stáhnout `app-release-aab` nebo `app-release-apk`

### Způsob 2: GitHub CLI
```bash
# Instalace gh CLI (pokud nemáte)
# https://cli.github.com/

# List recent runs
gh run list --workflow=android-build.yml

# Download artifacts z posledního run
gh run download --name app-release-aab
```

---

## 📱 Upload do Google Play Store

### 1. Příprava

- ✅ Signed AAB soubor z GitHub Actions
- ✅ Google Play Developer účet ($25 jednorázový poplatek)
- ✅ Screenshoty aplikace
- ✅ Ikona 512x512
- ✅ Feature graphic 1024x500
- ✅ Privacy Policy URL

### 2. Upload

1. Jít na [Google Play Console](https://play.google.com/console)
2. Vytvořit novou aplikaci
3. **Production** → **Create new release**
4. Upload `app-release.aab`
5. Vyplnit release notes
6. Přidat screenshoty a marketing materiály
7. **Save** → **Review** → **Start rollout to Production**

---

## 🔧 Customizace Workflow

### Změna názvu APK/AAB

Editovat `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        ...
        setProperty("archivesBaseName", "ebook-reader-v$versionName")
    }
}
```

### Přidání automatického versioning

Vytvořit `android/version.properties`:
```properties
VERSION_CODE=1
VERSION_NAME=1.0.0
```

Upravit workflow:
```yaml
- name: Auto-increment version
  run: |
    VERSION_CODE=$(cat android/version.properties | grep VERSION_CODE | cut -d'=' -f2)
    NEW_CODE=$((VERSION_CODE + 1))
    sed -i "s/VERSION_CODE=$VERSION_CODE/VERSION_CODE=$NEW_CODE/" android/version.properties
```

### Notifikace při úspěšném buildu

Přidat do workflow:
```yaml
- name: Send notification
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Android build successful! 🎉'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🐛 Troubleshooting

### Chyba: "invalid source release: 21"

**Problém:** Java 21 není použita

**Řešení:** Workflow už obsahuje `java-version: '21'`, ale zkontrolujte že je `compileOptions` v `android/app/build.gradle`:

```gradle
compileOptions {
    sourceCompatibility JavaVersion.VERSION_21
    targetCompatibility JavaVersion.VERSION_21
}
```

### Chyba: "Keystore file not found"

**Problém:** GitHub Secret není nastaven správně

**Řešení:**
1. Zkontrolovat že `ANDROID_KEYSTORE_BASE64` existuje v Secrets
2. Zkontrolovat že Base64 encoding je správný:
   ```bash
   # Test decode
   echo "YOUR_BASE64_STRING" | base64 -d > test-keystore.jks
   ```

### Chyba: "Permission denied: gradlew"

**Problém:** Gradle wrapper nemá execute práva

**Řešení:** Workflow už obsahuje `chmod +x`, ale můžete přidat do gitu:
```bash
git update-index --chmod=+x android/gradlew
git commit -m "Make gradlew executable"
```

### Build trvá příliš dlouho

**Optimizace:**

1. Povolit Gradle cache (už je v workflow)
2. Použít Gradle daemon:
   ```yaml
   run: ./gradlew bundleRelease --daemon
   ```
3. Paralelní build v `gradle.properties`:
   ```properties
   org.gradle.parallel=true
   org.gradle.caching=true
   ```

---

## 📊 Build Status Badge

Přidat do README.md:

```markdown
![Android Build](https://github.com/eKultura/ebook-reader/workflows/Android%20Release%20Build/badge.svg)
```

---

## 🔄 Aktualizace aplikace

### Proces pro novou verzi:

1. **Upravit kód**
2. **Zvýšit verzi** v `android/app/build.gradle`:
   ```gradle
   versionCode 2  // bylo 1
   versionName "1.0.1"  // bylo 1.0.0
   ```
3. **Spustit signed workflow** s novými version numbers
4. **Stáhnout AAB**
5. **Upload do Google Play Console**
6. **Vyplnit release notes** (co je nového)
7. **Start rollout**

---

## 📚 Další zdroje

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Capacitor Android Deployment](https://capacitorjs.com/docs/android)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android App Bundles](https://developer.android.com/guide/app-bundle)

---

## ✅ Checklist před prvním buildováním

- [ ] Node.js nainstalován lokálně pro testování
- [ ] Android Studio nainstalováno pro lokální testing
- [ ] Vytvořen release keystore
- [ ] Keystore bezpečně zálohován (Google Drive, 1Password, atd.)
- [ ] GitHub Secrets nastaveny
- [ ] Testovací build úspěšný lokálně
- [ ] GitHub Actions workflow test run úspěšný
- [ ] Google Play Developer účet vytvořen
- [ ] Screenshoty a marketing materiály připraveny

---

**Vytvořeno:** 2025-11-06
**Pro projekt:** Čtečka Knih eKultura
**Maintainer:** eKultura Team
