export type ClientOs = "Windows" | "macOS" | "Linux" | "unknown";
export type LighthouseEdition = "standalone" | "server";

export const LIGHTHOUSE_GITHUB_REPO = "LetPeopleWork/Lighthouse";
export const LIGHTHOUSE_GITHUB_REPO_URL = `https://github.com/${LIGHTHOUSE_GITHUB_REPO}`;
export const LIGHTHOUSE_GITHUB_RELEASES_URL = `${LIGHTHOUSE_GITHUB_REPO_URL}/releases`;

export const LIGHTHOUSE_DOCKER_COMMAND =
	'docker run -d -p 8081:443 -p 8080:80 -v ".:/app/Data" -v "./logs:/app/logs" -e "Database__ConnectionString=Data Source=/app/Data/LighthouseAppContext.db" ghcr.io/letpeoplework/lighthouse:latest';

export function detectClientOs(): ClientOs {
	if (typeof window === "undefined") return "unknown";

	const ua = window.navigator.userAgent.toLowerCase();
	const platform =
		(window.navigator as unknown as { userAgentData?: { platform?: string } })
			.userAgentData?.platform ?? window.navigator.platform;
	const platformLower = (platform ?? "").toLowerCase();

	if (platformLower.includes("mac") || ua.includes("mac os")) return "macOS";
	if (platformLower.includes("win") || ua.includes("windows")) return "Windows";
	if (platformLower.includes("linux") || ua.includes("linux")) return "Linux";

	return "unknown";
}

export function getReleaseAssetUrl(tag: string, assetName: string): string {
	return `https://github.com/${LIGHTHOUSE_GITHUB_REPO}/releases/download/${tag}/${assetName}`;
}

export function getStandaloneAssetNameForOs(os: ClientOs): string | undefined {
	switch (os) {
		case "Windows":
			return "Lighthouse-win-standalone-x64.exe";
		case "macOS":
			return "Lighthouse-osx.dmg";
		case "Linux":
			return "Lighthouse-linux-standalone.AppImage";
		default:
			return undefined;
	}
}

export function getServerAssetNameForOs(os: ClientOs): string | undefined {
	switch (os) {
		case "Windows":
			return "Lighthouse-win-x64.zip";
		case "Linux":
			return "Lighthouse-linux-x64.zip";
		case "macOS":
			return undefined;
		default:
			return undefined;
	}
}

export function getQuickDownloadUrl(
	edition: LighthouseEdition,
	os: ClientOs,
	tag: string,
): string | undefined {
	const assetName =
		edition === "standalone"
			? getStandaloneAssetNameForOs(os)
			: getServerAssetNameForOs(os);

	if (!assetName) return undefined;
	return getReleaseAssetUrl(tag, assetName);
}
