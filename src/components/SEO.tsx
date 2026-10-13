import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: string;
  canonicalUrl?: string;
  /**
   * Keep the page out of search results and AI crawlers. Use for pages that are
   * live but deliberately unlisted, so only people with the link reach them.
   * index.html ships "index, follow"; this swaps it for the run of this page and
   * restores it on navigating away. scripts/prerender-meta.mjs must set the same
   * flag for the route, or crawlers reading the static HTML will still index it.
   */
  noIndex?: boolean;
}

const SEO = ({
  title = "LetPeopleWork - Flow Metrics & Forecasting with Lighthouse",
  description = "Unlock the full potential of your organization with Lighthouse - the leading source-available tool for flow metrics, Monte Carlo forecasting, and delivery predictions. Connect to Jira, Azure DevOps, Linear & ServiceNow for data-driven insights.",
  keywords = "flow metrics, forecasting tool, Monte Carlo simulation, delivery forecasting, Jira integration, Azure DevOps, Linear integration, ServiceNow integration, agile metrics, team metrics, project forecasting, throughput, cycle time, work in progress, WIP, lead time, scrum metrics, kanban metrics, agile delivery, predictability, self-hosted agile tool, source available",
  ogImage = "https://letpeople.work/lighthouse-forecast.png",
  ogImageAlt = "Lighthouse Flow Metrics Dashboard",
  ogType = "website",
  canonicalUrl,
  noIndex = false
}: SEOProps) => {
  const siteUrl = "https://letpeople.work";
  const fullTitle = title.includes("LetPeopleWork") ? title : `${title} | LetPeopleWork`;
  const canonical = canonicalUrl || `${siteUrl}${window.location.pathname}`;

  // Meta tags are updated in place rather than rendered as JSX. index.html
  // already ships a full set of SEO tags (rewritten per route by
  // scripts/prerender-meta.mjs for crawlers), so rendering them again would
  // produce duplicate canonical, description and og tags. This keeps exactly
  // one of each and keeps them correct across client-side navigation.
  //
  // react-helmet-async is deliberately not used: version 2.x silently injects
  // nothing under React 19, which is why structured data never reached the DOM.
  useEffect(() => {
    document.title = fullTitle;

    const upsert = (
      selector: string,
      create: () => HTMLElement,
      apply: (el: HTMLElement) => void,
    ) => {
      let el = document.head.querySelector<HTMLElement>(selector);
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      apply(el);
    };

    const meta = (attr: "name" | "property", key: string, content: string) =>
      upsert(
        `meta[${attr}="${key}"]`,
        () => {
          const el = document.createElement("meta");
          el.setAttribute(attr, key);
          return el;
        },
        (el) => el.setAttribute("content", content),
      );

    meta("name", "title", fullTitle);
    meta("name", "description", description);
    meta("name", "keywords", keywords);
    // Restored explicitly rather than only set, so navigating from an unlisted
    // page to a normal one does not leave the whole SPA marked noindex.
    meta(
      "name",
      "robots",
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    );
    meta("property", "og:type", ogType);
    meta("property", "og:url", canonical);
    meta("property", "og:title", fullTitle);
    meta("property", "og:description", description);
    meta("property", "og:image", ogImage);
    meta("property", "og:image:alt", ogImageAlt);
    meta("name", "twitter:url", canonical);
    meta("name", "twitter:title", fullTitle);
    meta("name", "twitter:description", description);
    meta("name", "twitter:image", ogImage);
    meta("name", "twitter:image:alt", ogImageAlt);

    upsert(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        return el;
      },
      (el) => el.setAttribute("href", canonical),
    );
  }, [
    fullTitle,
    description,
    keywords,
    canonical,
    ogType,
    ogImage,
    ogImageAlt,
    noIndex,
  ]);

  // Structured data (JSON-LD) is not rendered here. It is written into each
  // route's static HTML at build time by scripts/seo-schema.mjs, so crawlers
  // that do not run JavaScript see it too. Rendering it again here would give
  // Google two copies of everything.
  return null;
};

export default SEO;
