import PeterImage from "../assets/Peter.png";
import BenjiImage from "../assets/Benji.png";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// The two founders, kept from the former services section: a product page
// still needs faces behind it, and these are the people answering the
// support mail. The bios are the founders' own words; the closing line was
// rewritten when consulting left the site.
const founders = [
  {
    name: "Peter Zylka-Greger",
    image: PeterImage,
    alt: "Peter Zylka-Greger - Flow and Kanban Expert",
    paragraphs: [
      "Years with teams worldwide taught me that people want to contribute and be part of something successful. We just need to let them work.",
    ],
  },
  {
    name: "Benjamin Huser-Berta",
    image: BenjiImage,
    alt: "Benjamin Huser-Berta - Software Engineer and Scrum Master",
    paragraphs: [
      "Software engineer and Scrum Master. Work can be creative and fun when we reduce waste and focus on delivering value.",
    ],
  },
];

const WhoBuildsThis = () => {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return (
    <section id="about" className="bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
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
                  <h3 className="text-xl font-semibold text-primary mb-3">{founder.name}</h3>
                  <img
                    src={founder.image}
                    alt={founder.alt}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 mx-auto"
                    width="80"
                    height="80"
                    loading="lazy"
                  />
                </div>
                {founder.paragraphs.map((text) => (
                  <p key={text.slice(0, 24)} className="text-muted-foreground">
                    {text}
                  </p>
                ))}
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
