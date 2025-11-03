# ==================================================================================
#  TERRAFORM OUTPUTS - MYDISPATCH INFRASTRUCTURE
# ==================================================================================

output "vercel_project_id" {
  description = "Vercel Project ID"
  value       = vercel_project.mydispatch.id
}

output "vercel_deployment_url" {
  description = "Production Deployment URL"
  value       = vercel_deployment.production.url
}

output "supabase_url" {
  description = "Supabase Project URL"
  value       = var.supabase_url
  sensitive   = true
}

output "recovery_time_objective" {
  description = "Target RTO for Phoenix Protocol"
  value       = "< 15 minutes"
}

output "infrastructure_status" {
  description = "Infrastructure Deployment Status"
  value       = "Deployed via Terraform"
}
