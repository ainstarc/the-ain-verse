import { GITHUB_USERNAME, GITHUB_API_ACCEPT_HEADER } from "./config.js";

const MAX_ISSUES_TO_DISPLAY = 50;
let liveIssuesContainer = null;
let liveIssuesToggle = null;
let liveIssuesList = null;
let liveIssueRepoHeaders = null; // For repo headers in live issues
let isSectionInitialized = false;
let allFetchedIssues = [];
let currentFilter = "";

function createIssueElement(issue) {
  const listItem = document.createElement("li");
  listItem.className = "live-issue-item";

  // Extract repo name from issue.repository_url
  const repoUrlParts = issue.repository_url.split("/");
  const repoName = repoUrlParts[repoUrlParts.length - 1];
  listItem.setAttribute("data-repo-name", repoName);

  // --- Add issue number at the start ---
  const issueNumberSpan = document.createElement("span");
  issueNumberSpan.className = "live-issue-number";
  issueNumberSpan.textContent = `#${issue.number} `;
  listItem.appendChild(issueNumberSpan);

  const titleLink = document.createElement("a");
  titleLink.href = issue.html_url;
  titleLink.textContent = issue.title;
  titleLink.target = "_blank";
  titleLink.rel = "noopener noreferrer";
  titleLink.className = "live-issue-title";

  const repoNameSpan = document.createElement("span");
  repoNameSpan.className = "live-issue-repo-name";
  repoNameSpan.textContent = repoName;

  listItem.appendChild(titleLink);
  listItem.appendChild(repoNameSpan);

  if (issue.labels && issue.labels.length > 0) {
    const labelsDiv = document.createElement("div");
    labelsDiv.className = "live-issue-labels";
    issue.labels.slice(0, 3).forEach((label) => {
      const labelSpan = document.createElement("span");
      labelSpan.className = "live-issue-label";
      labelSpan.textContent = label.name;
      labelSpan.style.backgroundColor = `#${label.color}`;
      const r = parseInt(label.color.substring(0, 2), 16);
      const g = parseInt(label.color.substring(2, 4), 16);
      const b = parseInt(label.color.substring(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      labelSpan.style.color = brightness > 128 ? "#000000" : "#FFFFFF";
      labelsDiv.appendChild(labelSpan);
    });
    listItem.appendChild(labelsDiv);
  }

  return listItem;
}

function createSearchInput() {
  const searchDiv = document.createElement("div");
  searchDiv.className = "live-issues-search-container";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Filter issues by keyword or label...";
  input.className = "live-issues-search-input";
  input.addEventListener("input", (e) => {
    currentFilter = e.target.value.trim().toLowerCase();
    renderGroupedIssues();
  });
  searchDiv.appendChild(input);
  return searchDiv;
}

function groupIssuesByRepo(issues) {
  const grouped = {};
  issues.forEach((issue) => {
    const repoUrlParts = issue.repository_url.split("/");
    const repoName = repoUrlParts[repoUrlParts.length - 1];
    if (!grouped[repoName]) grouped[repoName] = [];
    grouped[repoName].push(issue);
  });
  return grouped;
}

function filterIssues(issues) {
  if (!currentFilter) return issues;
  return issues.filter((issue) => {
    const title = issue.title.toLowerCase();
    const labels = (issue.labels || [])
      .map((l) => l.name.toLowerCase())
      .join(" ");
    return title.includes(currentFilter) || labels.includes(currentFilter);
  });
}

function renderGroupedIssues() {
  if (!liveIssuesList) return;
  liveIssuesList.innerHTML = "";
  const filtered = filterIssues(allFetchedIssues);
  if (filtered.length === 0) {
    liveIssuesList.innerHTML = "<li>No issues match your filter.</li>";
    return;
  }
  const grouped = groupIssuesByRepo(filtered);
  Object.keys(grouped)
    .sort()
    .forEach((repoName) => {
      const repoHeader = document.createElement("li");
      repoHeader.className = "live-issue-repo-header";
      repoHeader.textContent = repoName;
      liveIssuesList.appendChild(repoHeader);
      grouped[repoName].forEach((issue) => {
        liveIssuesList.appendChild(createIssueElement(issue));
      });
    });
  expandCollapseLiveIssuesRepoHeader();

  // If searching, show all matching items and expand all headers with results
  if (currentFilter && currentFilter.length > 0) {
    // Expand all headers with results and show their issues
    liveIssueRepoHeaders = document.querySelectorAll(".live-issue-repo-header");
    liveIssueRepoHeaders.forEach((header) => {
      header.classList.add("expanded");
      const repoName = header.textContent;
      const items = document.querySelectorAll(
        `.live-issue-item[data-repo-name="${repoName}"]`
      );
      items.forEach((item) => {
        item.style.display = "";
      });
    });
  } else {
    // Hide all issue items by default (collapsed state)
    if (liveIssueRepoHeaders) {
      liveIssueRepoHeaders.forEach((header) => {
        header.classList.remove("expanded"); // Reset expanded state
        const repoName = header.textContent;
        const items = document.querySelectorAll(
          `.live-issue-item[data-repo-name="${repoName}"]`
        );
        items.forEach((item) => {
          item.style.display = "none";
        });
      });
    }
  }
}

async function fetchAndRenderLiveIssues() {
  if (!liveIssuesList || !liveIssuesToggle) return;
  liveIssuesList.innerHTML =
    '<li><i class="fas fa-spinner fa-spin"></i> Loading latest issues...</li>';
  liveIssuesToggle.disabled = true;
  try {
    const response = await fetch(
      `https://api.github.com/search/issues?q=user:${GITHUB_USERNAME}+is:open+is:issue&sort=created&order=desc&per_page=${MAX_ISSUES_TO_DISPLAY}`,
      {
        headers: {
          Accept: GITHUB_API_ACCEPT_HEADER,
        },
      }
    );
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
    const data = await response.json();
    allFetchedIssues = data.items || [];
    renderGroupedIssues();
  } catch (error) {
    console.error("Error fetching live issues:", error);
    liveIssuesList.innerHTML = `<li>Error loading issues: ${error.message}</li>`;
  } finally {
    liveIssuesToggle.disabled = false;
  }
}

function toggleLiveIssuesSection() {
  if (!liveIssuesContainer || !liveIssuesToggle) return;

  const isCurrentlyOpen =
    liveIssuesContainer.classList.contains("sidebar-open");

  if (isCurrentlyOpen) {
    // === CLOSE SIDEBAR ===
    liveIssuesContainer.classList.remove("sidebar-open"); // Start slide-out animation
    liveIssuesToggle.setAttribute("aria-expanded", "false");
    liveIssuesToggle.innerHTML = '<i class="fas fa-list-alt"></i> View Issues';

    // Hide with display:none after transition to remove from layout
    const handleTransitionEnd = () => {
      liveIssuesContainer.style.display = "none";
      liveIssuesContainer.removeEventListener(
        "transitionend",
        handleTransitionEnd
      );
    };
    liveIssuesContainer.addEventListener("transitionend", handleTransitionEnd);
  } else {
    // === OPEN SIDEBAR ===
    liveIssuesContainer.style.display = "flex"; // Make it visible (display:flex for layout)

    // Force a reflow or use requestAnimationFrame to ensure 'display' change is applied before transition starts
    requestAnimationFrame(() => {
      liveIssuesContainer.classList.add("sidebar-open"); // Add class to trigger slide-in animation
      liveIssuesToggle.setAttribute("aria-expanded", "true");
      liveIssuesToggle.innerHTML = '<i class="fas fa-times"></i> Close Issues';
    });

    // Fetch issues if the list is empty or was showing "no issues"
    if (
      liveIssuesList.children.length === 0 ||
      (liveIssuesList.children.length === 1 &&
        liveIssuesList.firstChild && // Ensure firstChild exists
        liveIssuesList.firstChild.textContent && // Ensure textContent exists
        liveIssuesList.firstChild.textContent.includes("No open issues"))
    ) {
      fetchAndRenderLiveIssues();
    }
  }
}

/**
 * Initializes the live issues section, sets up the toggle button,
 * and ensures the sidebar is hidden initially.
 */
export function initializeLiveIssues() {
  if (isSectionInitialized) return;

  liveIssuesContainer = document.getElementById("live-issues-section");
  liveIssuesToggle = document.getElementById("live-issues-toggle");
  liveIssuesList = document.getElementById("live-issues-list");

  if (!liveIssuesContainer || !liveIssuesToggle || !liveIssuesList) {
    console.warn(
      "Live issues section DOM elements not found. Feature will not be available."
    );
    return;
  }

  // Insert search input above the list
  const searchInput = createSearchInput();
  liveIssuesContainer.insertBefore(searchInput, liveIssuesList);

  liveIssuesToggle.addEventListener("click", toggleLiveIssuesSection);

  // Optional: If you add an internal close button inside the sidebar:
  // const internalCloseButton = document.getElementById('live-issues-internal-close-btn');
  // if (internalCloseButton) {
  //   internalCloseButton.addEventListener('click', toggleLiveIssuesSection);
  // }

  // Set initial state for toggle button (closed)
  liveIssuesToggle.innerHTML = '<i class="fas fa-list-alt"></i> View Issues';
  liveIssuesToggle.setAttribute("aria-expanded", "false");
  liveIssuesContainer.classList.remove("sidebar-open"); // Ensure no 'open' class
  liveIssuesContainer.style.display = "none"; // Hide the sidebar initially
  liveIssuesContainer.classList.add("live-issues-sidebar"); // Base class for styling

  isSectionInitialized = true;
  console.log("Live Issues Section Initialized.");

  // Optional: Fetch issues immediately if you want the section to be populated
  // even when initially collapsed, or if you want to show a count on the toggle.
  // For now, it fetches when first expanded.
}

export function refreshLiveIssues() {
  if (
    liveIssuesContainer &&
    liveIssuesContainer.classList.contains("sidebar-open")
  ) {
    fetchAndRenderLiveIssues();
  } else if (liveIssuesList) {
    // Clear list if not expanded so it fetches fresh on next expand
    liveIssuesList.innerHTML = "";
  }
}

export function expandCollapseLiveIssuesRepoHeader() {
  liveIssueRepoHeaders = document.querySelectorAll(".live-issue-repo-header");
  liveIssueRepoHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const repoName = header.textContent;
      const isExpanding = !header.classList.contains("expanded");

      // Collapse all repo headers and hide all issue items
      liveIssueRepoHeaders.forEach((h) => h.classList.remove("expanded"));
      document.querySelectorAll(".live-issue-item").forEach((item) => {
        item.style.display = "none";
      });

      if (isExpanding) {
        // Expand only the clicked header and show its issues
        header.classList.add("expanded");
        const items = document.querySelectorAll(
          `.live-issue-item[data-repo-name="${repoName}"]`
        );
        items.forEach((item) => {
          item.style.display = "";
        });
      }
    });
  });
}
