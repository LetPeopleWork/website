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
// a consent banner. Do not do that without revisiting the compliance decision.
const plausible = Plausible({
  domain: "letpeople.work",
  // apiHost defaults to https://plausible.io (Plausible Cloud, EU region).
});

// Track the first load and every client-side route change in this SPA.
plausible.enableAutoPageviews();

// Custom events are still cookieless and carry no personal data, so they stay
// banner-free. Only send non-personal properties (edition, platform, placement)
// here, never anything that could identify a visitor.
export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>,
) {
  plausible.trackEvent(name, props ? { props } : undefined);
}

// Fires a single "Download" goal, tagged so the dashboard can break it down by
// edition, platform, and where on the site the click happened.
export function trackDownload(data: {
  edition: string;
  platform?: string;
  source?: string;
}) {
  const props: Record<string, string> = { edition: data.edition };
  if (data.platform) props.platform = data.platform;
  if (data.source) props.source = data.source;
  plausible.trackEvent("Download", { props });
}

export default plausible;
