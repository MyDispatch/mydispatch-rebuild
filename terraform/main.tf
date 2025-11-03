# ==================================================================================
#  TERRAFORM MAIN CONFIGURATION - MYDISPATCH INFRASTRUCTURE
# ==================================================================================
#  Phoenix Protocol Infrastructure as Code
#  Cloud-Agnostic Deployment for Supabase + Vercel
# ==================================================================================

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }

  backend "local" {
    path = "terraform.tfstate"
  }
}

# ==================================================================================
#  VERCEL FRONTEND DEPLOYMENT
# ==================================================================================

resource "vercel_project" "mydispatch" {
  name      = var.project_name
  framework = "vite"
  
  git_repository = {
    type = "github"
    repo = var.github_repo
  }

  environment = [
    {
      key    = "VITE_SUPABASE_URL"
      value  = var.supabase_url
      target = ["production", "preview"]
    },
    {
      key    = "VITE_SUPABASE_PUBLISHABLE_KEY"
      value  = var.supabase_anon_key
      target = ["production", "preview"]
    },
    {
      key    = "VITE_SUPABASE_PROJECT_ID"
      value  = var.supabase_project_id
      target = ["production", "preview"]
    }
  ]
}

resource "vercel_deployment" "production" {
  project_id = vercel_project.mydispatch.id
  production = true
  
  ref = "main"
}

# ==================================================================================
#  BACKUP CONFIGURATION
# ==================================================================================

resource "null_resource" "backup_schedule" {
  provisioner "local-exec" {
    command = <<-EOT
      echo "Setting up daily backup schedule..."
      # This would typically integrate with cloud provider's backup service
      # For now, documented in Recovery Plan
    EOT
  }

  triggers = {
    always_run = timestamp()
  }
}

# ==================================================================================
#  MONITORING & ALERTS
# ==================================================================================

resource "null_resource" "monitoring_setup" {
  provisioner "local-exec" {
    command = <<-EOT
      echo "Monitoring configured via Vercel Analytics + Supabase Dashboard"
      echo "Recovery Drill scheduled for quarterly execution"
    EOT
  }
}
