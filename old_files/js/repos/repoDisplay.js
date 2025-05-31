import { statusDiv, repoListDiv } from "../domElements.js";
import { createRepoCardElement } from "./repoCard.js";

export function renderRepoCards(
  reposToDisplay,
  currentSearchTermForStatus,
  isInitialLoadOrErrorContext = false
) {
  repoListDiv.innerHTML = ""; // Clear previous list

  if (reposToDisplay.length > 0) {
    // If repos are displayed, and it's not an error context, clear status.
    // Error messages set by fetchInitialRepos should persist.
    if (!statusDiv.textContent.startsWith("❌")) {
      statusDiv.textContent = "";
    }
  } else {
    // ReposToDisplay is empty.
    if (currentSearchTermForStatus && !isInitialLoadOrErrorContext) {
      // This means a search yielded no results, and it's not the initial load/error phase.
      statusDiv.textContent = `🤷 No repositories found matching "${currentSearchTermForStatus}".`;
    }
    // Otherwise (initial load empty, or error), fetchInitialRepos has already set the status.
    // So, do nothing to statusDiv here.
  }

  const fragment = document.createDocumentFragment();
  reposToDisplay.forEach((repo) => {
    const repoCard = createRepoCardElement(repo);
    fragment.appendChild(repoCard);
  });
  repoListDiv.appendChild(fragment);
}
