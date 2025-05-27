// imports starts

import {
    SITE_TITLE,
    PORTFOLIO_HEADER,
    INSTAGRAM_HANDLER,
    YOUTUBE_HANDLER,
    X_HANDLER,
    LINKEDIN_HANDLER,
    FACEBOOK_HANDLER,
    TIKTOK_HANDLER,
    PINTEREST_HANDLER,
    REDDIT_HANDLER,
    DISCORD_HANDLER,
    BEHANCE_HANDLER,
} from "./config";

// imports ends

export const statusDiv = document.getElementById("status");
export const repoListDiv = document.getElementById("repoList");
export const themeToggleButton = document.getElementById("theme-toggle");
export const catCallElement = document.getElementById("cat-call");
export const catAudioElement = document.getElementById("cat-sound");
export const catMoodIndicator = document.getElementById("cat-mood-indicator");
export const repoSearchInput = document.getElementById("repo-search-input");
export const bodyElement = document.body;

export function performPreFlightChecks() {
    if (!statusDiv || !repoListDiv) {
        console.error(
            "Error: Required DOM elements (#status or #repoList) not found."
        );
        if (statusDiv) {
            statusDiv.textContent =
                "❌ Critical error: Page structure is missing required elements.";
        }
        return false; // Indicate failure
    }
    return true; // Indicate success
}
