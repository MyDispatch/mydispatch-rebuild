#!/bin/bash
# ==================================================================================
#  EMERGENCY RECOVERY SCRIPT - PHOENIX PROTOCOL V1.0
# ==================================================================================
#  Vollautomatische System-Wiederherstellung nach Katastrophe
#  RTO Target: < 15 Minuten
# ==================================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-"test"}
START_TIME=$(date +%s)
LOG_FILE="recovery-drill-$(date +%Y%m%d-%H%M%S).log"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🔥 PHOENIX PROTOCOL - EMERGENCY RECOVERY${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Environment: ${YELLOW}$ENVIRONMENT${NC}"
echo -e "Start Time: $(date)"
echo -e "Log File: ${LOG_FILE}\n"

# Log function
log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

log "${YELLOW}[00:00]${NC} Starting recovery process..."

# PHASE 1: Infrastructure Recovery (Terraform)
log "\n${BLUE}PHASE 1: Infrastructure Recovery${NC}"
log "${YELLOW}[00:00]${NC} Initializing Terraform..."

cd terraform || { log "${RED}Error: terraform directory not found${NC}"; exit 1; }
terraform workspace select "$ENVIRONMENT" || terraform workspace new "$ENVIRONMENT"
terraform init -upgrade

log "${YELLOW}[00:30]${NC} Applying infrastructure..."
terraform apply -var-file="terraform.tfvars.$ENVIRONMENT" -auto-approve

INFRA_TIME=$(($(date +%s) - START_TIME))
log "${GREEN}✓${NC} Infrastructure restored in ${INFRA_TIME}s"

# PHASE 2: Database Recovery
log "\n${BLUE}PHASE 2: Database Recovery${NC}"
log "${YELLOW}[$(printf '%02d:%02d' $((INFRA_TIME/60)) $((INFRA_TIME%60)))]${NC} Restoring database from backup..."

# Get latest backup
LATEST_BACKUP=$(aws s3 ls s3://mydispatch-backups-$ENVIRONMENT/ --recursive | sort | tail -n 1 | awk '{print $4}')
log "Latest backup: $LATEST_BACKUP"

# Download and restore
aws s3 cp "s3://mydispatch-backups-$ENVIRONMENT/$LATEST_BACKUP" /tmp/backup.sql
supabase db reset --db-url "$SUPABASE_URL" < /tmp/backup.sql

DB_TIME=$(($(date +%s) - START_TIME))
log "${GREEN}✓${NC} Database restored in $((DB_TIME - INFRA_TIME))s"

# PHASE 3: Frontend Deployment
log "\n${BLUE}PHASE 3: Frontend Deployment${NC}"
log "${YELLOW}[$(printf '%02d:%02d' $((DB_TIME/60)) $((DB_TIME%60)))]${NC} Deploying frontend..."

cd ..
vercel deploy --prod --env VITE_SUPABASE_URL="$SUPABASE_URL" \
  --env VITE_SUPABASE_PUBLISHABLE_KEY="$SUPABASE_ANON_KEY"

DEPLOY_TIME=$(($(date +%s) - START_TIME))
log "${GREEN}✓${NC} Frontend deployed in $((DEPLOY_TIME - DB_TIME))s"

# PHASE 4: Health Checks
log "\n${BLUE}PHASE 4: Health Checks${NC}"
log "${YELLOW}[$(printf '%02d:%02d' $((DEPLOY_TIME/60)) $((DEPLOY_TIME%60)))]${NC} Running health checks..."

# Check database
log "  • Database connection..."
psql "$SUPABASE_URL" -c "SELECT 1;" > /dev/null 2>&1
log "    ${GREEN}✓${NC} Database responding"

# Check frontend
log "  • Frontend availability..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://mydispatch-$ENVIRONMENT.vercel.app")
if [ "$HTTP_CODE" = "200" ]; then
    log "    ${GREEN}✓${NC} Frontend responding (HTTP $HTTP_CODE)"
else
    log "    ${RED}✗${NC} Frontend error (HTTP $HTTP_CODE)"
    exit 1
fi

# Check edge functions
log "  • Edge functions..."
EDGE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/functions/v1/health")
if [ "$EDGE_CODE" = "200" ]; then
    log "    ${GREEN}✓${NC} Edge functions responding (HTTP $EDGE_CODE)"
else
    log "    ${YELLOW}⚠${NC}  Edge functions warning (HTTP $EDGE_CODE)"
fi

TOTAL_TIME=$(($(date +%s) - START_TIME))

# Final Report
log "\n${GREEN}========================================${NC}"
log "${GREEN}✓ RECOVERY COMPLETE${NC}"
log "${GREEN}========================================${NC}"
log "Total Recovery Time: ${GREEN}$(printf '%02d:%02d' $((TOTAL_TIME/60)) $((TOTAL_TIME%60)))${NC}"
log "Infrastructure: ${INFRA_TIME}s"
log "Database: $((DB_TIME - INFRA_TIME))s"
log "Frontend: $((DEPLOY_TIME - DB_TIME))s"
log "Health Checks: $((TOTAL_TIME - DEPLOY_TIME))s"
log ""

if [ $TOTAL_TIME -lt 900 ]; then
    log "${GREEN}✓ RTO TARGET MET: ${TOTAL_TIME}s < 900s (15min)${NC}"
else
    log "${RED}✗ RTO TARGET MISSED: ${TOTAL_TIME}s > 900s (15min)${NC}"
fi

log "\nRecovery log saved to: $LOG_FILE"
