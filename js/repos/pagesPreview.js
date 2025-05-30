function closePagesPreviewModal() {
  const modal = document.getElementById("pages-preview-modal");
  if (modal) {
    modal.remove();
    document.body.classList.remove("modal-open");
    // Remove active state from any card that might have triggered it
    document.querySelectorAll(".repo-card--preview-active").forEach((card) => {
      card.classList.remove("repo-card--preview-active");
    });
  }
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

  if (originatingCard) {
    originatingCard.classList.add("repo-card--preview-active");
  }
}

export function togglePagesPreview(event) {
  const repoCard = event.currentTarget;
  const actualClickedElement = event.target;

  if (
    actualClickedElement.closest(".repo-action-icon") ||
    actualClickedElement.closest(".repo-title-link") ||
    actualClickedElement.closest(".repo-topic") ||
    actualClickedElement.closest(".repo-language") ||
    actualClickedElement.closest(".repo-forks") ||
    actualClickedElement.closest(".repo-stars")
  ) {
    return;
  }
  const pagesUrl = repoCard.dataset.pagesUrl;
  if (!pagesUrl) return;

  const existingModal = document.getElementById("pages-preview-modal");
  if (
    existingModal &&
    repoCard.classList.contains("repo-card--preview-active")
  ) {
    closePagesPreviewModal();
    return;
  }
  showPagesPreviewModal(
    pagesUrl,
    repoCard.querySelector("h3 a").textContent,
    repoCard
  );
}
