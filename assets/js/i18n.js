/* Language state + applying translated strings to elements with data-i18n. */

function getLang() {
  return localStorage.getItem("lasau_lang") || "ro";
}

function setLang(lang) {
  localStorage.setItem("lasau_lang", lang);
}

function applyTranslations() {
  const lang = getLang();
  const dict = TRANSLATIONS[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  const toggleBtn = document.querySelector(".lang-toggle");
  if (toggleBtn) toggleBtn.textContent = dict.lang_toggle;
}

function initLangToggle() {
  const toggleBtn = document.querySelector(".lang-toggle");
  if (!toggleBtn) return;
  toggleBtn.addEventListener("click", () => {
    const next = getLang() === "ro" ? "en" : "ro";
    setLang(next);
    applyTranslations();
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: next } }));
  });
}

/* Note: applyTranslations() and initLangToggle() are invoked by layout.js
   after the shared header is injected, not here — avoids double-binding
   the toggle button. */
