import { ExternalLink, Quote } from "lucide-react";

export interface Testimonial {
    /** A phrase from the quote, word for word, marked where it stands in the quote. */
    highlight: string;
    quote: string;
    author: string;
    role: string;
    company?: string;
    authorUrl?: string;
    companyUrl?: string;
}

// In a fixed order, not shuffled: the ones that name an outcome and a
// company come first, because a buyer looks for "did it work, and for whom".
// `highlight` is a phrase taken word for word from the quote (the test checks
// that); the quotes themselves are the customers' words and stay as given.
// Hendra Gunawan (VP Engineering) is not listed until his quote arrives.
export const testimonials: Testimonial[] = [
    {
        highlight: "from guesstimations and overcommitment to data-driven PI Planning",
        quote: "Lighthouse transformed how our Agile Release Train operates: moving us from guesstimations and overcommitment to data-driven PI Planning. It streamlined progress tracking across teams, making delivery more transparent and predictable. With continuous forecasting, we're now better equipped to anticipate risks, align expectations, and deliver value with confidence.",
        author: "Agnieszka Reginek",
        role: "Professional Kanban Trainer | Scrum Master",
        authorUrl: "https://www.linkedin.com/in/agnieszka-reginek/",
    },
    {
        highlight: "a lean, cost‑effective way to surface risk and enable better decisions",
        quote: "Lighthouse has transformed how we approach delivery. By prompting the right questions earlier and using the default feature size function to quickly forecast “how much?”, it provides a lean, cost‑effective way to surface risk and enable better decisions.",
        author: "Chris Graves",
        role: "Agile Coach",
        company: "Focusrite",
        authorUrl: "https://www.linkedin.com/in/chris-graves-23455ab8/",
        companyUrl: "https://focusrite.com/",
    },
    {
        highlight: "We’re now more predictable, efficient, and responsive",
        quote: "Lighthouse helped us be more on to it. We’re now more predictable, efficient, and responsive when it comes to delivering value and serving our customers. It’s made planning sessions run smoother and helped set clearer expectations with our stakeholders. The insights we get from the data really sharpen our conversations and keep us focused on what matters.",
        author: "Gonzalo Mendez",
        role: "Scrum Master",
        company: "Mitre 10 (New Zealand) Ltd.",
        authorUrl: "https://www.linkedin.com/in/gonzalo-mendez-nz/",
        companyUrl: "https://www.mitre10.co.nz/",
    },
    {
        highlight: "answer critical questions in a matter of minutes",
        quote: "Whenever I am asked to assess the delivery health of a team, Lighthouse is my go-to tool as a consultant. Its quick, no-faff setup enables me to answer critical questions in a matter of minutes — shifting the conversation from gut-feel to data, and from wishful thinking to delivery risks and probabilities. For any coach trying to make risk visible and discussable, this is the tool that earns its place",
        author: "Gábor Bittera",
        role: "Scrum Master",
        authorUrl: "https://www.linkedin.com/in/gaborbittera/",
    },
    {
        highlight: "your mission control for all things delivery related",
        quote: "Very few tools out there are able to distill what is going on in your system to act effectively as your mission control for all things delivery related. If John Anderton designed a system for flow, this would be it.",
        author: "Nicolas Brown",
        role: "Author of ‘Real World Agility’ | Consultant | Speaker",
        company: "Thrivve",
        authorUrl: "https://www.linkedin.com/in/nicolasjmbrown/",
        companyUrl: "https://thrivve.partners/",
    },
    {
        highlight: "a continuous activity which enlightens both your project planning and tracking",
        quote: "The ability of Lighthouse to continuous forecast is a game changer. It transforms something complex and time consuming in a continuous activity which enlightens both your project planning and tracking.",
        author: "Lorenzo Santoro",
        role: "Project Manager",
        authorUrl: "https://www.linkedin.com/in/lorenzo-santoro-57172626/",
    }
];

const LinkedInIcon = () => (
    <svg 
        className="h-4 w-4" 
        viewBox="0 0 24 24" 
        fill="currentColor"
    >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

// The quote in full, with its strongest phrase marked where it stands, so
// nothing is said twice. The phrase is always part of the quote (tested).
const QuoteWithHighlight = ({ quote, highlight }: { quote: string; highlight: string }) => {
    const at = quote.indexOf(highlight);
    if (at < 0) return <>{quote}</>;
    return (
        <>
            {quote.slice(0, at)}
            <mark className="rounded-sm bg-accent px-0.5 font-semibold text-foreground [box-decoration-break:clone]">
                {highlight}
            </mark>
            {quote.slice(at + highlight.length)}
        </>
    );
};

const initials = (name: string) =>
    name
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("");

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
    <figure className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-soft transition-shadow duration-300 hover:shadow-medium">
        <Quote className="mb-4 h-7 w-7 text-primary/25" aria-hidden="true" />
        <blockquote className="flex-1 text-[15px] leading-relaxed text-foreground/80">
            <QuoteWithHighlight quote={testimonial.quote} highlight={testimonial.highlight} />
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
            <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary"
                aria-hidden="true"
            >
                {initials(testimonial.author)}
            </span>
            <span className="min-w-0 text-sm">
                <span className="block font-semibold text-foreground">
                    {testimonial.authorUrl ? (
                        <a
                            href={testimonial.authorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                            {testimonial.author}
                            <LinkedInIcon />
                        </a>
                    ) : (
                        testimonial.author
                    )}
                </span>
                <span className="block text-muted-foreground">
                    {testimonial.role}
                    {testimonial.company && (
                        <>
                            {" · "}
                            {testimonial.companyUrl ? (
                                <a
                                    href={testimonial.companyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-medium text-foreground/80 hover:text-primary transition-colors"
                                >
                                    {testimonial.company}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            ) : (
                                testimonial.company
                            )}
                        </>
                    )}
                </span>
            </span>
        </figcaption>
    </figure>
);

interface LighthouseTestimonialsProps {
    /** Show only the first few, for example three on the homepage. */
    limit?: number;
    /** A link under the cards, for example to the rest on the Lighthouse page. */
    more?: { href: string; label: string };
}

// All quotes visible at once, in a grid: one card at a time in a carousel
// hid five of the six, and a visitor rarely clicks through a carousel.
const LighthouseTestimonials = ({ limit, more }: LighthouseTestimonialsProps) => {
    const shown = limit ? testimonials.slice(0, limit) : testimonials;
    return (
        <div>
            <h2 className="text-center text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-10">
                What teams say about Lighthouse
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="testimonial-grid">
                {shown.map((t) => (
                    <TestimonialCard key={t.author} testimonial={t} />
                ))}
            </div>
            {more && (
                <p className="mt-8 text-center">
                    <a href={more.href} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                        {more.label}
                    </a>
                </p>
            )}
        </div>
    );
};

export default LighthouseTestimonials;
