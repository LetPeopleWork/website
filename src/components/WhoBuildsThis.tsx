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
      "For years I have been working with teams worldwide, experiencing what great teams can achieve. But also seeing that success isn't just about putting individuals together—it requires the right techniques, emotional intelligence, and toolkit.",
      "We see frustrated team members, overwhelmed managers, and complaining customers because people are drowning in meetings instead of delivering value. People want to contribute and be part of something successful—we just need to let them work.",
    ],
  },
  {
    name: "Benjamin Huser-Berta",
    image: BenjiImage,
    alt: "Benjamin Huser-Berta - Software Engineer and Scrum Master",
    paragraphs: [
      "As a Software Engineer and Scrum Master, I've seen teams struggle with wasteful processes and overwhelming workloads that kill motivation. I believe work can be creative and fun when we reduce waste and create environments focused on delivering value.",
      "We build the tools we use ourselves, with hands-on experience making them work in complex organizational environments.",
    ],
  },
];

const WhoBuildsThis = () => {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return (
    <section id="about" className="bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div
          ref={ref}
          className={`text-center bg-background/80 backdrop-blur-sm rounded-2xl p-12 border border-border transition-all duration-700 ease-out ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
            Who builds this
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            The practitioners behind the tools
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto text-left">
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

          <p className="mt-12 text-lg font-medium text-primary">
            We build the tools, and we use them ourselves.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhoBuildsThis;
