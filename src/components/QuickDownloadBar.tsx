import { useState, useEffect } from "react";
import { Download, Monitor, Container, Copy, Check, Command, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	detectClientOs,
	getQuickDownloadUrlFromAssets,
	LIGHTHOUSE_DOCKER_COMMAND,
	LIGHTHOUSE_GITHUB_RELEASES_URL,
	type ClientOs,
	type ReleaseAsset,
} from "@/lib/lighthouseDownloads";
import { trackDownload, trackEvent } from "@/lib/plausible";

interface AdditionalLink {
	name: string;
	url: string;
	external?: boolean;
}

interface QuickDownloadBarProps {
	additionalLink: AdditionalLink;
	/** Where this bar sits, sent to analytics (e.g. "lighthouse-hero", "home"). */
	source?: string;
}

const WindowsIcon = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
		<path d="M0 0h11.4v11.4H0ZM12.6 0H24v11.4H12.6ZM0 12.6h11.4V24H0ZM12.6 12.6H24V24H12.6Z" />
	</svg>
);

const OsChip = ({ os, ext }: { os: ClientOs; ext: string }) => (
	<span className="ml-2 flex items-center gap-1 opacity-60 text-xs border-l border-current/30 pl-2">
		{os === "Windows" && <WindowsIcon className="h-3 w-3" />}
		{os === "macOS" && <Command className="h-3 w-3" />}
		{os === "Linux" && <Terminal className="h-3 w-3" />}
	    {os} ({ext})
	</span>
);

const QuickDownloadBar = ({ additionalLink, source }: QuickDownloadBarProps) => {
	const [latestVersion, setLatestVersion] = useState("");
	const [releaseAssets, setReleaseAssets] = useState<ReleaseAsset[]>([]);
	const [isLoadingVersion, setIsLoadingVersion] = useState(false);
	const [copiedCommand, setCopiedCommand] = useState(false);
	const [clientOs, setClientOs] = useState<ClientOs>("unknown");

	useEffect(() => {
		const fetchLatestVersion = async () => {
			setIsLoadingVersion(true);
			try {
				const response = await fetch(
					"https://api.github.com/repos/LetPeopleWork/Lighthouse/releases/latest",
				);
				const data = await response.json();
				setLatestVersion(data.tag_name);
				setReleaseAssets(data.assets ?? []);
			} catch {
				setLatestVersion("v25.7.27.1729");
			} finally {
				setIsLoadingVersion(false);
			}
		};
		fetchLatestVersion();
	}, []);

	useEffect(() => {
		setClientOs(detectClientOs());
	}, []);

	const copyToClipboard = async (text: string) => {
		try {
			if (navigator.clipboard && globalThis.isSecureContext) {
				await navigator.clipboard.writeText(text);
			} else {
				const el = document.createElement("textarea");
				el.value = text;
				el.style.position = "fixed";
				el.style.left = "-999999px";
				el.style.top = "-999999px";
				document.body.appendChild(el);
				el.focus();
				el.select();
				document.execCommand("copy");
				el.remove();
			}
			setCopiedCommand(true);
			setTimeout(() => setCopiedCommand(false), 2000);
		} catch {
			// silent fail — user can copy manually
		}
	};

	const openQuickDownload = (edition: "standalone" | "server") => {
		trackDownload({ edition, platform: clientOs, source });
		const url = getQuickDownloadUrlFromAssets(edition, clientOs, releaseAssets);
		window.open(url ?? LIGHTHOUSE_GITHUB_RELEASES_URL, "_blank");
	};

	let standaloneExt: string | null = null;
	if (clientOs === "Windows") standaloneExt = ".exe";
	else if (clientOs === "macOS") standaloneExt = ".dmg";
	else if (clientOs === "Linux") standaloneExt = ".AppImage";

	const serverOsLabel =
		clientOs === "Windows" || clientOs === "Linux" ? { ext: ".zip" } : null;

	return (
		<div className="flex flex-col sm:flex-row gap-4 justify-center">
			<Button
				variant="hero"
				size="lg"
				disabled={isLoadingVersion}
				onClick={() => openQuickDownload("standalone")}
				aria-label="Quick download: Standalone"
			>
				<Download className="mr-2 h-4 w-4" />
				Standalone
				{standaloneExt && <OsChip os={clientOs} ext={standaloneExt} />}
			</Button>
			<Button
				variant="outline"
				size="lg"
				disabled={clientOs === "macOS" || isLoadingVersion}
				onClick={() => openQuickDownload("server")}
				aria-label="Quick download: Server"
				title={clientOs === "macOS" ? "Server is not available on macOS" : undefined}
			>
				<Monitor className="mr-2 h-4 w-4" />
				Server
				{serverOsLabel && <OsChip os={clientOs} ext={serverOsLabel.ext} />}
				{clientOs === "macOS" && (
					<span className="ml-2 text-xs opacity-50">n/a on macOS</span>
				)}
			</Button>
			<Button
				variant="outline"
				size="lg"
				onClick={() => {
					trackEvent("Docker command copied", { source: source ?? "unknown" });
					copyToClipboard(LIGHTHOUSE_DOCKER_COMMAND);
				}}
				aria-label="Copy Docker command"
			>
				<Container className="mr-2 h-4 w-4" />
				Docker
				{copiedCommand ? (
					<Check className="ml-2 h-4 w-4 text-green-500" />
				) : (
					<Copy className="ml-2 h-4 w-4" />
				)}
			</Button>
			<Button variant="outline" size="lg" asChild>
				{additionalLink.external ? (
					<a href={additionalLink.url} target="_blank" rel="noopener noreferrer">
						{additionalLink.name}
					</a>
				) : (
					<a href={additionalLink.url}>{additionalLink.name}</a>
				)}
			</Button>
		</div>
	);
};

export default QuickDownloadBar;
