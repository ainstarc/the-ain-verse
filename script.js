import { performPreFlightChecks, repoSearchInput } from "./js/domElements.js";
import { loadInitialTheme } from "./js/themeManager.js";
import {
    fetchInitialRepos,
    handleSearch,
    setupInteractiveCardListeners,
} from "./js/repoManager.js";
import { initializeCatSound } from "./js/catSoundManager.js";
import { initializeLiveIssues } from "./js/liveIssuesManager.js";
import { injectSocial } from "./js/socialManager.js";

async function initializeApp() {
    // --- PRE-FLIGHT CHECKS ---
    if (!performPreFlightChecks()) {
        return;
    }

    // --- INITIALIZE ---
    loadInitialTheme();
    await fetchInitialRepos(); // Fetch and display initial set of repos
    setupInteractiveCardListeners(); // Setup listeners after repos are on the page
    initializeLiveIssues(); // Initialize the live issues section
    initializeCatSound(); // Cat sound can be initialized after other UI elements
    injectSocial(); // Inject existing social information in "./js/config.js"

    // --- SETUP EVENT LISTENERS ---
    if (repoSearchInput) {
        repoSearchInput.addEventListener("input", (event) => {
            handleSearch(event.target.value);
        });
    }
}

document.addEventListener("DOMContentLoaded", initializeApp);
