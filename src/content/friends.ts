import ThrivveLogo from "@/assets/friends/thrivve-partners.svg";
import LilAgileMonsterLogo from "@/assets/friends/lil-agile-monster.png";
import friendsData from "./friends.json";

// Friends of LetPeopleWork (FriendsSection): the text lives in friends.json,
// the logo files in src/assets/friends/ and are mapped here by file name.
const LOGOS: Record<string, string> = {
  "thrivve-partners.svg": ThrivveLogo,
  "lil-agile-monster.png": LilAgileMonsterLogo,
};
export const friends = friendsData.map((f) => ({ ...f, image: LOGOS[f.logo] }));
