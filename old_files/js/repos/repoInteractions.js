import { repoListDiv } from "../domElements.js";
import { togglePagesPreview } from "./pagesPreview.js";

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
    if (card) card.classList.remove("repo-card--hover-pop");
  });
}
