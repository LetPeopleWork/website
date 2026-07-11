import {
	ArrowRight,
	Target,
	FileText,
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
	Hammer,
	Calendar as CalendarIcon,
	BarChart3,
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
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
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
import MediaCarousel from "@/components/MediaCarousel";
import LegalInfoDialog from "@/components/LegalInfoDialog";
import SEO from "@/components/SEO";
import lighthouseLogo from "@/assets/LighthouseLogo.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import LighthouseTestimonials from "@/components/LighthouseTestimonials";
import FAQSection from "@/components/FAQSection";
import LighthouseLearnMore from "@/components/LighthouseLearnMore";
import LighthouseWhatsNew from "@/components/LighthouseWhatsNew";
import { format } from "date-fns";
import { lighthouseAsset } from "@/lib/lighthouseAsset";
import metricsTeamVideo from "@/assets/videos/Metrics_Team.mp4";
import metricsProjectVideo from "@/assets/videos/Metrics_Projects.mp4";
import forecastsTeamVideo from "@/assets/videos/Forecasts_Team.mp4";
import forecastsProjectVideo from "@/assets/videos/Forecasts_Project.mp4";
import gitHubImage from "@/assets/screenshots/GitHub.png";
import {
	findAssetByPattern,
	LIGHTHOUSE_DOCKER_COMMAND,
	LIGHTHOUSE_GITHUB_RELEASES_URL,
	type ReleaseAsset,
} from "@/lib/lighthouseDownloads";
import QuickDownloadBar from "@/components/QuickDownloadBar";
import { trackDownload, trackEvent } from "@/lib/plausible";

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
};

const standaloneDownloads: DownloadEntry[] = [
	{
		os: "windows",
		label: "Windows Installer (.exe)",
		tooltip: "Recommended NSIS installer for Windows. Code signed.",
		assetPattern: "installer.exe",
	},
	{
		os: "windows",
		label: "Windows Installer (.msi)",
		tooltip:
			"MSI installer for Windows, useful for enterprise deployment. Code signed.",
		assetPattern: "installer.msi",
	},
	{
		os: "macos",
		label: "macOS Disk Image (.dmg)",
		tooltip: "Standard macOS disk image. Signed and notarized by Apple.",
		assetPattern: "osx.dmg",
	},
	{
		os: "macos",
		label: "macOS App Bundle (.zip)",
		tooltip:
			"The macOS app bundle as a zip archive. Signed and notarized by Apple.",
		assetPattern: "osx.app.zip",
	},
	{
		os: "linux",
		label: "Linux App (.AppImage)",
		tooltip:
			"Portable AppImage that runs on most Linux distributions without installation.",
		assetPattern: ".appimage",
	},
];

const serverDownloads: DownloadEntry[] = [
	{
		os: "windows",
		label: "Windows Binaries (.zip)",
		tooltip:
			"Server binaries for Windows (x64). Extract and run as a background service.",
		assetPattern: "server-win",
	},
	{
		os: "linux",
		label: "Linux Binaries (.zip)",
		tooltip:
			"Server binaries for Linux (x64). Extract and run as a background service.",
		assetPattern: "server-linux",
	},
	{
		os: "docker",
		label: "Docker Container",
		tooltip:
			"Copies the docker run command to your clipboard. Runs the server edition as a container.",
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
			// Small delay to ensure the page has rendered
			setTimeout(() => {
				const element = document.querySelector(hash);
				if (element) {
					element.scrollIntoView({ behavior: "smooth" });
				}
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

	const lighthouseFeatures = [
		{
			title: "Visualize the Flow for Teams",
			description:
				"Inspect how well work flows through your system and use the data to drive improvements",
			video: metricsTeamVideo,
		},
		{
			title: "Visualize the Flow on Portfolio Level",
			description:
				"Optimize your end to end value delivery by analyzing higher flight levels",
			video: metricsProjectVideo,
		},
		{
			title: "Run Forecasts for your Team",
			description:
				'Make plannings a breeze and get answers to "When will it be done" and "How much can we do" within seconds',
			video: forecastsTeamVideo,
		},
		{
			title: "Create Realistic Delivery Timelines",
			description:
				"Use the power of Monte Carlo Simulations to create timelines that are based on your historical data",
			video: forecastsProjectVideo,
		},
	];

	const detailedFeatures = [
		{
			icon: <BarChart3 className="h-8 w-8" />,
			title: "Visualize your Flow",
			description:
				"Take action based on real data - with Lighthouse you have all relevant Flow Metrics at your disposal",
			extendedDescription: `Whether it's on team or on portfolio level, you can't have easier access to a complete overview over your Flow than with Lighthouse.
      Whether you want to see the impact of a recent change, analyze how the last weeks went together with the team, or look for outliers to learn from - Lighthouse is making it easy for you!

      You get the full set: Cycle Time, Throughput, Work In Progress, Work Item Aging with pace bands, Arrivals, and a Flow Overview that flags stale and blocked work at a glance. Newer additions like the Load Balance Matrix help you control WIP, while Time in State shows how long each item has been sitting right now. Premium teams can even define their own named cycle times: measure any start-to-end window, such as a full lead time from backlog to done, right alongside the default Cycle Time on the scatterplot and the Cumulative Time per State chart. Filter the date range, drill down to specific items, and jump straight to your connected system.

      If you want to work data-driven, these are the metrics you need. And Lighthouse is the tool you want to visualize them!`,
			callToAction: "Miss some specific Metric or Chart? Reach out!",
			mediaItems: [
				{
					type: "image" as const,
					src: lighthouseAsset("features/metrics/metricsoverview.png"),
					alt: "Team Metrics",
				},
				{
					type: "image" as const,
					src: lighthouseAsset("features/metrics/portfoliometricsoverview.png"),
					alt: "Projects Metrics",
				},
				{
					type: "video" as const,
					src: metricsTeamVideo,
					alt: "Team Metrics Demo",
				},
			],
		},
		{
			icon: <Target className="h-8 w-8" />,
			title: "Forecast Delivery Dates",
			description:
				"Stop wasting time with guesses - Lighthouse is using your historical data to create realistic timelines in seconds",
			extendedDescription: `Instead of spending time with detailed breakdowns or assigning made up points to things, start making use of the data you already have!
      
      Lighthouse is using Monte Carlo Simulations to create probabilistic forecasts. Those forecasts come with an associated probability, which will help you do proper risk management.
      Like a Lighthouse that is consistently shining light into the darkness, the forecasts are updated continuously, so that you can take action once you notice that your initial plan may not work out anymore.

      You have the data already, now you just need Lighthouse and you will be able to create plans and timelines within seconds!`,
			callToAction: "",
			mediaItems: [
				{
					type: "image" as const,
					src: lighthouseAsset("features/teamdetail.png"),
					alt: "Team Forecasts",
				},
				{
					type: "image" as const,
					src: lighthouseAsset("features/portfoliodetail.png"),
					alt: "Projects Forecasts",
				},
				{
					type: "video" as const,
					src: forecastsProjectVideo,
					alt: "Project Forecasts Demo",
				},
			],
		},
		{
			icon: <ArrowRight className="h-8 w-8" />,
			title: "Integrate with the tools you already use",
			description:
				"No need to maintain multiple data sources - Lighthouse connects to Jira, Azure DevOps, Linear, and CSV",
			extendedDescription: `You don't want to maintain your data in yet another tool. This is why Lighthouse connects to what you are already using: Jira, Azure DevOps, Linear, or a simple CSV export.

      Its flexible design lets Lighthouse work with your data source no matter how you set it up. Using custom fields or labels? Have special filters you want to apply? Lighthouse can cope with that. Connect with a Personal Access Token, or use OAuth for Jira and Azure DevOps on the paid tiers.`,
			callToAction: "Your System is not supported? Let us know!",
			mediaItems: [
				{
					type: "image" as const,
					src: lighthouseAsset("concepts/worktrackingsystem_AzureDevOps.png"),
					alt: "ALM Connection",
				},
				{
					type: "image" as const,
					src: lighthouseAsset("concepts/azuredevops_team_wizard.png"),
					alt: "Query Configuration",
				},
			],
		},
		{
			icon: <FileText className="h-8 w-8" />,
			title: "Full Transparency - Full Control",
			description:
				"No need to send your data to some cloud provider in a foreign country - Lighthouse is 100% Open-Source, runs fully on your infrastructure and will not send anything to the cloud",
			extendedDescription: `We don't want our data to go uncontrolled in the Cloud. We assume you are the same. This is why there is no third-party cloud provider involved. Don't trust us? Check out the code yourself, Lighthouse is 100% Open-Source.
      
      It's 100% made in Switzerland, where we have many banks that have tight security constraints when it comes to Software. This is why we put effort into making it possible for everyone to be able to run it. All of this applies to the Community and the premium version.`,
			callToAction:
				"Struggle to get it approved in your company? Let us know and we will support you!",
			mediaItems: [
				{
					type: "image" as const,
					src: gitHubImage,
					alt: "Github",
				},
			],
		},
	];

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
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Lighthouse",
		applicationCategory: "BusinessApplication",
		applicationSubCategory: "Project Management",
		operatingSystem:
			"Windows (Binaries), macOS (Installer (dmg), App Bundle (.app)), Linux (Binaries), Container",
		offers: [
			{
				"@type": "Offer",
				name: "Community Edition",
				price: "0",
				priceCurrency: "CHF",
				description: "Free forever community edition with core features (capped to 3 teams, 1 portfolio)",
			},
			{
				"@type": "Offer",
				name: "Self-Service License",
				price: "2000",
				priceCurrency: "CHF",
				description:
					"Annual self-hosted license with unlimited teams, portfolios, and all paid-tier features. Community Slack support.",
			},
			{
				"@type": "Offer",
				name: "Enterprise License",
				price: "10000",
				priceCurrency: "CHF",
				description:
					"Annual self-hosted license with prioritised support, 24h acknowledgement, 2x60-min onboarding, named contacts, and workshop discounts.",
			},
		],
		description:
			"Open-source flow metrics and probabilistic forecasting tool. Connects to Jira, Azure DevOps, and Linear. AI integration via MCP, so you can ask your AI assistant questions about your delivery data directly. Self-hosted, no cloud dependency.",
		featureList: [
			"Flow Metrics Visualization",
			"Monte Carlo Probabilistic Forecasting",
			"Jira Integration",
			"Azure DevOps Integration",
			"Linear Integration",
			"AI Integration via MCP (Model Context Protocol)",
			"CLI for Shell Scripts and CI/CD Pipelines",
			"Team and Portfolio Level Analytics",
			"Throughput Analysis",
			"Cycle Time Tracking",
			"Work Item Age Tracking",
			"Work In Progress Limits",
			"Self-Hosted, No Cloud Dependency",
		],
		screenshot: "https://letpeople.work/forecasts-project.png",
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "5",
			ratingCount: "6",
			reviewCount: "6",
			bestRating: "5",
			worstRating: "1",
		},
		review: [
			{
				"@type": "Review",
				datePublished: "2024-01-01",
				author: {
					"@type": "Person",
					name: "Gonzalo Mendez",
					jobTitle: "Scrum Master",
				},
				reviewRating: {
					"@type": "Rating",
					ratingValue: "5",
					bestRating: "5",
				},
				reviewBody:
					"Lighthouse helped us be more on to it. We're now more predictable, efficient, and responsive when it comes to delivering value and serving our customers. It's made planning sessions run smoother and helped set clearer expectations with our stakeholders. The insights we get from the data really sharpen our conversations and keep us focused on what matters.",
			},
			{
				"@type": "Review",
				datePublished: "2024-01-01",
				author: {
					"@type": "Person",
					name: "Lorenzo Santoro",
					jobTitle: "Project Manager",
				},
				reviewRating: {
					"@type": "Rating",
					ratingValue: "5",
					bestRating: "5",
				},
				reviewBody:
					"The ability of Lighthouse to continuous forecast is a game changer. It transforms something complex and time consuming in a continuous activity which enlightens both your project planning and tracking.",
			},
			{
				"@type": "Review",
				datePublished: "2024-01-01",
				author: {
					"@type": "Person",
					name: "Agnieszka Reginek",
					jobTitle: "Professional Kanban Trainer | Scrum Master",
				},
				reviewRating: {
					"@type": "Rating",
					ratingValue: "5",
					bestRating: "5",
				},
				reviewBody:
					"Lighthouse transformed how our Agile Release Train operates: moving us from guesstimations and overcommitment to data-driven PI Planning. It streamlined progress tracking across teams, making delivery more transparent and predictable. With continuous forecasting, we're now better equipped to anticipate risks, align expectations, and deliver value with confidence.",
			},
			{
				"@type": "Review",
				datePublished: "2024-01-01",
				author: {
					"@type": "Person",
					name: "Chris Graves",
					jobTitle: "Agile Coach",
				},
				reviewRating: {
					"@type": "Rating",
					ratingValue: "5",
					bestRating: "5",
				},
				reviewBody:
					"Lighthouse has transformed how we approach delivery. By prompting the right questions earlier and using the default feature size function to quickly forecast 'how much?', it provides a lean, cost-effective way to surface risk and enable better decisions.",
			},
			{
				"@type": "Review",
				datePublished: "2024-01-01",
				author: {
					"@type": "Person",
					name: "Nicolas Brown",
					jobTitle: "Author of 'Real World Agility' | Consultant | Speaker",
				},
				reviewRating: {
					"@type": "Rating",
					ratingValue: "5",
					bestRating: "5",
				},
				reviewBody:
					"Very few tools out there are able to distill what is going on in your system to act effectively as your mission control for all things delivery related. If John Anderton designed a system for flow, this would be it.",
			},
			{
				"@type": "Review",
				datePublished: "2024-01-01",
				author: {
					"@type": "Person",
					name: "Gábor Bittera",
					jobTitle: "Scrum Master",
				},
				reviewRating: {
					"@type": "Rating",
					ratingValue: "5",
					bestRating: "5",
				},
				reviewBody:
					"Whenever I am asked to assess the delivery health of a team, Lighthouse is my go-to tool as a consultant. Its quick, no-faff setup enables me to answer critical questions in a matter of minutes — shifting the conversation from gut-feel to data, and from wishful thinking to delivery risks and probabilities. For any coach trying to make risk visible and discussable, this is the tool that earns its place.",
			},
		],
		softwareVersion: latestVersion,
		downloadUrl: "https://github.com/LetPeopleWork/Lighthouse/releases",
		publisher: {
			"@type": "Organization",
			name: "LetPeopleWork GmbH",
			url: "https://letpeople.work",
		},
		video: [
			{
				"@type": "VideoObject",
				name: "Lighthouse Team Metrics Visualization",
				description:
					"Visualize how well work flows through your system at the team level with Lighthouse flow metrics",
				thumbnailUrl: "https://letpeople.work/forecasts-project.png",
				uploadDate: "2024-10-01T00:00:00Z",
				contentUrl: metricsTeamVideo,
				embedUrl: metricsTeamVideo,
			},
			{
				"@type": "VideoObject",
				name: "Lighthouse Project Metrics Visualization",
				description:
					"Optimize your end-to-end value delivery by analyzing higher flight levels with Lighthouse",
				thumbnailUrl: "https://letpeople.work/forecasts-project.png",
				uploadDate: "2024-10-01T00:00:00Z",
				contentUrl: metricsProjectVideo,
				embedUrl: metricsProjectVideo,
			},
			{
				"@type": "VideoObject",
				name: "Lighthouse Team Forecasting",
				description:
					"Run forecasts for your team and get answers to when work will be done within seconds",
				thumbnailUrl: "https://letpeople.work/forecasts-project.png",
				uploadDate: "2024-10-01T00:00:00Z",
				contentUrl: forecastsTeamVideo,
				embedUrl: forecastsTeamVideo,
			},
			{
				"@type": "VideoObject",
				name: "Lighthouse Project Delivery Timeline Forecasting",
				description:
					"Create realistic delivery timelines using Monte Carlo Simulations based on historical data",
				thumbnailUrl: "https://letpeople.work/forecasts-project.png",
				uploadDate: "2024-10-01T00:00:00Z",
				contentUrl: forecastsProjectVideo,
				embedUrl: forecastsProjectVideo,
			},
		],
	};

	return (
		<div className="min-h-screen bg-background">
			<SEO
				title="Lighthouse - Flow Metrics & Forecasting Tool for Agile Teams"
				description="Lighthouse is an open-source tool for visualizing flow metrics and forecasting delivery dates using Monte Carlo simulations. Connects to Jira, Azure DevOps, and Linear. AI integration via MCP, so you can ask Claude or Copilot questions about your delivery data. Free community version available."
				keywords="lighthouse flow metrics, agile forecasting tool, Monte Carlo simulation, delivery forecasting, when will it be done, how much can we do, Jira flow metrics, Azure DevOps metrics, Linear integration, AI integration, MCP, Model Context Protocol, agile AI assistant, throughput, cycle time, lead time, WIP, work in progress, team velocity, sprint forecasting, agile metrics dashboard, kanban metrics, scrum metrics, project forecasting, portfolio forecasting, open source agile, predictability, self-hosted forecasting, agile analytics"
				ogImage="https://letpeople.work/forecasts-project.png"
				ogType="website"
				canonicalUrl="https://letpeople.work/lighthouse"
				structuredData={structuredData}
				breadcrumbs={[
					{ name: "Home", url: "/" },
					{ name: "Lighthouse", url: "/lighthouse" },
				]}
			/>
			<Navigation />

			{/* Hero Section */}
			<section className="pt-32 pb-20 bg-gradient-subtle">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<div className="flex justify-center mb-8">
							<img
								src={lighthouseLogo}
								alt="Lighthouse Flow Metrics Tool Logo"
								className="h-20 w-auto"
								width="80"
								height="80"
								loading="eager"
								fetchPriority="high"
							/>
						</div>
						<h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
							<span className="bg-gradient-primary bg-clip-text text-transparent">
								Lighthouse
							</span>
						</h1>
						<p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12">
							You're being asked when it'll be done. Right now, your honest
							answer is a guess. Lighthouse turns your real history from Jira,
							Azure DevOps, or Linear into forecasts you can defend, from team
							to portfolio, and shows you where delivery is losing speed so you
							can fix it.
						</p>

						{/* Download CTA */}
						<div className="mb-8">
							<QuickDownloadBar
								source="lighthouse-hero"
								additionalLink={{
									name: "View Documentation",
									url: "https://docs.lighthouse.letpeople.work",
									external: true,
								}}
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							No credit card required • Community Version Free forever
						</p>
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
				</div>
			</section>

			{/* Overview Section with Screenshots */}
			<section id="lighthouse-overview" className="py-20 bg-background">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
							See Lighthouse in Action
						</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							See how teams go from defending guessed dates to forecasts they
							can stand behind
						</p>
					</div>

					<Carousel className="w-full max-w-6xl mx-auto">
						<CarouselContent>
							{lighthouseFeatures.map((feature) => (
								<CarouselItem key={feature.title}>
									<div className="grid lg:grid-cols-2 gap-12 p-6 min-h-[400px]">
										<div className="flex flex-col justify-center space-y-6">
											<h3 className="text-2xl font-bold text-foreground">
												{feature.title}
											</h3>
											<p className="text-muted-foreground text-lg">
												{feature.description}
											</p>
										</div>

										<div className="flex flex-col justify-center items-center">
											{/* Single Video Display */}
											{feature.video && (
												<video
													className="w-full max-w-lg h-80 rounded-lg shadow-soft"
													controls
													preload="metadata"
												>
													<source src={feature.video} type="video/mp4" />
													<track kind="captions" srcLang="en" label="English" />
													Your browser does not support the video tag.
												</video>
											)}
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</div>
			</section>

			{/* Testimonials Section */}
			<section id="lighthouse-testimonials" className="py-20 bg-background">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<LighthouseTestimonials />
				</div>
			</section>

			{/* See-it-for-yourself: demo / walkthrough / community */}
			<LighthouseLearnMore />

			{/* Pricing Section — 3 tiers */}
			<section id="lighthouse-premium" className="py-24 md:py-32 bg-gradient-subtle">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16 md:mb-20">
						<span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
							Pricing
						</span>
						<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-6">
							Three editions.
							<br />
							<span className="text-primary font-light">Same product. Different access.</span>
						</h2>
						<p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
							Lighthouse stays open source and self-hosted across every edition.<br />Paid tiers unlock unlimited usage and choose how much of us you want alongside it.
						</p>
					</div>

					{/* Pre-launch notice */}
					<div className="max-w-3xl mx-auto mb-16 rounded-2xl border border-primary/20 bg-accent/40 px-6 py-6 text-center">
						<span className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1 mb-3">
							Until August 2026
						</span>
						<p className="text-sm md:text-base text-foreground leading-relaxed">
							<span className="font-semibold">Self-Service is</span> <span className="font-semibold text-primary">CHF 999 / year</span> <span className="font-semibold">today. In August 2026 it becomes CHF 2,000.</span>{" "}
							Start before then and you lock CHF 999 for your full term. We're telling you early so the choice is yours, no countdown.
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
							<div className="text-sm text-muted-foreground mb-6">Forever. Open source. Self-hosted.</div>
							<p className="text-base text-foreground/80 leading-relaxed mb-6">
								Everything you need to forecast and see your flow, up to a few teams.
							</p>
							<ul className="space-y-2.5 mb-8 flex-1 text-sm text-foreground/80">
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>All core flow metrics &amp; Monte Carlo forecasts</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>Jira, Azure DevOps, Linear, CSV</span></li>
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
								Most popular
							</span>
							<div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">Self-Service</div>
							<div className="flex items-baseline gap-2 mb-1">
								<div className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">CHF 999</div>
								<div className="text-sm text-muted-foreground">/ year</div>
							</div>
							<span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent text-primary text-xs font-semibold px-3 py-1 mb-3">Current rate · CHF 2,000 from August 2026</span>
								<div className="text-sm text-muted-foreground mb-6">Annual license. Self-hosted.</div>
							<p className="text-base text-foreground/80 leading-relaxed mb-6">
								The full product, your way.<br />Run it, configure it, and scale it, with the community at your back.
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
						</div>

						{/* Enterprise */}
						<div className="flex flex-col rounded-3xl border border-border bg-background p-8 md:p-10">
							<div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">Enterprise</div>
							<div className="flex items-baseline gap-2 mb-1">
								<div className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">CHF 10,000</div>
								<div className="text-sm text-muted-foreground">/ year</div>
							</div>
								<div className="text-sm text-muted-foreground mb-6 mt-3">For teams that want priority.</div>
							<p className="text-base text-foreground/80 leading-relaxed mb-6">
								Everything in Self-Service, plus a faster, prioritised line to support when you need it.
							</p>
							<ul className="space-y-2.5 mb-8 flex-1 text-sm text-foreground/80">
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span><span className="font-semibold">Everything in Self-Service</span></span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span><span className="font-semibold">Prioritised support.</span> Your questions and feature requests jump the queue</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>24h acknowledgement on async requests</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>2 × 60-min onboarding calls in your first 90 days</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>Named contacts for flow, coaching, and technical questions</span></li>
								<li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-1 shrink-0" /><span>10% off any LetPeopleWork workshop or training</span></li>
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
						Self-hosted and open source. If you ever stop paying, your data and the tool stay with you.
					</p>

					{/* Full feature comparison table */}
					<div className="bg-background rounded-2xl p-8 shadow-soft border border-border">
						<h3 className="text-2xl font-bold text-foreground mb-2 text-center">
							Feature comparison
						</h3>
						<p className="text-sm text-muted-foreground text-center mb-8">
							Tiers split on access and support, not features. Paid tiers share the same product.
						</p>

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
													{ feature: "Flow Metrics for Projects", community: true, self: true, enterprise: true },
													{ feature: "Manual Forecasts for Teams", community: true, self: true, enterprise: true },
													{ feature: "Continuous Forecasts for Projects", community: true, self: true, enterprise: true },
													{ feature: "100% Open Source (MIT License)", community: true, self: true, enterprise: true },
													{ feature: "Connection to Jira, Azure DevOps & Linear", community: true, self: true, enterprise: true },
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
													{ feature: "Deliveries", community: "1 Delivery", self: "Unlimited", enterprise: "Unlimited" },
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
														feature: { label: "Authentication & RBAC", tooltip: "Secure your Lighthouse instance with any OIDC-compatible identity provider (Microsoft Entra, Google, Keycloak, Auth0, etc.) and control access with Role Based Access Control across four roles and SSO group mappings." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "OAuth for Jira & Azure DevOps", tooltip: "Connect to Jira (Atlassian 3LO) and Azure DevOps (Microsoft Entra ID) via OAuth, with automatic token refresh and guided reconnect, alongside the standard Personal Access Token flow." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Exclude Items for Throughput", tooltip: "Keep maintenance, support, and unplanned work out of your throughput so forecasts reflect the work your team actually delivers. The filter flows through every forecast and metric." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Rule-Based Deliveries", tooltip: "Define rules to automatically include your Features based on criteria like labels, fixVersion, or custom fields, ensuring your deliveries are always up-to-date without manual updating." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Blackout Days", tooltip: "Define days which should not be counted in the Throughput for calculating forecasts, for example bank holidays." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Data Export & Sharing", tooltip: "Export flow metrics data to CSV or clipboard for sharing via email or custom analysis." },
														community: false, self: true, enterprise: true,
													},
													{
														feature: { label: "Data Sync Mappings", tooltip: "Write Metrics and Forecasts back to Jira and Azure DevOps and store them in your system." },
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
													{ feature: "10% workshop / training discount", community: false, self: false, enterprise: true },
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
				</div>
			</section>

			{/* FAQ — objection-handling, placed right before the final license CTA */}
			<FAQSection />

			{/* License Purchase Section */}
			<section id="lighthouse-license" className="py-24 md:py-32 bg-background">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
							Get a license
						</span>
						<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-6">
							Self-Service today.
							<br />
							<span className="text-primary font-light">Enterprise when you're ready.</span>
						</h2>
						<p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
							Pick the path that fits.<br />You can move up later, just write to us.
						</p>
						<p className="text-sm text-muted-foreground/80 font-light max-w-2xl mx-auto mt-4">
							Self-hosted and open source. If you ever stop paying, your data and the tool stay with you.
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
												CHF 999
											</div>
											<div className="text-lg text-muted-foreground">/ year</div>
										</div>
										<p className="text-xs text-primary font-medium mt-2">
											Current rate, locked in for your term. From August 2026, this license is CHF 2,000.
										</p>
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
															onClick={() => setShowLegalDialog(true)}
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
									Enterprise gives you the same product as Self-Service, plus a prioritised support queue, a 24h acknowledgement on async requests, onboarding calls, and a 10% workshop discount.
								</p>
							</div>
							<div className="flex flex-col gap-4">
								<div className="flex items-baseline gap-3">
									<div className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">CHF 10,000</div>
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

			{/* Small 'Convince Stakeholders' section - added to provide a downloadable pitch deck */}
			<section id="lighthouse-convince" className="py-12 bg-gradient-card">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-6">
						<h3 className="text-2xl font-semibold text-foreground">
							Need something to convince people in your company?
						</h3>
						<p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
							If you need a short, professional deck to share with stakeholders
							and decision-makers, download our pitch deck and use it in your
							next meeting.
						</p>
						<div className="mt-4">
							<a
								href="/Lighthouse_Pitch_Deck.pdf"
									onClick={() => trackDownload({ edition: "pitch-deck", source: "convince" })}
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

			{/* AI Integration Section */}
			<section id="lighthouse-ai" className="py-20 bg-gradient-hero">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/60 mb-4 block">
							AI Integration
						</span>
						<h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
							Connect Your AI Assistant
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
						{/* VS Code config snippet */}
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

						{/* Downloads + skill */}
						<div className="space-y-4">
							<div className="rounded-xl bg-white/10 border border-white/20 p-6">
								<h4 className="text-sm font-semibold text-primary-foreground mb-1">
									Agent Skill
								</h4>
								<p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
									A pre-built skill that teaches your AI agent when and how to
									use Lighthouse tools, including fallbacks and authentication.
									Drop it into Claude Code, VS Code, or any skill-compatible
									agent.
								</p>
								<a
									href="https://github.com/LetPeopleWork/lighthouse-clients/releases/latest/download/lighthouse-skill.zip"
										onClick={() => trackDownload({ edition: "ai-skill", source: "ai-integration" })}
									className="inline-flex items-center gap-2 text-sm font-medium text-green-300 hover:text-green-200 transition-colors"
								>
									Download lighthouse-skill.zip
									<ArrowRight className="w-4 h-4" />
								</a>
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
										onClick={() => trackDownload({ edition: "ai-mcpb", source: "ai-integration" })}
									className="inline-flex items-center gap-2 text-sm font-medium text-green-300 hover:text-green-200 transition-colors"
								>
									Download lighthouse-mcp-stdio.mcpb
									<ArrowRight className="w-4 h-4" />
								</a>
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

			{/* Detailed Features Section */}
			<section id="lighthouse-features" className="py-20 bg-gradient-subtle">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
							Deep Dive into Key Features
						</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Explore what makes Lighthouse the leading choice for Project
							Managers, Internal Coaches, and external Consultants.
						</p>
						<p className="text-sm text-muted-foreground mt-4">
							Find a full reference of all features in the{" "}
							<a
								href="https://docs.lighthouse.letpeople.work"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								Lighthouse documentation
							</a>
						</p>
					</div>

					<div className="space-y-16">
						{detailedFeatures.map((feature, index) => (
							<div
								key={feature.title}
								className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
							>
								<div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
									<div className="flex items-center space-x-4 mb-6">
										<div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center text-primary">
											{feature.icon}
										</div>
										<div>
											<h3 className="text-2xl font-bold text-foreground">
												{feature.title}
											</h3>
											<p className="text-muted-foreground">
												{feature.description}
											</p>
										</div>
									</div>

									{/* Extended description - space for content to be added later */}
									{feature.extendedDescription && (
										<div className="mt-6">
											<p className="text-muted-foreground leading-relaxed">
												{feature.extendedDescription}
											</p>
										</div>
									)}

									{/* Call to Action Hint */}
									{feature.callToAction && (
										<div className="mt-6 p-4 bg-accent/20 border-l-4 border-muted-foreground/30 rounded-r-lg">
											<p className="text-muted-foreground text-sm font-medium">
												💡 {feature.callToAction}
											</p>
										</div>
									)}
								</div>

								<div
									className={
										index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
									}
								>
									{/* Media Carousel - to be filled with content later */}
									{feature.mediaItems.length > 0 ? (
										<MediaCarousel
											mediaItems={feature.mediaItems}
											className="w-full h-80"
											enableModal={true}
										/>
									) : (
										<Card className="border-0 shadow-soft h-80">
											<CardContent className="p-8 h-full flex items-center justify-center">
												<div className="text-center text-muted-foreground">
													<p>
														Media carousel placeholder - content to be added
														later
													</p>
												</div>
											</CardContent>
										</Card>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<SimpleFooter />

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
			<LegalInfoDialog
				open={showLegalDialog}
				onOpenChange={setShowLegalDialog}
				defaultTab="terms"
			/>
		</div>
	);
};

export default Lighthouse;
