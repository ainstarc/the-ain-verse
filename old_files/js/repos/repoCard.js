import { GITHUB_USERNAME, GITHUB_API_ACCEPT_HEADER } from "../config.js";

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
    repoData.name.toLowerCase() === `${GITHUB_USERNAME.toLowerCase()}.github.io`
  ) {
    return `https://${GITHUB_USERNAME.toLowerCase()}.github.io/`;
  }
  return `https://${GITHUB_USERNAME.toLowerCase()}.github.io/${repoData.name}/`;
}

export function createRepoCardElement(repo) {
  const repoCard = document.createElement("div");
  repoCard.className = "repo-card";

  const repoNameLink = document.createElement("a");
  repoNameLink.href = repo.html_url;
  repoNameLink.textContent = repo.name;
  repoNameLink.target = "_blank";
  repoNameLink.rel = "noopener noreferrer";
  repoNameLink.classList.add("repo-title-link");

  const repoNameHeading = document.createElement("h3");
  repoNameHeading.appendChild(repoNameLink);
  repoCard.appendChild(repoNameHeading);

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
    repoCard.classList.add("repo-card--empty");
    const emptyIndicator = document.createElement("span");
    emptyIndicator.className =
      "repo-status-indicator repo-status-indicator--empty";
    emptyIndicator.innerHTML = '<i class="far fa-folder-open"></i> Empty';
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

      const pagesLinkIcon = document.createElement("a");
      pagesLinkIcon.href = pagesUrl;
      pagesLinkIcon.innerHTML = '<i class="fas fa-external-link-alt"></i>';
      pagesLinkIcon.target = "_blank";
      pagesLinkIcon.rel = "noopener noreferrer";
      pagesLinkIcon.className = "repo-action-icon repo-gh-pages-icon";
      pagesLinkIcon.title = `View GitHub Pages for ${repo.name}`;
      pagesLinkIcon.setAttribute(
        "aria-label",
        `View GitHub Pages for ${repo.name}`
      );
      pagesLinkIcon.onclick = (e) => e.stopPropagation();
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
  issuesLink.onclick = (e) => e.stopPropagation();
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

  const langSpan = document.createElement("span");
  langSpan.className = "repo-language";
  metaDiv.appendChild(langSpan);

  const setLanguageDisplay = (htmlContent, isEmpty = false) => {
    langSpan.style.display = isEmpty ? "none" : "";
    if (!isEmpty) langSpan.innerHTML = htmlContent;
  };

  if (repo.languages_url) {
    setLanguageDisplay(
      `<i class="fas fa-spinner fa-spin" title="Loading languages..."></i>`
    );
    fetch(repo.languages_url, { headers: { Accept: GITHUB_API_ACCEPT_HEADER } })
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject(new Error(`HTTP error ${response.status}`))
      )
      .then((languagesData) => {
        const sortedLanguages = Object.entries(languagesData)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3);
        if (sortedLanguages.length > 0) {
          setLanguageDisplay(
            `<i class="fas fa-laptop-code"></i> ${sortedLanguages
              .map(([lang]) => lang)
              .join(", ")}`
          );
        } else if (repo.language) {
          setLanguageDisplay(
            `<i class="fas fa-laptop-code"></i> ${repo.language}`
          );
        } else {
          setLanguageDisplay("", true);
        }
      })
      .catch((error) => {
        console.warn(
          `Could not fetch languages for ${repo.name}: ${error.message}`
        );
        setLanguageDisplay(
          repo.language
            ? `<i class="fas fa-laptop-code"></i> ${repo.language}`
            : "",
          !repo.language
        );
      });
  } else {
    setLanguageDisplay(
      repo.language
        ? `<i class="fas fa-laptop-code"></i> ${repo.language}`
        : "",
      !repo.language
    );
  }

  const starsSpan = document.createElement("span");
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
    topicsDiv.innerHTML = `<strong>Topics: </strong> ${repo.topics
      .slice(0, 3)
      .map((topic) => `<span class="repo-topic">${topic}</span>`)
      .join(" ")}`;
    repoCard.appendChild(topicsDiv);
  }
  return repoCard;
}
