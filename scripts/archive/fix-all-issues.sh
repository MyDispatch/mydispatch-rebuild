#!/bin/bash
# Alle identifizierten Probleme beheben
# Datum: 2025-11-09

set -e

echo "🔧 Starte vollständige Fehlerbehebung..."

# 1. PWAInstallButton-Duplikat entfernen (aus V28HeroPremium)
echo "1️⃣ Entferne PWAInstallButton aus V28HeroPremium.tsx..."
sed -i "/import.*PWAInstallButton/d" src/components/hero/V28HeroPremium.tsx
sed -i "/{showPWAButton && <PWAInstallButton \/>}/d" src/components/hero/V28HeroPremium.tsx
sed -i "/Note: PWAInstallButton/d" src/components/hero/V28HeroPremium.tsx

# 2. V28CookieConsent-Duplikate entfernen (nur in MarketingLayout behalten)
echo "2️⃣ Entferne V28CookieConsent aus AuthPageLayout.tsx..."
sed -i "/import.*V28CookieConsent/d" src/components/layout/AuthPageLayout.tsx
sed -i "/<V28CookieConsent \/>/d" src/components/layout/AuthPageLayout.tsx

echo "3️⃣ Entferne V28CookieConsent aus MarketingLayoutNew.tsx..."
sed -i "/import.*V28CookieConsent/d" src/components/layout/MarketingLayoutNew.tsx
sed -i "/<V28CookieConsent \/>/d" src/components/layout/MarketingLayoutNew.tsx

# 3. Service Worker Cache-Version erhöhen
echo "4️⃣ Erhöhe Service Worker Cache-Version..."
if [ -f public/sw.js ]; then
  sed -i "s/const CACHE_VERSION = .*/const CACHE_VERSION = 'v2025-11-09-07-00';/" public/sw.js
fi

# 4. Build-ID in index.html einfügen
echo "5️⃣ Füge Build-ID in index.html ein..."
if [ -f index.html ]; then
  if ! grep -q "build-id" index.html; then
    sed -i 's/<head>/<head>\n    <meta name="build-id" content="2025-11-09-07-00" \/>/' index.html
  fi
fi

echo "✅ Alle Fixes angewendet!"
echo ""
echo "Nächste Schritte:"
echo "1. npm run build"
echo "2. git add -A && git commit -m 'fix: Alle UI-Fehler behoben'"
echo "3. git push"
echo "4. curl -X POST <DEPLOY_HOOK_URL>"
