# 📝 Changelog

Keep track of notable changes and new features here. For detailed future plans and bug tracking, please refer to the [GitHub Issues](https://github.com/ainstarc/the-ain-verse/issues).

---

### `v0.1.4` – 2025-05-30

- 📌 Sidebar items now remain fixed correctly during page scroll. (Addresses [#17](https://github.com/your-repo/issues/17), [#23](https://github.com/your-repo/issues/23))
- 🙌 Contribution by [@Chandanag8197](https://github.com/Chandanag8197)
- 🛠️ Refactored `repoManager.js` into modular components for improved maintainability:
  - `pagesPreview.js` – handles GitHub Pages preview modal logic
  - `repoCard.js` – encapsulates repository card generation
  - `repoDisplay.js` – manages card rendering
  - `repoInteractions.js` – handles interactive behaviors
  - `repoService.js` – fetches and filters GitHub repo data
- 🐛 Fixed conflicting behavior on repo-card title click (Fixes [#9](https://github.com/your-repo/issues/9)):
  - Title now **only redirects to the GitHub repo**
  - Pages preview triggered from non-conflicting parts of the card

---

### `v0.1.3` – 2025-05-29

- 🔍 Added **Issue Search** functionality to the Live Issues sidebar, allowing filtering by keywords and labels.
- ✨ Introduced an "AI Links" section for quick access to mentioned AI tools.
- 🎨 Enhanced CSS styling for input field placeholders across the site for improved clarity and user experience.
- 🎨 Refined UI for the Live Issues sidebar, including toggle button styling for improved visibility and theme consistency.
- ↔️ Implemented expand/collapse functionality for repository groups within the Live Issues sidebar for better organization.
- #️⃣ Displayed issue numbers directly on individual issue items in the Live Issues list for easier reference.
- 📊 Added a search result count display to the Live Issues sidebar, providing clear feedback on filtering.

---

### `v0.1.2` – 2025-05-28

- 🔗 Added social media links to the website
- 🧹 Removed unnecessary package.json and package-lock.json
- 🙌 Contribution by @hugolopez-online

---

### `v0.1.1` – 2025-05-25

- 🔍 Added **repo search** functionality
- 🎧 Refreshed **audio interaction**
- 🎨 Updated overall **UI and layout**
- 🌦️ Implemented **weather-aware UI behavior**
- 🧩 Modularized **JavaScript and CSS** structure
- 🪝 Introduced **live GitHub Issues sidebar** with toggle
- ✨ Added smooth entry **animations**
- 📚 Expanded **documentation and inline comments**
- 🚀 Set up **GitHub Pages deployment workflow**
- 🧼 Updated `.gitignore` for cleaner version control

---

### `v0.1.0` – 2025-05-24

- 🚀 Initial release of **`the-ain-verse`**, your centralized portfolio hub
- 🗂️ Created responsive **repo cards** with:
  - Live preview in **modal iframe**
  - Direct links to **GitHub Pages** and **Issue pages**
- 🐱 Introduced interactive **cat companion**:
  - Mood-based **CSS styles**
  - Expanded **sound effect library**
- 🎛️ Refactored **theme logic** and standardized **icons**
- 🧱 Set up base project structure, styles, and layout

---
