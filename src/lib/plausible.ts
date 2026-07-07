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

export default plausible;
