/* Injects the shared header and footer into any page that has
   <div id="site-header"></div> and <div id="site-footer"></div>.
   Names, menu labels, footer text/links and button labels come from
   content/site.json (editable in the admin panel); the defaults in
   translations.js are only a fallback if that file can't be loaded. */

const NAV_ITEMS = [
  { key: "home", page: "index.html" },
  { key: "news", page: "news.html" },
  { key: "history", page: "history.html" },
  { key: "about", page: "about.html" },
  { key: "contact", page: "contact.html" },
];

const SITE = {
  name: "Lasău",
  tagline: null,
  footerLinks: [
    { label: { ro: "Știri", en: "News" }, url: "news.html" },
    { label: { ro: "Istorie", en: "History" }, url: "history.html" },
    { label: { ro: "Contact", en: "Contact" }, url: "contact.html" },
  ],
};

/* Resolves once content/site.json has been merged into TRANSLATIONS/SITE.
   Page scripts `await window.siteReady` before rendering, so every label
   (e.g. "Read more") already has its final text. */
window.siteReady = (async function loadSiteSettings() {
  let data;
  try {
    const res = await fetch("content/site.json", { cache: "no-store" });
    if (!res.ok) return;
    data = await res.json();
  } catch {
    return;
  }

  if (data.site_name) SITE.name = data.site_name;
  if (data.site_tagline) SITE.tagline = data.site_tagline;
  if (Array.isArray(data.footer_links)) SITE.footerLinks = data.footer_links;

  const merge = (key, field) => {
    if (!field) return;
    for (const lang of ["ro", "en"]) {
      const value = typeof field === "string" ? field : field[lang] || field.ro;
      if (value) TRANSLATIONS[lang][key] = value;
    }
  };
  Object.entries(data.nav || {}).forEach(([k, v]) => merge(`nav_${k}`, v));
  Object.entries(data.labels || {}).forEach(([k, v]) => merge(k, v));
  merge("footer_text", data.footer_text);
})();

function currentPage() {
  return window.location.pathname.split("/").pop() || "index.html";
}

function localized(field, lang) {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.ro || field.en || "";
}

function renderFooterLinks() {
  const nav = document.querySelector(".footer-nav");
  if (!nav) return;
  const lang = getLang();
  nav.innerHTML = SITE.footerLinks
    .map((link) => {
      const label = localized(link.label, lang);
      const url = link.url || "#";
      const external = /^https?:\/\//i.test(url);
      return `<a href="${escapeAttr(url)}"${external ? ' target="_blank" rel="noopener"' : ""}>${escapeText(label)}</a>`;
    })
    .join("");
}

function updateDocumentTitle() {
  const lang = getLang();
  const page = currentPage();
  const item = NAV_ITEMS.find((n) => n.page === page);
  if (!item || item.key === "home") {
    const tagline = localized(SITE.tagline, lang);
    document.title = tagline ? `${SITE.name} — ${tagline}` : SITE.name;
  } else {
    document.title = `${TRANSLATIONS[lang][`nav_${item.key}`]} — ${SITE.name}`;
  }
}

function escapeText(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function escapeAttr(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function renderLayout() {
  const path = currentPage();

  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <div class="container">
        <a href="index.html" class="site-title"><span>${escapeText(SITE.name)}</span></a>
        <nav class="main-nav">
          ${NAV_ITEMS.map(
            (n) => `<a href="${n.page}" data-i18n="nav_${n.key}" data-page="${n.page}"></a>`
          ).join("")}
          <button class="lang-toggle" type="button"></button>
        </nav>
      </div>`;
    header.querySelectorAll("[data-page]").forEach((a) => {
      if (a.getAttribute("data-page") === path) a.classList.add("active");
    });
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML = `
      <div class="container">
        <p data-i18n="footer_text"></p>
        <nav class="footer-nav"></nav>
      </div>`;
    renderFooterLinks();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await window.siteReady;
  renderLayout();
  applyTranslations();
  initLangToggle();
  updateDocumentTitle();
});

document.addEventListener("langchange", () => {
  renderFooterLinks();
  updateDocumentTitle();
});
