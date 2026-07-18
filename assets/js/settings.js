/* Loads content/settings.json so the hero and about-page images can be
   swapped for real village photos later without touching any code —
   either by editing settings.json directly or via the /admin/ CMS. */

async function fetchSettings() {
  try {
    const res = await fetch("content/settings.json", { cache: "no-store" });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

/* Swaps the hero background for a real photo when hero_image is set;
   otherwise keeps the illustrated hills (default in style.css). */
function applyHeroImage(settings) {
  const hero = document.querySelector(".hero");
  if (hero && settings.hero_image) {
    hero.style.backgroundImage = `url('${settings.hero_image}')`;
  }
}

/* Fills the About page photo slot when about_image is set; otherwise
   leaves the dashed placeholder visible as a hint of where to add one. */
function applyAboutImage(settings) {
  const slot = document.querySelector(".photo-slot");
  if (slot && settings.about_image) {
    slot.classList.remove("photo-slot-empty");
    slot.style.backgroundImage = `url('${settings.about_image}')`;
    slot.textContent = "";
  }
}
