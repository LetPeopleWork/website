// Single source of truth for every price stated on the site (ADO #5563).
export interface Prices {
  /** Display string for the Self-Service licence, e.g. "CHF 2,000". */
  selfService: string;
  /** Bare amount for schema.org Offer.price, which takes no currency symbol or separators. */
  selfServiceAmount: string;
  /** Implement / BYOD pilot engagement. */
  pilot: string;
  /** Flow Clarity Assessment (bundles a Lighthouse licence). */
  assessment: string;
}

export const prices: Prices = {
  selfService: "CHF 2,000",
  selfServiceAmount: "2000",
  pilot: "CHF 3,000",
  assessment: "CHF 4,500",
};
