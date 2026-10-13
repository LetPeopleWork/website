import { init, track } from "@plausible-analytics/tracker";

// Cookieless, EU-hosted web analytics (Plausible).
//
// No cookies, no personal data stored, no cross-site tracking, so no consent
// banner is required under GDPR/ePrivacy and the Swiss revFADP. The privacy
// policy discloses it (see LegalInfoDialog, "Cookies & Analytics").
//
// Localhost is ignored by default (captureOnLocalhost: false), so local dev
// and preview builds do not pollute the stats.
//
// IMPORTANT: keep this cookieless. Adding Google Analytics would drag us back
// into needing a consent banner. Custom events are fine as long as their
// properties stay non-personal: page paths, editions, platforms and score
// bands are fine, email addresses and free-text answers are not.
//
// This is Plausible's official npm tracker. It replaced plausible-tracker
// (deprecated on npm) in October 2026 because only the official one sends the
// "engagement" events behind the dashboard's scroll depth and time on page.

// Pageviews are reported with a trailing slash so that /lighthouse and
// /lighthouse/ do not split into two rows in the dashboard. GitHub Pages
// redirects to the trailing-slash form anyway. Applied to every event,
// engagement events included, so they line up with their pageview.
export const canonicalUrl = (raw: string): string => {
  try {
    const url = new URL(raw);
    if (!url.pathname.endsWith("/")) url.pathname = `${url.pathname}/`;
    return url.toString();
  } catch {
    return raw;
  }
};

init({
  domain: "letpeople.work",
  // Pageviews follow the SPA's history changes on their own, and the
  // engagement events (scroll depth, time on page) come with them.
  autoCapturePageviews: true,
  // Outbound links and file downloads are tracked by the delegated listener
  // below, which keeps our event names and never blocks target="_blank".
  outboundLinks: false,
  fileDownloads: false,
  transformRequest: (payload) => ({ ...payload, u: canonicalUrl(payload.u) }),
});

const toProps = (props?: Record<string, string | number | boolean>) =>
  props
    ? Object.fromEntries(Object.entries(props).map(([key, value]) => [key, String(value)]))
    : undefined;

export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>,
  options?: { interactive?: boolean },
) {
  track(name, { props: toProps(props), interactive: options?.interactive });
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
  track("Download", { props });
}

// Outbound links, mailto CTAs and raw file links.
//
// Deliberately our own listener rather than the tracker's outboundLinks
// option: it keeps the event names the dashboard goals already use, and it
// only observes, so target="_blank" links behave exactly as written.
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

