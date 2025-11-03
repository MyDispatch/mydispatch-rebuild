#!/bin/bash

# ============================================================================
# RESTORE SPECIFIC BACKUP - MYDISPATCH
# ============================================================================
# Usage: ./scripts/restore-specific-backup.sh [BACKUP_FILENAME]
# Example: ./scripts/restore-specific-backup.sh mydispatch_backup_20250131_020000.sql.gpg
# ============================================================================

set -e

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ ERROR: Backup filename required"
  echo "Usage: $0 <backup-filename>"
  echo ""
  echo "Available backups:"
  aws s3 ls s3://mydispatch-backups/mydispatch/backups/ | grep "backup_"
  exit 1
fi

echo "🔄 Restoring backup: $BACKUP_FILE"

# Download specific backup
aws s3 cp \
  "s3://mydispatch-backups/mydispatch/backups/$BACKUP_FILE" \
  ./backups/

# Decrypt
echo "🔓 Decrypting backup..."
echo "$BACKUP_ENCRYPTION_KEY" | gpg \
  --batch \
  --yes \
  --passphrase-fd 0 \
  --decrypt "backups/$BACKUP_FILE" \
  > backups/restore.sql

# Restore
echo "⚡ Restoring to database..."
psql "$SUPABASE_DB_URL" < backups/restore.sql

echo "✅ Restore complete!"
