# VidyaSutra

**Where E-Waste Powers Education.**

A responsive, static college-project website for students of Vaish College of Engineering, Rohtak. VidyaSutra encourages responsible e-waste donation and explores how verified recycling contributions could support education.

- **Live site (GitHub Pages):** <https://raghavmehrada.github.io/vidya-sutra/>
- **Repository:** <https://github.com/RaghavMehraDA/vidya-sutra>

## Project files

```text
.
├── index.html
├── style.css
├── script.js
├── vaish-college-seal.jpg
├── .nojekyll
├── .gitignore
└── README.md
```

The site uses plain HTML, CSS and vanilla JavaScript. There is no build step, package installation, framework, external font, or CDN dependency. Keep the HTML, CSS, JavaScript and crest image together in the same folder.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. You can also open this folder in Visual Studio Code and use the Live Server extension on `index.html`.

## Connect the donation-interest form (Google Forms)

The form starts in a safe **demo** mode: it validates entries in the browser and sends nothing. Every disclaimer on the page reflects that. To make it actually deliver responses to a Google Form:

1. Create a Google Form with these questions (this order is easiest):
   - **Your name** — Short answer, required
   - **Email address** — Short answer, required
   - **Department, class or student group** — Short answer, required
   - **What might you donate?** — Checkboxes (list the same item types as the site)
   - **Anything else** — Paragraph
   - **Consent** — Checkboxes with a single "Yes" option
2. Open the form's live link and copy the **form ID** — the long token between `/d/e/` and `/viewform`:
   `https://docs.google.com/forms/d/e/1FAIpQLSd...xyz/viewform`
3. Find each question's **entry ID**. The simplest method is *Get pre-filled link*: type a marker into each field, click **Get link**, and read the `entry.XXXXXXXXXX` values from the generated URL.
4. Open `script.js` and fill in `FORM_CONFIG` at the top of the file:

   ```js
   const FORM_CONFIG = {
     formId: '1FAIpQLSd...xyz',
     entries: {
       name: 'entry.1111111111',
       email: 'entry.2222222222',
       studentGroup: 'entry.3333333333',
       items: 'entry.4444444444',
       note: 'entry.5555555555',
       consent: 'entry.6666666666'
     }
   };
   ```

5. Commit and push. As soon as `formId` is set, the form submits to Google Forms and **the on-page wording switches by itself** from the "nothing is sent" text to the accurate "submitted to the programme's Google Form" text (the `data-demo-only` / `data-live-only` spans in `index.html`).

Notes:

- Google Forms does not return CORS headers, so submissions are sent with `mode: 'no-cors'`. The browser cannot read the reply, so the page shows a success message once the request resolves rather than confirming it server-side. Test a real submission and check the form's **Responses** tab.
- Validation stays client-side only. If you later add a real backend, re-validate on the server and never put credentials in frontend code.
- You can leave `entry` values blank for any question you do not want to submit; blanks are skipped.

## Publish with GitHub Pages

This project is already published from the `main` branch, `/(root)` folder.

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, keep **Deploy from a branch**, the `main` branch and the `/(root)` folder.
3. Every push to `main` redeploys the site automatically. The URL is <https://raghavmehrada.github.io/vidya-sutra/>.

The `.nojekyll` file tells GitHub Pages to serve the files as-is. All page assets use relative paths, so they work both locally and under the GitHub Pages project URL.

## Pushing updates

`main` already tracks `origin/main`, so from this folder:

```bash
git add .
git commit -m "Describe your change"
git push
```

## Important project notes

- The donation-interest form only sends data **after** `FORM_CONFIG.formId` is set. Until then it is an on-page demonstration and nothing is transmitted or stored.
- GitHub Pages serves static files only. Google Forms receives the form data; connect a secure backend instead if you need validation, rate limiting or private storage.
- Never put database credentials, private tokens, or other people's personal data in frontend code or in the repository.
- The college crest in `vaish-college-seal.jpg` was supplied for this project. Confirm you have permission to publish it before making the repository public.
- No license is granted for this project; all rights reserved.
