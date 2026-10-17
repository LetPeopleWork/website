import PeterImage from "../assets/Peter.png";
import BenjiImage from "../assets/Benji.png";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import foundersData from "@/content/founders.json";

// The two founders, kept from the former services section: a product page
// still needs faces behind it, and these are the people answering the
// support mail. The bios are the founders' own words, in
// src/content/founders.json, which the pitch deck reads too
// (deck/build-deck.mjs), so both always say the same. Keep anecdotes and
// numbers out of bios; they belong with the proof.
const PHOTOS: Record<string, string> = { "Peter.png": PeterImage, "Benji.png": BenjiImage };
const founders = foundersData.map((f) => ({ ...f, image: PHOTOS[f.photo] }));

const WhoBuildsThis = () => {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return (
    <section id="about" className="bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-12 md:pb-24">
        <div
          ref={ref}
          className={`text-center rounded-2xl p-8 md:p-12 border border-border transition-all duration-700 ease-out ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
            Who builds this
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            The practitioners behind the tools
          </h2>

          <div className="grid md:grid-cols-2 gap-10 max-w-3xl mx-auto text-center">
            {founders.map((founder) => (
              <div key={founder.name} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-primary">{founder.name}</h3>
                  <p className="mt-1 mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{founder.role}</p>
                  <img
                    src={founder.image}
                    alt={founder.alt}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 mx-auto"
                    width="80"
                    height="80"
                    loading="lazy"
                  />
                </div>
                <p className="text-muted-foreground">{founder.bio}</p>
                <a
                  href={founder.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {founder.link.label}
                </a>
              </div>
            ))}
          </div>

          <p className="mt-10 text-base font-medium text-primary">
            We build the tools, and we use them ourselves.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhoBuildsThis;
