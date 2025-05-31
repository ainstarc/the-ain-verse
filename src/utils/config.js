// Central configuration for the application
const config = {
  // GitHub username for fetching repositories and issues
  githubUsername: "ainstarc",

  // Social media links
  social: {
    github: "https://github.com/ainstarc",
    instagram: "#",
    youtube: "#",
    twitter: "#",
    discord: "#",
  },

  // API endpoints
  api: {
    repos: (username) =>
      `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`,
    issues: (username) =>
      `https://api.github.com/search/issues?q=user:${username}+is:issue+is:open&sort=updated&order=desc&per_page=30`,
  },
};

export default config;
