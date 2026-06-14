const LIGHTHOUSE_ASSET_BASE =
  "https://cdn.jsdelivr.net/gh/LetPeopleWork/Lighthouse@main/docs/assets/";

export function lighthouseAsset(path: string): string {
  return `${LIGHTHOUSE_ASSET_BASE}${path.replace(/^\//, "")}`;
}
