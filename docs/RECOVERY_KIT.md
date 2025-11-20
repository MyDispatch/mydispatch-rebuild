# 🧰 RECOVERY KIT - MyDispatch

## Overview

This document contains all tools, scripts, and procedures needed to rebuild MyDispatch from scratch in under 15 minutes.

---

## 1. PREREQUISITES

### Required Software

```bash
# Install required tools
brew install terraform      # Infrastructure as Code
brew install postgresql     # Database CLI
brew install awscli         # Cloud storage
brew install vercel         # Frontend deployment
brew install gpg            # Backup decryption
```

### Repository Access

```bash
# Clone repositories
git clone https://github.com/[owner]/mydispatch.git
git clone https://github.com/[owner]/mydispatch-secure-mirror.git

# Verify both repositories are identical
cd mydispatch
git remote add mirror ../mydispatch-secure-mirror
git fetch mirror
git diff main mirror/main  # Should be empty
```

---

## 2. RECOVERY SCRIPTS

### Full System Recovery

**File:** `scripts/emergency-recovery.sh`

```bash
#!/bin/bash
# ============================================================================
# EMERGENCY FULL SYSTEM RECOVERY
# ============================================================================

set -e

echo "🚨 EMERGENCY RECOVERY - MyDispatch"
echo "=================================="

# Load environment
source .env.recovery

# Phase 1: Infrastructure (5-8 min)
echo "⚡ Phase 1: Infrastructure..."
cd terraform
terraform init -reconfigure
terraform apply -auto-approve -var-file="terraform.tfvars"
cd ..

# Phase 2: Database (3-5 min)
echo "💾 Phase 2: Database..."
./scripts/restore-latest-backup.sh

# Phase 3: Frontend (2-3 min)
echo "🎨 Phase 3: Frontend..."
npm ci
npm run build
vercel deploy --prod --yes

# Phase 4: Verification (2 min)
echo "✅ Phase 4: Verification..."
npm run test:e2e:critical

echo ""
echo "✅ RECOVERY COMPLETE!"
echo "🌐 Application: https://mydispatch.app"
echo "📊 Monitor: Check Vercel + Supabase dashboards"
```

### Database Restore Only

**File:** `scripts/restore-latest-backup.sh`

```bash
#!/bin/bash
# ============================================================================
# RESTORE LATEST DATABASE BACKUP
# ============================================================================

set -e

echo "💾 Database Restore - Latest Backup"

# Download latest backup
LATEST_BACKUP=$(aws s3 ls s3://mydispatch-backups/mydispatch/backups/ \
  | grep "backup_" \
  | sort \
  | tail -n 1 \
  | awk '{print $4}')

echo "📦 Latest backup: $LATEST_BACKUP"

aws s3 cp \
  "s3://mydispatch-backups/mydispatch/backups/$LATEST_BACKUP" \
  ./backups/latest.sql.gpg

# Decrypt
echo "🔓 Decrypting backup..."
echo "$BACKUP_ENCRYPTION_KEY" | gpg \
  --batch \
  --yes \
  --passphrase-fd 0 \
  --decrypt backups/latest.sql.gpg \
  > backups/restore.sql

# Restore
echo "⚡ Restoring to database..."
psql "$SUPABASE_DB_URL" < backups/restore.sql

# Verify
echo "✅ Verifying restoration..."
TABLES=$(psql "$SUPABASE_DB_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo "Tables restored: $TABLES"

echo "✅ Database restore complete!"
```

### Backup Verification

**File:** `scripts/verify-backup.sh`

```bash
#!/bin/bash
# ============================================================================
# VERIFY BACKUP INTEGRITY
# ============================================================================

set -e

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./scripts/verify-backup.sh <backup-file>"
  exit 1
fi

echo "🔍 Verifying backup: $BACKUP_FILE"

# Decrypt
echo "$BACKUP_ENCRYPTION_KEY" | gpg \
  --batch \
  --yes \
  --passphrase-fd 0 \
  --decrypt "$BACKUP_FILE" \
  > /tmp/test_restore.sql

# Test restore to temporary database
echo "Testing restore to temporary database..."
psql "$TEST_DB_URL" < /tmp/test_restore.sql

# Verify structure
TABLES=$(psql "$TEST_DB_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo "✅ Tables found: $TABLES"

# Cleanup
rm /tmp/test_restore.sql
psql "$TEST_DB_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo "✅ Backup verification complete!"
```

---

## 3. INFRASTRUCTURE TEMPLATES

### Terraform Quick Start

```bash
# Initialize Terraform
cd terraform
terraform init

# Create terraform.tfvars (NEVER commit this!)
cat > terraform.tfvars << EOF
environment           = "production"
supabase_access_token = "sbp_xxx"
supabase_org_id       = "org_xxx"
database_password     = "secure-password-16-chars"
vercel_api_token      = "xxx"
github_repo           = "owner/mydispatch"
EOF

# Plan infrastructure
terraform plan

# Apply infrastructure
terraform apply

# Get outputs
terraform output
```

### Docker Quick Start

```bash
# Build image
docker build -t mydispatch:latest .

# Run locally
docker run -p 8080:80 mydispatch:latest

# Test
curl http://localhost:8080/health

# Deploy to registry
docker tag mydispatch:latest registry.example.com/mydispatch:latest
docker push registry.example.com/mydispatch:latest
```

---

## 4. RECOVERY ENVIRONMENT

### Required Environment Variables

**File:** `.env.recovery.example`

```bash
# ============================================================================
# RECOVERY ENVIRONMENT VARIABLES
# ============================================================================

# Supabase
SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_ORG_ID=org_xxxxxxxxxxxxxxxx
SUPABASE_DB_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# Vercel
VERCEL_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VERCEL_ORG_ID=team_xxxxxxxxxxxxx

# AWS (for backups)
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_DEFAULT_REGION=eu-central-1

# Backup
BACKUP_ENCRYPTION_KEY=secure-encryption-passphrase-32-chars-min
BACKUP_S3_BUCKET=mydispatch-backups

# Application
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Testing
TEST_DB_URL=postgresql://localhost:5432/test_restore
```

---

## 5. MANUAL RECOVERY STEPS

### If Automation Fails

#### Step 1: Create New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `mydispatch-recovery`
4. Region: `eu-central-1`
5. Database password: Use secure password
6. Copy: Project URL, Anon Key, Service Role Key

#### Step 2: Restore Database

```bash
# Connect to new database
psql "postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Download and decrypt backup
aws s3 cp s3://mydispatch-backups/mydispatch/backups/[latest].sql.gpg ./
gpg --decrypt [latest].sql.gpg > restore.sql

# Restore
\i restore.sql

# Verify
\dt
SELECT COUNT(*) FROM [key_table];
```

#### Step 3: Deploy Frontend

```bash
# Install Vercel CLI
npm i -g vercel

# Update environment variables
cat > .env << EOF
VITE_SUPABASE_URL=https://[new-project].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[new-anon-key]
EOF

# Deploy
vercel deploy --prod
```

#### Step 4: Update DNS (if needed)

1. Go to DNS provider
2. Update A/CNAME records to new Vercel deployment
3. Wait for propagation (5-60 min)

---

## 6. VERIFICATION CHECKLIST

### Post-Recovery Tests

```bash
# 1. Health check
curl https://mydispatch.app/health
# Expected: {"status": "healthy"}

# 2. Database connectivity
curl https://[project].supabase.co/rest/v1/
# Expected: 200 OK

# 3. Authentication
# Manual: Try login at /auth

# 4. Critical flows
npm run test:e2e:critical

# 5. Data integrity
psql "$SUPABASE_DB_URL" -c "SELECT COUNT(*) FROM users;"
# Compare with pre-disaster count
```

---

## 7. EMERGENCY CONTACTS

### Recovery Team

| Role           | Name   | Phone   | Email   |
| -------------- | ------ | ------- | ------- |
| Tech Lead      | [Name] | [Phone] | [Email] |
| DevOps         | [Name] | [Phone] | [Email] |
| Database Admin | [Name] | [Phone] | [Email] |

### Service Providers

| Provider | Support              | URL                            |
| -------- | -------------------- | ------------------------------ |
| Supabase | support@supabase.com | https://supabase.com/dashboard |
| Vercel   | support@vercel.com   | https://vercel.com/support     |
| AWS      | [Account Support]    | https://console.aws.amazon.com |

---

## 8. TESTING RECOVERY

### Dry Run Procedure

```bash
# 1. Create test environment
cd terraform
cp terraform.tfvars terraform.tfvars.test
# Edit: Change environment = "test"

# 2. Deploy test infrastructure
terraform workspace new test
terraform apply -var-file="terraform.tfvars.test"

# 3. Restore backup to test environment
SUPABASE_DB_URL=$TEST_DB_URL ./scripts/restore-latest-backup.sh

# 4. Deploy frontend to test
vercel deploy --env=test

# 5. Run verification
npm run test:e2e -- --env=test

# 6. Cleanup
terraform destroy -var-file="terraform.tfvars.test"
```

---

## 9. TROUBLESHOOTING

### Common Issues

**Issue:** Terraform state locked

```bash
# Solution: Force unlock
terraform force-unlock [LOCK_ID]
```

**Issue:** Backup decryption fails

```bash
# Solution: Verify encryption key
echo "$BACKUP_ENCRYPTION_KEY" | gpg --batch --decrypt [file].gpg
```

**Issue:** Vercel deployment fails

```bash
# Solution: Check build logs
vercel logs [deployment-url]
```

**Issue:** Database restore timeout

```bash
# Solution: Restore in batches
psql "$SUPABASE_DB_URL" < schema.sql
psql "$SUPABASE_DB_URL" < data.sql
```

---

## 10. APPENDIX

### File Locations

```
mydispatch/
├── terraform/                 # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   └── terraform.tfvars      # NEVER commit!
├── scripts/                   # Recovery scripts
│   ├── emergency-recovery.sh
│   ├── restore-latest-backup.sh
│   └── verify-backup.sh
├── backups/                   # Local backup cache
├── docs/                      # Documentation
│   ├── DISASTER_RECOVERY_PLAN.md
│   └── RECOVERY_KIT.md       # This file
└── .env.recovery             # Recovery environment
```

---

**VERSION:** 1.0.0  
**LAST UPDATED:** 2025-01-31  
**OWNER:** DevOps Team
