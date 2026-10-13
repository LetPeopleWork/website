import { lighthouseAsset } from "@/lib/lighthouseAsset";

// Proof that the forecasts can be trusted, placed right after the proof that
// setup is quick. A sceptical reader's first question about a forecasting
// tool is how good its forecasts are; this is the feature that answers it.
const RealityCheckSection = () => (
  <section id="reality-check" className="py-20 md:py-24 bg-background scroll-mt-24">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
            Forecast Reality Check
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-5">
            Lighthouse checks its own forecasts
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            A forecast is only useful if you know how far to trust it. Reality Check replays past forecasts against what the team then delivered, for each percentile and each sampling window, and shows which ones held.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            So before you quote a date in a meeting, you know whether the 70th or the 85th percentile has been right for your team.
          </p>
        </div>
        <img
          src={lighthouseAsset("features/realitycheck.png")}
          alt="Forecast Reality Check: backtested forecasts per percentile and sampling window, marked where they held and where they missed"
          width="1200"
          height="1016"
          loading="lazy"
          className="w-full h-auto rounded-xl border border-border shadow-soft bg-card"
        />
      </div>
    </div>
  </section>
);

export default RealityCheckSection;
