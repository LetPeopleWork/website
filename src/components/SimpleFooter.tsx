import { useState } from "react";
import { Mail, MessageSquare, Users } from "lucide-react";
import { Github, Linkedin, Youtube } from "@/components/icons/BrandIcons";
import LegalInfoDialog from "./LegalInfoDialog";
import logo from "@/assets/LPW_Banner_White.png";

const SimpleFooter = () => {
  const currentYear = new Date().getFullYear();
  // A link like letpeople.work/?legal=privacy opens the dialog on that tab.
  // The old /privacy-policy URL redirects there (public/privacy-policy/).
  const legalFromUrl = (() => {
    const value = new URLSearchParams(window.location.search).get("legal");
    return value === "impressum" || value === "privacy" || value === "terms" ? value : undefined;
  })();
  const [dialogOpen, setDialogOpen] = useState(legalFromUrl !== undefined);
  const [activeTab, setActiveTab] = useState<"impressum" | "privacy" | "terms">(legalFromUrl ?? "impressum");

  const openDialog = (tab: "impressum" | "privacy" | "terms") => {
    setActiveTab(tab);
    setDialogOpen(true);
  };
  
  // Three short groups instead of one long row of thirteen links. The guide
  // pages stay linked here on purpose: Google finds new pages mostly through
  // internal links. The guides are static pages outside the app, so these are
  // plain links, not router links.
  const groups: { title: string; links: { name: string; href: string; external?: boolean }[] }[] = [
    {
      title: "Product",
      links: [
        { name: "Lighthouse", href: "/lighthouse" },
        { name: "Sizing Poker", href: "/sizing-poker" },
        { name: "Compare", href: "/compare/" },
      ],
    },
    {
      title: "Guides",
      links: [
        { name: "Jira without story points", href: "/jira-forecasting-without-story-points/" },
        { name: "Azure DevOps forecasting", href: "/azure-devops-forecasting/" },
        { name: "Flow assessment", href: "/assessment" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "AI and obAIa", href: "/ai" },
        { name: "Blog", href: "https://blog.letpeople.work", external: true },
        { name: "Contact", href: "mailto:contact@letpeople.work" },
      ],
    },
  ];

  // Where to follow us, on every page. These used to be a homepage section of
  // their own ("Where to find us"), which repeated half of this footer.
  const social = [
    { name: "Slack community", href: "https://join.slack.com/t/let-people-work/shared_invite/zt-38df4z4sy-iqJEo6S8kmIgIfsgsV0J1A", Icon: MessageSquare },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/let-people-work/", Icon: Linkedin },
    { name: "Newsletter on Substack", href: "https://blog.letpeople.work/subscribe", Icon: Mail },
    { name: "YouTube", href: "https://www.youtube.com/@LetPeopleWork/videos", Icon: Youtube },
    { name: "Meetup", href: "https://www.meetup.com/lighthouselive/", Icon: Users },
    { name: "GitHub", href: "https://github.com/LetPeopleWork", Icon: Github },
  ];

  const legal: { name: string; tab: "impressum" | "privacy" | "terms" }[] = [
    { name: "Impressum", tab: "impressum" },
    { name: "Privacy Policy", tab: "privacy" },
    { name: "Terms and Conditions", tab: "terms" },
  ];

  return (
    <>
      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <img src={logo} alt="LetPeopleWork" className="h-8 w-auto" width="172" height="32" loading="lazy" />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Flow metrics and delivery forecasts, built by two practitioners in Zürich.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Follow LetPeopleWork">
                {social.map(({ name, href, Icon }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      title={name}
                      className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">{group.title}</p>
                  <ul className="space-y-2">
                    {group.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                          className="text-sm text-muted-foreground no-underline transition-colors duration-200 hover:text-primary"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>© {currentYear} LetPeopleWork GmbH, Zürich</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {legal.map((item) => (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => openDialog(item.tab)}
                  className="cursor-pointer transition-colors duration-200 hover:text-primary"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <LegalInfoDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        defaultTab={activeTab}
      />
    </>
  );
};

export default SimpleFooter;