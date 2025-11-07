#!/bin/bash

# 🔐 Create Signed Android Release
# This script helps you create a signed AAB for Google Play Store

set -e

echo "🔐 Čtečka Knih - Vytvoření podepsaného AAB"
echo "=========================================="
echo ""

# Check if keystore exists
if [ ! -f "android/app/release-key.jks" ]; then
    echo "⚠️  Keystore nenalezen!"
    echo ""
    echo "Vytváření nového keystore..."
    echo ""
    echo "Budete dotázáni na následující informace:"
    echo "  - Heslo keystore (použijte silné heslo!)"
    echo "  - Jméno a organizaci"
    echo "  - Město a stát"
    echo ""

    cd android/app
    keytool -genkey -v -keystore release-key.jks \
        -alias ekultura-release \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000
    cd ../..

    echo ""
    echo "✅ Keystore vytvořen!"
    echo ""
fi

# Check if keystore.properties exists
if [ ! -f "android/keystore.properties" ]; then
    echo "⚠️  keystore.properties nenalezen!"
    echo ""
    read -sp "Zadejte heslo keystore: " KEYSTORE_PASSWORD
    echo ""
    read -sp "Zadejte heslo klíče (Enter pro stejné): " KEY_PASSWORD
    echo ""

    if [ -z "$KEY_PASSWORD" ]; then
        KEY_PASSWORD=$KEYSTORE_PASSWORD
    fi

    cat > android/keystore.properties << EOF
storePassword=$KEYSTORE_PASSWORD
keyPassword=$KEY_PASSWORD
keyAlias=ekultura-release
storeFile=app/release-key.jks
EOF

    echo "✅ keystore.properties vytvořen!"
    echo ""
fi

# Ask for version
echo "Zadejte informace o verzi:"
read -p "Version Name (např. 1.0.0): " VERSION_NAME
read -p "Version Code (např. 1): " VERSION_CODE

if [ -n "$VERSION_NAME" ] && [ -n "$VERSION_CODE" ]; then
    sed -i.bak "s/versionCode [0-9]*/versionCode $VERSION_CODE/" android/app/build.gradle
    sed -i.bak "s/versionName \"[^\"]*\"/versionName \"$VERSION_NAME\"/" android/app/build.gradle
    rm android/app/build.gradle.bak
    echo "✅ Verze aktualizována: $VERSION_NAME (code: $VERSION_CODE)"
fi

echo ""
echo "📦 Building web application..."
npm run build

echo ""
echo "🔄 Syncing with Android..."
npx cap sync android

echo ""
echo "🏗️  Building signed AAB..."
cd android
./gradlew bundleRelease --no-daemon

echo ""
echo "✅ Signed AAB vytvořen!"
echo ""
echo "📂 Soubor:"
echo "   android/app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "📱 Další kroky:"
echo "   1. Najděte soubor výše"
echo "   2. Přihlašte se do Google Play Console"
echo "   3. Production → Create new release"
echo "   4. Nahrajte app-release.aab"
echo "   5. Vyplňte release notes a publikujte"
echo ""
echo "🎉 Hotovo!"
