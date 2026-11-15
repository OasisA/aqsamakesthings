# aqsamakesthings — Aqsa Owais's portfolio site

Plain HTML + one CSS file + a small optional JS file. No build step, no framework.
Open `index.html` in a browser, or serve the folder with any static server.
Deploys as-is to GitHub Pages, Netlify, Cloudflare Pages, etc.

```
index.html        Home: opening statement, three threads, selected work
about.html        Path, learning abroad, how I work, honors, education
work.html         Senior design, IDEA Lab, industry, self-initiated projects, research, publications
philaetube.html   Full case study
community.html    Health policy & advocacy, health equity on campus, where it started
making.html       For the love of making: Instagram projects not shown on Work (teaching, workshops, builds, signs, art)
contact.html      Contact links
assets/css/style.css   All styling; colors and fonts are tokens at the top
assets/js/main.js      Mobile menu, gentle scroll reveal, case-study TOC highlight
assets/img/            Images (webp/jpg, pre-sized for web)
```

## Updating

- **Add a project:** copy an `<article class="project">` block in `work.html`.
  To feature it on Home, copy a `<article class="card">` in `index.html`.
- **Add a community entry:** copy any `<article class="entry">` in `community.html`.
- **Images:** keep them ≤1600px on the long edge, webp or jpg, and always set
  `width`, `height`, `alt`, and `loading="lazy"` (except the first image on a page).
- **Nav/footer** are repeated in each HTML file — if you add a page, update all seven. The Work menu item has a dropdown (`<ul class="subnav">`); add more case studies there.
- **After editing style.css**, bump the `?v=` number on the stylesheet link in each page so browsers load the new version.
- **Colors:** edit the variables in `:root` at the top of `style.css` (dark-mode values are just below).

## Placeholders

All placeholders were removed for the first public version. To flag something you still need to fill in, wrap it in `<span class="ph">…</span>` (shows in yellow) and find them with `grep -n 'class="ph' *.html`.
