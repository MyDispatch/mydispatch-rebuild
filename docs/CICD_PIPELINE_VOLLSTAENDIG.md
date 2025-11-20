# 🚀 VOLLSTÄNDIGE CI/CD PIPELINE MIT GITHUB ACTIONS
## DAUERHAFT & KONSEQUENT AUTOMATISIERTE QUALITÄTSSICHERUNG

---

## 🎯 MISSION

Implementiere eine **vollautomatische, mehrstufige CI/CD Pipeline** die:
- ✅ **Jeden Commit** automatisch testet
- ✅ **Jeden Pull Request** validiert
- ✅ **Code Qualität** erzwingt
- ✅ **Automatisch deployed** (nach Freigabe)
- ✅ **Rollbacks** ermöglicht
- ✅ **Sicherheit** garantiert

**ABSOLUTE REGEL:**
- ❌ **KEIN Code** ohne Tests darf in Production
- ❌ **KEIN Merge** ohne erfolgreiche CI/CD
- ✅ **ALLE Checks** müssen grün sein
- ✅ **AUTOMATISCHE** Quality Gates

---

## 📋 PHASE 1: REPOSITORY SETUP

### 1.1 Branch Strategy (Git Flow)

**Erstelle Branch-Struktur:**

main (production)
↑
staging (pre-production)
↑
develop (development)
↑
feature/* (feature branches)
hotfix/* (emergency fixes)

text

**Branch Protection Rules:**

BRANCH: main (Production)
□ Require pull request reviews (min 1 approval)
□ Require status checks to pass

✅ build

✅ test

✅ lint

✅ type-check

✅ security-scan

✅ lighthouse
□ Require conversation resolution
□ Require signed commits
□ Include administrators (enforce for everyone)
□ Restrict who can push (only CI/CD)
□ Require linear history
□ No force pushes
□ No deletions

BRANCH: staging
□ Require pull request reviews (min 1 approval)
□ Require status checks to pass

✅ build

✅ test

✅ lint

✅ type-check
□ No force pushes

BRANCH: develop
□ Require status checks to pass

✅ build

✅ test

✅ lint
□ No force pushes

text

### 1.2 GitHub Secrets Setup

**Konfiguriere Repository Secrets:**

Settings → Secrets and variables → Actions → New repository secret

REQUIRED SECRETS:
├─ VERCEL_TOKEN # Vercel Deployment
├─ VERCEL_ORG_ID # Vercel Organization
├─ VERCEL_PROJECT_ID # Vercel Project
├─ SUPABASE_ACCESS_TOKEN # Supabase CLI
├─ SUPABASE_DB_PASSWORD # Database Password
├─ SENTRY_AUTH_TOKEN # Error Tracking
├─ CHROMATIC_PROJECT_TOKEN # Visual Regression
├─ CODECOV_TOKEN # Code Coverage
├─ SLACK_WEBHOOK_URL # Notifications
└─ NPM_TOKEN # Package Publishing (optional)

text

### 1.3 Environment Variables

**Erstelle: `.env.example`**

App Config
NEXT_PUBLIC_APP_URL=https://mydispatch.de
NEXT_PUBLIC_APP_NAME=MyDispatch

Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

Email (Resend)
RESEND_API_KEY=re_...

Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=mydispatch.de

Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...

Feature Flags
NEXT_PUBLIC_FEATURE_BLOG=false
NEXT_PUBLIC_FEATURE_NEWSLETTER=true

text

**Erstelle: `.env.development`, `.env.staging`, `.env.production`**

---

## 📦 PHASE 2: PACKAGE.JSON SCRIPTS

**Erstelle: `package.json`**

{
"name": "mydispatch",
"version": "1.0.0",
"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint",
"lint:fix": "next lint --fix",
"type-check": "tsc --noEmit",
"format": "prettier --write "/*.{ts,tsx,md,json}"",
"format:check": "prettier --check "/*.{ts,tsx,md,json}"",

text
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage",
"test:ui": "vitest --ui",

"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:debug": "playwright test --debug",

"test:a11y": "axe-cli --exit",

"validate": "npm run lint && npm run type-check && npm run test:coverage",

"security:audit": "npm audit --production",
"security:scan": "truffleHog --regex --entropy=False .",

"lighthouse": "lhci autorun",

"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build",

"chromatic": "chromatic --exit-zero-on-changes",

"prepare": "husky install"
},
"lint-staged": {
".{ts,tsx}": [
"eslint --fix",
"prettier --write",
"vitest related --run"
],
".{md,json}": [
"prettier --write"
]
}
}

text

---

## 🔧 PHASE 3: GITHUB ACTIONS WORKFLOWS

### 3.1 Main CI/CD Workflow

**Erstelle: `.github/workflows/ci-cd.yml`**

name: CI/CD Pipeline

on:
push:
branches: [main, staging, develop]
pull_request:
branches: [main, staging, develop]

Cancel in-progress runs for the same workflow
concurrency:
group: ${{ github.workflow }}-${{ github.ref }}
cancel-in-progress: true

jobs:

============================================================================
JOB 1: SETUP & INSTALL
============================================================================
setup:
name: Setup & Install Dependencies
runs-on: ubuntu-latest

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  - name: Install dependencies
    run: npm ci
    
  - name: Cache node_modules
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
============================================================================
JOB 2: LINT & FORMAT CHECK
============================================================================
lint:
name: Lint & Format Check
runs-on: ubuntu-latest
needs: setup

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  - name: Restore cache
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
  - name: Run ESLint
    run: npm run lint
    
  - name: Check formatting
    run: npm run format:check
============================================================================
JOB 3: TYPE CHECK
============================================================================
type-check:
name: TypeScript Type Check
runs-on: ubuntu-latest
needs: setup

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  - name: Restore cache
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
  - name: Run type check
    run: npm run type-check
============================================================================
JOB 4: UNIT TESTS
============================================================================
test:
name: Unit & Integration Tests
runs-on: ubuntu-latest
needs: setup

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  - name: Restore cache
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
  - name: Run tests with coverage
    run: npm run test:coverage
    
  - name: Upload coverage to Codecov
    uses: codecov/codecov-action@v3
    with:
      token: ${{ secrets.CODECOV_TOKEN }}
      files: ./coverage/coverage-final.json
      fail_ci_if_error: true
      
  - name: Check coverage thresholds
    run: |
      COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
      if (( $(echo "$COVERAGE < 80" | bc -l) )); then
        echo "Coverage is below 80%: $COVERAGE%"
        exit 1
      fi
============================================================================
JOB 5: E2E TESTS
============================================================================
e2e:
name: E2E Tests (Playwright)
runs-on: ubuntu-latest
needs: setup

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  - name: Restore cache
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
  - name: Install Playwright browsers
    run: npx playwright install --with-deps
    
  - name: Build application
    run: npm run build
    env:
      NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      
  - name: Run E2E tests
    run: npm run test:e2e
    
  - name: Upload Playwright report
    if: always()
    uses: actions/upload-artifact@v3
    with:
      name: playwright-report
      path: playwright-report/
      retention-days: 30
============================================================================
JOB 6: ACCESSIBILITY TESTS
============================================================================
accessibility:
name: Accessibility Tests
runs-on: ubuntu-latest
needs: setup

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  - name: Restore cache
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
  - name: Build application
    run: npm run build
    
  - name: Start server
    run: npm start &
    
  - name: Wait for server
    run: npx wait-on http://localhost:3000
    
  - name: Run axe accessibility tests
    run: |
      npx axe-cli http://localhost:3000 \
        http://localhost:3000/pricing \
        http://localhost:3000/features \
        --exit
============================================================================
JOB 7: SECURITY SCAN
============================================================================
security:
name: Security Scan
runs-on: ubuntu-latest
needs: setup

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    with:
      fetch-depth: 0 # Full history for secret scanning
      
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  - name: Run npm audit
    run: npm audit --production --audit-level=moderate
    
  - name: Secret scanning with TruffleHog
    uses: trufflesecurity/trufflehog@v3
    with:
      path: ./
      base: ${{ github.event.repository.default_branch }}
      head: HEAD
      
  - name: Dependency review
    uses: actions/dependency-review-action@v3
    if: github.event_name == 'pull_request'
============================================================================
JOB 8: BUILD
============================================================================
build:
name: Build Application
runs-on: ubuntu-latest
needs: [lint, type-check, test]

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  - name: Restore cache
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
  - name: Build
    run: npm run build
    env:
      NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      
  - name: Check build size
    run: |
      SIZE=$(du -sb .next | cut -f1)
      MAX_SIZE=$((250 * 1024 * 1024)) # 250MB
      if [ $SIZE -gt $MAX_SIZE ]; then
        echo "Build size exceeds 250MB: $(($SIZE / 1024 / 1024))MB"
        exit 1
      fi
      
  - name: Upload build artifact
    uses: actions/upload-artifact@v3
    with:
      name: build
      path: .next/
      retention-days: 1
============================================================================
JOB 9: LIGHTHOUSE CI
============================================================================
lighthouse:
name: Lighthouse Performance Check
runs-on: ubuntu-latest
needs: build

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  - name: Download build artifact
    uses: actions/download-artifact@v3
    with:
      name: build
      path: .next/
      
  - name: Restore cache
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
  - name: Start server
    run: npm start &
    
  - name: Wait for server
    run: npx wait-on http://localhost:3000
    
  - name: Run Lighthouse CI
    uses: treosh/lighthouse-ci-action@v10
    with:
      urls: |
        http://localhost:3000
        http://localhost:3000/pricing
        http://localhost:3000/features
      configPath: './lighthouserc.json'
      uploadArtifacts: true
      temporaryPublicStorage: true
============================================================================
JOB 10: VISUAL REGRESSION (Chromatic)
============================================================================
visual-regression:
name: Visual Regression Tests
runs-on: ubuntu-latest
needs: build
if: github.event_name == 'pull_request'

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    with:
      fetch-depth: 0 # Required for Chromatic
      
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  - name: Restore cache
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
  - name: Run Chromatic
    uses: chromaui/action@v1
    with:
      projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
      exitZeroOnChanges: true
      autoAcceptChanges: main
============================================================================
JOB 11: DEPLOY TO STAGING
============================================================================
deploy-staging:
name: Deploy to Staging
runs-on: ubuntu-latest
needs: [build, e2e, accessibility, security, lighthouse]
if: github.ref == 'refs/heads/staging' && github.event_name == 'push'
environment:
name: staging
url: https://staging.mydispatch.de

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Deploy to Vercel (Staging)
    uses: amondnet/vercel-action@v25
    with:
      vercel-token: ${{ secrets.VERCEL_TOKEN }}
      vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
      vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
      vercel-args: '--prod'
      scope: ${{ secrets.VERCEL_ORG_ID }}
      
  - name: Notify Slack
    uses: slackapi/slack-github-action@v1.24.0
    with:
      webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
      webhook-type: incoming-webhook
      payload: |
        {
          "text": "✅ Staging Deployment Successful",
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Deployment to *Staging* completed successfully!\n*URL:* https://staging.mydispatch.de\n*Commit:* ${{ github.sha }}"
              }
            }
          ]
        }
============================================================================
JOB 12: DEPLOY TO PRODUCTION
============================================================================
deploy-production:
name: Deploy to Production
runs-on: ubuntu-latest
needs: [build, e2e, accessibility, security, lighthouse]
if: github.ref == 'refs/heads/main' && github.event_name == 'push'
environment:
name: production
url: https://mydispatch.de

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Deploy to Vercel (Production)
    uses: amondnet/vercel-action@v25
    with:
      vercel-token: ${{ secrets.VERCEL_TOKEN }}
      vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
      vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
      vercel-args: '--prod'
      scope: ${{ secrets.VERCEL_ORG_ID }}
      
  - name: Create Sentry release
    uses: getsentry/action-release@v1
    env:
      SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
      SENTRY_ORG: mydispatch
      SENTRY_PROJECT: web
    with:
      environment: production
      version: ${{ github.sha }}
      
  - name: Notify Slack
    uses: slackapi/slack-github-action@v1.24.0
    with:
      webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
      webhook-type: incoming-webhook
      payload: |
        {
          "text": "🚀 Production Deployment Successful",
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Deployment to *Production* completed successfully!\n*URL:* https://mydispatch.de\n*Commit:* ${{ github.sha }}\n*Author:* ${{ github.actor }}"
              }
            }
          ]
        }
text

### 3.2 Pull Request Checks Workflow

**Erstelle: `.github/workflows/pr-checks.yml`**

name: PR Checks

on:
pull_request:
types: [opened, synchronize, reopened]

jobs:

============================================================================
PR METADATA VALIDATION
============================================================================
pr-validation:
name: Validate PR
runs-on: ubuntu-latest

text
steps:
  - name: Check PR title
    uses: amannn/action-semantic-pull-request@v5
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    with:
      types: |
        feat
        fix
        docs
        style
        refactor
        perf
        test
        chore
      requireScope: false
      
  - name: Check PR size
    uses: actions/github-script@v6
    with:
      script: |
        const pr = context.payload.pull_request
        const additions = pr.additions
        const deletions = pr.deletions
        const changes = additions + deletions
        
        const MAX_CHANGES = 1000
        
        if (changes > MAX_CHANGES) {
          core.setFailed(`PR too large: ${changes} changes (max: ${MAX_CHANGES}). Please split into smaller PRs.`)
        }
        
  - name: Check for CHANGELOG update
    uses: actions/github-script@v6
    with:
      script: |
        const pr = context.payload.pull_request
        const files = await github.rest.pulls.listFiles({
          owner: context.repo.owner,
          repo: context.repo.repo,
          pull_number: pr.number
        })
        
        const hasChangelog = files.data.some(file => 
          file.filename.includes('CHANGELOG.md')
        )
        
        if (!hasChangelog && !pr.title.startsWith('docs:') && !pr.title.startsWith('chore:')) {
          core.warning('⚠️ CHANGELOG.md not updated. Consider adding an entry.')
        }
============================================================================
COMPONENT REGISTRY CHECK
============================================================================
component-registry-check:
name: Check Component Registry Update
runs-on: ubuntu-latest

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Check if new components added
    uses: actions/github-script@v6
    with:
      script: |
        const pr = context.payload.pull_request
        const files = await github.rest.pulls.listFiles({
          owner: context.repo.owner,
          repo: context.repo.repo,
          pull_number: pr.number
        })
        
        const newComponents = files.data.filter(file =>
          file.filename.includes('components/ui/') &&
          file.filename.endsWith('.tsx') &&
          file.status === 'added'
        )
        
        if (newComponents.length > 0) {
          const hasRegistryUpdate = files.data.some(file =>
            file.filename.includes('COMPONENT_REGISTRY.md')
          )
          
          if (!hasRegistryUpdate) {
            core.setFailed('❌ New components added but COMPONENT_REGISTRY.md not updated!')
          }
        }
============================================================================
BUNDLE SIZE CHECK
============================================================================
bundle-size:
name: Check Bundle Size
runs-on: ubuntu-latest

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  - name: Install dependencies
    run: npm ci
    
  - name: Build
    run: npm run build
    
  - name: Analyze bundle size
    uses: andresz1/size-limit-action@v1
    with:
      github_token: ${{ secrets.GITHUB_TOKEN }}
      skip_step: install
text

### 3.3 Dependency Update Workflow

**Erstelle: `.github/workflows/dependency-updates.yml`**

name: Dependency Updates

on:
schedule:
- cron: '0 2 * * 1' # Every Monday at 2 AM
workflow_dispatch: # Manual trigger

jobs:
update-dependencies:
name: Update Dependencies
runs-on: ubuntu-latest

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      
  - name: Update dependencies
    run: |
      npm update
      npm audit fix
      
  - name: Create Pull Request
    uses: peter-evans/create-pull-request@v5
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
      commit-message: 'chore: update dependencies'
      title: 'chore: Weekly dependency updates'
      body: |
        Automated dependency updates
        
        - Updates all dependencies to latest versions
        - Runs `npm audit fix` for security patches
        
        Please review changes before merging.
      branch: chore/dependency-updates
      labels: dependencies
text

### 3.4 Stale PR/Issue Cleanup

**Erstelle: `.github/workflows/stale.yml`**

name: Close Stale Issues and PRs

on:
schedule:
- cron: '0 0 * * *' # Daily

jobs:
stale:
runs-on: ubuntu-latest
steps:
- uses: actions/stale@v8
with:
repo-token: ${{ secrets.GITHUB_TOKEN }}

text
      # Stale Issues
      stale-issue-message: 'This issue has been automatically marked as stale because it has not had recent activity. It will be closed in 7 days if no further activity occurs.'
      close-issue-message: 'This issue was automatically closed due to inactivity.'
      days-before-issue-stale: 60
      days-before-issue-close: 7
      stale-issue-label: 'stale'
      
      # Stale PRs
      stale-pr-message: 'This PR has been automatically marked as stale because it has not had recent activity. It will be closed in 7 days if no further activity occurs.'
      close-pr-message: 'This PR was automatically closed due to inactivity.'
      days-before-pr-stale: 30
      days-before-pr-close: 7
      stale-pr-label: 'stale'
text

---

## 📊 PHASE 4: QUALITY GATES CONFIGURATION

### 4.1 Lighthouse CI Config

**Erstelle: `lighthouserc.json`**

{
"ci": {
"collect": {
"numberOfRuns": 3,
"settings": {
"preset": "desktop"
}
},
"assert": {
"assertions": {
"categories:performance": ["error", {"minScore": 0.9}],
"categories:accessibility": ["error", {"minScore": 0.95}],
"categories:best-practices": ["error", {"minScore": 0.95}],
"categories:seo": ["error", {"minScore": 0.95}],

text
    "first-contentful-paint": ["error", {"maxNumericValue": 1500}],
    "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
    "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
    "total-blocking-time": ["error", {"maxNumericValue": 300}],
    
    "resource-summary:script:size": ["error", {"maxNumericValue": 250000}],
    "resource-summary:stylesheet:size": ["error", {"maxNumericValue": 50000}],
    "resource-summary:image:size": ["error", {"maxNumericValue": 1000000}]
  }
},
"upload": {
  "target": "temporary-public-storage"
}
}
}

text

### 4.2 Code Coverage Config

**Erstelle: `vitest.config.ts`**

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
plugins: [react()],
test: {
environment: 'jsdom',
coverage: {
provider: 'v8',
reporter: ['text', 'json', 'html', 'lcov'],
exclude: [
'node_modules/',
'dist/',
'.next/',
'/*.config.{js,ts}',
'/*.d.ts',
'/types/',
'/tests/',
],
// Coverage Thresholds
lines: 80,
functions: 80,
branches: 80,
statements: 80,
},
},
resolve: {
alias: {
'@': path.resolve(__dirname, './src'),
},
},
})

text

---

## 🔔 PHASE 5: NOTIFICATIONS & MONITORING

### 5.1 Slack Notifications Setup

**Erstelle: `.github/workflows/notifications.yml`**

name: Notifications

on:
workflow_run:
workflows: ["CI/CD Pipeline"]
types:
- completed

jobs:
notify:
runs-on: ubuntu-latest

text
steps:
  - name: Notify on failure
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    uses: slackapi/slack-github-action@v1.24.0
    with:
      webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
      webhook-type: incoming-webhook
      payload: |
        {
          "text": "❌ CI/CD Pipeline Failed",
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "*CI/CD Pipeline Failed* 🚨\n*Branch:* ${{ github.ref }}\n*Commit:* ${{ github.sha }}\n*Author:* ${{ github.actor }}\n<${{ github.event.workflow_run.html_url }}|View Workflow>"
              }
            }
          ]
        }
text

### 5.2 Status Badge for README

**Füge zu `README.md` hinzu:**

MyDispatch
[
[
[

[Your README content]

text

---

## 🔄 PHASE 6: DEPLOYMENT STRATEGIES

### 6.1 Rollback Strategy

**Erstelle: `.github/workflows/rollback.yml`**

name: Rollback Deployment

on:
workflow_dispatch:
inputs:
environment:
description: 'Environment to rollback'
required: true
type: choice
options:
- staging
- production
commit_sha:
description: 'Commit SHA to rollback to'
required: true
type: string

jobs:
rollback:
name: Rollback to Previous Version
runs-on: ubuntu-latest
environment: ${{ github.event.inputs.environment }}

text
steps:
  - name: Checkout specific commit
    uses: actions/checkout@v4
    with:
      ref: ${{ github.event.inputs.commit_sha }}
      
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  - name: Install dependencies
    run: npm ci
    
  - name: Build
    run: npm run build
    
  - name: Deploy to Vercel
    uses: amondnet/vercel-action@v25
    with:
      vercel-token: ${{ secrets.VERCEL_TOKEN }}
      vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
      vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
      vercel-args: '--prod'
      
  - name: Notify Slack
    uses: slackapi/slack-github-action@v1.24.0
    with:
      webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
      webhook-type: incoming-webhook
      payload: |
        {
          "text": "⏪ Rollback Completed",
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "*Rollback to ${{ github.event.inputs.commit_sha }}*\n*Environment:* ${{ github.event.inputs.environment }}\n*Initiated by:* ${{ github.actor }}"
              }
            }
          ]
        }
text

### 6.2 Preview Deployments

**Erstelle: `.github/workflows/preview.yml`**

name: Preview Deployment

on:
pull_request:
types: [opened, synchronize]

jobs:
deploy-preview:
name: Deploy Preview
runs-on: ubuntu-latest

text
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Deploy to Vercel (Preview)
    uses: amondnet/vercel-action@v25
    id: vercel-deploy
    with:
      vercel-token: ${{ secrets.VERCEL_TOKEN }}
      vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
      vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
      
  - name: Comment PR with preview URL
    uses: actions/github-script@v6
    with:
      script: |
        github.rest.issues.createComment({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: `🚀 **Preview Deployment**\n\n✅ Preview deployed successfully!\n\n**Preview URL:** ${{ steps.vercel-deploy.outputs.preview-url }}\n\nThis preview will be automatically updated on new commits.`
        })
text

---

## 📚 PHASE 7: DOCUMENTATION & ENFORCEMENT

### 7.1 CI/CD Documentation

**Erstelle: `/docs/CI_CD_GUIDE.md`**

CI/CD Pipeline Guide
Overview
Unser CI/CD System automatisiert Quality Assurance und Deployment.

Pipeline Stages
1. Setup (1-2 Min)
Dependency Installation

Cache Management

2. Quality Checks (3-5 Min)
✅ Linting (ESLint)

✅ Formatting (Prettier)

✅ Type Check (TypeScript)

✅ Unit Tests (Vitest)

✅ Coverage Check (min 80%)

3. Integration Tests (5-10 Min)
✅ E2E Tests (Playwright)

✅ Accessibility Tests (axe-core)

✅ Visual Regression (Chromatic)

4. Security (2-3 Min)
✅ npm audit

✅ Secret Scanning (TruffleHog)

✅ Dependency Review

5. Performance (3-5 Min)
✅ Build Size Check

✅ Lighthouse CI

✅ Bundle Analysis

6. Deployment (3-5 Min)
✅ Deploy to Staging (auto)

✅ Deploy to Production (manual approval)

Total Duration: ~15-30 Min

Branch Strategy
text
main (production)    → Auto-deploy to Production (after approval)
  ↑
staging              → Auto-deploy to Staging
  ↑
develop              → Auto-deploy to Development
  ↑
feature/xyz          → Preview Deployment
Pull Request Workflow
Create Feature Branch:

bash
git checkout -b feature/new-component
Make Changes & Commit:

bash
git add .
git commit -m "feat: add new component"
Push & Create PR:

bash
git push origin feature/new-component
CI/CD Runs Automatically:

All quality checks execute

Preview deployment created

Status shown in PR

Review & Approval:

Min 1 approval required

All checks must pass ✅

Merge:

Squash & Merge to develop

Auto-deploy to Development

Deployment Process
Development
Trigger: Push to develop

Auto-deploy: Yes

URL: https://dev.mydispatch.de

Staging
Trigger: Push to staging

Auto-deploy: Yes

URL: https://staging.mydispatch.de

Production
Trigger: Push to main

Auto-deploy: Yes (after manual approval)

URL: https://mydispatch.de

Rollback Process
Manual Rollback:

Go to: Actions → Rollback Deployment

Click "Run workflow"

Select environment: production or staging

Enter commit SHA (from last working version)

Click "Run workflow"

Automatic Rollback:

Bei kritischen Fehlern: Automatic Rollback nach 5 Min ohne manuelle Intervention

Troubleshooting
Pipeline Failed?
Check Logs:

GitHub Actions → Failed Job → View Logs

Common Issues:

❌ Tests failing: Fix tests locally first

❌ Lint errors: Run npm run lint:fix

❌ Type errors: Run npm run type-check

❌ Coverage < 80%: Add more tests

Fix & Retry:

bash
# Fix locally
npm run validate

# If all pass:
git add .
git commit --amend
git push --force
Deployment Failed?
Check Vercel Logs

Check Environment Variables

Try Manual Rollback

Contact Team Lead

Maintenance
Weekly Tasks
Review Failed Pipelines

Update Dependencies (auto PR)

Clean up Stale Branches

Monthly Tasks
Review Performance Metrics

Update Security Policies

Optimize Pipeline Duration

text

### 7.2 Enforcement Checklist

**Erstelle: `/docs/DEPLOYMENT_CHECKLIST.md`**

🚀 DEPLOYMENT CHECKLIST
PRE-DEPLOYMENT
Code Quality
□ All unit tests passing (coverage > 80%)
□ All E2E tests passing
□ No ESLint errors/warnings
□ No TypeScript errors
□ Code formatted (Prettier)

Security
□ npm audit clean (no high/critical vulnerabilities)
□ No secrets in code
□ Environment variables configured
□ HTTPS enforced

Performance
□ Lighthouse score > 90
□ Bundle size < 250kb (gzipped)
□ Images optimized
□ Lazy loading implemented

Accessibility
□ WCAG 2.1 AA compliant
□ Keyboard navigation works
□ Screen reader tested
□ Color contrast > 4.5:1

Documentation
□ CHANGELOG.md updated
□ README.md current
□ API docs updated
□ Component Registry updated

Legal & Compliance
□ DSGVO compliance verified
□ Cookie banner functional
□ Privacy Policy current
□ Legal pages reviewed

DEPLOYMENT
Staging
□ Deployed to staging
□ Smoke tests passed
□ Manual QA done
□ Stakeholder approval

Production
□ All staging checks ✓
□ Backup created
□ Rollback plan ready
□ Monitoring active
□ Team notified

POST-DEPLOYMENT
Verification
□ Homepage loads
□ Critical flows work
□ No console errors
□ Analytics tracking

Monitoring
□ Error rate < 1%
□ Response time < 500ms
□ Uptime 100%

Communication
□ Team notified
□ Stakeholders informed
□ Documentation updated
□ Changelog published

✅ ALL CHECKED → DEPLOYMENT APPROVED

text

---

## 🎯 FINAL ENFORCEMENT

**ABSOLUTE REGELN:**

❌ NIEMALS:

Code ohne Tests mergen

Pipeline-Checks umgehen

Direkt zu main pushen

Secrets in Code committen

Deployment ohne Approval

✅ IMMER:

Feature Branch erstellen

Tests schreiben

PR erstellen

Code Review abwarten

Alle Checks grün

Merge nach Approval