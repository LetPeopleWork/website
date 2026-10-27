import { useScrollReveal } from "@/hooks/useScrollReveal";
import { friends } from "@/content/friends";

// Partners we know, like and recommend. Not a sales channel and not paid
// placement: a friend is someone we have worked with and would send a
// client to. Add one in src/content/friends.json (+ its logo in
// src/content/friends.ts). Logos sit on a white tile so logos with their own
// background colours still look tidy side by side.

const FriendsSection = () => {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return (
    <section id="friends" className="bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div
          ref={ref}
          className={`text-center rounded-2xl p-8 md:p-12 border border-border transition-all duration-700 ease-out ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
            Friends of LetPeopleWork
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            People we like to work with
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Our friends are partners we know, trust and enjoy working with. We have shared workshops, classes and
            ideas with them, and we recommend them without hesitation. If one of them fits what you need, reach out and
            say hi from us.
          </p>

          <div className="grid md:grid-cols-2 gap-10 max-w-3xl mx-auto" data-testid="friends-grid">
            {friends.map((friend) => (
              <article key={friend.name} className="space-y-4">
                <a
                  href={friend.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-28 rounded-xl bg-white border border-border p-4 transition-shadow hover:shadow-md"
                >
                  <img src={friend.image} alt={friend.alt} className="max-h-20 max-w-[60%] object-contain" loading="lazy" />
                </a>
                <div>
                  <h3 className="text-xl font-semibold text-primary">{friend.name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {friend.location}
                  </p>
                </div>
                <p className="text-muted-foreground">{friend.description}</p>
                <a
                  href={friend.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {friend.link.label}
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FriendsSection;
