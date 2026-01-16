import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { workshops } from "@/lib/workshops";
import { CheckCircle2 } from "lucide-react";

const WorkshopsSection = () => {
  return (
    <section id="workshops" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              Enterprise Offerings
            </Badge>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Hand-Crafted{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Workshops
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Private, customized engagements delivered directly to your organization. No generic
            training decks, no theoretical frameworks divorced from reality. Each workshop
            is focused on your data, your systems, and led by senior practitioners who understand the
            difference between talking about agile and actually making delivery systems work.
          </p>
        </div>

        {/* Workshops Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {workshops.map((workshop) => (
            <Card
              key={workshop.id}
              className="group hover:shadow-lg transition-all duration-300 border-0 shadow-soft flex flex-col"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{workshop.title}</CardTitle>
                    <CardDescription className="text-lg font-medium text-foreground/80">
                      {workshop.subtitle}
                    </CardDescription>
                  </div>
                </div>

                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {workshop.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6 flex-1 flex flex-col">
                {/* Scope - Always Present */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                    Scope
                  </h4>
                  <ul className="space-y-1">
                    {workshop.scope?.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deliverables - Always Visible */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                    What You Receive
                  </h4>
                  <ul className="space-y-3">
                    {workshop.deliverables.map((deliverable) => (
                      <li key={deliverable.title} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                        <div>
                          <div className="font-medium text-foreground">
                            {deliverable.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {deliverable.description}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing - Prominent Display */}
                <div className="mt-auto pt-6 border-t space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Investment
                    </h4>
                    {workshop.pricing.fixedPrice ? (
                      <div className="text-3xl font-bold text-foreground">
                        {workshop.pricing.fixedPrice}
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-baseline gap-4">
                        {workshop.pricing.onSite && (
                          <div>
                            <span className="text-3xl font-bold text-foreground">
                              {workshop.pricing.onSite}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              On-Site
                            </span>
                          </div>
                        )}
                        {workshop.pricing.remote && (
                          <div>
                            <span className="text-3xl font-bold text-foreground">
                              {workshop.pricing.remote}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              Remote
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {workshop.pricing.includes && (
                      <p className="text-sm text-muted-foreground">
                        Includes {workshop.pricing.includes}
                      </p>
                    )}
                  </div>

                  <Button className="w-full" size="lg" variant="default" asChild>
                    <a href={`mailto:contact@letpeople.work?subject=Request for ${encodeURIComponent(workshop.title)}`}>
                      Schedule Workshop
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkshopsSection;
