/* === customize portfolio starts === */

// mandatory (APP WON'T WORK PROPERLY IF LEFT AS EMPTY STRING!)
export const GITHUB_USERNAME = "ainstarc"; // your GitHub username
export const SITE_TITLE = "The Awesome Ain-Verse!"; // your desired site title (A.K.A: what's displayed in the browser tab)
export const PORTFOLIO_HEADER = "Enter the Ain-Verse"; // your desired portfolio header (A.K.A: what's displayed at the top of the page)

// social (recommended max. 3)
export const INSTAGRAM_HANDLER = ""; // your Instagram handler (optional)
export const YOUTUBE_HANDLER = ""; // your YouTube handler (optional)
export const X_HANDLER = ""; // your X (Twitter) handler (optional)
export const LINKEDIN_HANDLER = ""; // your LinkedIn handler (optional)
export const FACEBOOK_HANDLER = ""; // your Facebook handler (optional)
export const TIKTOK_HANDLER = ""; // your TikTok handler (optional)
export const PINTEREST_HANDLER = ""; // your Pinterest handler (optional)
export const REDDIT_HANDLER = ""; // your Reddit handler (optional)
export const DISCORD_HANDLER = ""; // your Discord username or invite code (optional)
export const BEHANCE_HANDLER = ""; // your Behance handler (optional)

/* === customize portfolio ends === */
export const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`;
export const THEME_STORAGE_KEY = "user-theme-preference";
export const GITHUB_API_ACCEPT_HEADER =
    "application/vnd.github.mercy-preview+json"; // For topics
