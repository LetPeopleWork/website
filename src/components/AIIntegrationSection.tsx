import { ArrowRight } from "lucide-react";

const prompts = [
  {
    question: "Which teams should I focus on this week?",
    answer:
      "Get a prioritized view of where predictability is dropping, WIP is creeping up, or cycle time is spiking. No dashboard required.",
  },
  {
    question: "Will we finish the Q3 release by August?",
    answer:
      "Run a Monte Carlo forecast in seconds and get a confidence range you can bring straight to your steering committee.",
  },
  {
    question: "What's one thing this team could do to improve their flow?",
    answer:
      "Get a coaching recommendation based on your team's actual metrics. The same advice a flow consultant would give, available anytime.",
  },
];

const AIIntegrationSection = () => {
  return (
    <section id="ai-integration" className="py-20 bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/60 mb-4 block">
            AI Integration
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            Ask Your Data{" "}
            <span className="bg-gradient-to-r from-green-200 to-emerald-300 bg-clip-text text-transparent">
              Anything
            </span>
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Your AI assistant can now read your Lighthouse data directly. No exports, no copy-paste, no dashboard tab-switching. Ask what needs your attention, run a forecast, or build agentic workflows. All grounded in your team's real metrics.
          </p>
        </div>

        {/* Prompts + chat mockup */}
        <div className="grid lg:grid-cols-2 gap-10 items-start mb-16">

          {/* Prompt cards */}
          <div className="space-y-4">
            {prompts.map((p, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/10 border border-white/20 p-6 hover:bg-white/15 transition-colors duration-200"
              >
                <p className="text-sm font-semibold text-green-200 mb-2 leading-snug">
                  "{p.question}"
                </p>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">
                  {p.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Chat mockup — swap this div for a real screenshot/video when ready */}
          <div className="rounded-xl overflow-hidden border border-white/20 bg-black/40">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-black/30 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
              <div className="w-3 h-3 rounded-full bg-green-400/60" />
              <span className="text-xs text-white/40 ml-2 font-mono">Claude + Lighthouse</span>
            </div>

            {/* Conversation */}
            <div className="p-6 space-y-5 font-mono text-sm">
              {/* User */}
              <div className="flex justify-end">
                <div className="bg-primary/70 text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-xs text-xs">
                  Which teams should I focus on this week?
                </div>
              </div>

              {/* AI */}
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-black">
                  AI
                </div>
                <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-primary-foreground/90 text-xs leading-relaxed space-y-3 flex-1">
                  <p>Based on your Lighthouse data, here's where to focus:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-base leading-none">●</span>
                      <span className="font-semibold text-white">Team Alpha</span>
                      <span className="text-white/60">Cycle time up 42% this week</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 text-base leading-none">●</span>
                      <span className="font-semibold text-white">Team Beta</span>
                      <span className="text-white/60">WIP at 89% of limit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 text-base leading-none">●</span>
                      <span className="font-semibold text-white">All others</span>
                      <span className="text-white/60">On track, within SLE</span>
                    </div>
                  </div>
                  <p className="text-white/70">
                    Team Alpha needs your first conversation. Cycle time jumped from 8 to 11.4 days, with 3 items aging past SLE in{" "}
                    <span className="text-emerald-300">"In Review"</span> since Monday.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-primary-foreground/60 text-sm mb-6">
            Works with any AI that supports tool calling. Claude, Copilot, and beyond. No vendor lock-in, true to our open-source roots.
          </p>
          <a
            href="https://docs.lighthouse.letpeople.work/aiintegration.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-all duration-200 hover:-translate-y-0.5 shadow-soft no-underline"
          >
            Learn how to connect
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default AIIntegrationSection;
