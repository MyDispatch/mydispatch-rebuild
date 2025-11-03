# ============================================================================
# TERRAFORM VARIABLES - MYDISPATCH
# ============================================================================

variable "environment" {
  description = "Environment name (production, staging, development)"
  type        = string
  default     = "production"
  
  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "Environment must be production, staging, or development."
  }
}

variable "supabase_access_token" {
  description = "Supabase Management API Access Token"
  type        = string
  sensitive   = true
}

variable "supabase_org_id" {
  description = "Supabase Organization ID"
  type        = string
}

variable "supabase_region" {
  description = "Supabase Project Region"
  type        = string
  default     = "eu-central-1"
}

variable "database_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
  
  validation {
    condition     = length(var.database_password) >= 16
    error_message = "Database password must be at least 16 characters."
  }
}

variable "vercel_api_token" {
  description = "Vercel API Token"
  type        = string
  sensitive   = true
}

variable "github_repo" {
  description = "GitHub repository (format: owner/repo)"
  type        = string
}

variable "site_url" {
  description = "Application Site URL"
  type        = string
  default     = "https://mydispatch.app"
}

# ============================================================================
# BACKUP CONFIGURATION
# ============================================================================

variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 30
  
  validation {
    condition     = var.backup_retention_days >= 7 && var.backup_retention_days <= 365
    error_message = "Backup retention must be between 7 and 365 days."
  }
}

variable "backup_bucket" {
  description = "S3 bucket for encrypted backups"
  type        = string
  default     = "mydispatch-backups"
}
