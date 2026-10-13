import pricingData from "./pricing.json";

// Single source of truth for every price stated on the site (ADO #5563).
export interface Prices {
  /** Display string for the Self-Service licence, e.g. "CHF 2,000". */
  selfService: string;
  /** Bare amount for schema.org Offer.price, which takes no currency symbol or separators. */
  selfServiceAmount: string;
  /** Display string for the Enterprise licence, e.g. "CHF 10,000". */
  enterprise: string;
  /** Bare amount for schema.org Offer.price. */
  enterpriseAmount: string;
  /** Implement / BYOD pilot engagement. */
  pilot: string;
  /** Flow Clarity Assessment (bundles a Lighthouse licence). */
  assessment: string;
  /** One AI workshop at pilot pricing, per team (the /ai page). */
  aiWorkshopPilot: string;
  /** Bare amount for schema.org Offer.price. */
  aiWorkshopPilotAmount: string;
}

// The values live in pricing.json so the build can put the same prices into
// the static structured data (scripts/seo-schema.mjs). Edit them there.
export const prices: Prices = pricingData;
