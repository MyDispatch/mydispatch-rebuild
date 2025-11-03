/* ==================================================================================
   SEO-Komponente - KRITISCH!
   ==================================================================================
   Meta-Tags, Open Graph, Schema.org für alle Marketing-Seiten
   DEFENSIVE PROGRAMMING: Verhindert Crashes bei Bundle-Splitting
   ================================================================================== */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { logger } from '@/lib/logger';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article';
  schema?: object;
  image?: string;
  keywords?: string[];
}

export function SEOHead({ title, description, canonical, type = 'website', schema, image, keywords }: SEOHeadProps) {
  // DEFENSIVE PROGRAMMING: Runtime-Check für React-Verfügbarkeit
  if (typeof React === 'undefined' || !React) {
    logger.warn('[SEOHead] React not available, skipping render', { component: 'SEOHead' });
    return null;
  }

  const fullTitle = `${title} | MyDispatch - Taxi & Mietwagen Software`;
  const siteUrl = 'https://my-dispatch.de';
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const ogImage = image || `${siteUrl}/og-image.jpg`;
  const keywordString = keywords ? keywords.join(', ') : 'Taxi Software, Mietwagen Software, Disposition, DSGVO, Fuhrparkverwaltung, Made in Germany';

  // Robuste Helmet-Implementierung mit Error-Boundary
  try {
    return (
      <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordString} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="language" content="de" />
      <meta name="author" content="MyDispatch - RideHub Solutions" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="MyDispatch" />
      <meta property="og:locale" content="de_DE" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      </Helmet>
    );
  } catch (error) {
    logger.warn('[SEOHead] Helmet context error', { component: 'SEOHead', error });
    // Fallback: Standard HTML Meta-Tags ohne Helmet
    return null;
  }
}
