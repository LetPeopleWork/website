import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// A one-line mention, deliberately small: Lighthouse is the product, Sizing
// Poker is the free extra. It sits below the Lighthouse story, not beside it.
const SizingPokerTeaser = () => (
  <section id="sizing-poker" className="py-12 md:py-16 bg-background">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 rounded-2xl border border-border bg-gradient-subtle px-6 py-6 md:px-8"
        data-testid="sizing-poker-teaser"
      >
        <div className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2 block">
            Also free · Sizing Poker
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight mb-1">
            Still sizing in story points?
          </h3>
          <p className="text-muted-foreground">
            Skip the hour arguing whether it's a 5 or an 8. Sizing Poker asks one question per item, and it runs in your browser.
          </p>
        </div>
        <Link
          to="/sizing-poker"
          className="group inline-flex items-center gap-2 self-start md:self-center whitespace-nowrap rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Try Sizing Poker
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  </section>
);

export default SizingPokerTeaser;
