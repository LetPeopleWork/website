import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { BUDGET_PATH, budgetSeasonOpen } from "@/features/budget/season";
import { prices } from "@/lib/pricing";
import { trackEvent } from "@/lib/plausible";

// The year-end budget note above the navigation. It sits in the page flow and
// scrolls away, so it costs no screen space once someone reads on. The fixed
// navigation starts below it: this component publishes the gap as --nav-top,
// which Navigation uses as its top offset.
//
// It hides itself after the season (features/budget/season.ts), on the budget
// page itself, and on the tool pages that have no navigation.
const DISMISS_KEY = "lpw-budget-bar-dismissed";
const HIDDEN_ON = [BUDGET_PATH, "/survey", "/admin"];

const wasDismissed = (): boolean => {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
};

const BudgetBar = () => {
  const { pathname } = useLocation();
  const [open] = useState(() => budgetSeasonOpen());
  const [dismissed, setDismissed] = useState(wasDismissed);
  const bar = useRef<HTMLElement>(null);

  const visible = open && !dismissed && !HIDDEN_ON.some((path) => pathname.startsWith(path));

  useEffect(() => {
    const root = document.documentElement;
    const el = bar.current;
    if (!visible || !el) {
      root.style.removeProperty("--nav-top");
      return;
    }
    const update = () =>
      root.style.setProperty("--nav-top", `${Math.max(0, el.offsetHeight - window.scrollY)}px`);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // The text can wrap to a second line once the web font arrives.
    const observer = "ResizeObserver" in window ? new ResizeObserver(update) : null;
    observer?.observe(el);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
      root.style.removeProperty("--nav-top");
    };
  }, [visible, pathname]);

  if (!visible) return null;

  const dismiss = () => {
    setDismissed(true);
    trackEvent("Budget campaign", { action: "bar-dismiss" });
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Private windows: the bar is gone for this visit, which is enough.
    }
  };

  return (
    <aside
      ref={bar}
      aria-label="Year-end budget"
      data-testid="budget-bar"
      className="bg-primary text-primary-foreground"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
        <Link
          to={BUDGET_PATH}
          onClick={() => trackEvent("Budget campaign", { action: "bar-click", page: pathname })}
          className="group flex-1 text-center text-sm leading-snug text-primary-foreground no-underline"
        >
          <span className="font-semibold">Budget left this year?</span>{" "}
          <span className="underline decoration-white/40 underline-offset-4 group-hover:decoration-white">
            {prices.selfService} gets every team a year of Lighthouse
          </span>
          <ArrowRight className="ml-1.5 inline h-3.5 w-3.5 align-[-2px] transition-transform group-hover:translate-x-0.5" />
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Hide this note"
          className="-my-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary-foreground/70 transition-colors hover:bg-white/10 hover:text-primary-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
};

export default BudgetBar;
