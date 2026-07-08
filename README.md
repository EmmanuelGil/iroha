# Iroha Japanese Language School — website

Static multilingual site (EN / JA / ES / KO / VI / ZH) served by GitHub Pages at
https://emmanuelgil.github.io/iroha/

## How it works

The 12 public pages (`index.html`, `japanese.html`, …, `admission-process*.html`)
are **generated** — do not edit them by hand. Edit the sources and rebuild:

```
src/
  templates/home.html        structure of the 6 home pages (one file, all languages)
  templates/admission.html   structure of the 6 admission pages
  i18n/en.json ... zh.json   every text of the site, one file per language
build.mjs                    renders templates + i18n into the 12 pages + sitemap.xml
```

## Workflow

1. Change structure/design → edit `src/templates/*.html` (use `{{key}}` placeholders).
   Change a text → edit the matching key in `src/i18n/<lang>.json`.
2. Rebuild all pages:

   ```
   node build.mjs
   ```

3. Commit and push. GitHub Pages publishes the result.

No dependencies are required (plain Node.js). Template variables provided by the
builder: `lang`, `base`, `canonical`, `og_locale`, `lang_chip`, `lang_links`,
`hreflang_links`, `home_href`, `admission_href`, `meta_title`, `meta_description` —
everything else comes from the i18n JSON of each language.

## Notes

- The contact form posts to FormSubmit.co, which forwards submissions to
  fjls@fukuokaschool.com (works on any static hosting, no PHP needed). The
  first submission ever sends a one-time activation e-mail to that inbox —
  it must be confirmed once before messages are delivered.
- Sliders are powered by `js/sliders.js` (dependency-free: swipe, dots, arrows,
  keyboard, autoplay). Markup: `<div data-slider data-autoplay="6000"><div class="...-track">…`
- If the site moves to its own domain, update `BASE` in `build.mjs`, rebuild,
  and update `robots.txt`.
