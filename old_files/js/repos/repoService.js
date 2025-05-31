import { API_URL, GITHUB_API_ACCEPT_HEADER } from "../config.js";
import { statusDiv, repoListDiv } from "../domElements.js";
import { renderRepoCards } from "./repoDisplay.js";

let allFetchedRepos = [];
let currentSearchTerm = "";

function getFilteredRepos() {
  if (!currentSearchTerm) {
    return allFetchedRepos;
  }
  return allFetchedRepos.filter((repo) => {
    const nameMatch = repo.name.toLowerCase().includes(currentSearchTerm);
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

export async function fetchInitialRepos() {
  statusDiv.textContent = "🔄 Loading projects...";
  statusDiv.style.color = "";
  repoListDiv.innerHTML = "";

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
      allFetchedRepos = [];
      throw new Error("Received unexpected data format from API.");
    }

    if (allFetchedRepos.length === 0) {
      statusDiv.textContent = "🤷 No public repositories found.";
      renderRepoCards([], "", true);
    } else {
      statusDiv.textContent = ""; // Clear loading message
      renderRepoCards(getFilteredRepos(), currentSearchTerm, true);
    }
  } catch (error) {
    console.error("Error fetching repositories:", error);
    allFetchedRepos = [];
    let errorMessage = `❌ Error: ${error.message}.`;
    if (error.message.includes("403")) {
      errorMessage +=
        " This might be due to API rate limiting. Please try again later.";
    }
    errorMessage += " Check console for more details.";
    statusDiv.innerHTML = `${errorMessage} <button id="retry-fetch-button">Retry</button>`;
    statusDiv.style.color = "red";
    document
      .getElementById("retry-fetch-button")
      ?.addEventListener("click", fetchInitialRepos);
    renderRepoCards([], currentSearchTerm, true);
  }
}

export function handleSearch(searchTerm) {
  currentSearchTerm = searchTerm.toLowerCase().trim();
  renderRepoCards(getFilteredRepos(), currentSearchTerm, false);
}
