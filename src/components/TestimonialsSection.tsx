import LighthouseTestimonials from "@/components/LighthouseTestimonials";

// Social proof as its own beat, right after the product: it used to sit at
// the bottom of the Lighthouse section where nobody reached it.
const TestimonialsSection = () => (
  <section id="testimonials" className="pt-4 pb-16 md:pb-24 bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LighthouseTestimonials />
    </div>
  </section>
);

export default TestimonialsSection;
