#!/bin/bash

# 🚀 RYCHLÝ PUSH DO div-cz/div_ctecka
# Spusťte tento skript po vytvoření repozitáře na GitHubu

set -e

echo "🚀 DIV Čtečka - Push do nového repozitáře"
echo "=========================================="
echo ""

# Kontrola že jsme ve správné složce
if [ ! -f "capacitor.config.ts" ]; then
    echo "❌ Chyba: Nejste ve složce projektu!"
    echo "Spusťte: cd /home/user/ebook-reader"
    exit 1
fi

echo "📍 Pracovní složka: $(pwd)"
echo ""

# Commit aktuálních změn
echo "💾 Commitování změn..."
git config --local commit.gpgsign false
git add -A
git commit -m "Update repo references to div_ctecka" || echo "Nothing to commit"

echo ""
echo "🧹 Vytváření čisté historie..."
echo ""

# Backup .git
mv .git .git-backup

# Nový čistý git
git init
git add .
git commit -m "Initial commit: DIV Čtečka

Mobilní aplikace pro čtení elektronických knih od DIV.cz

Features:
- Podpora PDF, EPUB, Markdown formátů
- Tmavý režim a nastavitelné písmo
- Fulltextové vyhledávání
- Sledování čtecího pokroku
- React 18 + TypeScript + Capacitor 7
- GitHub Actions pro automatické buildy

Bundle ID: cz.div.reader
Organization: DIV.cz"

echo ""
echo "📤 Připojování k novému repozitáři..."
git branch -M main
git remote add origin https://github.com/div-cz/div_ctecka.git

echo ""
echo "🚀 Pushing do div-cz/div_ctecka..."
echo ""

if git push -u origin main; then
    echo ""
    echo "✅ ÚSPĚCH! Projekt nahrán!"
    echo ""
    echo "🎉 Váš projekt je nyní na:"
    echo "   https://github.com/div-cz/div_ctecka"
    echo ""
    echo "📱 Další kroky:"
    echo "   1. Vytvořit signed AAB: ./create-signed-release.sh"
    echo "   2. Nahrát do Google Play Console"
    echo ""

    # Smazat backup
    rm -rf .git-backup
else
    echo ""
    echo "❌ Push selhal!"
    echo ""
    echo "Možné příčiny:"
    echo "1. Repozitář div-cz/div_ctecka ještě neexistuje"
    echo "   → Vytvořte na https://github.com/div-cz (NECHAT PRÁZDNÉ!)"
    echo ""
    echo "2. Nemáte oprávnění"
    echo "   → Zkontrolujte GitHub přístup"
    echo ""
    echo "Obnovuji původní git..."
    rm -rf .git
    mv .git-backup .git

    exit 1
fi
