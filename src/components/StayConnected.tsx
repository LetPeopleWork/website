import { MessageSquare, Linkedin, Mail, Youtube, Users } from "lucide-react";

const StayConnected = () => {
  const connections = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Slack Community",
      description: "Ask us and other practitioners directly.",
      cta: "Join Slack",
      link: "https://join.slack.com/t/let-people-work/shared_invite/zt-38df4z4sy-iqJEo6S8kmIgIfsgsV0J1A"
    },
    {
      icon: <Linkedin className="h-8 w-8" />,
      title: "LinkedIn",
      description: "What we work on, and what we learn with teams.",
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
      description: "Recorded Lighthouse Live sessions on real delivery data.",
      cta: "Watch on YouTube",
      link: "https://www.youtube.com/@LetPeopleWork/videos"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Meetup",
      description: "Free online sessions, open to everyone.",
      cta: "Join on Meetup",
      link: "https://www.meetup.com/lighthouselive/"
    }
  ];

  // One row of links under the blog, not five equal cards: the page's last
  // call to action is the closing offer above, and this is where to follow us.
  return (
    <section id="stay-connected" className="pt-2 pb-24 md:pb-28 bg-background scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-base font-semibold text-foreground mb-4">Where to find us</h3>
        <ul className="flex flex-wrap gap-3">
          {connections.map((connection) => (
            <li key={connection.title}>
              <a
                href={connection.link}
                target="_blank"
                rel="noopener noreferrer"
                title={connection.description}
                className="inline-flex items-center gap-2.5 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground no-underline transition-colors hover:border-primary/40 hover:text-primary [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-primary"
              >
                {connection.icon}
                {connection.cta}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default StayConnected;