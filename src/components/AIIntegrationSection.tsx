import { ArrowRight } from "lucide-react";

// A compact band, not a full-colour section: AI access is a secondary
// feature, and the strongest background on the homepage now belongs to the
// closing offer. The example conversation stays because it shows the feature
// faster than a description does; it is labelled as an example.
const AIIntegrationSection = () => {
  return (
    <section id="ai-integration" className="py-20 md:py-24 bg-gradient-subtle border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-4 block">
              AI assistants
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 tracking-tight">
              Ask your AI assistant about your flow
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Lighthouse comes with an MCP server, so Claude, Copilot or any assistant that supports tool calling can read your metrics and run a forecast. Its answers come from your team's data in Lighthouse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://docs.lighthouse.letpeople.work/aiintegration.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:bg-primary-hover transition-colors no-underline"
              >
                How to connect
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/ai"
                className="group inline-flex items-center justify-center gap-2 font-semibold text-primary px-2 py-3 no-underline"
              >
                How we work with AI
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <figure>
            <div className="rounded-xl overflow-hidden border border-border bg-[hsl(158_29%_14%)] shadow-medium">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-black/30 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
                <span className="text-xs text-white/50 ml-2 font-mono">Claude + Lighthouse</span>
              </div>

              <div className="p-6 space-y-5 font-mono text-sm">
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-xs text-xs">
                    Which teams should I focus on this week?
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-black">
                    AI
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-white/90 text-xs leading-relaxed space-y-3 flex-1">
                    <p>Based on your Lighthouse data, here's where to focus:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 text-base leading-none">●</span>
                        <span className="font-semibold text-white">Team Alpha</span>
                        <span className="text-white/70">Cycle time up 42% this week</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-base leading-none">●</span>
                        <span className="font-semibold text-white">Team Beta</span>
                        <span className="text-white/70">WIP at 89% of limit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 text-base leading-none">●</span>
                        <span className="font-semibold text-white">All others</span>
                        <span className="text-white/70">On track, within SLE</span>
                      </div>
                    </div>
                    <p className="text-white/80">
                      Team Alpha needs your first conversation. Cycle time jumped from 8 to 11.4 days, with 3 items ageing past the SLE in{" "}
                      <span className="text-emerald-300">"In Review"</span> since Monday.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="text-xs text-muted-foreground mt-3 text-center">
              Example conversation with made-up teams. Works with any assistant that supports MCP.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default AIIntegrationSection;
