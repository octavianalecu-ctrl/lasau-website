/* Injects the shared header and footer into any page that has
   <div id="site-header"></div> and <div id="site-footer"></div>. */

function renderLayout() {
  const path = window.location.pathname.split("/").pop() || "index.html";

  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <div class="container">
        <a href="index.html" class="site-title"><span>Lasău</span></a>
        <nav class="main-nav">
          <a href="index.html" data-i18n="nav_home" data-page="index.html"></a>
          <a href="news.html" data-i18n="nav_news" data-page="news.html"></a>
          <a href="history.html" data-i18n="nav_history" data-page="history.html"></a>
          <a href="about.html" data-i18n="nav_about" data-page="about.html"></a>
          <a href="contact.html" data-i18n="nav_contact" data-page="contact.html"></a>
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
        <nav class="footer-nav">
          <a href="news.html" data-i18n="nav_news"></a>
          <a href="history.html" data-i18n="nav_history"></a>
          <a href="contact.html" data-i18n="nav_contact"></a>
        </nav>
      </div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderLayout();
  applyTranslations();
  initLangToggle();
});
