import { MessageSquare, Linkedin, Mail, Youtube, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const StayConnected = () => {
  const connections = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Slack Community",
      description: "Join the community for real discussions, quick answers, and direct access to us and other practitioners.",
      cta: "Join Slack",
      link: "https://join.slack.com/t/let-people-work/shared_invite/zt-38df4z4sy-iqJEo6S8kmIgIfsgsV0J1A"
    },
    {
      icon: <Linkedin className="h-8 w-8" />,
      title: "LinkedIn",
      description: "Follow us for industry insights, case studies, and updates on Flow and Obeya methodologies.",
      cta: "Follow on LinkedIn",
      link: "https://www.linkedin.com/company/let-people-work/"
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Newsletter",
      description: "Get our essays and experiments straight to your inbox. Free, on Substack, unsubscribe anytime.",
      cta: "Subscribe on Substack",
      link: "https://blog.letpeople.work/subscribe"
    },
    {
      icon: <Youtube className="h-8 w-8" />,
      title: "YouTube",
      description: "Watch Lighthouse Live and practical sessions on flow metrics, forecasting, and delivery.",
      cta: "Watch on YouTube",
      link: "https://www.youtube.com/@LetPeopleWork/videos"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Meetup",
      description: "Join our free community sessions and Lighthouse Live, online and open to everyone.",
      cta: "Join on Meetup",
      link: "https://www.meetup.com/lighthouselive/"
    }
  ];

  return (
    <section id="stay-connected" className="py-24 md:py-32 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Keep getting better at this
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The methods, metrics, and mindsets that make flow stick, from the community that's building faster delivery, not just measuring it.
          </p>
        </div>

        {/* Connection Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {connections.map((connection, index) => (
            <Card key={index} className="group hover:shadow-medium transition-all duration-300 border-0 bg-background/80 backdrop-blur-sm flex flex-col h-full">
              <CardHeader className="text-center pb-4 flex-shrink-0">
                <div className="mx-auto w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200 mb-4">
                  {connection.icon}
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {connection.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {connection.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow flex flex-col justify-end">
                <Button variant="outline" className="w-full group" asChild>
                  <a href={connection.link} target="_blank" rel="noopener noreferrer">
                    {connection.cta}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StayConnected;