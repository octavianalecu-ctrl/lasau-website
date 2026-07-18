# Site Lasău

Website simplu, static (HTML/CSS/JS), bilingv (RO/EN), pentru satul Lasău, județul Hunedoara.

## Structură

```
index.html         Acasă — prezentare + ultimele știri/articole
news.html           Știri comunitare (listă + articol individual via ?slug=)
history.html        Istoria satului (listă + articol individual via ?slug=)
about.html          Despre sat
contact.html        Contact
content/news/news.json         datele știrilor
content/history/history.json   datele articolelor de istorie
content/settings.json          fotografia principală (Acasă) și fotografia din pagina Despre sat
assets/css/style.css           stiluri
assets/js/                     translations.js, i18n.js, layout.js, posts.js, settings.js
admin/                         panou de administrare (Decap CMS) pentru postare fără cod
```

## Testare locală

Nu poți deschide fișierele direct cu dublu-clic (fetch() al `.json` e blocat de browser pe `file://`).
Rulează un server local din folderul proiectului, de exemplu:

```bash
python3 -m http.server 8000
```

apoi deschide `http://localhost:8000`.

## Cum se adaugă o știre sau un articol de istorie

### Varianta simplă (editare directă de fișier)

Deschide `content/news/news.json` (sau `content/history/history.json`) și adaugă un nou obiect
în lista `posts`, după modelul celor existente. Câmpurile `_en` sunt opționale — dacă lipsesc,
site-ul afișează automat versiunea RO și în engleză.

Câmpuri: `slug` (identificator unic, fără spații/diacritice), `date` (AAAA-LL-ZZ), `title_ro`,
`title_en`, `excerpt_ro`, `excerpt_en`, `body_ro`, `body_en`. Paragrafele din `body` se separă
cu o linie goală.

### Varianta pentru voluntari non-tehnici (panou de administrare)

Proiectul include `admin/` — o interfață web (Decap CMS) unde oricine primește acces poate
adăuga/edita știri și articole printr-un formular, fără să atingă cod. Pentru activare:

1. Publică site-ul pe [Netlify](https://netlify.com) (gratuit) — leagă folderul/repo-ul de proiect.
2. În Netlify: **Site settings → Identity → Enable Identity**.
3. Tot acolo: **Identity → Services → Git Gateway → Enable Git Gateway**.
4. Invită editorii din **Identity → Invite users**.
5. Editorii accesează `https://numele-site-ului.netlify.app/admin/`, își fac cont și pot adăuga
   postări direct din browser.

Fiecare postare adăugată din panou este salvată automat înapoi în `news.json` / `history.json`
prin git, deci istoricul modificărilor rămâne vizibil.

## Cum se înlocuiesc imaginile principale cu poze reale din sat

Componentele principale sunt gândite să fie ușor de personalizat cu poze reale, fără a umbla în cod:

- **Fotografia din articole (Știri/Istorie)** — fiecare postare are un câmp opțional „Fotografie”
  în panoul de administrare. Dacă nu adaugi o poză, cardul afișează automat un fundal colorat de
  tip gradient (variază de la o postare la alta), deci site-ul arată intenționat chiar și fără poze.
- **Fotografia principală de pe Acasă (hero)** și **fotografia din pagina Despre sat** se controlează
  din `content/settings.json` (câmpurile `hero_image` și `about_image`). Cât timp sunt goale, pe
  Acasă apare ilustrația cu dealuri, iar pe Despre sat apare un cadru punctat cu mesajul „Adaugă o
  fotografie din sat”.

Există două moduri de a adăuga pozele reale:

1. **Din panoul de administrare** (`admin/`, după activarea CMS-ului descrisă mai sus) — secțiunea
   „Setări site / Site settings” are câmpuri de upload pentru fotografia de pe Acasă și cea de pe
   Despre sat; se încarcă direct din browser, fără cod.
2. **Manual** — pune fișierul poză în `assets/img/` (ex: `assets/img/hero-lasau.jpg`) și scrie calea
   în `content/settings.json`, ex: `"hero_image": "assets/img/hero-lasau.jpg"`.

## Găzduire

Orice găzduire de site static funcționează (Netlify, GitHub Pages, Vercel etc.). Pentru panoul
de administrare cu editori non-tehnici, Netlify e cea mai simplă opțiune (Identity + Git Gateway
integrate).

## De completat

- Textele din `about.html` (date generale, indicații de acces) și `contact.html` (date primărie,
  email real) sunt momentan text-placeholder — de înlocuit cu informații reale.
- Articolele de istorie din `content/history/history.json` sunt puncte de plecare — de completat
  cu informații verificate, surse și eventual fotografii vechi.
