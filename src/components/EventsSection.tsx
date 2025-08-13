import { Calendar, Clock, MapPin, ExternalLink, GraduationCap, Wrench, Mic, Building, DollarSign, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Types: Training, Workshop, Talk, Conference

const EventsSection = () => {
  const allEvents = [
    {
      type: "Workshop",
      title: "Introduction to Probabilistic Forecasting",
      date: new Date("2025-08-22"),
      displayDate: "Aug 22, 2025",
      time: "14:00 - 16:00 CEST",
      location: "Online, Zoom",
      price: "100$",
      description: `What's MCS and how does it work? How is it different from "traditional estimation"? What are the prerequisites and how to get started?

Why this session?
When plans collide with reality, single-point ("most likely") estimates rarely hold up. Probabilistic forecasting gives you a fuller picture—showing the range of outcomes and their likelihood—so you can make calmer, evidence-based decisions about budgets, timelines, capacity and risk.

We will explain how MCS works, how you gather the data, how you apply it and what data you need to run a MCS in your context.`,
      ctaText: "Register Now",
      ctaLink: "https://www.tickettailor.com/events/letpeoplework/1724396"
    },
    {
      type: "Workshop",
      title: "The Flow Show",
      date: new Date("2025-08-26"),
      displayDate: "Aug 26, 2025",
      time: "16:00 – 20:00 CEST",
      location: "Munich, Germany",
      price: "Free for the first 5 registrations, then 100$",
      description: "This will be an interactive unconference—you bring the topics you care about, and we’ll explore them together. Whether you're into forecasting with your data, understanding what makes systems predictable, or just want to nerd out on metrics, this is your playground. We can talk about the theory, or dive in hands-on (yes - you can also bring your data if you want!).",
      ctaText: "Register",
      ctaLink: "https://forms.gle/6CEWzjvSkr4TWF5z8"
    },
    {
      type: ["Talk", "Workshop"],
      title: "AgileByExample 2025",
      date: new Date("2025-10-08"),
      displayDate: "Oct 6 - 8, 2025",
      location: "Warsaw, Poland",
      price: "See Conference Website",
      description: `Join us at AgileByExample 2025, where we will be hosting our signature workshop "Flowbeya - How visualizing Flow Metrics on an Obeya can guide your Team" as well as presenting a brand new talk "How it's all connected: From Flow Metrics to Product KPIs".
      
      We're looking forward to sharing insights, but also to connecting with you in person!`,
      ctaText: "Get Tickets",
      ctaLink: "https://agilebyexample.com/"
    }
  ];

  // Filter out past events
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
  
  const upcomingEvents = allEvents.filter(event => event.date >= today);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Training":
        return <GraduationCap className="h-4 w-4" />;
      case "Workshop":
        return <Wrench className="h-4 w-4" />;
      case "Talk":
        return <Mic className="h-4 w-4" />;
      case "Conference":
        return <Building className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <section id="events" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            See us{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Live!
            </span>{" "}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our public workshops, trainings, or meet us at conferences.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {upcomingEvents.map((event) => (
            <Card key={event.title} className="group hover:shadow-medium transition-all duration-300 border-0 shadow-soft">
              <CardHeader className="pb-4">
                <div className="flex items-center mb-2 gap-2 flex-wrap">
                  {Array.isArray(event.type) ? (
                    event.type.map((type) => (
                      <Badge key={type} variant="outline" className="text-primary border-primary flex items-center gap-1">
                        {getTypeIcon(type)}
                        {type}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-primary border-primary flex items-center gap-1">
                      {getTypeIcon(event.type)}
                      {event.type}
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {event.title}
                </CardTitle>

                <CardDescription className="text-muted-foreground">
                  {event.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-3 text-primary" />
                    {event.displayDate}
                  </div>

                  {event.time && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-3 text-primary" />
                      {event.time}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-3 text-primary" />
                    {event.location}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-3 text-primary" />
                    {event.price}
                  </div>
                </div>

                <Button
                  variant="default"
                  className="w-full group"
                  asChild
                >
                  <a href={event.ctaLink} target="_blank" rel="noopener noreferrer">
                    {event.ctaText}
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div id="custom-events" className="text-center bg-gradient-subtle rounded-2xl p-12 border border-border">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 rounded-full p-4">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h3 className="text-3xl font-bold text-foreground mb-6">
            Need Something Tailored to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Your Needs?
            </span>
          </h3>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            We believe in the power of collaboration. This is why all our trainings, workshops, and consulting services are designed together with you to match your needs.
            Furthermore, we always deliver them in pairs, so you get the best insights and diverse perspectives.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
            <div className="bg-background/50 rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary mr-2" />
                <h4 className="text-lg font-semibold text-foreground">Custom Training & Private Workshops</h4>
              </div>
              <p className="text-muted-foreground text-sm">
                Didn't find exactly what you're looking for? We create bespoke training programs and private workshops tailored to your team's specific needs and challenges. Get exclusive attention for your team with our expert pairs delivering maximum impact.
              </p>
            </div>
            
            <div className="bg-background/50 rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary mr-2" />
                <h4 className="text-lg font-semibold text-foreground">Pricing</h4>
              </div>
              <p className="text-muted-foreground text-sm">
                Private events start at $1,000 per event (not per attendee). Perfect for teams of up to 30 people looking for focused, collaborative learning experiences.
              </p>
            </div>
          </div>

          <Button variant="hero" size="lg" asChild>
            <a href="mailto:contact@letpeople.work">
              <MessageCircle className="mr-2 h-5 w-5" />
              Reach Out To Talk About How We Can Support
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;