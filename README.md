# Ain-Verse: My GitHub Projects Showcase

Welcome to the Ain-Verse! This is a dynamic, interactive single-page application designed to showcase my GitHub repositories. It features a light/dark theme, fetches repository data directly from the GitHub API, and includes a playful interactive "cat-call" element.

## ✨ Features

- **Dynamic Repository Listing:** Fetches and displays public GitHub repositories for the configured user (`ainstarc`).
- **Repository Filtering/Searching:** Allows users to easily find specific repositories by typing keywords that match repository names, descriptions, or topics.
- **GitHub API Integration:** Uses the GitHub API to get repository details, including descriptions, languages, stars, forks, and topics.
- **Light/Dark Theme:** User-selectable theme preference that persists across sessions using `localStorage`. Also respects OS-level color scheme preference.
- **Interactive "Pspspsps" Cat:**
  - Plays random cat sounds on hover/click.
  - Sound volume adjusts based on the time of day (simulating cat behavior).
  - Visual mood indicator (emoji) changes based on interaction frequency and time.
  - "Pspspsps" text styling (color, boldness, case) changes with the cat's "mood."
  - Idle state: If not interacted with, the cat "goes to sleep" (💤 emoji).
- **GitHub Pages Preview Modal:** Click on a repository card (if it has GitHub Pages) to view a live preview in a large modal iframe.
- **Modular JavaScript & CSS:** Code is organized into modules for better maintainability.
- **Live GitHub Issues Sidebar:** A toggleable sidebar that displays a consolidated list of open issues from your repositories, featuring:
  - Search and filter capabilities for issues by keywords and labels.
  - Grouping of issues by repository.
  - Display of search result count for immediate feedback.
  - Expandable and collapsible repository groups for better organization.
  - Direct links to individual issues on GitHub.
  - Display of issue numbers for easy reference.
- **AI Links Section:** A dedicated section providing quick access to relevant AI tools and resources.
- **Responsive Design:** Adapts to different screen sizes.
- **Accessibility Considerations:** Includes ARIA labels and semantic HTML where appropriate.

## 🚀 Technologies Used

- **HTML5:** For the basic structure of the page.
- **CSS3:** For styling, including:
  - CSS Custom Properties (Variables) for theming.
  - Flexbox and Grid for layout.
  - Transitions and subtle animations.
- **JavaScript (ES6+ Modules):** For all dynamic functionality, including:
  - Fetching data from the GitHub API (`fetch` API, `async/await`).
  - DOM manipulation.
  - Event handling.
  - Managing theme state.
  - Implementing the interactive cat sound and preview modal features.
- **Font Awesome:** For icons.

## 🛠️ Setup & Usage

This is a static website. To view it:

1.  **Clone the repository (optional):**
    ```bash
    git clone <repository-url>
    cd the-ain-verse
    ```
2.  **Open `index.html`:** Simply open the `index.html` file in your web browser.

No build steps or local server are strictly required for basic viewing, as it's designed to run directly in the browser.

### Configuration

- The GitHub username to fetch repositories for is set in `js/config.js` (`GITHUB_USERNAME`).
- Cat sounds are located in the `sounds/` directory and configured in `js/catSoundManager.js`.

## 💡 How to Interact

- **Theme Toggle:** Click the 🌙/☀️ button in the header to switch between light and dark themes.
- **Filter Repositories:** Use the search bar (usually located above the repository list) to type and filter repositories by name, description, or topics.
- **"Pspspsps" Cat:** Hover over or click the "pspspsps" text in the introductory paragraph to hear cat sounds and see its mood change.
- **Repository Previews:** If a repository card has a GitHub Pages site, click on the card (not the action icons) to open a preview modal. Click the "×" button or outside the modal content to close.
- **Live Issues Sidebar:**
  - Click the vertical tab on the left edge of the screen (styled with an accent color, e.g., `salmon red` in light theme, `teal` in dark theme) to open/close the "Live Issues" sidebar.
  - Use the search input within the sidebar to filter issues by keywords or labels (e.g., `bug`, `label:enhancement`).
  - Click on repository names to expand or collapse their respective issue lists.

## 📜 Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full list of changes and release history.

Keep track of notable changes and new features here. For detailed future plans and bug tracking, please refer to the [GitHub Issues](https://github.com/ainstarc/the-ain-verse/issues).

## 📄 License

This project is licensed under the MIT License. See the `LICENSE.md` file for details.

---

Enjoy exploring the Ain-Verse! 🐾
