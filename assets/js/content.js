/* Fetches per-page content JSON (content/pages/*.json) so text and images
   on every page can be edited from the admin panel instead of being
   hardcoded — only navigation/UI chrome (translations.js) stays fixed. */

async function fetchPageContent(jsonPath) {
  try {
    const res = await fetch(jsonPath, { cache: "no-store" });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

function fieldFor(data, base, lang) {
  return data[`${base}_${lang}`] || data[`${base}_ro`] || data[`${base}_en`] || "";
}

function contentEscapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

/* Renders freeform multi-paragraph text (blank line = new paragraph),
   same convention as post bodies. */
function richTextHtml(text) {
  return text
    .split(/\n\s*\n/)
    .map((para) => `<p>${contentEscapeHtml(para).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/* Sets textContent on elements whose data-field attribute names a field
   base (e.g. data-field="title" reads title_ro/title_en). Elements with
   data-rich="1" get paragraph-split HTML instead of plain text. */
function applyFieldsIn(container, data) {
  const lang = getLang();
  container.querySelectorAll("[data-field]").forEach((el) => {
    const base = el.getAttribute("data-field");
    const value = fieldFor(data, base, lang);
    if (el.hasAttribute("data-rich")) {
      el.innerHTML = richTextHtml(value);
    } else {
      el.textContent = value;
    }
  });
}

/* Swaps the hero background for a real photo when hero_image is set;
   otherwise keeps the illustrated hills (default in style.css). */
function applyHeroImage(data) {
  const hero = document.querySelector(".hero");
  if (hero && data.hero_image) {
    hero.style.backgroundImage = `url('${data.hero_image}')`;
  }
}

/* Fills a photo slot when the given image field is set; otherwise leaves
   the dashed placeholder visible as a hint of where to add one. */
function applyPhotoSlot(selector, data, field) {
  const slot = document.querySelector(selector);
  if (slot && data[field]) {
    slot.classList.remove("photo-slot-empty");
    slot.style.backgroundImage = `url('${data[field]}')`;
    slot.textContent = "";
  }
}
