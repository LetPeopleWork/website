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
      "Lighthouse Premium license included for data sharing",
      "60-minute debrief (virtual, on-site on request)",
    ],
    format: {
      duration: "Fixed Scope",
      location: ["Remote Delivery"],
    },
    deliverables: [
      {
        title: "Lighthouse Premium license for data collection",
        description: "Set up Lighthouse and securely share your data with us for analysis",
      },
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
      includes: "1 Annual Lighthouse Premium License",
    },
  },
  {
    id: "complete-flow-package",
    title: "Complete Flow Transformation Package",
    subtitle: "End-to-End: Assessment + Implementation + Sustaining Capability",
    description:
      "The complete journey from understanding your delivery system's current state to implementing a working solution that provides ongoing visibility. This package combines diagnostic assessment with hands-on implementation and sustained capability through Lighthouse Premium.\n\nYou get the strategic insight of the Flow Clarity Assessment combined with the practical implementation of the BYOD Workshop, plus the ongoing capability to maintain visibility into your delivery system. This is 25% less than purchasing separately—the most comprehensive and cost-effective way to transform your delivery predictability.",
    scope: [
      "Two-phase engagement: Assessment followed by Implementation",
      "Remote or on-site delivery options",
      "Analysis of your historical data (3-6 months)",
      "Private 1-day implementation workshop with your team",
      "Uses your actual business data and workflows",
    ],
    format: {
      duration: "2-Phase Engagement",
      location: ["Remote", "On-Site"],
    },
    deliverables: [
      {
        title: "Complete diagnostic report",
        description: "Flow constraints, WIP patterns, aging trends, and predictability indicators from your historical data",
      },
      {
        title: "Lighthouse Premium configured to your workflows",
        description: "Custom configuration matching your team structures and processes",
      },
      {
        title: "Your historical data integrated and validated",
        description: "Real data from your systems, cleaned and ready for ongoing analysis",
      },
      {
        title: "Immediate visibility into flow metrics",
        description: "Answer the questions you're constantly being asked with live data",
      },
      {
        title: "A production-ready system your teams can use immediately",
        description: "Walk away with both understanding and capability to sustain it",
      },
      {
        title: "60-minute diagnostic debrief + full-day implementation workshop",
        description: "Comprehensive engagement from assessment to working solution",
      },
    ],
    pricing: {
      onSite: "CHF 7,000",
      remote: "CHF 6,000",
      includes: "Flow Clarity Assessment + BYOD Workshop + 1 Annual Lighthouse Premium License (Save 25% compared to separate purchases)",
    },
  },
];
