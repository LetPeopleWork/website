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
import { format } from "date-fns";
import metricsTeam1 from "@/assets/screenshots/Metrics_Team_1.png";
import metricsProject1 from "@/assets/screenshots/Metrics_Project_1.png";
import forecastsTeamManual from "@/assets/screenshots/Forecasts_Team_Manual.png";
import forecastsProject from "@/assets/screenshots/Forecasts_Project.png";
import metricsTeamVideo from "@/assets/videos/Metrics_Team.mp4";
import metricsProjectVideo from "@/assets/videos/Metrics_Projects.mp4";
import forecastsTeamVideo from "@/assets/videos/Forecasts_Team.mp4";
import forecastsProjectVideo from "@/assets/videos/Forecasts_Project.mp4";
import almConnectionImage from "@/assets/screenshots/ALM_Connection.png";
import queryConfigurationImage from "@/assets/screenshots/Query_Configuration.png";
import gitHubImage from "@/assets/screenshots/GitHub.png";
import {
	findAssetByPattern,
	LIGHTHOUSE_DOCKER_COMMAND,
	LIGHTHOUSE_GITHUB_RELEASES_URL,
	type ReleaseAsset,
} from "@/lib/lighthouseDownloads";
import QuickDownloadBar from "@/components/QuickDownloadBar";

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
			"MSI installer for Windows — useful for enterprise deployment. Code signed.",
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
			"Portable AppImage — runs on most Linux distributions without installation.",
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
      
      You have access to all the metrics that are relevant for a deep analysis, can filter the date range you look at, and drill down to the specific items including direct links to your connected systems.
      
      If you want to work data-driven, these are the metrics you need. And Lighthouse is the tool you want to visualize them!`,
			callToAction: "Miss some specific Metric or Chart? Reach out!",
			mediaItems: [
				{
					type: "image" as const,
					src: metricsTeam1,
					alt: "Team Metrics",
				},
				{
					type: "image" as const,
					src: metricsProject1,
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
					src: forecastsTeamManual,
					alt: "Team Forecasts",
				},
				{
					type: "image" as const,
					src: forecastsProject,
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
			title: "Integrate with most popular ALM Tools",
			description:
				"No need to maintain multiple data sources - Lighthouse connects to Jira and Azure DevOps",
			extendedDescription: `You don't want to maintain your data in yet another tool. This is why Lighthouse is connected to what you are already using.
      
      Its flexible design allows Lighthouse to connect with your data source, independent how you designed it. Using custom fields or labels? Have some special filters you want to apply? Lighthouse can cope with that!`,
			callToAction: "Your System is not supported? Let us know!",
			mediaItems: [
				{
					type: "image" as const,
					src: almConnectionImage,
					alt: "ALM Connection",
				},
				{
					type: "image" as const,
					src: queryConfigurationImage,
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
				name: "Community Version",
				price: "0",
				priceCurrency: "CHF",
				description: "Free forever community version with core features",
			},
			{
				"@type": "Offer",
				name: "Premium License",
				price: "999",
				priceCurrency: "CHF",
				description:
					"Annual premium license with unlimited teams and advanced features",
			},
		],
		description:
			"Open-source flow metrics and forecasting tool for agile teams. Visualize flow metrics, forecast delivery dates using Monte Carlo simulations, and integrate with Jira and Azure DevOps.",
		featureList: [
			"Flow Metrics Visualization",
			"Monte Carlo Forecasting",
			"Jira Integration",
			"Azure DevOps Integration",
			"Team and Portfolio Level Analytics",
			"Throughput Analysis",
			"Cycle Time Tracking",
			"Lead Time Metrics",
			"Work In Progress Limits",
			"Deliveries",
		],
		screenshot: "https://letpeople.work/forecasts-project.png",
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "5",
			ratingCount: "1",
			bestRating: "5",
		},
		review: {
			"@type": "Review",
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
				"Lighthouse helped us be more on to it. We're now more predictable, efficient, and responsive when it comes to delivering value and serving our customers.",
		},
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
				description="Lighthouse is an open-source tool for visualizing flow metrics and forecasting delivery dates using Monte Carlo simulations. Connect to Jira & Azure DevOps for data-driven agile insights. Free community version available."
				keywords="lighthouse flow metrics, agile forecasting tool, Monte Carlo simulation, delivery forecasting, when will it be done, how much can we do, Jira flow metrics, Azure DevOps metrics, throughput, cycle time, lead time, WIP, work in progress, team velocity, sprint forecasting, agile metrics dashboard, kanban metrics, scrum metrics, project forecasting, portfolio forecasting, open source agile, predictability, agile analytics"
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
							Make your Flow transparent from team to portfolio level. Get
							data-driven insights instead of gut feelings. Forecast delivery
							dates in seconds based on your real performance and drive
							actionable improvements.
						</p>

						{/* Download CTA */}
						<div className="mb-8">
							<QuickDownloadBar
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
																	copyToClipboard(LIGHTHOUSE_DOCKER_COMMAND);
																} else {
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
							Discover how Lighthouse can transform your flow metrics and
							forecasting
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

			{/* Why Premium Section */}
			<section id="lighthouse-premium" className="py-20 bg-gradient-subtle">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
							Lighthouse{" "}
							<span className="bg-gradient-primary bg-clip-text text-transparent">
								Premium
							</span>
						</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
							While our Community Version provides all the features you need to
							analyze the flow and forecast delivery dates, Premium unlocks
							enterprise-grade capabilities that help you scale the usage and
							adoption within your organization and thus lead to a scaled
							learning.
						</p>
					</div>

					{/* Comparison Table */}
					<div className="bg-background rounded-2xl p-8 shadow-soft border border-border">
						<h3 className="text-2xl font-bold text-foreground mb-8 text-center">
							Community vs Premium Comparison
						</h3>

						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-border">
										<th className="text-left py-4 px-4 font-semibold text-foreground">
											Feature
										</th>
										<th className="text-center py-4 px-4 font-semibold text-foreground">
											Community Version
										</th>
										<th className="text-center py-4 px-4 font-semibold text-foreground bg-gradient-primary bg-clip-text text-transparent">
											Premium Version
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border">
									{/* Base Functionality */}
									<tr>
										<td
											colSpan={3}
											className="py-4 px-4 font-semibold text-foreground bg-accent/30"
										>
											Base Functionality
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											Flow Metrics for Teams
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											Flow Metrics for Projects
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											Manual Forecasts for Teams
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											Continuous Forecasts for Projects
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											100% Open Source (MIT License)
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											Connection to Jira and Azure DevOps
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											<div className="flex items-center space-x-2">
												<span>AI &amp; LLM Integration</span>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger>
															<Info className="h-4 w-4 text-blue-500" />
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-sm">
																Connect Lighthouse to Claude, ChatGPT, or any
																MCP-compatible AI assistant. Query metrics, run
																forecasts, and explore delivery data through
																natural language — no dashboard required.
															</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											<div className="flex items-center space-x-2">
												<span>CLI &amp; Automation</span>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger>
															<Info className="h-4 w-4 text-blue-500" />
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-sm">
																Automate metrics collection and forecasting via
																the <code>lh</code> CLI or the MCP server.
																Integrate Lighthouse data into scripts, CI/CD
																pipelines, and custom tooling.
															</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
									</tr>

									{/* Constraints in Community Version */}
									<tr>
										<td
											colSpan={3}
											className="py-4 px-4 font-semibold text-foreground bg-accent/30"
										>
											Usage Limits
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											Number of Teams
										</td>
										<td className="py-3 px-4 text-center text-muted-foreground">
											Max 3
										</td>
										<td className="py-3 px-4 text-center text-foreground font-semibold bg-gradient-primary bg-clip-text text-transparent">
											Unlimited
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											Number of Portfolios
										</td>
										<td className="py-3 px-4 text-center text-muted-foreground">
											Max 1
										</td>
										<td className="py-3 px-4 text-center text-foreground font-semibold bg-gradient-primary bg-clip-text text-transparent">
											Unlimited
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											CSV Support
										</td>
										<td className="py-3 px-4 text-center text-muted-foreground">
											Max 1 Team
										</td>
										<td className="py-3 px-4 text-center text-foreground font-semibold bg-gradient-primary bg-clip-text text-transparent">
											Unlimited Teams and Portfolios
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											Demo Data
										</td>
										<td className="py-3 px-4 text-center text-muted-foreground">
											Basic Scenarios
										</td>
										<td className="py-3 px-4 text-center text-foreground font-semibold bg-gradient-primary bg-clip-text text-transparent">
											Advanced Scenarios
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											Deliveries
										</td>
										<td className="py-3 px-4 text-center text-muted-foreground">
											1 Delivery
										</td>
										<td className="py-3 px-4 text-center text-foreground font-semibold bg-gradient-primary bg-clip-text text-transparent">
											Unlimited
										</td>
									</tr>

									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											<div className="flex items-center space-x-2">
												<span>Additional Fields</span>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger>
															<Info className="h-4 w-4 text-blue-500" />
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-sm">
																Add custom fields to capture additional metadata
																specific to your workflow and requirements.
															</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</td>
										<td className="py-3 px-4 text-center text-muted-foreground">
											1 Additional Field
										</td>
										<td className="py-3 px-4 text-center text-foreground font-semibold bg-gradient-primary bg-clip-text text-transparent">
											Unlimited
										</td>
									</tr>
									{/* Premium Features */}
									<tr>
										<td
											colSpan={3}
											className="py-4 px-4 font-semibold text-foreground bg-accent/30"
										>
											Premium-Only Features
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											<div className="flex items-center space-x-2">
												<span>Rule-Based Deliveries</span>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger>
															<Info className="h-4 w-4 text-blue-500" />
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-sm">
																Define rules to automatically include your
																Features based on criteria like labels,
																fixVersion, or custom fields, ensuring your
																deliveries are always up-to-date without manual
																updating.
															</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</td>
										<td className="py-3 px-4 text-center">
											<XCircle className="h-5 w-5 text-red-500 mx-auto" />
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
									</tr>
									<tr>
										<tr>
											<td className="py-3 px-4 text-muted-foreground">
												<div className="flex items-center space-x-2">
													<span> Blackout Days</span>
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger>
																<Info className="h-4 w-4 text-blue-500" />
															</TooltipTrigger>
															<TooltipContent>
																<p className="text-sm">
																	Define days which should not be counted in the
																	Throughput for calculating forecasts, for
																	example bank holidays.
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</div>
											</td>
										</tr>
										<td className="py-3 px-4 text-center">
											<XCircle className="h-5 w-5 text-red-500 mx-auto" />
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											<div className="flex items-center space-x-2">
												<span>Data Export &amp; Sharing</span>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger>
															<Info className="h-4 w-4 text-blue-500" />
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-sm">
																Export flow metrics data to CSV or clipboard for
																sharing via email or custom analysis
															</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</td>
										<td className="py-3 px-4 text-center">
											<XCircle className="h-5 w-5 text-red-500 mx-auto" />
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
									</tr>
									{/* Data Sync Mappings - Premium Only */}
									<tr>
										<td className="py-3 px-4 text-muted-foreground">
											<div className="flex items-center space-x-2">
												<span>Data Sync Mappings</span>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger>
															<Info className="h-4 w-4 text-blue-500" />
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-sm">
																Write Metrics and Forecasts back to Jira and
																Azure DevOps and store them in your system.
															</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</td>
										<td className="py-3 px-4 text-center">
											<XCircle className="h-5 w-5 text-red-500 mx-auto" />
										</td>
										<td className="py-3 px-4 text-center">
											<Check className="h-5 w-5 text-green-600 mx-auto" />
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div className="mt-6 p-4 bg-accent/20 rounded-lg">
							<p className="text-sm text-muted-foreground">
								<span className="font-semibold text-foreground">Note:</span> New
								premium features may be introduced as premium-only for the first
								few months before being made available to the Community Version,
								ensuring premium users get early access to cutting-edge
								capabilities.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* License Purchase Section */}
			<section id="lighthouse-license" className="py-20 bg-background">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
							Get Your{" "}
							<span className="bg-gradient-primary bg-clip-text text-transparent">
								Premium License
							</span>
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Purchase your Lighthouse Premium license and unlock the full
							potential of your organization.
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
									<h3 className="text-2xl font-bold text-foreground mb-4">
										Lighthouse Premium License
									</h3>
									<p className="text-muted-foreground mb-2">
										Valid for one year from the date of purchase
									</p>
									<div className="text-sm text-muted-foreground mb-6">
										<p className="mb-2">
											Please contact us at licensing@letpeople.work if you:
										</p>
										<ul className="space-y-1 ml-4">
											<li>• Are interested in a trial license</li>
											<li>
												• Want to explore a pricing reduction or a custom
												enterprise agreements
											</li>
											<li>• Need a custom invoice</li>
											<li>• Have any other license related question</li>
										</ul>
									</div>

									<div className="mb-6">
										<div className="text-4xl font-bold text-foreground mb-2">
											CHF 999{" "}
											<span className="text-lg font-normal text-muted-foreground">
												.-
											</span>
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
							Lighthouse exposes your flow data through three integration points — pick the one that fits your setup. Works with any AI that supports tool calling. No vendor lock-in.
						</p>
					</div>

					{/* Three method cards */}
					<div className="grid md:grid-cols-3 gap-6 mb-16">
						<div className="rounded-xl bg-white/10 border border-white/20 p-6">
							<div className="text-xs font-bold uppercase tracking-wider text-green-300 mb-3">CLI</div>
							<h3 className="text-lg font-semibold text-primary-foreground mb-2">Shell & Scripts</h3>
							<p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
								Use the Lighthouse CLI in shell scripts, CI jobs, or any terminal-capable agent. Outputs JSON for easy integration with existing pipelines.
							</p>
							<code className="block text-xs bg-black/30 text-green-300 rounded-lg px-3 py-2 font-mono">
								npm install -g @letpeoplework/lighthouse-cli
							</code>
						</div>

						<div className="rounded-xl bg-white/15 border border-white/30 p-6 ring-1 ring-white/20">
							<div className="text-xs font-bold uppercase tracking-wider text-green-300 mb-3">MCP stdio · Most Popular</div>
							<h3 className="text-lg font-semibold text-primary-foreground mb-2">Local AI Clients</h3>
							<p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
								Connect VS Code, GitHub Copilot, Claude Code, or any local AI tool via the MCP stdio package. Or drop the <span className="text-green-300 font-mono">.mcpb</span> bundle directly into your client — no npm required.
							</p>
							<code className="block text-xs bg-black/30 text-green-300 rounded-lg px-3 py-2 font-mono">
								@letpeoplework/lighthouse-mcp-stdio
							</code>
						</div>

						<div className="rounded-xl bg-white/10 border border-white/20 p-6">
							<div className="text-xs font-bold uppercase tracking-wider text-green-300 mb-3">MCP HTTP</div>
							<h3 className="text-lg font-semibold text-primary-foreground mb-2">Shared & Hosted</h3>
							<p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
								Run the HTTP server for shared team setups, container deployments, or remote development environments. Exposes a standard <span className="text-green-300 font-mono">/mcp</span> endpoint.
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
								<span className="text-xs text-white/40 ml-2 font-mono">.vscode/mcp.json</span>
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
								<h4 className="text-sm font-semibold text-primary-foreground mb-1">Agent Skill</h4>
								<p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
									A pre-built skill that teaches your AI agent when and how to use Lighthouse tools — including fallbacks and authentication. Drop it into Claude Code, VS Code, or any skill-compatible agent.
								</p>
								<a
									href="https://docs.lighthouse.letpeople.work/aiintegration.html"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 text-sm font-medium text-green-300 hover:text-green-200 transition-colors"
								>
									Download lighthouse-skill.zip
									<ArrowRight className="w-4 h-4" />
								</a>
							</div>

							<div className="rounded-xl bg-white/10 border border-white/20 p-6">
								<h4 className="text-sm font-semibold text-primary-foreground mb-1">MCPB Bundle</h4>
								<p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
									A single-file bundle for clients that support the MCPB format. No npm install, no configuration — just drop it in and connect.
								</p>
								<a
									href="https://docs.lighthouse.letpeople.work/aiintegration.html"
									target="_blank"
									rel="noopener noreferrer"
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
