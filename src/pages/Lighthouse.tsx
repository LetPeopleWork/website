import {
	ArrowRight,
	Download,
	Monitor,
	Smartphone,
	Container,
	Copy,
	Check,
	Shield,
	ChevronDown,
	ChevronUp,
	User,
	Mail,
	Building,
	CheckCircle,
	XCircle,
	Info,
	Calendar as CalendarIcon,
	Command,
	Terminal,
	Laptop,
	Server as ServerIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Navigation from "@/components/Navigation";
import SimpleFooter from "@/components/SimpleFooter";
import LegalInfoDialog from "@/components/LegalInfoDialog";
import SEO from "@/components/SEO";
import lighthouseLogo from "@/assets/LighthouseLogo.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import LighthouseTestimonials from "@/components/LighthouseTestimonials";
import FAQSection from "@/components/FAQSection";
import LighthouseLearnMore from "@/components/LighthouseLearnMore";
import LighthouseWhatsNew from "@/components/LighthouseWhatsNew";
import TrialRequestDialog from "@/features/trial/components/TrialRequestDialog";
import { format } from "date-fns";
import { lighthouseAsset } from "@/lib/lighthouseAsset";
import {
	findAssetByPattern,
	LIGHTHOUSE_DOCKER_COMMAND,
	LIGHTHOUSE_GITHUB_RELEASES_URL,
	type ReleaseAsset,
} from "@/lib/lighthouseDownloads";
import QuickDownloadBar from "@/components/QuickDownloadBar";
import FilmLightbox from "@/features/film/components/FilmLightbox";
import { trackVideoPlay, VIDEOS } from "@/features/film/videos";
import ForecastShot from "@/features/lighthouse-page/ForecastShot";
import { CALL_LABEL, CALL_URL } from "@/lib/contact";
import PathChips from "@/features/paths/PathChips";
import {
	findPath,
	pathFromSearch,
	questionFromSearch,
	writePathToUrl,
	type PathKey,
	type QuestionTab,
} from "@/features/paths/paths";
import LighthouseQuestions from "@/features/lighthouse-page/LighthouseQuestions";
import RealityCheckSection from "@/features/lighthouse-page/RealityCheckSection";
import WhereItRuns from "@/features/lighthouse-page/WhereItRuns";
import { LIGHTHOUSE_FILM, isFilmAvailable } from "@/features/film/lighthouseFilm";
import { trackDownload, trackEvent } from "@/lib/plausible";
import { prices } from "@/lib/pricing";

const WindowsIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		className={className}
		fill="currentColor"
		aria-hidden="true"
	>
		<path d="M0 0h11.4v11.4H0ZM12.6 0H24v11.4H12.6ZM0 12.6h11.4V24H0ZM12.6 12.6H24V24H12.6Z" />
	</svg>
);

const OsIcon = ({ os, className }: { os: string; className?: string }) => {
	switch (os) {
		case "windows":
			return <WindowsIcon className={className} />;
		case "macos":
			return <Command className={className} />;
		case "linux":
			return <Terminal className={className} />;
		case "docker":
			return <Container className={className} />;
		default:
			return <Monitor className={className} />;
	}
};

type DownloadEntry = {
	os: "windows" | "macos" | "linux" | "docker";
	label: string;
	tooltip: string;
	assetPattern?: string;
	format?: string;
};

const standaloneDownloads: DownloadEntry[] = [
	{
		os: "windows",
		label: "Windows Installer (.exe)",
		tooltip: "Recommended NSIS installer for Windows. Code signed.",
		assetPattern: "installer.exe",
		format: "exe",
	},
	{
		os: "windows",
		label: "Windows Installer (.msi)",
		tooltip:
			"MSI installer for Windows, useful for enterprise deployment. Code signed.",
		assetPattern: "installer.msi",
		format: "msi",
	},
	{
		os: "macos",
		label: "macOS Disk Image (.dmg)",
		tooltip: "Standard macOS disk image. Signed and notarized by Apple.",
		assetPattern: "osx.dmg",
		format: "dmg",
	},
	{
		os: "macos",
		label: "macOS App Bundle (.zip)",
		tooltip:
			"The macOS app bundle as a zip archive. Signed and notarized by Apple.",
		assetPattern: "osx.app.zip",
		format: "app.zip",
	},
	{
		os: "linux",
		label: "Linux App (.AppImage)",
		tooltip:
			"Portable AppImage that runs on most Linux distributions without installation.",
		assetPattern: ".appimage",
		format: "appimage",
	},
];

const serverDownloads: DownloadEntry[] = [
	{
		os: "windows",
		label: "Windows Binaries (.zip)",
		tooltip:
			"Server binaries for Windows (x64). Extract and run as a background service.",
		assetPattern: "server-win",
		format: "server-zip",
	},
	{
		os: "linux",
		label: "Linux Binaries (.zip)",
		tooltip:
			"Server binaries for Linux (x64). Extract and run as a background service.",
		assetPattern: "server-linux",
		format: "server-zip",
	},
	{
		os: "docker",
		label: "Docker Container",
		tooltip:
			"Copies the docker run command to your clipboard. Runs the server edition as a container.",
	},
];

// The skills ship as assets of the clients release. Set released once a
// release carries the zip, or the download link would 404.
const agentSkills = [
	{
		name: "Lighthouse",
		description: "When and how to use the Lighthouse tools, with fallbacks, authentication, and how to read flow metrics and forecasts.",
		zip: "lighthouse-skill.zip",
		edition: "ai-skill",
		released: true,
	},
	{
		name: "Refinement",
		description: "Get a Team ready for its next Refinement: whether to refine more or stop, which Work Items are worth the time, and the votes still missing.",
		zip: "lighthouse-refinement-skill.zip",
		edition: "ai-skill-refinement",
		released: true,
	},
	{
		name: "Daily Flow Review",
		description: "Open the daily with what the Team should decide and discuss today: blocked work, SLE risk, WIP over its limit.",
		zip: "lighthouse-daily-flow-review-skill.zip",
		edition: "ai-skill-daily-flow-review",
		released: true,
	},
];

const Lighthouse = () => {
	const [latestVersion, setLatestVersion] = useState<string>("");
	const [releaseAssets, setReleaseAssets] = useState<ReleaseAsset[]>([]);
	const [copiedCommand, setCopiedCommand] = useState(false);
	const [showLicenseDetails, setShowLicenseDetails] = useState(false);
	const [purchaseForm, setPurchaseForm] = useState({
		name: "",
		email: "",
		organization: "",
		validFrom: new Date(), // Default to today
	});
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);
	const [paymentResult, setPaymentResult] = useState<{
		show: boolean;
		type: "success" | "canceled";
		title: string;
		description: string;
	}>({
		show: false,
		type: "success",
		title: "",
		description: "",
	});
	const [showLegalDialog, setShowLegalDialog] = useState(false);
	const [filmOpen, setFilmOpen] = useState(false);
	const openFilm = () => {
		trackVideoPlay(VIDEOS.film, "lighthouse-hero");
		setFilmOpen(true);
	};
	const [legalTab, setLegalTab] = useState<"terms" | "privacy">("terms");
	// Situation chips (?for=): which one is chosen, and which question tab
	// it opens. A link from the homepage arrives with both set.
	const [pathKey, setPathKey] = useState<PathKey | undefined>(
		() => pathFromSearch(window.location.search)?.key,
	);
	// ?question= (from Sizing Poker, for example) names the tab directly.
	const [questionTab, setQuestionTab] = useState<QuestionTab>(
		() =>
			questionFromSearch(window.location.search) ??
			pathFromSearch(window.location.search)?.tab ??
			"when",
	);
	const chooseJump = (key: PathKey | undefined) => {
		setPathKey(key);
		writePathToUrl(key);
		const path = findPath(key);
		if (!path) return;
		trackEvent("Path chosen", { path: path.key, source: "lighthouse-jump" });
		setQuestionTab(path.tab);
		document.getElementById(path.anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
	};
	// Which trial CTA opened the dialog; null = closed. Analytics only.
	const [trialSource, setTrialSource] = useState<string | null>(null);
	const { toast } = useToast();

	// Pre-fill form from URL parameters on mount
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const name = urlParams.get("name");
		const email = urlParams.get("email");
		const organization = urlParams.get("organization");
		const validFrom = urlParams.get("validFrom");

		if (name || email || organization || validFrom) {
			setPurchaseForm((prev) => ({
				name: name || prev.name,
				email: email || prev.email,
				organization: organization || prev.organization,
				validFrom: validFrom ? new Date(validFrom) : prev.validFrom,
			}));
		}
	}, []);

	// Fetch latest version from GitHub releases
	useEffect(() => {
		const fetchLatestVersion = async () => {
			try {
				const response = await fetch(
					"https://api.github.com/repos/LetPeopleWork/Lighthouse/releases/latest",
				);
				const data = await response.json();
				setLatestVersion(data.tag_name);
				setReleaseAssets(data.assets ?? []);
			} catch (error) {
				console.error("Failed to fetch latest version:", error);
				setLatestVersion("v25.7.27.1729");
			}
		};

		fetchLatestVersion();
	}, []);

	// Check for Stripe payment result and show appropriate dialog
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const paymentStatus = urlParams.get("payment");
		if (paymentStatus === "success") {
			trackEvent("License purchased", { source: "stripe-return" });
			// Show success dialog first
			setPaymentResult({
				show: true,
				type: "success",
				title: "Upgrade Complete! 🎉",
				description:
					"Your payment has been processed successfully. We're preparing your premium license and will send it to your email shortly from licensing@lighthouse.letpeople.work.\n\nExpected it within the next 4 hours. Please check your inbox and spam folder.\n\nHaven't received it? No worries – just drop us a line at licensing@letpeople.work and we'll sort it out.",
			});

			// Clear the URL parameters after showing the dialog
			setTimeout(() => {
				const newUrl = window.location.pathname;
				window.history.replaceState({}, document.title, newUrl);
			}, 1000); // Increased delay to ensure dialog shows
		} else if (paymentStatus === "canceled") {
			trackEvent("Checkout canceled", { source: "stripe-return" });
			// Show canceled dialog first
			setPaymentResult({
				show: true,
				type: "canceled",
				title: "Payment Canceled",
				description: "Your payment was canceled. You can try again anytime.",
			});

			// Clear the URL parameters after showing the dialog
			setTimeout(() => {
				const newUrl = window.location.pathname;
				window.history.replaceState({}, document.title, newUrl);
			}, 1000); // Increased delay to ensure dialog shows
		}
	}, []);

	// Handle anchor navigation
	useEffect(() => {
		const hash = window.location.hash;
		if (hash) {
			// Small delay to ensure the page has rendered. An instant jump, not a
			// smooth scroll: someone arriving on a deep link (a guide's download
			// button, Sizing Poker's link to the Refinement tab) wants to be
			// there, and a smooth scroll never runs in a tab that isn't visible
			// yet, which left those visitors at the top of the page.
			setTimeout(() => {
				document.querySelector(hash)?.scrollIntoView();
			}, 100);
		}
	}, []);

	const copyToClipboard = async (text: string) => {
		try {
			// Check if clipboard API is available (requires HTTPS)
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(text);
				setCopiedCommand(true);
				setTimeout(() => setCopiedCommand(false), 2000);
			} else {
				// Fallback for HTTP sites
				const textArea = document.createElement("textarea");
				textArea.value = text;
				textArea.style.position = "fixed";
				textArea.style.left = "-999999px";
				textArea.style.top = "-999999px";
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();

				try {
					document.execCommand("copy");
					setCopiedCommand(true);
					setTimeout(() => setCopiedCommand(false), 2000);
				} catch (err) {
					console.error("Fallback copy failed:", err);
					toast({
						title: "Copy failed",
						description: "Please copy the command manually",
						variant: "destructive",
					});
				} finally {
					document.body.removeChild(textArea);
				}
			}
		} catch (error) {
			console.error("Failed to copy to clipboard:", error);
			toast({
				title: "Copy failed",
				description: "Please copy the command manually",
				variant: "destructive",
			});
		}
	};

	const handlePurchase = async () => {
		if (
			!purchaseForm.name ||
			!purchaseForm.email ||
			!purchaseForm.organization
		) {
			toast({
				title: "Missing Information",
				description:
					"Please fill in your name, email address, and organization.",
				variant: "destructive",
			});
			return;
		}

		setIsProcessingPayment(true);

		try {
			const { data, error } = await supabase.functions.invoke(
				"create-payment",
				{
					body: {
						name: purchaseForm.name,
						email: purchaseForm.email,
						organization: purchaseForm.organization,
						validFrom: format(purchaseForm.validFrom, "yyyy-MM-dd"), // Format as YYYY-MM-DD
					},
				},
			);

			if (error) throw error;

			// Non-personal: no name, email or organisation is ever sent to analytics.
			trackEvent("Checkout started", { source: "license-purchase" });
			trackEvent("Form: Submission", { source: "license-purchase" });

			// Redirect to Stripe checkout in the same tab
			window.location.href = data.url;
		} catch (error) {
			console.error("Payment error:", error);
			toast({
				title: "Payment Error",
				description: "Failed to create payment session. Please try again.",
				variant: "destructive",
			});
			setIsProcessingPayment(false);
		}
	};

	// Structured data for SEO
	return (
		<div className="min-h-screen bg-background">
			<SEO
				title="Lighthouse - Flow Metrics & Forecasting Tool for Agile Teams"
				description="Lighthouse is a source-available, self-hosted tool for visualizing flow metrics and forecasting delivery dates using Monte Carlo simulations. Connects to Jira, Azure DevOps, Linear, and ServiceNow. AI integration via MCP, so you can ask Claude or Copilot questions about your delivery data. Free community version available."
				keywords="lighthouse flow metrics, agile forecasting tool, Monte Carlo simulation, delivery forecasting, when will it be done, how much can we do, Jira flow metrics, Azure DevOps metrics, Linear integration, ServiceNow integration, ITSM flow metrics, AI integration, MCP, Model Context Protocol, agile AI assistant, throughput, cycle time, lead time, WIP, work in progress, team velocity, sprint forecasting, agile metrics dashboard, kanban metrics, scrum metrics, project forecasting, portfolio forecasting, source available, Jira Data Center, predictability, self-hosted forecasting, agile analytics"
				ogImage="https://letpeople.work/lighthouse-forecast.png"
				ogType="website"
				canonicalUrl="https://letpeople.work/lighthouse/"
			/>
			<Navigation />

			{/* Hero: what it is, where it runs, what it connects to, and what it
			    costs, before anything else. Visitors evaluating a tool look for the
			    price early, so it is one click away. One download button (the
			    desktop app for the visitor's system; the rest is in Downloads), the
			    trial, a call for those not ready to install, and the forecast
			    itself, readable, with the film a click away. */}
			<section id="film" className="pt-32 pb-14 bg-gradient-subtle scroll-mt-24">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="flex items-center justify-center gap-3 mb-6">
						<img
							src={lighthouseLogo}
							alt=""
							className="h-10 w-auto"
							width="40"
							height="40"
							loading="eager"
							fetchPriority="high"
						/>
						<span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
							Lighthouse
						</span>
					</div>
					<h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.08] mb-6">
						Know how likely your date is before you promise it
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
						Flow metrics and Monte Carlo forecasts for one team or a whole
						portfolio. Lighthouse runs on your laptop or inside your network and
						connects to Jira Cloud and Data Center, Azure DevOps, Linear and
						ServiceNow.
					</p>

					<div className="mb-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<QuickDownloadBar source="lighthouse-hero" compact />
						<Button
							variant="outline"
							size="lg"
							className="rounded-full px-7"
							onClick={() => { setTrialSource("lighthouse-hero"); trackEvent("Trial dialog opened", { source: "lighthouse-hero" }); }}
						>
							Try Premium free for 30 days
						</Button>
					</div>
					<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold mb-4">
						<a href="#lighthouse-premium" className="text-primary underline-offset-4 hover:underline">
							See pricing
						</a>
						<a href="#downloads" className="text-primary underline-offset-4 hover:underline">
							Server, Docker and all downloads
						</a>
						<a
							href={CALL_URL}
							onClick={() => trackEvent("Call link clicked", { source: "lighthouse-hero" })}
							className="text-primary underline-offset-4 hover:underline"
						>
							{CALL_LABEL}
						</a>
					</div>
					<p className="text-sm text-muted-foreground mb-12">
						Community is free for up to 3 teams and 1 portfolio. Self-Service is {prices.selfService} a year.
					</p>
					<ForecastShot
						onPlayFilm={isFilmAvailable() ? openFilm : undefined}
						filmSeconds={LIGHTHOUSE_FILM.durationSeconds}
					/>
				</div>
			</section>
			<FilmLightbox open={filmOpen} onOpenChange={setFilmOpen} />

			{/* Situation chips: jump to the part of the page that answers why you
			    came. Same choices as on the homepage, carried over in ?for=. */}
			<section aria-label="Jump to what you came for" className="py-8 bg-background border-b border-border">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<PathChips selected={pathKey} onSelect={chooseJump} />
				</div>
			</section>

			<LighthouseQuestions value={questionTab} onValueChange={setQuestionTab} />

			{/* Proof: live, unedited setup demo */}
			<section id="first-forecast" className="py-20 bg-gradient-subtle border-y border-border">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-8">
						<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary bg-accent px-4 py-1.5 rounded-full mb-5">
							Live demo, unedited
						</span>
						<h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
							From nothing to a forecast in under ten minutes
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							Gabor Bittera set out to bust the myth that probabilistic
							forecasting takes weeks to set up. He started a ten minute timer,
							downloaded Lighthouse, connected his Jira, and forecast his team's
							next ten items. Here are the final ninety seconds, with 1:25 still
							on the clock.
						</p>
					</div>

					<div className="rounded-2xl overflow-hidden border border-border shadow-medium bg-black">
						<video
							className="w-full block"
							controls
							preload="none"
							poster="/lighthouse-first-forecast-poster.jpg"
							aria-label="Live demo: setting up Lighthouse and running a first Monte Carlo forecast in under ten minutes"
							onPlay={() => trackEvent("Video play", { video: "first-forecast" })}
						>
							<source src="/lighthouse-first-forecast.mp4" type="video/mp4" />
							Your browser does not support the video tag.
						</video>
					</div>

					<p className="text-center text-sm text-muted-foreground mt-5">
						Clip from a Lighthouse Live session with Gabor Bittera, Scrum Master,
						May 2026. Shared with his permission.{" "}
						<a
							href="https://www.youtube.com/@LetPeopleWork/videos"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline"
						>
							Watch full sessions on YouTube
						</a>
					</p>
				</div>
			</section>

			<RealityCheckSection />

			<WhereItRuns onOpenPrivacy={() => { setLegalTab("privacy"); setShowLegalDialog(true); }} />

			{/* Testimonials Section */}
			<section id="lighthouse-testimonials" className="py-20 bg-background">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<LighthouseTestimonials />
				</div>
			</section>

			{/* Pricing Section — 3 tiers */}
			<section id="lighthouse-premium" className="py-24 md:py-32 bg-gradient-subtle">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16 md:mb-20">
						<span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
							Pricing
						</span>
						<h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.08] mb-6">
							Free for up to 3 teams
						</h2>
						<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							Every edition runs on your own systems. Self-Service lifts the Community limits and adds sign-in, rule-based deliveries and more. Enterprise adds priority support.
						</p>
					</div>

					{/* 3-tier card grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 md:mb-20 items-stretch">
						{/* Community */}
						<div className="flex flex-col rounded-3xl border border-border bg-background p-8 md:p-10">
							<div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">Community</div>
							<div className="flex items-baseline gap-2 mb-1">
								<div className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">Free</div>
							</div>
							<div className="text-sm text-muted-foreground mb-6">Free, with no time limit.</div>
							<p className="text-base text-foreground/80 leading-relaxed mb-6">
								Everything you need to forecast and see your flow, up to a few teams.
							</p>
							<ul className="space-y-2.5 mb-8 flex-1 text-sm text-foreground/80">
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>All core flow metrics &amp; Monte Carlo forecasts</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>Jira, Azure DevOps, Linear, ServiceNow, CSV</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>AI / MCP integration</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>Up to 3 teams · 1 portfolio · 1 delivery</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>Community Slack support</span></li>
							</ul>
							<a
								href="#downloads"
								className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors no-underline"
							>
								Download free
							</a>
						</div>

						{/* Self-Service — Recommended */}
						<div className="relative flex flex-col rounded-3xl border-2 border-primary/50 bg-background p-8 md:p-10 shadow-medium md:scale-[1.02] md:-translate-y-2">
							<span className="absolute -top-3 right-6 text-[11px] font-bold uppercase tracking-[0.15em] bg-primary text-primary-foreground px-3 py-1 rounded-full shadow-soft">
								Recommended
							</span>
							<div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">Self-Service</div>
							<div className="flex items-baseline gap-2 mb-1">
								<div className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">{prices.selfService}</div>
								<div className="text-sm text-muted-foreground">/ year</div>
							</div>
								<div className="text-sm text-muted-foreground mb-6">Annual license. Self-hosted.</div>
							<p className="text-base text-foreground/80 leading-relaxed mb-6">
								Everything Lighthouse can do, for as many teams as you have.
							</p>
							<ul className="space-y-2.5 mb-8 flex-1 text-sm text-foreground/80">
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span><span className="font-semibold">Everything in Community</span>, no caps</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>Unlimited teams, portfolios, deliveries</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>Auth &amp; RBAC, rule-based deliveries, data sync mappings</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>Community Slack, alongside our team</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>
									Feature requests via <a href="https://ideas.letpeople.work/" className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">ideas.letpeople.work</a>
								</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>Best-effort help from us when we have capacity</span></li>
							</ul>
							<a
								href="#lighthouse-license"
								className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft hover:shadow-medium transition-all hover:-translate-y-0.5 no-underline"
							>
								Get Self-Service <ArrowRight className="w-4 h-4" />
							</a>
							<button
								type="button"
								onClick={() => { setTrialSource("pricing-card"); trackEvent("Trial dialog opened", { source: "pricing-card" }); }}
								className="mt-3 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
							>
								or try it free for 30 days, without an account or a card
							</button>
						</div>

						{/* Enterprise */}
						<div className="flex flex-col rounded-3xl border border-border bg-background p-8 md:p-10">
							<div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">Enterprise</div>
							<div className="flex items-baseline gap-2 mb-1">
								<div className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">{prices.enterprise}</div>
								<div className="text-sm text-muted-foreground">/ year</div>
							</div>
								<div className="text-sm text-muted-foreground mb-6 mt-3">For teams that want priority.</div>
							<p className="text-base text-foreground/80 leading-relaxed mb-6">
								Everything in Self-Service, plus a faster line to us when you need help.
							</p>
							<ul className="space-y-2.5 mb-8 flex-1 text-sm text-foreground/80">
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span><span className="font-semibold">Everything in Self-Service</span></span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span><span className="font-semibold">Prioritised support.</span> Your questions and feature requests jump the queue</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>24h acknowledgement on async requests</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>2 × 60-min onboarding calls in your first 90 days</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>Named contacts for flow, coaching, and technical questions</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>Data Processing Agreement (minimal, since you self-host)</span></li>
							</ul>
														<a
								href="mailto:licensing@letpeople.work?subject=Lighthouse%20Enterprise%20enquiry"
								className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors no-underline"
							>
								Talk to us
							</a>
						</div>
					</div>

					{/* No lock-in reassurance */}
					<p className="text-center text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-16">
						In the app and the documentation, the paid features are called Premium. Self-Service and
						Enterprise both include all of them. If you stop paying, your data stays on your systems and
						Lighthouse goes back to the Community limits. We help you set it up for free, whatever edition you use.
					</p>

					{/* Full feature comparison: collapsed by default, because most
					    visitors decide on the three cards above. A native <details>
					    keeps the table in the page for search engines. */}
					<details id="feature-comparison" className="group bg-background rounded-2xl p-6 md:p-8 shadow-soft border border-border">
						<summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
							<span>
								<span className="block text-xl md:text-2xl font-bold text-foreground">Compare all features</span>
								<span className="block text-sm text-muted-foreground mt-1">
									The flow metrics and forecasts are in every edition. Paid editions add the features marked below.
								</span>
							</span>
							<ChevronDown className="h-6 w-6 shrink-0 text-primary transition-transform group-open:rotate-180" />
						</summary>
						<div className="mt-8">

						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-border">
										<th className="text-left py-4 px-4 font-semibold text-foreground">
											Feature
										</th>
										<th className="text-center py-4 px-4 font-semibold text-foreground">
											Community
										</th>
										<th className="text-center py-4 px-4 font-semibold text-primary">
											Self-Service
										</th>
										<th className="text-center py-4 px-4 font-semibold text-primary">
											Enterprise
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border">
									{(() => {
										type Cell = boolean | string | { label: string; tooltip: string };
										type Row = { feature: Cell; community: Cell; self: Cell; enterprise: Cell };
										type Group = { title: string; rows: Row[] };

										const renderFeature = (cell: Cell) => {
											if (typeof cell === "object" && cell !== null && "tooltip" in cell) {
												return (
													<div className="flex items-center space-x-2">
														<span>{cell.label}</span>
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger>
																	<Info className="h-4 w-4 text-blue-500" />
																</TooltipTrigger>
																<TooltipContent>
																	<p className="text-sm max-w-xs">{cell.tooltip}</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													</div>
												);
											}
											return cell as string;
										};

										const renderValue = (cell: Cell, accent = false) => {
											if (typeof cell === "boolean") {
												return cell
													? <Check className="h-5 w-5 text-green-600 mx-auto" />
													: <XCircle className="h-5 w-5 text-red-500 mx-auto" />;
											}
											return <span className={accent ? "text-primary font-semibold" : "text-muted-foreground"}>{cell as string}</span>;
										};

										const groups: Group[] = [
											{
												title: "Base Functionality",
												rows: [
													{ feature: "Flow Metrics for Teams", community: true, self: true, enterprise: true },
													{ feature: "Flow Metrics for Portfolios", community: true, self: true, enterprise: true },
													{
														feature: { label: "Team Forecasts: how many, when, and backtests", tooltip: "Ask when a number of Work Items will be done, or how many will be done by a date, and check how past forecasts would have held up against what your Team then delivered." },
														community: true, self: true, enterprise: true,
													},
													{
														feature: { label: "Continuous Forecasts for Portfolios", tooltip: "Every Feature is re-forecast on every refresh, so the dates move as soon as the work or the Throughput does." },
														community: true, self: true, enterprise: true,
													},
													{ feature: "Source available: read and audit the code", community: true, self: true, enterprise: true },
													{ feature: "Connection to Jira, Azure DevOps, Linear & ServiceNow", community: true, self: true, enterprise: true },
													{
														feature: { label: "Refinement: need & sizing votes", tooltip: "See how many Work Items your team should have ready before the next Refinement, and size each one by voting whether it fits your SLE: Yes, Yes if…, or No. No story points." },
														community: true, self: true, enterprise: true,
													},
													{
														feature: { label: "Reporting", tooltip: "A Reports tab on every Team and Portfolio. The first report type, Then & Now, sets Cycle Time, Throughput, WIP and Work Item Age from before a change beside the same metrics today, with a summary of what changed. More report types are coming." },
														community: true, self: true, enterprise: true,
													},
													{
														feature: { label: "Forecast Reality Check", tooltip: "Forecast weeks that already happened and compare with what your Team finished. You see whether your history window and percentiles hold up." },
														community: true, self: true, enterprise: true,
													},
													{
														feature: { label: "Forecasted Start Dates", tooltip: "See when work on each Feature is forecast to begin, next to when it finishes. Both come from the same simulation." },
														community: true, self: true, enterprise: true,
													},
													{
														feature: { label: "Multi-Team Forecasts", tooltip: "Forecast Features that several Teams work on together, with one likelihood that accounts for every Team involved." },
														community: true, self: true, enterprise: true,
													},
													{
														feature: { label: "Dependencies, read from your tracker", tooltip: "Blockers from Jira, Azure DevOps and Linear links show on every Feature, with warnings for cycles and waits that cannot be forecast. No setup." },
														community: true, self: true, enterprise: true,
													},
													{
														feature: { label: "SLE Risk", tooltip: "The chance each in-progress Work Item misses your SLE, worked out from your Team's own history, with a view of the ones already at risk." },
														community: true, self: true, enterprise: true,
													},
													{
														feature: { label: "AI & LLM Integration", tooltip: "Connect Lighthouse to Claude, ChatGPT, or any MCP-compatible AI assistant. Query metrics, run forecasts, and explore delivery data through natural language, no dashboard required." },
														community: true, self: true, enterprise: true,
													},
													{
														feature: { label: "CLI & Automation", tooltip: "Automate metrics collection and forecasting via the lh CLI or the MCP server. Integrate Lighthouse data into scripts, CI/CD pipelines, and custom tooling." },
														community: true, self: true, enterprise: true,
													},
												],
											},
											{
												title: "Usage Limits",
												rows: [
													{ feature: "Number of Teams", community: "Max 3", self: "Unlimited", enterprise: "Unlimited" },
													{ feature: "Number of Portfolios", community: "Max 1", self: "Unlimited", enterprise: "Unlimited" },
													{ feature: "CSV Support", community: "Max 1 Team", self: "Unlimited", enterprise: "Unlimited" },
													{ feature: "Demo Data", community: "Basic Scenarios", self: "Advanced Scenarios", enterprise: "Advanced Scenarios" },
													{ feature: "Deliveries", community: "1 per Portfolio", self: "Unlimited", enterprise: "Unlimited" },
													{ feature: "Reports", community: "1 per type per Team / Portfolio", self: "Unlimited", enterprise: "Unlimited" },
													{
														feature: { label: "Additional Fields", tooltip: "Add custom fields to capture additional metadata specific to your workflow and requirements." },
														community: "1 Field", self: "Unlimited", enterprise: "Unlimited",
													},
												],
											},
											{
												title: "Paid-tier Features",
												rows: [
													{
														feature: { label: "Authentication & RBAC", tooltip: "Secure your Lighthouse instance with any OIDC-compatible identity provider (Microsoft Entra, Google, Keycloak, Auth0, etc.) and control access with Role Based Access Control across four roles and SSO group mappings. For server installs (Docker, Kubernetes); not available in the standalone desktop apps." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "OAuth for Jira & Azure DevOps", tooltip: "Connect to Jira (Atlassian 3LO) and Azure DevOps (Microsoft Entra ID) via OAuth, with automatic token refresh and guided reconnect, alongside the standard Personal Access Token flow." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Exclude Items for Throughput", tooltip: "Keep maintenance, support and unplanned work out of your throughput, so forecasts are based on the work you plan for. The filter applies to every forecast and metric." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Rule-Based Deliveries", tooltip: "Define rules that pick Features by label or custom field. The delivery updates itself as Features come and go." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Manual Feature Ordering", tooltip: "Decide the order Lighthouse forecasts your Features in, independent of the rank in your work tracking system. Move any Feature to the top, up, down or to the bottom, and the forecast updates straight away." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Blackout Days & Recurring Rules", tooltip: "Define days that do not count as working days, one-off like bank holidays or recurring like weekends. Throughput leaves them out and forecast dates skip them." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Data Export & Sharing", tooltip: "Export flow metrics data to CSV or clipboard for sharing via email or custom analysis." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Data Sync Mappings", tooltip: "Write metrics and forecasts, including forecasted start dates and their likelihoods, back to fields in Jira and Azure DevOps." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Delivery Timeline", tooltip: "One bar per Feature from forecast start to finish, in order, with dependencies drawn between them and the Features that will not start before the target date called out." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Dependency-aware Forecasts", tooltip: "The forecast waits for a blocker to finish before the blocked Feature starts, so the dates reflect what your tracker says is in the way." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Named Cycle Times", tooltip: "Measure any start-to-end window, such as a full lead time from backlog to done, right next to the default Cycle Time." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Follow a Jira Release", tooltip: "A Delivery that follows a Jira Release (fixVersion), picks up its Features by itself, and writes the forecast back to it." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Archive Deliveries", tooltip: "Keep a finished Delivery exactly as it was, so what you forecast in August still reads the same in October." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Custom Terminology", tooltip: "Use your words for Feature, Work Item, Team, Portfolio, SLE and more, everywhere in Lighthouse." },
														community: false, self: true, enterprise: true,
													},
												],
											},
											{
												title: "Support & Onboarding",
												rows: [
													{ feature: "Community Slack", community: true, self: true, enterprise: true },
													{ feature: "Feature requests (ideas.letpeople.work)", community: true, self: true, enterprise: true },
													{ feature: "Best-effort help from the team", community: false, self: true, enterprise: true },
													{ feature: "Prioritised support queue", community: false, self: false, enterprise: true },
													{ feature: "24h acknowledgement (async)", community: false, self: false, enterprise: true },
													{ feature: "Onboarding calls (2×60 min in first 90 days)", community: false, self: false, enterprise: true },
													{ feature: "Named contacts for support", community: false, self: false, enterprise: true },
												],
											},
										];

										return groups.flatMap((group, gi) => [
											<tr key={`g${gi}`}>
												<td colSpan={4} className="py-4 px-4 font-semibold text-foreground bg-accent/30">
													{group.title}
												</td>
											</tr>,
											...group.rows.map((row, ri) => (
												<tr key={`g${gi}r${ri}`}>
													<td className="py-3 px-4 text-muted-foreground">
														{renderFeature(row.feature)}
													</td>
													<td className="py-3 px-4 text-center">{renderValue(row.community)}</td>
													<td className="py-3 px-4 text-center">{renderValue(row.self, true)}</td>
													<td className="py-3 px-4 text-center">{renderValue(row.enterprise, true)}</td>
												</tr>
											)),
										]);
									})()}
								</tbody>
							</table>
						</div>

						<div className="mt-6 p-4 bg-accent/20 rounded-lg">
							<p className="text-sm text-muted-foreground">
								<span className="font-semibold text-foreground">Note:</span> New paid-tier features may be introduced for Self-Service and Enterprise first, before being made available in the Community edition. Community customers stay on the same feature line and just get there a release or two later.
							</p>
						</div>
						</div>
					</details>
				</div>

					{/* Post-comparison trial CTA: whoever read this far is evaluating.
					    Anchored: the assessment's next-step CTA lands here. */}
					<div id="lighthouse-trial" className="text-center mt-12 scroll-mt-24">
						<p className="text-lg text-foreground font-medium mb-1">Easier to just try it?</p>
						<p className="text-sm text-muted-foreground mb-5">We&apos;ll email you a 30-day Premium license for the Self-Service edition. You don&apos;t sign up, we don&apos;t ask for a card, and after 30 days it expires on its own.</p>
						<Button
							variant="outline"
							onClick={() => { setTrialSource("comparison"); trackEvent("Trial dialog opened", { source: "comparison" }); }}
						>
							Try Premium free for 30 days
						</Button>
					</div>
			</section>

			{/* Buying right below the prices: the form used to sit five screens
			    further down, after the FAQ and the downloads. */}
			<section id="lighthouse-license" className="py-24 md:py-32 bg-background">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
							Get a license
						</span>
						<h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.08] mb-6">
							Buy Self-Service, or talk to us about Enterprise
						</h2>
						<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
							You can move from one edition to the other later. Just write to us.
						</p>
					</div>

					<Card className="border-0 shadow-medium hover:shadow-glow transition-all duration-300">
						<CardContent className="p-12">
							<div className="grid lg:grid-cols-2 gap-12 items-start">
								{/* License Info */}
								<div>
									<div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-6">
										<Shield className="h-10 w-10 text-white" />
									</div>
									<h3 className="text-2xl font-bold text-foreground mb-2">
										Self-Service License
									</h3>
									<p className="text-sm text-primary font-semibold mb-4">Annual · Self-hosted</p>
									<p className="text-muted-foreground mb-4">
										Everything in the Self-Service column above. Fill in your details and you'll have your license in minutes.
									</p>
									<div className="text-sm text-muted-foreground mb-6">
										<p className="mb-2">Or write to licensing@letpeople.work if you:</p>
										<ul className="space-y-1 ml-4">
											<li>• Want a trial license</li>
											<li>• Need a custom invoice or PO process</li>
											<li>• Want to talk Enterprise terms instead</li>
										</ul>
									</div>

									<div className="mb-6">
										<div className="flex items-baseline gap-3">
											<div className="text-4xl font-bold text-foreground">
												{prices.selfService}
											</div>
											<div className="text-lg text-muted-foreground">/ year</div>
										</div>
									</div>

									{/* License Details Collapsible */}
									<Collapsible
										open={showLicenseDetails}
										onOpenChange={setShowLicenseDetails}
									>
										<CollapsibleTrigger asChild>
											<Button variant="outline" size="sm" className="mb-4">
												License Details
												{showLicenseDetails ? (
													<ChevronUp className="ml-2 h-4 w-4" />
												) : (
													<ChevronDown className="ml-2 h-4 w-4" />
												)}
											</Button>
										</CollapsibleTrigger>
										<CollapsibleContent className="space-y-2">
											<div className="p-4 bg-accent/20 rounded-lg text-sm text-muted-foreground">
												<h4 className="font-semibold text-foreground mb-2">
													Key License Terms:
												</h4>
												<ul className="space-y-1">
													<li>
														• License valid for 365 days from purchase date
													</li>
													<li>
														• Maximum 50 concurrent Lighthouse instances per
														organization and license
													</li>
													<li>• Non-transferable, non-sublicensable license</li>
													<li>
														• Commercial use permitted within licensed
														organization only
													</li>
													<li>
														• License termination for violations or misuse
													</li>
													<li>
														• Software provided "as is" without warranties
													</li>
												</ul>
												<div className="mt-3 pt-3 border-t border-border">
													<p className="text-xs mb-2">
														<button
															onClick={() => { setLegalTab("terms"); setShowLegalDialog(true); }}
															className="text-primary hover:underline"
														>
															View full Terms & Conditions
														</button>{" "}
														for complete license details and restrictions.
													</p>
												</div>
											</div>
										</CollapsibleContent>
									</Collapsible>
								</div>

								{/* Purchase Form */}
								<div className="bg-gradient-subtle rounded-xl p-8">
									<h4 className="text-xl font-bold text-foreground mb-6">
										License Information
									</h4>

									<div className="space-y-4 mb-8">
										<div className="space-y-2">
											<Label
												htmlFor="name"
												className="flex items-center space-x-2"
											>
												<User className="h-4 w-4" />
												<span>Full Name</span>
											</Label>
											<Input
												id="name"
												placeholder="Enter your full name"
												value={purchaseForm.name}
												onChange={(e) =>
													setPurchaseForm({
														...purchaseForm,
														name: e.target.value,
													})
												}
											/>
										</div>

										<div className="space-y-2">
											<Label
												htmlFor="email"
												className="flex items-center space-x-2"
											>
												<Mail className="h-4 w-4" />
												<span>Email Address</span>
											</Label>
											<Input
												id="email"
												type="email"
												placeholder="Enter your email address"
												value={purchaseForm.email}
												onChange={(e) =>
													setPurchaseForm({
														...purchaseForm,
														email: e.target.value,
													})
												}
											/>
										</div>

										<div className="space-y-2">
											<Label
												htmlFor="organization"
												className="flex items-center space-x-2"
											>
												<Building className="h-4 w-4" />
												<span>Organization</span>
											</Label>
											<Input
												id="organization"
												placeholder="Enter your organization name"
												value={purchaseForm.organization}
												onChange={(e) =>
													setPurchaseForm({
														...purchaseForm,
														organization: e.target.value,
													})
												}
											/>
										</div>

										<div className="space-y-2">
											<Label
												htmlFor="validFrom"
												className="flex items-center space-x-2"
											>
												<CalendarIcon className="h-4 w-4" />
												<span>License Valid From</span>
											</Label>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														id="validFrom"
														variant="outline"
														className="w-full justify-start text-left font-normal"
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{purchaseForm.validFrom ? (
															format(purchaseForm.validFrom, "PPP")
														) : (
															<span>Pick a date</span>
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														mode="single"
														selected={purchaseForm.validFrom}
														onSelect={(date) =>
															date &&
															setPurchaseForm({
																...purchaseForm,
																validFrom: date,
															})
														}
														disabled={(date) =>
															date < new Date(new Date().setHours(0, 0, 0, 0))
														}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
											<p className="text-xs text-muted-foreground">
												Choose when you want your license to start being valid.
												Defaults to today.
											</p>
										</div>
									</div>

									<Button
										size="lg"
										className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-white"
										disabled={
											!purchaseForm.name ||
											!purchaseForm.email ||
											!purchaseForm.organization ||
											isProcessingPayment
										}
										onClick={() => handlePurchase()}
									>
										{isProcessingPayment
											? "Processing..."
											: "Purchase License Now"}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>

									<p className="text-xs text-muted-foreground text-center mt-4">
										You will be forwarded to Stripe to securely complete your
										payment
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Enterprise enquiry card */}
					<div className="mt-8 rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-white to-accent/30 p-8 md:p-12 relative overflow-hidden">
						<div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
						<div className="relative grid lg:grid-cols-2 gap-10 items-center">
							<div>
								<span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3 block">
									Enterprise
								</span>
								<h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
										Want priority support?
								</h3>
								<p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-2">
									Enterprise gives you the same product as Self-Service, plus a prioritised support queue, a 24h acknowledgement on async requests, and onboarding calls.
								</p>
							</div>
							<div className="flex flex-col gap-4">
								<div className="flex items-baseline gap-3">
									<div className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">{prices.enterprise}</div>
									<div className="text-base text-muted-foreground">/ year</div>
								</div>
								<a
									href="mailto:licensing@letpeople.work?subject=Lighthouse%20Enterprise%20enquiry"
									className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm md:text-base bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft hover:shadow-medium transition-all hover:-translate-y-0.5 no-underline self-start"
								>
									Talk to us <ArrowRight className="w-4 h-4" />
								</a>
								<p className="text-xs text-muted-foreground">
									Reply within one working day. We'll set up a short call to scope the agreement and onboarding.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Pitch deck right after pricing: the person evaluating often has to convince someone who decides. */}
			<section id="lighthouse-convince" className="py-12 bg-gradient-card">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-6">
						<h3 className="text-2xl font-semibold text-foreground">
							Need to convince someone who decides?
						</h3>
						<p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
							A short deck for your manager or steering committee. It covers
							what Lighthouse does and what it costs.
						</p>
						<div className="mt-4">
							<a
								href="/Lighthouse_Pitch_Deck.pdf"
									onClick={() => trackDownload({ edition: "pitch-deck", format: "pdf", source: "convince" })}
										data-skip-autotrack
								className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:opacity-90 transition-opacity"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Download className="h-4 w-4" />
								Pitch Deck (PDF)
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Downloads */}
			<section id="downloads" className="py-20 bg-background">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
							Downloads
						</h2>
						{latestVersion && (
							<p className="text-sm font-medium text-primary">
								Latest: {latestVersion}
							</p>
						)}
					</div>

					<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						{/* Standalone card */}
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-primary">
										<Laptop className="h-5 w-5" />
									</div>
									<div>
										<h3 className="text-lg font-semibold text-foreground">
											Standalone
										</h3>
										<p className="text-xs text-muted-foreground">
											Desktop app with auto-updates
										</p>
									</div>
								</div>
								<p className="text-sm text-muted-foreground mb-5">
									Best for personal use and getting started quickly. Runs as a
									native desktop application.
								</p>
								<div className="space-y-0.5">
									{standaloneDownloads.map((item) => (
										<TooltipProvider key={`${item.os}-${item.label}`}>
											<Tooltip>
												<TooltipTrigger asChild>
													<button
														className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/60 transition-colors text-left group"
														onClick={() => {
															trackDownload({
																edition: "standalone",
																platform: item.os,
																format: item.format,
																source: "downloads-section",
															});
															const url =
																findAssetByPattern(
																	releaseAssets,
																	item.assetPattern!,
																)?.browser_download_url ??
																LIGHTHOUSE_GITHUB_RELEASES_URL;
															window.open(url, "_blank");
														}}
													>
														<span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-muted-foreground">
															<OsIcon os={item.os} className="h-4 w-4" />
														</span>
														<span className="flex-1 text-sm">{item.label}</span>
														<Download className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
													</button>
												</TooltipTrigger>
												<TooltipContent side="right">
													<p className="max-w-xs text-xs">{item.tooltip}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Server card */}
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-primary">
										<ServerIcon className="h-5 w-5" />
									</div>
									<div>
										<h3 className="text-lg font-semibold text-foreground">
											Server
										</h3>
										<p className="text-xs text-muted-foreground">
											Centrally hosted for your team
										</p>
									</div>
								</div>
								<p className="text-sm text-muted-foreground mb-5">
									Best for hosting Lighthouse centrally for multiple users.
									Available for Windows, Linux, and as a Docker container.
								</p>
								<div className="space-y-0.5">
									{serverDownloads.map((item) => {
										const isDocker = item.os === "docker";
										return (
											<TooltipProvider key={`${item.os}-${item.label}`}>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/60 transition-colors text-left group"
															onClick={() => {
																if (isDocker) {
																	trackEvent("Docker command copied", {
																		source: "downloads-section",
																	});
																	copyToClipboard(LIGHTHOUSE_DOCKER_COMMAND);
																} else {
																	trackDownload({
																		edition: "server",
																		platform: item.os,
																		format: item.format,
																		source: "downloads-section",
																	});
																	const url =
																		findAssetByPattern(
																			releaseAssets,
																			item.assetPattern!,
																		)?.browser_download_url ??
																		LIGHTHOUSE_GITHUB_RELEASES_URL;
																	window.open(url, "_blank");
																}
															}}
														>
															<span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-muted-foreground">
																<OsIcon os={item.os} className="h-4 w-4" />
															</span>
															<span className="flex-1 text-sm">
																{item.label}
															</span>
															{isDocker ? (
																copiedCommand ? (
																	<Check className="h-3.5 w-3.5 text-green-500" />
																) : (
																	<Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
																)
															) : (
																<Download className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
															)}
														</button>
													</TooltipTrigger>
													<TooltipContent side="right">
														<p className="max-w-xs text-xs">{item.tooltip}</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</div>

					{latestVersion && (
						<p className="text-center text-xs text-muted-foreground mt-8">
							<a
								href={LIGHTHOUSE_GITHUB_RELEASES_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="underline underline-offset-4 hover:text-foreground"
							>
								View all releases on GitHub
							</a>
						</p>
					)}

					{/* Free onboarding offer */}
					<div className="max-w-3xl mx-auto mt-12 rounded-2xl border border-primary/20 bg-accent/40 p-8 text-center">
						<h3 className="text-xl font-bold text-foreground mb-3">
							Want help setting it up?
						</h3>
						<p className="text-muted-foreground leading-relaxed mb-6">
							We&apos;ll set it up with you for free, on any edition. That includes
							connecting your tracker and a first walkthrough with your team.
						</p>
						<a
							href="mailto:contact@letpeople.work?subject=Lighthouse%20onboarding"
							onClick={() => trackEvent("Onboarding enquiry", { source: "downloads-section" })}
							className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-7 py-3.5 rounded-full shadow-soft hover:shadow-medium hover:bg-primary-hover transition-all duration-200 hover:-translate-y-0.5 no-underline"
						>
							Get free onboarding
						</a>
					</div>
				</div>
			</section>

			{/* FAQ: objections, after the downloads for those still deciding */}
			<FAQSection />

			{/* See-it-for-yourself: demo / walkthrough / community */}
			<LighthouseLearnMore />

			{/* AI Integration Section */}
			<section id="lighthouse-ai" className="py-20 bg-gradient-hero">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/60 mb-4 block">
							AI Integration
						</span>
						<h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
							Connect your AI assistant
						</h2>
						<p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
							Lighthouse exposes your flow data through three integration points.
							Pick the one that fits your setup. Works with any AI that
							supports tool calling. No vendor lock-in.
						</p>
					</div>

					{/* Three method cards */}
					<div className="grid md:grid-cols-3 gap-6 mb-16">
						<div className="rounded-xl bg-white/10 border border-white/20 p-6">
							<div className="text-xs font-bold uppercase tracking-wider text-green-300 mb-3">
								CLI
							</div>
							<h3 className="text-lg font-semibold text-primary-foreground mb-2">
								Shell & Scripts
							</h3>
							<p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
								Use the Lighthouse CLI in shell scripts, CI jobs, or any
								terminal-capable agent. Outputs JSON for easy integration with
								existing pipelines.
							</p>
							<code className="block text-xs bg-black/30 text-green-300 rounded-lg px-3 py-2 font-mono">
								npm install -g @letpeoplework/lighthouse-cli
							</code>
						</div>

						<div className="rounded-xl bg-white/15 border border-white/30 p-6 ring-1 ring-white/20">
							<div className="text-xs font-bold uppercase tracking-wider text-green-300 mb-3">
								MCP stdio · Most Popular
							</div>
							<h3 className="text-lg font-semibold text-primary-foreground mb-2">
								Local AI Clients
							</h3>
							<p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
								Connect VS Code, GitHub Copilot, Claude Code, or any local AI
								tool via the MCP stdio package. Or drop the{" "}
								<span className="text-green-300 font-mono">.mcpb</span> bundle
								directly into your client, no npm required.
							</p>
							<code className="block text-xs bg-black/30 text-green-300 rounded-lg px-3 py-2 font-mono">
								@letpeoplework/lighthouse-mcp-stdio
							</code>
						</div>

						<div className="rounded-xl bg-white/10 border border-white/20 p-6">
							<div className="text-xs font-bold uppercase tracking-wider text-green-300 mb-3">
								MCP HTTP
							</div>
							<h3 className="text-lg font-semibold text-primary-foreground mb-2">
								Shared & Hosted
							</h3>
							<p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
								Run the HTTP server for shared team setups, container
								deployments, or remote development environments. Exposes a
								standard <span className="text-green-300 font-mono">/mcp</span>{" "}
								endpoint.
							</p>
							<code className="block text-xs bg-black/30 text-green-300 rounded-lg px-3 py-2 font-mono">
								@letpeoplework/lighthouse-mcp-http
							</code>
						</div>
					</div>

					{/* Config example + downloads */}
					<div className="grid lg:grid-cols-2 gap-10 mb-16">
						{/* VS Code config snippet + MCPB bundle */}
						<div className="space-y-4">
						<div className="rounded-xl bg-black/40 border border-white/20 overflow-hidden">
							<div className="flex items-center gap-2 px-4 py-3 bg-black/30 border-b border-white/10">
								<div className="w-3 h-3 rounded-full bg-red-400/60" />
								<div className="w-3 h-3 rounded-full bg-yellow-400/60" />
								<div className="w-3 h-3 rounded-full bg-green-400/60" />
								<span className="text-xs text-white/40 ml-2 font-mono">
									.vscode/mcp.json
								</span>
							</div>
							<pre className="p-5 text-xs text-green-300 font-mono leading-relaxed overflow-x-auto">{`{
  "servers": {
    "lighthouse": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@letpeoplework/lighthouse-mcp-stdio"],
      "env": {
        "LIGHTHOUSE_URL": "https://your-lighthouse-instance",
        "LIGHTHOUSE_API_KEY": "your-api-key"
      }
    }
  }
}`}</pre>
						</div>

							<div className="rounded-xl bg-white/10 border border-white/20 p-6">
								<h4 className="text-sm font-semibold text-primary-foreground mb-1">
									MCPB Bundle
								</h4>
								<p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
									A single-file bundle for clients that support the MCPB format.
									No npm install, no configuration. Just drop it in and connect.
								</p>
								<a
									href="https://github.com/LetPeopleWork/lighthouse-clients/releases/latest/download/lighthouse-mcp-stdio.mcpb"
										onClick={() => trackDownload({ edition: "ai-mcpb", format: "mcpb", source: "ai-integration" })}
										data-skip-autotrack
									className="inline-flex items-center gap-2 text-sm font-medium text-green-300 hover:text-green-200 transition-colors"
								>
									Download lighthouse-mcp-stdio.mcpb
									<ArrowRight className="w-4 h-4" />
								</a>
							</div>
						</div>

						{/* Agent skills */}
						<div>
							<div className="h-full rounded-xl bg-white/10 border border-white/20 p-6">
								<h4 className="text-sm font-semibold text-primary-foreground mb-1">
									Agent Skills
								</h4>
								<p className="text-primary-foreground/70 text-sm leading-relaxed mb-5">
									Teach your AI agent to work with Lighthouse. Drop them into
									Claude Code, VS Code, or any skill-compatible agent.
								</p>
								<ul className="space-y-5">
									{agentSkills.map((skill) => (
										<li key={skill.zip}>
											<div className="flex items-center gap-2 mb-1">
												<span className="text-sm font-semibold text-primary-foreground">
													{skill.name}
												</span>
												{!skill.released && (
													<span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground/80 border border-white/30 rounded-full px-2 py-0.5">
														Coming soon
													</span>
												)}
											</div>
											<p className="text-primary-foreground/70 text-sm leading-relaxed">
												{skill.description}
											</p>
											{skill.released && (
												<a
													href={`https://github.com/LetPeopleWork/lighthouse-clients/releases/latest/download/${skill.zip}`}
													onClick={() => trackDownload({ edition: skill.edition, format: "zip", source: "ai-integration" })}
													data-skip-autotrack
													className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-green-300 hover:text-green-200 transition-colors"
												>
													Download {skill.zip}
													<ArrowRight className="w-4 h-4" />
												</a>
											)}
										</li>
									))}
								</ul>
							</div>

						</div>
					</div>

					<div className="text-center">
						<a
							href="https://docs.lighthouse.letpeople.work/aiintegration.html"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-all duration-200 hover:-translate-y-0.5 no-underline"
						>
							Full setup guide
							<ArrowRight className="w-4 h-4" />
						</a>
					</div>
				</div>
			</section>

			{/* Recently shipped / what's new */}
			<LighthouseWhatsNew />

			{/* Payment Result Dialog */}
			<Dialog
				open={paymentResult.show}
				onOpenChange={(open) =>
					!open && setPaymentResult({ ...paymentResult, show: false })
				}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader className="text-center">
						<div className="flex justify-center mb-4">
							{paymentResult.type === "success" ? (
								<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
									<CheckCircle className="h-8 w-8 text-green-600" />
								</div>
							) : (
								<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
									<XCircle className="h-8 w-8 text-red-600" />
								</div>
							)}
						</div>
						<DialogTitle
							className={`text-xl font-bold ${paymentResult.type === "success" ? "text-green-700" : "text-red-700"}`}
						>
							{paymentResult.title}
						</DialogTitle>
					</DialogHeader>
					<div className="text-center space-y-4">
						{paymentResult.type === "success" ? (
							<div className="text-muted-foreground leading-relaxed space-y-3 text-left">
								<p>
									Your payment has been processed successfully. We're preparing
									your premium license and will send it to your email shortly
									from licensing@lighthouse.letpeople.work.
								</p>
								<p>
									Expect it within the next 4 hours. Please check your inbox and
									spam folder.
								</p>
								<p>
									Haven't received it? No worries – just drop us a line at{" "}
									<a
										href="mailto:licensing@letpeople.work"
										className="text-primary hover:underline"
									>
										licensing@letpeople.work
									</a>{" "}
									and we'll sort it out.
								</p>
							</div>
						) : (
							<p className="text-muted-foreground leading-relaxed">
								{paymentResult.description}
							</p>
						)}
						<Button
							onClick={() =>
								setPaymentResult({ ...paymentResult, show: false })
							}
							className={`w-full ${
								paymentResult.type === "success"
									? "bg-green-600 hover:bg-green-700 text-white"
									: "bg-red-600 hover:bg-red-700 text-white"
							}`}
						>
							{paymentResult.type === "success" ? "Got it!" : "Understood"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Legal Information Dialog */}
			<TrialRequestDialog
				open={trialSource !== null}
				onOpenChange={(open) => { if (!open) setTrialSource(null); }}
				source={trialSource ?? "pricing-card"}
			/>

			<LegalInfoDialog
				open={showLegalDialog}
				onOpenChange={setShowLegalDialog}
				defaultTab={legalTab}
			/>
		</div>
	);
};

export default Lighthouse;
