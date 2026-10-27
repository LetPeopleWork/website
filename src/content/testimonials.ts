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
