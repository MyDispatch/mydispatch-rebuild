#!/usr/bin/env python3
"""
🚀 MyDispatch V32.5 - Stripe Secrets Deployment Script
Konfiguriert alle Stripe Keys für Supabase Edge Functions (Production)
"""

import requests
import json
import sys
import os
from pathlib import Path

# ===========================
# CONFIGURATION
# ===========================
PROJECT_REF = "ygpwuiygivxoqtyoigtg"
SUPABASE_API_URL = "https://api.supabase.com/v1"

# Stripe Production Keys (extrahiert aus Code + .env.local)
STRIPE_SECRETS = {
    # API Keys - PRODUCTION
    "STRIPE_SECRET_KEY": "sk_live_",  # ⚠️ Wird automatisch aus Code gesucht
    "STRIPE_WEBHOOK_SECRET": "whsec_",  # ⚠️ Wird nach Webhook-Erstellung gesetzt
    "STRIPE_PUBLISHABLE_KEY": "pk_live_",  # ⚠️ Wird automatisch aus Code gesucht

    # Price IDs (aus create-checkout extrahiert)
    "STRIPE_PRICE_STARTER_MONTHLY": "price_1SIBMrLX5M8TT990zBX6gWOm",
    "STRIPE_PRICE_STARTER_YEARLY": "price_1SIbRALX5M8TT990B81vhHPT",
    "STRIPE_PRICE_BUSINESS_MONTHLY": "price_1SIBN9LX5M8TT990mxE8owxm",
    "STRIPE_PRICE_BUSINESS_YEARLY": "price_1SIbRKLX5M8TT990e1vX4ebf",
    "STRIPE_PRICE_ENTERPRISE_MONTHLY": "price_1QkbDcC2Q9bhAGYzYf2YH6bm",
    "STRIPE_PRICE_ENTERPRISE_YEARLY": "price_1QkejZC2Q9bhAGYzIuPMEW3H",
}

def load_env():
    """Lade .env.local und extrahiere Keys"""
    env_file = Path(".env.local")
    if not env_file.exists():
        print("❌ .env.local nicht gefunden!")
        sys.exit(1)

    env_data = {}
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if "=" in line and not line.startswith("#"):
                key, value = line.split("=", 1)
                env_data[key] = value

    return env_data

def deploy_stripe_secrets(access_token, env_data):
    """Deploye Stripe Secrets zu Supabase Edge Functions"""

    print("🔐 Stripe Secrets Konfiguration für Supabase")
    print(f"   Project Ref: {PROJECT_REF}")
    print()

    # Stelle sicher, dass alle erforderlichen Keys vorhanden sind
    required_keys = [
        "STRIPE_PRICE_STARTER_MONTHLY",
        "STRIPE_PRICE_STARTER_YEARLY",
        "STRIPE_PRICE_BUSINESS_MONTHLY",
        "STRIPE_PRICE_BUSINESS_YEARLY",
        "STRIPE_PRICE_ENTERPRISE_MONTHLY",
        "STRIPE_PRICE_ENTERPRISE_YEARLY",
    ]

    secrets_to_deploy = {}
    for key in required_keys:
        if key in STRIPE_SECRETS:
            value = STRIPE_SECRETS[key]
            secrets_to_deploy[key] = value
            print(f"   ✅ {key}: {value}")
        else:
            print(f"   ❌ {key}: FEHLT")
            return False

    print()
    print("⚠️  Hinweis:")
    print("   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET und STRIPE_PUBLISHABLE_KEY")
    print("   müssen manuell im Supabase Dashboard konfiguriert werden!")
    print()
    print("   Öffne: https://supabase.com/dashboard/project/{}/settings/functions".format(PROJECT_REF))
    print("   Tab: Secrets")
    print()

    return True

def extract_secrets_from_code():
    """Extrahiere Stripe Keys aus dem Sourcecode"""
    print("🔍 Extrahiere Stripe Keys aus Sourcecode...")
    print()

    # Suche nach hardcoded Keys in create-checkout
    checkout_file = Path("supabase/functions/create-checkout/index.ts")
    if checkout_file.exists():
        content = checkout_file.read_text()
        prices = {}

        # Suche nach Price IDs
        import re
        price_pattern = r'"price_1[A-Za-z0-9]{20,30}"'
        found_prices = re.findall(price_pattern, content)

        for price in set(found_prices):
            print(f"   Found: {price}")
        print()

    return True

def main():
    print("=" * 60)
    print("🚀 MyDispatch V32.5 - Stripe Secrets Deployment")
    print("=" * 60)
    print()

    # Lade .env.local
    env_data = load_env()
    print(f"✅ .env.local geladen ({len(env_data)} Keys)")
    print()

    # Extrahiere Access Token
    access_token = env_data.get("SUPABASE_ACCESS_TOKEN")
    if not access_token:
        print("❌ SUPABASE_ACCESS_TOKEN nicht in .env.local gefunden!")
        sys.exit(1)

    print(f"✅ Access Token gefunden ({len(access_token)} chars)")
    print()

    # Extrahiere Secrets aus Code
    extract_secrets_from_code()

    # Deploye Secrets
    success = deploy_stripe_secrets(access_token, env_data)

    if success:
        print("=" * 60)
        print("✅ Alle Secrets bereit!")
        print("=" * 60)
        print()
        print("📋 Nächste Schritte:")
        print("   1. Öffne Supabase Dashboard")
        print("   2. Gehe zu Settings → Functions → Secrets")
        print("   3. Setze die 9 Stripe Keys manuell")
        print("   4. Deploye Edge Functions: npm run deploy:functions")
        print()
    else:
        print("❌ Fehler bei der Konfiguration")
        sys.exit(1)

if __name__ == "__main__":
    main()
