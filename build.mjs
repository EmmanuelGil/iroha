// Static site builder for Iroha Japanese Language School.
//
//   node build.mjs
//
// Renders src/templates/{home,admission}.html against src/i18n/{lang}.json
// and writes the 12 public pages (index.html, japanese.html, ... and the
// admission-process*.html family) plus sitemap.xml at the repo root.
// Edit the templates to change structure once for every language; edit the
// i18n JSON files to change texts for a single language.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://emmanuelgil.github.io/iroha/';

// Each language only pulls the Noto Serif/Sans subset it actually needs
// (CJK webfonts are heavy) — see fontsUrl().
const LANGS = [
  { code: 'en', home: 'index.html', admission: 'admission-process.html', ogLocale: 'en_US', chip: 'EN', label: 'English', script: 'latin' },
  { code: 'ja', home: 'japanese.html', admission: 'admission-process-jp.html', ogLocale: 'ja_JP', chip: 'JP', label: '日本語', script: 'JP' },
  { code: 'es', home: 'spanish.html', admission: 'admission-process-es.html', ogLocale: 'es_ES', chip: 'ES', label: 'Español', script: 'latin' },
  { code: 'ko', home: 'korean.html', admission: 'admission-process-ko.html', ogLocale: 'ko_KR', chip: 'KO', label: '한국어', script: 'KR' },
  { code: 'vi', home: 'vietnamese.html', admission: 'admission-process-vi.html', ogLocale: 'vi_VN', chip: 'VI', label: 'Tiếng Việt', script: 'latin' },
  { code: 'zh', home: 'chinese.html', admission: 'admission-process-zh.html', ogLocale: 'zh_CN', chip: 'ZH', label: '中文', script: 'SC' },
];

function fontsUrl(script) {
  const families = ['family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400', 'family=Noto+Sans:ital,wght@0,300..700;1,300..700'];
  if (script !== 'latin') {
    families.push(`family=Noto+Serif+${script}:wght@400;600;700`, `family=Noto+Sans+${script}:wght@300..700`);
  }
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

// Home canonical for the default language is the site root.
const homeUrl = (l) => l.code === 'en' ? BASE : BASE + l.home;
const admUrl = (l) => BASE + l.admission;

function hreflangLinks(urlOf) {
  const lines = LANGS.map(l => `  <link rel="alternate" hreflang="${l.code}" href="${urlOf(l)}">`);
  lines.push(`  <link rel="alternate" hreflang="x-default" href="${urlOf(LANGS[0])}">`);
  return lines.join('\n');
}

function langLinks(current, fileOf, indent) {
  return LANGS.map(l => {
    const cur = l.code === current ? ' aria-current="true"' : '';
    return `${indent}<a href="${fileOf(l)}"${cur}>${l.label}</a>`;
  }).join('\n');
}

function render(template, vars) {
  const out = template.replace(/\{\{([a-z0-9_]+)\}\}/gi, (m, key) => {
    if (!(key in vars)) throw new Error(`Missing template variable: ${key}`);
    return vars[key];
  });
  const leftover = out.match(/\{\{[a-z0-9_]+\}\}/i);
  if (leftover) throw new Error(`Unreplaced placeholder: ${leftover[0]}`);
  return out;
}

const homeTpl = readFileSync(path.join(ROOT, 'src/templates/home.html'), 'utf8');
const admTpl = readFileSync(path.join(ROOT, 'src/templates/admission.html'), 'utf8');

for (const l of LANGS) {
  const i18n = JSON.parse(readFileSync(path.join(ROOT, `src/i18n/${l.code}.json`), 'utf8'));
  const common = {
    lang: l.code,
    base: BASE,
    og_locale: l.ogLocale,
    lang_chip: l.chip,
    meta_title: i18n.meta.title,
    meta_description: i18n.meta.description,
    home_href: l.home,
    admission_href: l.admission,
    fonts_url: fontsUrl(l.script),
  };

  const homeVars = {
    ...i18n.home, ...common,
    canonical: homeUrl(l),
    hreflang_links: hreflangLinks(homeUrl),
    lang_links: langLinks(l.code, (x) => x.home, '            '),
  };
  writeFileSync(path.join(ROOT, l.home), render(homeTpl, homeVars), 'utf8');

  const admVars = {
    ...i18n.admission, ...common,
    canonical: admUrl(l),
    hreflang_links: hreflangLinks(admUrl),
    lang_links: langLinks(l.code, (x) => x.admission, '            '),
  };
  writeFileSync(path.join(ROOT, l.admission), render(admTpl, admVars), 'utf8');
  console.log(`built ${l.home} + ${l.admission}`);
}

// ---- sitemap.xml ------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const urls = LANGS.flatMap(l => [homeUrl(l), admUrl(l)]);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n') +
  `\n</urlset>\n`;
writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log('built sitemap.xml');
