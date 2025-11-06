# 📱 Návod na Build a Nasazení - Čtečka Knih eKultura

Kompletní průvodce pro build a nasazení mobilní čtečky knih na Android a iOS.

## 📋 Obsah

- [Předpoklady](#předpoklady)
- [Instalace závislostí](#instalace-závislostí)
- [Build webové aplikace](#build-webové-aplikace)
- [Android Build](#android-build)
- [iOS Build](#ios-build)
- [Publikace do Store](#publikace-do-store)

---

## 🔧 Předpoklady

### Společné pro Android i iOS
- **Node.js** 18+ a npm
- **Git**

### Pro Android
- **Android Studio** (Arctic Fox nebo novější)
- **Java JDK** 17+
- **Android SDK** (API Level 33+)
- **Gradle** (automaticky s Android Studio)

### Pro iOS (pouze na macOS)
- **macOS** (Monterey 12+ nebo novější)
- **Xcode** 14+ (z Mac App Store)
- **CocoaPods** - nainstalovat: `sudo gem install cocoapods`
- **Apple Developer účet** ($99/rok)

---

## 📦 Instalace závislostí

```bash
# 1. Naklonovat repozitář
git clone https://github.com/eKultura/ebook-reader.git
cd ebook-reader

# 2. Nainstalovat npm závislosti
npm install

# 3. Build webové aplikace
npm run build

# 4. Synchronizovat s nativními platformami
npx cap sync
```

---

## 🌐 Build webové aplikace

Webová aplikace je napsaná v React + TypeScript s Vite.

```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production buildu
npm run preview

# Lint
npm run lint
```

**Výstup buildu:** složka `dist/`

---

## 🤖 Android Build

### 1. Otevření projektu v Android Studio

```bash
# Otevřít Android projekt
npx cap open android
```

Nebo manuálně otevřít složku `android/` v Android Studio.

### 2. Konfigurace aplikace

**Soubor:** `android/app/build.gradle`

```gradle
android {
    namespace "app.lovable.bc54af510f2c423e971132129f635b1b"
    compileSdk 34

    defaultConfig {
        applicationId "app.lovable.bc54af510f2c423e971132129f635b1b"
        minSdk 22
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

**Změny pro produkci:**
- Upravte `versionCode` a `versionName` pro každou novou verzi
- Přidejte klíč pro podepisování APK/AAB

### 3. Konfigurace podepisovacího klíče (Signing)

**Vytvořit keystore:**
```bash
keytool -genkey -v -keystore release-key.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
```

**Přidat do `android/app/build.gradle`:**
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('release-key.keystore')
            storePassword 'vaše-heslo'
            keyAlias 'release'
            keyPassword 'vaše-heslo'
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

**DŮLEŽITÉ:** Keystore uložte bezpečně a NEPŘIDÁVEJTE do gitu!

### 4. Build APK/AAB

**V Android Studio:**
1. `Build` → `Generate Signed Bundle / APK`
2. Vybrat `Android App Bundle` (AAB) pro Google Play
3. Vybrat keystore a zadat hesla
4. Vybrat `release` build variant
5. Kliknout `Finish`

**Pomocí příkazové řádky:**
```bash
# Debug APK (pro testování)
cd android
./gradlew assembleDebug

# Release AAB (pro Google Play)
./gradlew bundleRelease

# Release APK (pro přímou distribuci)
./gradlew assembleRelease
```

**Výstup:**
- Debug APK: `android/app/build/outputs/apk/debug/`
- Release APK: `android/app/build/outputs/apk/release/`
- Release AAB: `android/app/build/outputs/bundle/release/`

### 5. Testování

```bash
# Debug build na připojeném zařízení/emulátoru
cd android
./gradlew installDebug

# Nebo v Android Studio: Run ▶️
```

---

## 🍎 iOS Build

### 1. Otevření projektu v Xcode

```bash
# Nainstalovat CocoaPods závislosti
cd ios/App
pod install

# Otevřít Xcode workspace
npx cap open ios
```

Nebo manuálně otevřít `ios/App/App.xcworkspace` v Xcode.

### 2. Konfigurace aplikace

**V Xcode:**
1. Otevřít projekt v navigátoru (modrá ikona)
2. Vybrat `App` target
3. V záložce `General`:
   - **Bundle Identifier:** `app.lovable.bc54af510f2c423e971132129f635b1b`
   - **Version:** `1.0.0` (zobrazovaná verze)
   - **Build:** `1` (číslo buildu, zvyšujte s každou verzí)
   - **Deployment Target:** iOS 13.0+

### 3. Konfigurace Apple Developer účtu

1. V Xcode: `Xcode` → `Preferences` → `Accounts`
2. Přidat Apple ID s Developer účtem
3. V projektu vybrat `Signing & Capabilities`
4. Zaškrtnout `Automatically manage signing`
5. Vybrat Team (Developer účet)

### 4. Konfigurace oprávnění (Info.plist)

**Soubor:** `ios/App/App/Info.plist`

Přidat oprávnění pro čtení souborů:
```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Přístup k fotogalerii pro nahrání knih</string>
<key>NSCameraUsageDescription</key>
<string>Přístup ke kameře pro nahrání knih</string>
```

### 5. Build a Archive

**V Xcode:**
1. Vybrat `Product` → `Scheme` → `App`
2. Vybrat `Any iOS Device (arm64)`
3. `Product` → `Archive`
4. Počkat na dokončení (může trvat 5-10 minut)
5. V Organizer kliknout `Distribute App`
6. Vybrat `App Store Connect`
7. Následovat průvodce

**Pomocí příkazové řádky:**
```bash
cd ios/App

# Build pro simulator (testování)
xcodebuild -workspace App.xcworkspace \
  -scheme App \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 15'

# Archive pro produkci
xcodebuild -workspace App.xcworkspace \
  -scheme App \
  -configuration Release \
  -archivePath ./build/App.xcarchive \
  archive
```

### 6. Testování

**Na simulátoru:**
1. V Xcode vybrat simulator (např. iPhone 15)
2. Stisknout `Cmd + R` nebo kliknout Run ▶️

**Na fyzickém zařízení:**
1. Připojit iPhone/iPad přes USB
2. Důvěřovat počítači na zařízení
3. V Xcode vybrat zařízení
4. Stisknout `Cmd + R`

---

## 🚀 Publikace do Store

### Google Play Store (Android)

1. **Vytvoření aplikace:**
   - Jít na [Google Play Console](https://play.google.com/console)
   - Vytvořit novou aplikaci
   - Vyplnit základní informace

2. **Nahrání AAB:**
   - `Production` → `Create new release`
   - Nahrát `app-release.aab`
   - Vyplnit release notes
   - Odeslat k revizi

3. **Požadované materiály:**
   - Screenshoty (min. 2, různé velikosti)
   - Ikona aplikace 512x512
   - Feature graphic 1024x500
   - Popis aplikace (krátký a plný)
   - Privacy policy URL

4. **Čekací doba:** 1-7 dní na schválení

### Apple App Store (iOS)

1. **Vytvoření aplikace v App Store Connect:**
   - Jít na [App Store Connect](https://appstoreconnect.apple.com)
   - `My Apps` → `+` → `New App`
   - Vyplnit Bundle ID, název, SKU

2. **Nahrání buildu:**
   - Build se nahraje automaticky z Xcode Organizer
   - Nebo použít Application Loader / Transporter

3. **Konfigurace aplikace:**
   - Přidat screenshoty (6.7", 6.5", 5.5")
   - App ikona 1024x1024
   - Popis, klíčová slova
   - Privacy policy URL
   - Kategorie
   - Věkové omezení

4. **Odeslání k revizi:**
   - `Submit for Review`
   - Vyplnit kontaktní informace
   - Odpovědět na otázky o exportu

5. **Čekací doba:** 1-5 dní na schválení

---

## 🔄 Aktualizace po změnách

Po každé změně kódu:

```bash
# 1. Build web aplikace
npm run build

# 2. Sync s nativními platformami
npx cap sync

# 3. Otevřít v IDE a znovu buildovat
npx cap open android  # nebo ios
```

**Zkrácený proces:**
```bash
npm run build && npx cap sync && npx cap open android
```

---

## 📝 Checklist před publikací

### Android
- [ ] Otestováno na min. 3 zařízeních s různými verzemi Androidu
- [ ] Versioncode a versionName aktualizovány
- [ ] Podepsáno release keystore
- [ ] ProGuard pravidla zkontrolována
- [ ] APK/AAB otestováno (nainstalováno z buildu)
- [ ] Screenshoty připraveny (telefon + tablet)
- [ ] Privacy policy URL platná

### iOS
- [ ] Otestováno na simulátorech i fyzickém zařízení
- [ ] Version a Build čísla aktualizována
- [ ] Všechny povinné ikony přidány (App Icon)
- [ ] Launch Screen nastaven
- [ ] Oprávnění (permissions) správně popsána
- [ ] Screenshoty připraveny (všechny velikosti)
- [ ] Privacy policy URL platná
- [ ] Export compliance vyřešeno

---

## 🛠️ Časté problémy

### Android

**Problem:** Gradle build selhává
```bash
# Řešení: Vyčistit a znovu buildovat
cd android
./gradlew clean
./gradlew build
```

**Problem:** App se nenainstaluje
```bash
# Řešení: Povolit instalaci z neznámých zdrojů
# Nastavení → Zabezpečení → Neznámé zdroje
```

### iOS

**Problem:** CocoaPods dependency konflikt
```bash
# Řešení:
cd ios/App
pod deintegrate
pod install
```

**Problem:** Provisioning profile chyba
```
# Řešení: V Xcode Signing & Capabilities
# - Odznačit "Automatically manage signing"
# - Znovu zaškrtnout
# - Stáhnout profily: Xcode → Preferences → Accounts → Download Manual Profiles
```

---

## 📞 Kontakt a podpora

- **Projekt:** eKultura - Čtečka Knih
- **Repository:** https://github.com/eKultura/ebook-reader
- **Issues:** https://github.com/eKultura/ebook-reader/issues

---

## 📚 Užitečné odkazy

### Capacitor
- [Dokumentace Capacitor](https://capacitorjs.com/docs)
- [Android Development](https://capacitorjs.com/docs/android)
- [iOS Development](https://capacitorjs.com/docs/ios)

### Android
- [Android Studio](https://developer.android.com/studio)
- [Google Play Console](https://play.google.com/console)
- [Android Signing Guide](https://developer.android.com/studio/publish/app-signing)

### iOS
- [Xcode](https://developer.apple.com/xcode/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)

---

**Verze:** 1.0.0
**Poslední aktualizace:** 2025-11-06
