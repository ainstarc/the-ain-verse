# 📝 Changelog

Keep track of notable changes and new features here.  
For detailed future plans and bug tracking, refer to the [GitHub Issues](https://github.com/ainstarc/the-ain-verse/issues).

---

## `v0.4.0` – 2025-05-31

- Transitioned to React v18.2.0

---

## `v0.3.1` – 2025-05-30

- 📌 Fixed: Sidebar items now remain fixed correctly during scroll  
  _(PR [#23](https://github.com/ainstarc/pull/23), Issue [#17](https://github.com/ainstarc/issues/17))_
- 🛠️ Refactored `repoManager.js` into modular components for better maintainability  
  _(PR [#25](https://github.com/ainstarc/pull/25))_
  - `pagesPreview.js` – GitHub Pages preview modal logic
  - `repoCard.js` – Repository card generation
  - `repoDisplay.js` – Card rendering
  - `repoInteractions.js` – Interactive behaviors
  - `repoService.js` – Repo fetching and filtering
- 🐛 Fixed conflicting behavior on repo-card title click: now **only redirects to GitHub**  
   _(Fixes [#9](https://github.com/ainstarc/issues/9))_
  🙌 Contribution by [@Chandanag8197](https://github.com/Chandanag8197)

---

## `v0.3.0` – 2025-05-29

- 🔍 Enhanced **Live Issues Sidebar**:
  - Search filter and repository grouping
  - Result count display
  - Toggle button styling improved for visibility
  - Issue count badge on filtered results  
    _(PR [#13](https://github.com/ainstarc/pull/13), PR [#16](https://github.com/ainstarc/pull/16), Issue [#7](https://github.com/ainstarc/issues/7), [#14](https://github.com/ainstarc/issues/14))_
- ✨ Added **AI Links** section for quick tool access
- 🎨 UI refinements for sidebar and placeholders

---

## `v0.2.1` – 2025-05-28

- 🔗 Added social media links to website header/footer  
  _(PR [#10](https://github.com/ainstarc/pull/10), Issue [#6](https://github.com/ainstarc/issues/6))_ 🙌 Contribution by [@hugolopez-online](https://github.com/hugolopez-online)
- 🧹 Removed unused `package.json` and `package-lock.json`  
  _(PR [#11](https://github.com/ainstarc/pull/11))_

---

## `v0.2.0` – 2025-05-25

- 🔍 Introduced **GitHub Repo Search** functionality
- 🎧 Updated **audio interaction behavior**
- 🌦️ Added **weather-aware UI effects**
- 🧩 Modularized JS and CSS file structure
- 🪝 Launched **Live GitHub Issues Sidebar** with toggle
- ✨ Smooth entry **animations** for elements
- 🎨 Overall UI/UX enhancements
- 📚 Expanded inline comments and developer docs
- 🚀 GitHub Pages deployment setup
- 🧼 Updated `.gitignore` for cleaner source tracking

---

## `v0.1.0` – 2025-05-24

- 🚀 Initial launch of **`the-ain-verse`**
- 🗂️ Created responsive **repo cards** with:
  - Live preview modals
  - Links to GitHub Pages and Issues
- 🐱 Introduced **interactive cat companion**:
  - Mood-reactive CSS themes
  - Ambient sound effects
- 🎛️ Standardized theme logic and icons
- 🧱 Base layout, structure, and design
