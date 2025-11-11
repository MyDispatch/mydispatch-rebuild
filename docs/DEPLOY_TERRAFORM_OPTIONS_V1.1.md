# Terraform Deploy-Optionen (Vercel vs. AWS S3 + CloudFront)
Status: Production-Ready (Guideline)
Version: 1.1.1
Datum: 2025-11-11
Autor: Engineering

## Zusammenfassung
Dieses Dokument skizziert zwei praktikable Deploy-Strategien für MyDispatch (React + Vite):
1) Vercel (statisches Hosting, keine Terraform-Nutzung erforderlich) – schnell, integriert, optional mit Turborepo Remote Cache.
2) AWS S3 + CloudFront via Terraform – voll kontrolliertes, kosteneffizientes Static Hosting mit globalem CDN und TLS.

## Details
- Grundannahmen
  - Build-Artefakte: `dist/` aus `npm run build` (Vite).
  - SPA-Routing: 404-Fallback auf `index.html` via CloudFront.
  - Cache-Strategie: Aggressiv für statische Assets, kurz für HTML.

### Option A: Vercel (ohne Terraform)
- Eigenschaften
  - Kein Terraform notwendig: Deployment über Vercel CLI oder Git-Integration.
  - `vercel.json` im Repo vorhanden; Build & Preview via Vercel erledigt.
  - Integration mit Turborepo Remote Cache möglich.

- Schritte
  - Projekt in Vercel anlegen, Repo verlinken.
  - Build Command: `npm run build`; Output: `dist`.
  - Preview/Production Deploys via Pull Requests.

- Vorteile/Nachteile
  - + Sehr schnell, wenig Ops-Aufwand.
  - − Weniger Infra-Kontrolle; kein Terraform-Audit.

### Option B: AWS S3 + CloudFront (mit Terraform)
- Komponenten
  - S3 Bucket (Static Website, Public Read via CloudFront Origin Access Control).
  - CloudFront Distribution (TLS, Caching, SPA 404 → `index.html`).
  - ACM-Zertifikat (Region us-east-1 für CloudFront), optional Route53.

- Beispiel-Ressourcen (Auszug)
```hcl
resource "aws_s3_bucket" "site" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_website_configuration" "site" {
  bucket = aws_s3_bucket.site.id
  index_document { suffix = "index.html" }
  error_document { key = "index.html" } # SPA Fallback
}

resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id   = "s3-origin"
  }

  default_cache_behavior {
    target_origin_id       = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
  }

  viewer_certificate {
    acm_certificate_arn = var.acm_certificate_arn
    ssl_support_method  = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

# Upload nach Build (CI-Schritt)
# aws s3 sync dist/ s3://$BUCKET --delete
# CloudFront Invalidation
# aws cloudfront create-invalidation --distribution-id $DISTRIBUTION --paths "/index.html" "/assets/*"
```

- CI/CD Hinweise
  - Nach `npm run build`: `aws s3 sync` auf Bucket, dann `cloudfront create-invalidation`.
  - Assets (z. B. `/assets/*`) invalidieren, `index.html` immer invalidieren.

## Validierung
- Deploy-Checks
  - Öffne die Distribution-URL / Domain, prüfe: Startseite lädt, Routing funktioniert, HTTPS aktiv.
  - Cache-Header für `index.html` kurz (z. B. `max-age=0`/`no-store`), Assets lang (`max-age=31536000`, immutable).

- Rollback-Strategie
  - S3 Versioning optional aktivieren.
  - Terraform State verwalten (Remote State in S3/DynamoDB empfohlen).

## Referenzen
- Terraform Root: `terraform/main.tf` (bereits im Repo)
- Vercel Konfiguration: `vercel.json`
- Build-Artefakte: `dist/` (Vite)
- Turborepo (Struktur/Pipelines): https://github.com/vercel/turborepo/tree/main/examples/basic

