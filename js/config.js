/* === customize portfolio starts === */

// mandatory (APP WON'T WORK PROPERLY IF LEFT AS EMPTY STRING!)
export const GITHUB_USERNAME = "ainstarc"; // your GitHub username

// social
export const INSTAGRAM_HANDLER = ""; // your Instagram handler (optional)
export const YOUTUBE_HANDLER = ""; // your YouTube handler (optional)
export const TWITTER_HANDLER = ""; // your X (Twitter) handler (optional)
export const DISCORD_HANDLER = ""; // your Discord username or invite code (optional)

/* === customize portfolio ends === */
export const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`;
export const THEME_STORAGE_KEY = "user-theme-preference";
export const GITHUB_API_ACCEPT_HEADER =
    "application/vnd.github.mercy-preview+json"; // For topics
