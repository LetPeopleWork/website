import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TestimonialsSection from "./TestimonialsSection";
import LighthouseTestimonials from "./LighthouseTestimonials";
import { testimonials } from "@/content/testimonials";

// The quotes are the customers' words. The bold line on each card is a
// phrase lifted from the quote, never a summary we wrote for them.
describe("testimonials", () => {
  it("takes every headline word for word from its quote", () => {
    for (const t of testimonials) {
      expect(t.quote).toContain(t.highlight);
    }
  });

  it("leads with the quotes that name an outcome and a company", () => {
    expect(testimonials.slice(0, 3).map((t) => t.author)).toEqual([
      "Agnieszka Reginek",
      "Chris Graves",
      "Gonzalo Mendez",
    ]);
    expect(testimonials.every((t) => t.quote.trim().length > 0)).toBe(true);
  });

  it("shows all of them at once on the Lighthouse page, no carousel", () => {
    render(<LighthouseTestimonials />);
    const grid = screen.getByTestId("testimonial-grid");
    expect(within(grid).getAllByRole("figure")).toHaveLength(testimonials.length);
  });

  it("marks the strongest phrase inside the quote instead of repeating it", () => {
    const { container } = render(<LighthouseTestimonials limit={1} />);
    const marks = container.querySelectorAll("mark");
    expect(marks).toHaveLength(1);
    expect(marks[0].textContent).toBe(testimonials[0].highlight);
    expect(container.querySelector("blockquote")!.textContent).toBe(testimonials[0].quote);
  });

  it("shows three on the homepage and links to the rest", () => {
    render(<TestimonialsSection />);
    expect(within(screen.getByTestId("testimonial-grid")).getAllByRole("figure")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "More from teams using Lighthouse" })).toHaveAttribute(
      "href",
      "/lighthouse#lighthouse-testimonials",
    );
  });
});
