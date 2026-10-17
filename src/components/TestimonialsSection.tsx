import LighthouseTestimonials from "@/components/LighthouseTestimonials";

// Social proof as its own beat, right after the product: it used to sit at
// the bottom of the Lighthouse section where nobody reached it.
const TestimonialsSection = () => (
  <section id="testimonials" className="pt-4 pb-12 md:pb-16 bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* The three that name an outcome; the rest are on the Lighthouse page. */}
      <LighthouseTestimonials
        limit={3}
        more={{ href: "/lighthouse#lighthouse-testimonials", label: "More from teams using Lighthouse" }}
      />
    </div>
  </section>
);

export default TestimonialsSection;
