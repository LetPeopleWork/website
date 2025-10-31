import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  structuredData?: object;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

const SEO = ({
  title = "LetPeopleWork - Flow Metrics & Forecasting with Lighthouse",
  description = "Unlock the full potential of your organization with Lighthouse - the leading open-source tool for flow metrics, Monte Carlo forecasting, and delivery predictions. Connect to Jira & Azure DevOps for data-driven insights.",
  keywords = "flow metrics, forecasting tool, Monte Carlo simulation, delivery forecasting, Jira integration, Azure DevOps, agile metrics, team metrics, project forecasting, throughput, cycle time, work in progress, WIP, lead time, scrum metrics, kanban metrics, agile delivery, predictability, open source agile tool",
  ogImage = "https://letpeople.work/forecasts-project.png",
  ogType = "website",
  canonicalUrl,
  structuredData,
  breadcrumbs
}: SEOProps) => {
  const siteUrl = "https://letpeople.work";
  const fullTitle = title.includes("LetPeopleWork") ? title : `${title} | LetPeopleWork`;
  const canonical = canonicalUrl || `${siteUrl}${window.location.pathname}`;

  // BreadcrumbList structured data
  const breadcrumbStructuredData = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${siteUrl}${crumb.url}`
    }))
  } : null;

  // WebSite structured data with search action
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LetPeopleWork",
    "url": siteUrl,
    "description": "Expert consulting in Flow, Delivery, and Obeya methodologies. Creators of Lighthouse - the leading open-source flow metrics and forecasting tool.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/?s={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet prioritizeSeoTags>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Lighthouse Flow Metrics Dashboard" />
      <meta property="og:site_name" content="LetPeopleWork" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Lighthouse Flow Metrics Dashboard" />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="English" />
      <meta name="author" content="LetPeopleWork GmbH" />
      <meta name="revisit-after" content="7 days" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* BreadcrumbList Structured Data */}
      {breadcrumbStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      )}
      
      {/* WebSite Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(websiteStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;