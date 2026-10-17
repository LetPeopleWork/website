import PeterImage from "../assets/Peter.png";
import BenjiImage from "../assets/Benji.png";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// The two founders, kept from the former services section: a product page
// still needs faces behind it, and these are the people answering the
// support mail. The bios are the founders' own words; the closing line was
// rewritten when consulting left the site. Each `track` line says what the
// person does at LetPeopleWork, with a link to something they wrote. Keep
// anecdotes and numbers out of bios; they belong with the proof.
const founders = [
  {
    name: "Peter Zylka-Greger",
    image: PeterImage,
    alt: "Peter Zylka-Greger - Flow and Kanban Expert",
    paragraphs: [
      "Years with teams worldwide taught me that people want to contribute and be part of something successful. We just need to let them work.",
    ],
    track: {
      text: "Co-founder. Works with teams and leaders on making delivery predictable, and writes about what he learns.",
      href: "https://blog.letpeople.work/p/how-lighthouse-changed-the-way-i",
      label: "How Lighthouse changed the way I work",
    },
  },
  {
    name: "Benjamin Huser-Berta",
    image: BenjiImage,
    alt: "Benjamin Huser-Berta - Software Engineer and Scrum Master",
    paragraphs: [
      "Software engineer and Scrum Master. Work can be creative and fun when we reduce waste and focus on delivering value.",
    ],
    track: {
      text: "Co-founder. Designs and builds Lighthouse, and writes the step-by-step guides to Monte Carlo forecasting.",
      href: "https://blog.letpeople.work/p/an-introduction-and-step-by-step-guide-to-monte-carlo-simulations",
      label: "His Monte Carlo guide",
    },
  },
];

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
                <p className="text-sm text-foreground">
                  {founder.track.text}{" "}
                  <a
                    href={founder.track.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {founder.track.label}
                  </a>
                </p>
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
