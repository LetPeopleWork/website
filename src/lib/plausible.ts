import Plausible from "plausible-tracker";

// Cookieless, EU-hosted web analytics (Plausible).
//
// No cookies, no personal data stored, no cross-site tracking, so no consent
// banner is required under GDPR/ePrivacy and the Swiss revFADP. The privacy
// policy discloses it (see LegalInfoDialog, "Cookies & Analytics").
//
// Localhost is ignored by default (trackLocalhost: false), so local dev and
// preview builds do not pollute the stats.
//
// IMPORTANT: keep this cookieless. Adding Google Analytics, or turning on
// Plausible's custom-event / revenue tracking, would drag us back into needing
// a consent banner. Custom events are fine as long as their properties stay
// non-personal: page paths, editions, platforms and score bands are fine,
// email addresses and free-text answers are not.
const plausible = Plausible({
  domain: "letpeople.work",
  // apiHost defaults to https://plausible.io (Plausible Cloud, EU region).
});

// Pageviews are reported with a trailing slash so that /lighthouse and
// /lighthouse/ do not split into two rows in the dashboard. GitHub Pages
// redirects to the trailing-slash form anyway.
const canonicalUrl = () => {
  const { origin, pathname, search, hash } = window.location;
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return `${origin}${path}${search}${hash}`;
};

const trackPageview = () => plausible.trackPageview({ url: canonicalUrl() });

// Deliberately not enableAutoPageviews(), because that reports the raw URL.
trackPageview();
const originalPushState = history.pushState.bind(history);
history.pushState = function (...args: Parameters<History["pushState"]>) {
  originalPushState(...args);
  trackPageview();
} as typeof history.pushState;
window.addEventListener("popstate", trackPageview);

export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>,
) {
  plausible.trackEvent(name, props ? { props } : undefined);
}

// Values are lowercased so that "Windows" and "windows" stop showing up as two
// separate rows in the property breakdown.
const norm = (value: string) => value.trim().toLowerCase();

// Fires the "Download" goal, tagged so the dashboard can break it down by
// edition, platform, file format, and where on the site the click happened.
export function trackDownload(data: {
  edition: string;
  platform?: string;
  format?: string;
  source?: string;
}) {
  const props: Record<string, string> = { edition: norm(data.edition) };
  if (data.platform) props.platform = norm(data.platform);
  if (data.format) props.format = norm(data.format).replace(/^\./, "");
  if (data.source) props.source = data.source;
  plausible.trackEvent("Download", { props });
}

// Outbound links, mailto CTAs and raw file links.
//
// Deliberately NOT plausible.enableAutoOutboundTracking(): that helper calls
// preventDefault() and forces location.href, which breaks every
// target="_blank" link on the site. This delegated listener only observes.
//
// Anchors that already call trackDownload themselves carry
// data-skip-autotrack, so a single click never counts as both "Download" and
// "File Download".
const FILE_PATTERN =
  /\.(pdf|zip|csv|xlsx|docx|pptx|exe|msi|dmg|appimage|mcpb|tar\.gz)$/i;

document.addEventListener(
  "click",
  (event) => {
    const anchor = (event.target as Element | null)?.closest?.("a");
    if (!anchor || anchor.dataset.skipAutotrack !== undefined) return;

    const href = anchor.getAttribute("href") ?? "";
    if (!href) return;

    // Our own contact addresses, never a visitor's. The subject line is
    // dropped so the property report groups all mail clicks per address
    // instead of splintering into one row per subject.
    if (href.toLowerCase().startsWith("mailto:")) {
      const address = decodeURIComponent(href.slice(7)).split("?")[0];
      trackEvent("Email link: Click", { url: address });
      return;
    }
    if (!/^https?:/i.test(anchor.href)) return;

    if (FILE_PATTERN.test(new URL(anchor.href).pathname)) {
      trackEvent("File Download", { url: anchor.href });
    }
    if (anchor.host && anchor.host !== window.location.host) {
      trackEvent("Outbound Link: Click", { url: anchor.href });
    }
  },
  { capture: true },
);

export default plausible;
