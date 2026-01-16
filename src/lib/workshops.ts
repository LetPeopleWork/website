export interface WorkshopDeliverable {
  title: string;
  description: string;
}

export interface WorkshopPricing {
  onSite?: string;
  remote?: string;
  includes?: string;
  fixedPrice?: string;
}

export interface Workshop {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  whatThisDelivers?: string;
  format: {
    duration: string;
    location: string[];
  };
  deliverables: WorkshopDeliverable[];
  scope?: string[];
  pricing: WorkshopPricing;
}

export const workshops: Workshop[] = [
  {
    id: "byod-workshop",
    title: "BYOD Workshop",
    subtitle: "Bring Your Own Data",
    description:
      "Stop pretending sample datasets represent your reality. This workshop is built entirely around your actual business data: the work items, workflows, and metrics that leadership asks you about every week.\n\nWe configure Lighthouse Premium directly in your environment, using your live data to create a working system that reflects how work actually moves through your organization.",
    scope: [
      "Private 1-day implementation workshop",
      "Remote or on-site delivery",
      "Uses your actual business data and workflows",
    ],
    format: {
      duration: "1-Day Session",
      location: ["Remote", "On-Site"],
    },
    deliverables: [
      {
        title: "Lighthouse Premium configured to your workflows",
        description:
          "Custom configuration matching your team structures and processes",
      },
      {
        title: "Your historical data integrated and validated",
        description:
          "Real data from your systems, cleaned and ready for analysis",
      },
      {
        title: "Immediate visibility into flow metrics",
        description:
          "Answer the questions you're constantly being asked with live data",
      },
      {
        title: "A system your teams can start using the next day",
        description:
          "No implementation delays - walk away with a production-ready system",
      },
    ],
    pricing: {
      onSite: "CHF 4,500",
      remote: "CHF 3,500",
      includes: "1 Annual Enterprise License for Lighthouse Premium",
    },
  },
  {
    id: "flow-clarity-assessment",
    title: "Flow Clarity Assessment",
    subtitle: "Delivery System Diagnostic",
    description:
      "Before you can improve predictability, you need to see where unpredictability actually lives in your system. This diagnostic cuts through assumptions and reveals what your historical data says about how work flows (or doesn't flow) through your teams.\n\nA standardized, data-driven diagnostic that makes invisible flow patterns visible and actionable. No opinions, no finger-pointing. Just objective analysis of what your delivery data reveals.",
    scope: [
      "Analysis of 3–6 months of historical delivery data",
      "Primary data sources: Jira or Azure DevOps",
      "Additional sources supported (reach out to discuss)",
    ],
    format: {
      duration: "Fixed Scope",
      location: ["Remote Delivery"],
    },
    deliverables: [
      {
        title: "Flow constraints and bottlenecks",
        description: "Where work actually gets stuck",
      },
      {
        title: "WIP distribution patterns",
        description: "Where attention and capacity are concentrated",
      },
      {
        title: "Aging trends",
        description: "How predictably work moves toward completion",
      },
      {
        title: "Predictability indicators",
        description: "Team-level and system-level delivery consistency",
      },
    ],
    pricing: {
      fixedPrice: "CHF 3,500",
    },
  },
];
