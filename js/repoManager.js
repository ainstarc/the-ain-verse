import {
    GITHUB_USERNAME,
    API_URL,
    GITHUB_API_ACCEPT_HEADER,
} from "./config.js";
import { statusDiv, repoListDiv } from "./domElements.js";

let allFetchedRepos = []; // Cache for all fetched repositories
let currentSearchTerm = ""; // Stores the current search term

function getGhPagesUrl(repoData) {
    if (
        repoData.homepage &&
        typeof repoData.homepage === "string" &&
        repoData.homepage.trim() !== "" &&
        (repoData.homepage.startsWith("http://") ||
            repoData.homepage.startsWith("https://"))
    ) {
        return repoData.homepage;
    }
    if (
        repoData.name.toLowerCase() ===
        `${GITHUB_USERNAME.toLowerCase()}.github.io`
    ) {
        return `https://${GITHUB_USERNAME.toLowerCase()}.github.io/`;
    }
    return `https://${GITHUB_USERNAME.toLowerCase()}.github.io/${
        repoData.name
    }/`;
}

function createRepoCardElement(repo) {
    const repoCard = document.createElement("div");
    repoCard.className = "repo-card";

    const repoNameLink = document.createElement("a");
    repoNameLink.href = repo.html_url;
    repoNameLink.textContent = repo.name;
    repoNameLink.target = "_blank";
    repoNameLink.rel = "noopener noreferrer";

    const repoNameHeading = document.createElement("h3");
    repoNameHeading.appendChild(repoNameLink);
    repoCard.appendChild(repoNameHeading);

    // Add status indicators (Archived, Empty)
    const repoStatusIndicatorsDiv = document.createElement("div");
    repoStatusIndicatorsDiv.className = "repo-status-indicators";

    if (repo.archived) {
        repoCard.classList.add("repo-card--archived");
        const archivedIndicator = document.createElement("span");
        archivedIndicator.className =
            "repo-status-indicator repo-status-indicator--archived";
        archivedIndicator.innerHTML = '<i class="fas fa-archive"></i> Archived';
        repoStatusIndicatorsDiv.appendChild(archivedIndicator);
    } else if (repo.size === 0) {
        // Show "Empty" only if not archived (repo.size is in KB)
        repoCard.classList.add("repo-card--empty");
        const emptyIndicator = document.createElement("span");
        emptyIndicator.className =
            "repo-status-indicator repo-status-indicator--empty";
        emptyIndicator.innerHTML = '<i class="far fa-folder-open"></i> Empty'; // Using Font Awesome 'far fa-folder-open'
        repoStatusIndicatorsDiv.appendChild(emptyIndicator);
    }

    if (repoStatusIndicatorsDiv.hasChildNodes()) {
        repoCard.appendChild(repoStatusIndicatorsDiv);
    }

    const cardActionsDiv = document.createElement("div");
    cardActionsDiv.className = "repo-card-actions";

    if (repo.has_pages) {
        const pagesUrl = getGhPagesUrl(repo);
        if (pagesUrl) {
            repoCard.classList.add("repo-card--has-pages-preview");
            repoCard.dataset.pagesUrl = pagesUrl;
            repoCard.title = `Click to preview ${repo.name} GitHub Pages`;

            const pagesLinkIcon = document.createElement("a"); // This is the icon link
            pagesLinkIcon.href = pagesUrl;
            pagesLinkIcon.innerHTML =
                '<i class="fas fa-external-link-alt"></i>';
            pagesLinkIcon.target = "_blank";
            pagesLinkIcon.rel = "noopener noreferrer";
            pagesLinkIcon.className = "repo-action-icon repo-gh-pages-icon";
            pagesLinkIcon.title = `View GitHub Pages for ${repo.name}`;
            pagesLinkIcon.setAttribute(
                "aria-label",
                `View GitHub Pages for ${repo.name}`
            );
            pagesLinkIcon.onclick = (e) => e.stopPropagation(); // Prevent card click when icon is clicked
            cardActionsDiv.appendChild(pagesLinkIcon);
        }
    }

    const issuesLink = document.createElement("a");
    issuesLink.href = `${repo.html_url}/issues/`;
    issuesLink.innerHTML = `<span class="bug-count-number">${repo.open_issues_count}</span>`;
    issuesLink.target = "_blank";
    issuesLink.rel = "noopener noreferrer";
    issuesLink.className = "repo-action-icon repo-issues-icon";
    issuesLink.title = `View ${repo.open_issues_count} open issues or report a new one for ${repo.name}`;
    issuesLink.setAttribute(
        "aria-label",
        `View ${repo.open_issues_count} open issues or report a new issue for ${repo.name}`
    );
    issuesLink.onclick = (e) => e.stopPropagation(); // Prevent card click when icon is clicked
    cardActionsDiv.appendChild(issuesLink);
    repoCard.appendChild(cardActionsDiv);

    if (repo.description) {
        const descP = document.createElement("p");
        descP.className = "repo-description";
        descP.textContent = repo.description;
        repoCard.appendChild(descP);
    }

    const metaDiv = document.createElement("div");
    metaDiv.className = "repo-meta";

    // --- Language Display Section ---
    const langSpan = document.createElement("span");
    langSpan.className = "repo-language"; // Keep existing class for styling consistency
    metaDiv.appendChild(langSpan); // Add to metaDiv, content will be populated

    // Helper to set the language display content
    const setLanguageDisplay = (htmlContent, isEmpty = false) => {
        if (isEmpty) {
            langSpan.style.display = "none";
        } else {
            langSpan.innerHTML = htmlContent;
            langSpan.style.display = ""; // Ensure it's visible
        }
    };

    if (repo.languages_url) {
        setLanguageDisplay(
            `<i class="fas fa-spinner fa-spin" title="Loading languages..."></i>`
        ); // Initial loading state
        fetch(repo.languages_url, {
            headers: { Accept: GITHUB_API_ACCEPT_HEADER },
        })
            .then((response) => {
                if (!response.ok)
                    throw new Error(
                        `HTTP error ${response.status} fetching languages`
                    );
                return response.json();
            })
            .then((languagesData) => {
                const sortedLanguages = Object.entries(languagesData)
                    .sort(([, bytesA], [, bytesB]) => bytesB - bytesA)
                    .slice(0, 3);

                if (sortedLanguages.length > 0) {
                    let content = `<i class="fas fa-laptop-code"></i> `;
                    content += sortedLanguages.map(([lang]) => lang).join(", ");
                    setLanguageDisplay(content);
                } else if (repo.language) {
                    // Fallback if languages_url returns empty but primary lang exists
                    setLanguageDisplay(
                        `<i class="fas fa-laptop-code"></i> ${repo.language}`
                    );
                } else {
                    setLanguageDisplay("", true); // Hide if no languages found
                }
            })
            .catch((error) => {
                console.warn(
                    `Could not fetch languages for ${repo.name}: ${error.message}`
                );
                if (repo.language) {
                    // Fallback to primary language on error
                    setLanguageDisplay(
                        `<i class="fas fa-laptop-code"></i> ${repo.language}`
                    );
                } else {
                    setLanguageDisplay("", true); // Hide on error if no fallback
                }
            });
    } else if (repo.language) {
        // If no languages_url, just use repo.language
        setLanguageDisplay(
            `<i class="fas fa-laptop-code"></i> ${repo.language}`
        );
    } else {
        // No languages_url and no primary language
        setLanguageDisplay("", true); // Hide the language span
    }
    // --- End Language Display Section ---

    const starsSpan = document.createElement("span");
    starsSpan.className = "repo-stars";
    starsSpan.innerHTML = `<i class="fas fa-star"></i> ${repo.stargazers_count}`;
    metaDiv.appendChild(starsSpan);
    const forksSpan = document.createElement("span");
    forksSpan.className = "repo-forks";
    forksSpan.innerHTML = `<i class="fas fa-code-branch"></i> ${repo.forks_count}`;
    metaDiv.appendChild(forksSpan);
    repoCard.appendChild(metaDiv);

    if (repo.topics && repo.topics.length > 0) {
        const topicsDiv = document.createElement("div");
        topicsDiv.className = "repo-topics";
        const labelStrong = document.createElement("strong");
        labelStrong.textContent = "Topics: ";
        topicsDiv.appendChild(labelStrong);

        // Show up to the first 3 topics as badges
        const topicsToDisplay = repo.topics.slice(0, 3);

        topicsToDisplay.forEach((topic) => {
            const topicSpan = document.createElement("span");
            topicSpan.className = "repo-topic";
            topicSpan.textContent = topic;
            topicsDiv.appendChild(topicSpan);
        });
        repoCard.appendChild(topicsDiv);
    }
    return repoCard;
}

// Renders the provided list of repositories to the DOM and updates status.
function renderReposToDOM(reposToDisplay) {
    repoListDiv.innerHTML = ""; // Clear previous list

    if (reposToDisplay.length === 0) {
        if (currentSearchTerm) {
            statusDiv.textContent = `🤷 No repositories found matching "${currentSearchTerm}".`;
        } else if (
            allFetchedRepos.length === 0 &&
            !statusDiv.textContent.startsWith("❌ Error")
        ) {
            // This case is when initial fetch yielded no repos (not an error state)
            // statusDiv should already be set by fetchInitialRepos, e.g., "🤷 No public repositories found."
            // If statusDiv is empty here, it means fetchInitialRepos found repos, but then allFetchedRepos was cleared somehow.
            // For safety, if allFetchedRepos is empty and no search term, and no error, set a generic message.
            if (!statusDiv.textContent)
                statusDiv.textContent = "🤷 No repositories found.";
        }
        // If there's an error message, it should persist.
    } else {
        statusDiv.textContent = ""; // Clear status message if repos are displayed
    }

    const fragment = document.createDocumentFragment();
    reposToDisplay.forEach((repo) => {
        const repoCard = createRepoCardElement(repo);
        fragment.appendChild(repoCard);
    });
    repoListDiv.appendChild(fragment);
}

function closePagesPreviewModal() {
    const modal = document.getElementById("pages-preview-modal");
    if (modal) {
        modal.remove();
        document.body.classList.remove("modal-open");
        // Remove active state from any card that might have triggered it
        document
            .querySelectorAll(".repo-card--preview-active")
            .forEach((card) => {
                card.classList.remove("repo-card--preview-active");
            });
    }
}

function togglePagesPreview(event) {
    const repoCard = event.currentTarget;
    // Ensure we don't trigger preview if an action icon within the card was clicked
    if (event.target.closest(".repo-action-icon")) {
        return;
    }
    const pagesUrl = repoCard.dataset.pagesUrl;

    if (!pagesUrl) return;

    // Close any other active preview modal first
    const existingModal = document.getElementById("pages-preview-modal");
    if (existingModal) {
        const isActiveForThisCard = repoCard.classList.contains(
            "repo-card--preview-active"
        );
        closePagesPreviewModal(); // This will remove active class from all cards
        if (isActiveForThisCard) {
            // If we just closed the modal for this card, don't reopen it immediately
            return;
        }
    }

    // repoCard.classList.add("repo-card--preview-active"); // Will be added by showPagesPreviewModal
    showPagesPreviewModal(
        pagesUrl,
        repoCard.querySelector("h3 a").textContent,
        repoCard
    );
}

function showPagesPreviewModal(pagesUrl, repoName, originatingCard) {
    closePagesPreviewModal(); // Ensure no other modal is open

    const modalOverlay = document.createElement("div");
    modalOverlay.id = "pages-preview-modal";
    modalOverlay.className = "modal-overlay pages-preview-modal-overlay";
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) {
            closePagesPreviewModal();
        }
    };

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content pages-preview-modal-content";

    const iframe = document.createElement("iframe");
    iframe.className = "pages-iframe";
    iframe.src = pagesUrl;
    iframe.sandbox = "allow-scripts allow-same-origin allow-popups allow-forms";
    iframe.title = `${repoName} GitHub Pages Preview`;
    iframe.setAttribute("loading", "lazy");

    const closeButton = document.createElement("button");
    closeButton.className = "modal-close-btn pages-preview-close-btn";
    closeButton.innerHTML = "&times;";
    closeButton.setAttribute("aria-label", "Close preview");
    closeButton.onclick = (e) => {
        e.stopPropagation();
        closePagesPreviewModal();
    };

    modalContent.appendChild(closeButton);
    modalContent.appendChild(iframe);
    modalOverlay.appendChild(modalContent);

    document.body.appendChild(modalOverlay);
    document.body.classList.add("modal-open");
    closeButton.focus();

    if (originatingCard)
        originatingCard.classList.add("repo-card--preview-active");
}

export function setupInteractiveCardListeners() {
    repoListDiv.addEventListener("click", function (event) {
        const card = event.target.closest(".repo-card--has-pages-preview");
        if (card) {
            togglePagesPreview({ currentTarget: card, target: event.target });
        }
    });

    repoListDiv.addEventListener("mouseover", function (event) {
        const card = event.target.closest(".repo-card--has-pages-preview");
        if (card && !card.classList.contains("repo-card--preview-active")) {
            card.classList.add("repo-card--hover-pop");
        }
    });
    repoListDiv.addEventListener("mouseout", function (event) {
        const card = event.target.closest(".repo-card--has-pages-preview");
        if (card) {
            card.classList.remove("repo-card--hover-pop");
        }
    });
}

// Filters `allFetchedRepos` based on `currentSearchTerm` and renders them.
export function filterAndRenderRepos() {
    let reposToDisplay = allFetchedRepos;

    if (currentSearchTerm) {
        reposToDisplay = allFetchedRepos.filter((repo) => {
            const nameMatch = repo.name
                .toLowerCase()
                .includes(currentSearchTerm);
            const descriptionMatch =
                repo.description &&
                repo.description.toLowerCase().includes(currentSearchTerm);
            const topicsMatch =
                repo.topics &&
                repo.topics.some((topic) =>
                    topic.toLowerCase().includes(currentSearchTerm)
                );
            return nameMatch || descriptionMatch || topicsMatch;
        });
    }
    renderReposToDOM(reposToDisplay);
}

// Called by the search input event listener in script.js
export function handleSearch(searchTerm) {
    currentSearchTerm = searchTerm.toLowerCase().trim();
    filterAndRenderRepos();
}

// Fetches repositories from GitHub, caches them, and then renders them.
export async function fetchInitialRepos() {
    statusDiv.textContent = "🔄 Loading projects...";
    statusDiv.style.color = ""; // Reset color
    repoListDiv.innerHTML = ""; // Clear list while loading

    try {
        const response = await fetch(API_URL, {
            headers: { Accept: GITHUB_API_ACCEPT_HEADER },
        });
        if (!response.ok) {
            const errorData = await response
                .json()
                .catch(() => ({ message: response.statusText }));
            throw new Error(
                `GitHub API Error: ${response.status} - ${
                    errorData.message || "Unknown error"
                }`
            );
        }
        allFetchedRepos = await response.json();

        if (!Array.isArray(allFetchedRepos)) {
            // Should not happen with GitHub API
            allFetchedRepos = []; // Ensure it's an array
            throw new Error("Received unexpected data format from API.");
        }

        if (allFetchedRepos.length === 0) {
            statusDiv.textContent = "🤷 No public repositories found.";
            // repoListDiv is already clear
        } else {
            statusDiv.textContent = ""; // Clear loading message
        }
        filterAndRenderRepos(); // Display all fetched repos (or based on any pre-existing search term if app re-init)
    } catch (error) {
        console.error("Error fetching repositories:", error);
        allFetchedRepos = []; // Clear cache on error
        repoListDiv.innerHTML = ""; // Ensure list is clear
        let errorMessage = `❌ Error: ${error.message}.`;
        if (error.message.includes("403"))
            errorMessage +=
                " This might be due to API rate limiting. Please try again later.";
        errorMessage += " Check console for more details.";
        statusDiv.innerHTML = `${errorMessage} <button id="retry-fetch-button">Retry</button>`;
        statusDiv.style.color = "red";
        const retryButton = document.getElementById("retry-fetch-button");
        if (retryButton) {
            retryButton.onclick = fetchInitialRepos; // Re-run this function on click
        }
    }
}
