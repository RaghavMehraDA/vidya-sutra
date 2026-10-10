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

The site uses plain HTML, CSS and vanilla JavaScript. There is no build step, framework, external font or CDN dependency — even the Supabase integration uses `fetch`, so nothing extra is loaded.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. You can also open this folder in Visual Studio Code and use the Live Server extension on `index.html`.

## Connect the form to Supabase

The form starts in a safe **demo** mode: it validates entries in the browser and sends nothing, and every disclaimer on the page says so. To store responses in Supabase:

### 1. Create the table and lock it down

In your Supabase project, open **SQL Editor** and run:

```sql
create table if not exists public.donation_interests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (position('@' in email) > 1 and char_length(email) <= 200),
  student_group text check (char_length(student_group) <= 160),
  items text[] not null default '{}',
  note text check (char_length(note) <= 2000),
  consent boolean not null default false
);

-- Turn on Row Level Security. With no read/update/delete policy, the public
-- (anon) key can ONLY insert — it cannot read, edit or delete rows.
alter table public.donation_interests enable row level security;

create policy "anon can submit interest"
  on public.donation_interests
  for insert
  to anon
  with check (true);
```

### 2. Copy your project URL and anon key

Open **Project Settings → API** and copy:

- **Project URL** — like `https://abcdefghijklm.supabase.co`
- **`anon` `public`** key

Paste them into `FORM_CONFIG` at the top of `script.js` and set the provider:

```js
const FORM_CONFIG = {
  provider: 'supabase',
  supabase: {
    url: 'https://abcdefghijklm.supabase.co',
    anonKey: 'YOUR_ANON_PUBLIC_KEY',
    table: 'donation_interests'
  },
  googleForms: { formId: '', entries: { name: '', email: '', studentGroup: '', items: '', note: '', consent: '' } }
};
```

### 3. Save and push

As soon as `provider` is `'supabase'` and both values are set, submissions are inserted into the table and **the on-page wording switches by itself** from the "nothing is sent" text to the accurate "saved to the programme's secure database" text (the `data-demo-only` / `data-live-only` spans in `index.html`).

### Security notes

- The **`anon` key is designed to be public** in browser code. It is safe here **only because RLS is on and the only policy is an anonymous INSERT** — anonymous users cannot read, edit or delete rows.
- **Never** put the `service_role` key in this file or the repository. It bypasses RLS and grants full access.
- Client-side validation is a convenience, not security. Because anonymous inserts are open, a determined person could spam the table. Before a public launch, add rate limiting or a CAPTCHA (for example a Supabase Edge Function), and set a data-retention plan.
- Verify your setup by submitting a test entry, then checking **Table Editor → donation_interests**.

## Optional: deliver to a Google Form instead

If you prefer a Google Form over Supabase, create the form, then use *Get pre-filled link* to find each field's `entry.XXXXXXXXXX` id. Put the form ID and entry IDs in `FORM_CONFIG.googleForms` and set `provider: 'googleForms'`. Note that Google Forms does not send CORS headers, so the page cannot read the result and simply shows a success message once the request resolves. (The on-page "live" wording refers to a secure database; adjust it in `index.html` if you use Google Forms.)

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

- The donation-interest form only sends data **after** a provider is configured in `FORM_CONFIG`. Until then it is an on-page demonstration and nothing is transmitted or stored.
- GitHub Pages serves static files only; Supabase stores the responses. If you need stricter validation or abuse protection, add a Supabase Edge Function between the page and the table.
- Never put database secrets, the `service_role` key, private tokens, or other people's personal data in frontend code or in the repository.
- The college crest in `vaish-college-seal.jpg` was supplied for this project. Confirm you have permission to publish it before making the repository public.
- No license is granted for this project; all rights reserved.
