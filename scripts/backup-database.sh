#!/bin/bash

# ============================================================================
# MYDISPATCH DATABASE BACKUP SCRIPT
# ============================================================================
# Automated daily backup with encryption and cloud storage
# Usage: ./scripts/backup-database.sh
# ============================================================================

set -e

# Configuration
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="mydispatch_backup_${TIMESTAMP}.sql"
ENCRYPTED_FILE="mydispatch_backup_${TIMESTAMP}.sql.gpg"
RETENTION_DAYS=30

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔄 Starting MyDispatch Database Backup..."

# Check required environment variables
if [ -z "$SUPABASE_DB_URL" ]; then
  echo -e "${RED}❌ ERROR: SUPABASE_DB_URL not set${NC}"
  exit 1
fi

if [ -z "$BACKUP_ENCRYPTION_KEY" ]; then
  echo -e "${YELLOW}⚠️  WARNING: BACKUP_ENCRYPTION_KEY not set - backup will not be encrypted${NC}"
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# ============================================================================
# STEP 1: Create Database Dump
# ============================================================================

echo "📦 Creating database dump..."

pg_dump "$SUPABASE_DB_URL" \
  --format=plain \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  > "$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Database dump created successfully${NC}"
else
  echo -e "${RED}❌ Database dump failed${NC}"
  exit 1
fi

# ============================================================================
# STEP 2: Encrypt Backup
# ============================================================================

if [ -n "$BACKUP_ENCRYPTION_KEY" ]; then
  echo "🔒 Encrypting backup..."
  
  echo "$BACKUP_ENCRYPTION_KEY" | gpg \
    --batch \
    --yes \
    --passphrase-fd 0 \
    --symmetric \
    --cipher-algo AES256 \
    --output "$BACKUP_DIR/$ENCRYPTED_FILE" \
    "$BACKUP_DIR/$BACKUP_FILE"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup encrypted successfully${NC}"
    rm "$BACKUP_DIR/$BACKUP_FILE"  # Remove unencrypted file
    BACKUP_FILE=$ENCRYPTED_FILE
  else
    echo -e "${RED}❌ Encryption failed${NC}"
    exit 1
  fi
fi

# ============================================================================
# STEP 3: Upload to Cloud Storage (Optional - if AWS CLI available)
# ============================================================================

if command -v aws &> /dev/null && [ -n "$BACKUP_S3_BUCKET" ]; then
  echo "☁️  Uploading to S3..."
  
  aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" \
    "s3://$BACKUP_S3_BUCKET/mydispatch/backups/$BACKUP_FILE" \
    --storage-class STANDARD_IA
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup uploaded to S3${NC}"
  else
    echo -e "${YELLOW}⚠️  S3 upload failed - backup saved locally${NC}"
  fi
fi

# ============================================================================
# STEP 4: Cleanup Old Backups
# ============================================================================

echo "🗑️  Cleaning up old backups (keeping last $RETENTION_DAYS days)..."

find "$BACKUP_DIR" -name "mydispatch_backup_*.sql*" -mtime +$RETENTION_DAYS -delete

# ============================================================================
# STEP 5: Verify Backup
# ============================================================================

BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
echo -e "${GREEN}✅ BACKUP COMPLETED${NC}"
echo "📊 Backup Details:"
echo "  - File: $BACKUP_FILE"
echo "  - Size: $BACKUP_SIZE"
echo "  - Location: $BACKUP_DIR"
echo "  - Timestamp: $TIMESTAMP"

# Log to backup log
echo "[$(date)] SUCCESS - Backup created: $BACKUP_FILE ($BACKUP_SIZE)" >> "$BACKUP_DIR/backup.log"

exit 0
