import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

const SEO = ({
  title = "LetPeopleWork - Flow Metrics & Forecasting with Lighthouse",
  description = "Unlock the full potential of your organization with Lighthouse - the leading open-source tool for flow metrics, Monte Carlo forecasting, and delivery predictions. Connect to Jira & Azure DevOps for data-driven insights.",
  keywords = "flow metrics, forecasting tool, Monte Carlo simulation, delivery forecasting, Jira integration, Azure DevOps, agile metrics, team metrics, project forecasting, throughput, cycle time, work in progress, WIP, lead time, scrum metrics, kanban metrics, agile delivery, predictability, open source agile tool",
  ogImage = "https://letpeople.work/forecasts-project.png",
  ogType = "website",
  canonicalUrl,
  structuredData
}: SEOProps) => {
  const siteUrl = "https://letpeople.work";
  const fullTitle = title.includes("LetPeopleWork") ? title : `${title} | LetPeopleWork`;
  const canonical = canonicalUrl || `${siteUrl}${window.location.pathname}`;

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
      <meta property="og:site_name" content="LetPeopleWork" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="LetPeopleWork GmbH" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;