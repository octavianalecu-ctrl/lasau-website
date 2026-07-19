/* Fetches a content JSON file (news.json / history.json) and renders
   either a card list or a single article, re-rendering on language toggle. */

async function fetchPosts(jsonPath) {
  const res = await fetch(jsonPath, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${jsonPath}: ${res.status}`);
  const data = await res.json();
  const posts = (data.posts || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

function formatDate(dateStr, lang) {
  try {
    return new Date(dateStr).toLocaleDateString(lang === "ro" ? "ro-RO" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

/* Picks one of 4 warm gradient placeholders deterministically from the slug,
   so posts without a real photo still look varied and intentional. */
function thumbClassFor(slug) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return `thumb-grad-${(hash % 4) + 1}`;
}

function thumbStyleFor(post) {
  if (post.image) return ` style="background-image:url('${post.image}')"`;
  return "";
}

function thumbClassAttrFor(post) {
  return post.image ? "" : ` ${thumbClassFor(post.slug)}`;
}

/* Picks posts by slug in the given order (for a "featured on home" selection
   made in the CMS). Falls back to the 2 most recent posts when no slugs
   are configured, so the home page still looks right out of the box. */
function pickFeatured(posts, slugs) {
  if (!slugs || slugs.length === 0) return posts.slice(0, 2);
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  return slugs.map((s) => bySlug.get(s)).filter(Boolean);
}

/* Renders a grid of post cards. `limit` caps how many are shown (home page previews). */
function renderPostCards(container, posts, { basePage, limit } = {}) {
  const lang = getLang();
  const dict = TRANSLATIONS[lang];
  const list = typeof limit === "number" ? posts.slice(0, limit) : posts;

  if (list.length === 0) {
    const emptyKey = basePage === "news.html" ? "empty_news" : "empty_history";
    container.innerHTML = `<p class="empty-state" data-i18n="${emptyKey}">${dict[emptyKey]}</p>`;
    return;
  }

  container.innerHTML = list
    .map((post) => {
      const title = post[`title_${lang}`] || post.title_ro || post.title_en || "";
      const excerpt = post[`excerpt_${lang}`] || post.excerpt_ro || post.excerpt_en || "";
      const href = `${basePage}?slug=${encodeURIComponent(post.slug)}`;
      return `
        <article class="card">
          <a href="${href}" class="card-thumb${thumbClassAttrFor(post)}"${thumbStyleFor(post)} aria-hidden="true"></a>
          <div class="card-body">
            <div class="date">${formatDate(post.date, lang)}</div>
            <h3><a href="${href}">${escapeHtml(title)}</a></h3>
            <p class="excerpt">${escapeHtml(excerpt)}</p>
            <a href="${href}" class="read-more" data-i18n="read_more">${dict.read_more}</a>
          </div>
        </article>`;
    })
    .join("");
}

/* Renders a single article (from ?slug=) or, if no slug present, returns false
   so the caller can fall back to rendering the list. */
function renderPostDetail(container, posts, { listPage } = {}) {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  if (!slug) return false;

  const lang = getLang();
  const dict = TRANSLATIONS[lang];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    container.innerHTML = `
      <a class="back-link" href="${listPage}" data-i18n="back_to_list">${dict.back_to_list}</a>
      <p class="empty-state">${dict.not_found}</p>`;
    return true;
  }

  const title = post[`title_${lang}`] || post.title_ro || post.title_en || "";
  const body = post[`body_${lang}`] || post.body_ro || post.body_en || "";
  const bodyHtml = body
    .split(/\n\s*\n/)
    .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br>")}</p>`)
    .join("");
  const imageHtml = post.image
    ? `<div class="card-thumb" style="height:260px;border-radius:var(--radius-sm);margin-bottom:1.25rem;background-image:url('${post.image}')"></div>`
    : "";

  container.innerHTML = `
    <a class="back-link" href="${listPage}" data-i18n="back_to_list">${dict.back_to_list}</a>
    <article class="article">
      ${imageHtml}
      <div class="date">${formatDate(post.date, lang)}</div>
      <h1>${escapeHtml(title)}</h1>
      ${bodyHtml}
    </article>`;
  return true;
}
