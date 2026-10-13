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
            Don't trust a forecast? Fair enough, we wouldn't either. Reality Check forecasts weeks that already happened, as if they hadn't, and compares the result with what your team really finished. You see it for every percentile and every sampling window.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            When Peter backtested his own team, the 85% forecast said 12 items for those two weeks. They finished 16. Better to find out how your forecasts hold up before the next steering committee than during it.
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
