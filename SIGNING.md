# 🔐 Podepsání AAB pro Google Play Store

**RYCHLÝ NÁVOD** - Jak vytvořit podepsaný AAB pro Google Play

## ⚠️ DŮLEŽITÉ - Přečtěte si nejdřív!

**Keystore obsahuje kritické údaje pro publikaci aplikace:**
- Bez keystore **NEMŮŽETE** aktualizovat aplikaci v Google Play
- Pokud keystore ztratíte, musíte vytvořit novou aplikaci s novým balíčkem
- **Zálohujte keystore** na bezpečné místo (Google Drive, 1Password, USB disk)
- **NIKDY** nenahrávejte keystore do Gitu

---

## 🚀 Rychlé řešení (5 minut)

### Krok 1: Vytvořit Keystore

```bash
cd android/app

# Vytvoření keystore (vyplňte informace)
keytool -genkey -v -keystore release-key.jks \
  -alias ekultura-release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Co vyplnit:**
```
Enter keystore password: [zadejte silné heslo]
Re-enter new password: [zopakujte heslo]
What is your first and last name?
  [Unknown]: eKultura Team
What is the name of your organizational unit?
  [Unknown]: Development
What is the name of your organization?
  [Unknown]: eKultura
What is the name of your City or Locality?
  [Unknown]: Prague
What is the name of your State or Province?
  [Unknown]: Czech Republic
What is the two-letter country code for this unit?
  [Unknown]: CZ
Is CN=eKultura Team, OU=Development, O=eKultura, L=Prague, ST=Czech Republic, C=CZ correct?
  [no]: yes

Enter key password for <ekultura-release>
  (RETURN if same as keystore password): [Enter pro stejné heslo]
```

**📝 Poznamenejte si:**
- Keystore password: `__________________`
- Key alias: `ekultura-release`
- Key password: `__________________` (stejné jako keystore)

### Krok 2: Vytvořit `keystore.properties`

```bash
cd android
cat > keystore.properties << 'EOF'
storePassword=VASE_KEYSTORE_HESLO
keyPassword=VASE_KEY_HESLO
keyAlias=ekultura-release
storeFile=app/release-key.jks
EOF
```

**NAHRAĎTE:**
- `VASE_KEYSTORE_HESLO` - heslo které jste zadali
- `VASE_KEY_HESLO` - key heslo (obvykle stejné)

### Krok 3: Aktualizovat `build.gradle`

Tento krok je **automatický** - již je v projektu připraven.

### Krok 4: Build Signed AAB

```bash
# Z root složky projektu
npm run build
npx cap sync android

cd android
./gradlew bundleRelease
```

**Výsledek:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Krok 5: Nahrát do Google Play Console

1. Jít na [Google Play Console](https://play.google.com/console)
2. Vybrat aplikaci
3. **Production** → **Create new release**
4. Nahrát `app-release.aab` ze složky výše
5. **Save** → **Review release** → **Start rollout to Production**

---

## ✅ Checklist před nahráním

- [ ] Keystore vytvořen a hesla uložena
- [ ] `keystore.properties` vytvořen s hesly
- [ ] Build úspěšný: `./gradlew bundleRelease`
- [ ] AAB nalezen v `android/app/build/outputs/bundle/release/`
- [ ] Keystore zálohován na bezpečném místě

---

## 🔒 Bezpečnost Keystore

### ✅ CO DĚLAT:
- Zálohovat `release-key.jks` + hesla na 3 místa:
  - Google Drive (šifrovaný)
  - USB disk (v trezoru)
  - Password manager (1Password, Bitwarden)
- Sdílet pouze s důvěryhodnými vývojáři

### ❌ NEDĚLAT:
- ❌ Nahrávat keystore do Gitu
- ❌ Sdílet keystore přes email
- ❌ Ukládat hesla v plain textu v repozitáři
- ❌ Používat slabá hesla

---

## 🐛 Časté problémy

### Chyba: "Keystore file does not exist"

```bash
# Zkontrolovat cestu
ls android/app/release-key.jks

# Pokud neexistuje, vytvořit znovu (Krok 1)
```

### Chyba: "Failed to read key from keystore"

```bash
# Zkontrolovat hesla v keystore.properties
cat android/keystore.properties

# Ověřit keystore
keytool -list -v -keystore android/app/release-key.jks
```

### Chyba: "The apk must be signed with the same certificates"

Toto znamená, že Google Play už má jinou verzi s jiným keystore.

**Řešení:**
- Pro **novou aplikaci**: OK, pokračujte
- Pro **update**: MUSÍTE použít původní keystore!

---

## 🔄 Aktualizace aplikace

Při každé nové verzi:

1. **Zvýšit verzi** v `android/app/build.gradle`:
```gradle
versionCode 2  // zvýšit o 1
versionName "1.0.1"  // nová verze
```

2. **Build nové AAB**:
```bash
npm run build
npx cap sync android
cd android
./gradlew bundleRelease
```

3. **Nahrát do Google Play** jako novou verzi

---

## 📂 Struktura souborů

```
ebook-reader/
├── android/
│   ├── app/
│   │   └── release-key.jks         ← KEYSTORE (NEZÁLOHOVAT DO GITU!)
│   ├── keystore.properties         ← HESLA (NEZÁLOHOVAT DO GITU!)
│   └── app/build.gradle            ← Signing konfigurace
└── .gitignore                      ← Ignoruje keystore
```

---

## 📱 Ověření podpisu

Po buildu ověřit že AAB je podepsaný:

```bash
# Instalace bundletool (pokud nemáte)
# https://github.com/google/bundletool/releases

java -jar bundletool.jar validate \
  --bundle=android/app/build/outputs/bundle/release/app-release.aab

# Nebo ověření v jarsigner
jarsigner -verify -verbose -certs \
  android/app/build/outputs/bundle/release/app-release.aab
```

Měli byste vidět:
```
jar verified.
```

---

## 🎯 Alternativa: Android Studio

Pokud preferujete GUI:

1. Otevřít projekt: `npx cap open android`
2. **Build** → **Generate Signed Bundle / APK**
3. Vybrat **Android App Bundle**
4. **Next**
5. **Create new...** (pokud nemáte keystore)
6. Vyplnit údaje z Kroku 1
7. **Next** → vybrat **release**
8. **Finish**

AAB bude v `android/app/release/`

---

## 💾 Zálohování Keystore

### Doporučený postup:

```bash
# 1. Vytvořit šifrovaný ZIP
zip -e keystore-backup.zip android/app/release-key.jks android/keystore.properties
# Zadat heslo pro ZIP

# 2. Nahrát do cloud storage
# Google Drive / Dropbox / OneDrive

# 3. Uložit heslo do password manageru
# 1Password / Bitwarden / LastPass
```

---

## 📞 Pomoc

Pokud máte problémy:

1. Zkontrolovat hesla v `keystore.properties`
2. Ověřit že keystore existuje: `ls android/app/release-key.jks`
3. Spustit build s verbose: `./gradlew bundleRelease --info`
4. Zkontrolovat [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) pro GitHub Actions signing

---

**Úspěch?** → AAB je připravený pro Google Play Store! 🎉

**Další krok:** Nahrát do Google Play Console → Production → Create new release
