# VidyaSutra

**Where E-Waste Powers Education.**

A responsive, static college-project website for students of Vaish College of Engineering, Rohtak. VidyaSutra encourages responsible e-waste donation and explores how verified recycling contributions could support education.

## Project files

```text
.
├── index.html
├── style.css
├── script.js
├── vaish-college-seal.jpg
├── .nojekyll
└── README.md
```

The site uses plain HTML, CSS and vanilla JavaScript. There is no build step, package installation, framework, external font, or CDN dependency. Keep the HTML, CSS, JavaScript and crest image together in the same folder.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. You can also open this folder in Visual Studio Code and use the Live Server extension on `index.html`.

## Publish with GitHub Pages

### Upload through GitHub

1. Create a GitHub repository, for example `vidya-sutra` (the repository may have any name you choose).
2. Upload the **contents of this folder** to the repository root. Make sure `index.html` is at the root, beside `style.css`, `script.js` and `vaish-college-seal.jpg`—not inside an extra nested folder.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/(root)` folder, then save.
6. Wait for the Pages deployment to finish. The site URL will be shown in the Pages settings. For a regular repository it usually follows `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/`.

### Or push with Git

Create an empty repository on GitHub, open a terminal in this folder, then run:

```bash
git init
git add .
git commit -m "Add VidyaSutra website"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

Then enable Pages for the `main` branch and `/(root)` folder as described above. If Git asks you to authenticate, follow GitHub's current sign-in instructions; do not put access tokens in project files.

All page assets use relative paths, so they work both locally and when the repository is published under a GitHub Pages project URL.

## Important project notes

- The donation-interest form is a frontend demonstration. It does **not** send or save submissions, notify the college, schedule a pickup, or confirm an item will be accepted.
- GitHub Pages serves static files only. To receive interest submissions, connect the form to a secure backend or form service. A commented integration placeholder is in `script.js`; it is intentionally inactive.
- Never put database credentials, private tokens, or student data in frontend code or in the repository.
- The college crest in `vaish-college-seal.jpg` was supplied for this project. Confirm you have permission to publish it before making the repository public.
