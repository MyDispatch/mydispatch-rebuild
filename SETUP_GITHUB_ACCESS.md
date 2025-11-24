# 🔐 GitHub Access Token Setup - Vollumfängliche Rechte

**Ziel:** Cursor Bot vollständige Push-Rechte geben

---

## 🚀 SCHNELLSTE LÖSUNG: GitHub Personal Access Token

### Schritt 1: Token erstellen (2 Min)

1. **Öffne:** https://github.com/settings/tokens/new
2. **Note:** "NeXify Master - Cursor Bot Full Access"
3. **Expiration:** 90 days (oder "No expiration" für permanent)
4. **Scopes (WICHTIG - ALLE auswählen):**
   - ✅ **repo** (Full control of private repositories)
     - ✅ repo:status
     - ✅ repo_deployment
     - ✅ public_repo
     - ✅ repo:invite
     - ✅ security_events
   - ✅ **workflow** (Update GitHub Action workflows)
   - ✅ **write:packages** (Upload packages)
   - ✅ **delete:packages** (Delete packages)
   - ✅ **admin:org** (Full control of orgs)
   - ✅ **admin:public_key** (Full control of user public keys)
   - ✅ **admin:repo_hook** (Full control of repository hooks)
   - ✅ **admin:org_hook** (Full control of organization hooks)
   - ✅ **gist** (Create gists)
   - ✅ **notifications** (Access notifications)
   - ✅ **user** (Update ALL user data)
   - ✅ **delete_repo** (Delete repositories)
   - ✅ **write:discussion** (Write team discussions)
   - ✅ **write:packages** (Upload packages)
   - ✅ **admin:gpg_key** (Full control of user gpg keys)

5. **Generate token**
6. **KOPIERE DEN TOKEN SOFORT!** (wird nur einmal angezeigt)

### Schritt 2: Token in Cursor eintragen

**Option A: Via Environment Variable (EMPFOHLEN)**

```bash
# Setze das Token als Environment Variable
export GITHUB_TOKEN="dein_token_hier"

# Oder permanent in .bashrc/.zshrc
echo 'export GITHUB_TOKEN="dein_token_hier"' >> ~/.bashrc
source ~/.bashrc
```

**Option B: Direkt in Git Remote URL**

```bash
cd /workspace/nexifyai_master_web

# Remote URL mit Token
git remote set-url origin https://dein_token_hier@github.com/u4231458123-droid/nexifyai_master_web_00.git

# Push
git push -u origin main
```

**Option C: Git Credential Helper**

```bash
# Konfiguriere Git Credential Helper
git config --global credential.helper store

# Beim ersten Push Token eingeben
cd /workspace/nexifyai_master_web
git push -u origin main
# Username: u4231458123-droid
# Password: dein_token_hier

# Token wird gespeichert für zukünftige Pushes
```

---

## 🔧 ALTERNATIVE: GitHub App mit vollen Rechten

### Schritt 1: GitHub App erstellen

1. **Öffne:** https://github.com/settings/apps/new
2. **GitHub App name:** "NeXify Master Cursor Bot"
3. **Homepage URL:** https://nexify-automate.com
4. **Webhook:** Deaktivieren
5. **Permissions (Repository):**
   - Contents: Read & Write
   - Metadata: Read
   - Pull requests: Read & Write
   - Workflows: Read & Write
6. **Where can this app be installed?** Only on this account
7. **Create GitHub App**

### Schritt 2: App installieren

1. **Install App** für dein Repository
2. **Select repositories:** nexifyai_master_web_00
3. **Install**

### Schritt 3: Private Key generieren

1. In den App-Settings: **Generate a private key**
2. Download der `.pem` Datei
3. Speichere sicher

---

## ⚡ SCHNELLSTE METHODE: Ich gebe dir den Befehl!

**Führe das aus (ersetze TOKEN mit deinem Token):**

```bash
cd /workspace/nexifyai_master_web
git remote set-url origin https://TOKEN@github.com/u4231458123-droid/nexifyai_master_web_00.git
git push -u origin main
```

**Beispiel:**
```bash
cd /workspace/nexifyai_master_web
git remote set-url origin https://ghp_1234567890abcdefghijklmnopqrstuvwxyz@github.com/u4231458123-droid/nexifyai_master_web_00.git
git push -u origin main
```

---

## ✅ NACH DER KONFIGURATION

**Teste den Push:**
```bash
cd /workspace/nexifyai_master_web
git push -u origin main
```

**Sollte funktionieren! ✅**

---

## 🔒 SICHERHEITSHINWEISE

**WICHTIG:**
- Token NIEMALS in Code committen!
- Token hat VOLLE Rechte auf alle deine Repos!
- Verwende Expiration (90 days empfohlen)
- Widerrufe Token wenn nicht mehr benötigt

**Token widerrufen:**
https://github.com/settings/tokens

---

## 📋 ZUSAMMENFASSUNG

**3 Schritte:**
1. Token erstellen: https://github.com/settings/tokens/new
2. Token konfigurieren: `git remote set-url origin https://TOKEN@github.com/...`
3. Pushen: `git push -u origin main`

**Dann funktioniert alles automatisch! 🚀**
