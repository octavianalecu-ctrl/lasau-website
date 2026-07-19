# Site Lasău

Website simplu, static (HTML/CSS/JS), bilingv (RO/EN), pentru satul Lasău, județul Hunedoara.
Tot conținutul (text + imagini) de pe toate paginile este editabil din panoul de administrare —
nu e nevoie de cod pentru actualizări curente.

## Structură

```
index.html          Acasă
news.html            Știri comunitare (listă + articol individual via ?slug=)
history.html         Istoria satului (listă + articol individual via ?slug=)
about.html           Despre sat
contact.html         Contact

content/pages/home.json        text Acasă (hero, titluri secțiuni) + articole recomandate
content/pages/about.json       text pagina Despre sat + fotografie
content/pages/contact.json     text pagina Contact + email
content/news/news.json         titlu/intro pagina Știri + toate articolele de știri
content/history/history.json   titlu/intro pagina Istorie + toate articolele de istorie

assets/css/style.css            stiluri
assets/js/translations.js       texte fixe de interfață (navigare, butoane) — nu conținut
assets/js/i18n.js                comutare RO/EN pentru interfață
assets/js/layout.js              antet + subsol comune
assets/js/posts.js               randare articole (listă, detaliu, selecție recomandate)
assets/js/content.js             randare conținut per-pagină din content/pages/*.json

admin/                           panou de administrare (Decap CMS) pentru editare fără cod
```

## Testare locală

Nu poți deschide fișierele direct cu dublu-clic (fetch() al `.json` e blocat de browser pe `file://`).
Rulează un server local din folderul proiectului, de exemplu:

```bash
python3 -m http.server 8000
```

apoi deschide `http://localhost:8000`.

## Ce se poate edita din panoul de administrare (`/admin/`)

Odată activat CMS-ul (pași mai jos), din `/admin/` poți edita, fără cod:

- **Pagina Acasă** — titlu și subtitlu (hero), fotografia principală, titlurile secțiunilor de
  Știri/Istorie, și **ce articole apar pe prima pagină** (selecție manuală din articolele
  existente; dacă nu selectezi nimic, se afișează automat cele mai recente 2 din fiecare).
- **Pagina Despre sat** — titlu, introducere, fotografie, textul din „Date generale" și „Cum
  ajungeți în Lasău".
- **Pagina Contact** — titlu, introducere, datele primăriei, textul despre site și email-ul
  de contact.
- **Știri** — titlul și introducerea paginii, plus fiecare articol (titlu, rezumat, text
  integral, fotografie opțională, dată).
- **Istorie** — la fel ca Știri.

Toate câmpurile de text au variantă RO și, opțional, EN (dacă lipsește varianta EN, site-ul
afișează automat textul RO și pentru vizitatorii care aleg engleză).

## Cum se adaugă o știre sau un articol de istorie

### Varianta simplă (editare directă de fișier)

Deschide `content/news/news.json` (sau `content/history/history.json`) și adaugă un nou obiect
în lista `posts`, după modelul celor existente.

Câmpuri: `slug` (identificator unic, fără spații/diacritice), `date` (AAAA-LL-ZZ), `title_ro`,
`title_en`, `excerpt_ro`, `excerpt_en`, `body_ro`, `body_en`, `image` (opțional). Paragrafele
din `body` se separă cu o linie goală.

### Varianta pentru voluntari non-tehnici (panou de administrare)

Proiectul include `admin/` — o interfață web (Decap CMS) unde oricine primește acces poate
adăuga/edita conținut printr-un formular, fără să atingă cod. Pentru activare:

1. Publică site-ul pe [Netlify](https://netlify.com) (gratuit) — leagă folderul/repo-ul de proiect.
2. În Netlify: **Site settings → Identity → Enable Identity**.
3. Tot acolo: **Identity → Services → Git Gateway → Enable Git Gateway**.
4. Invită editorii din **Identity → Invite users**.
5. Editorii accesează `https://numele-site-ului.netlify.app/admin/`, își fac cont și pot edita
   direct din browser.

Fiecare modificare din panou este salvată automat printr-un commit git, deci istoricul
modificărilor rămâne vizibil.

### Testare locală a panoului de administrare (opțional, pentru dezvoltare)

Poți testa `/admin/` fără cont Netlify: decomentează `local_backend: true` în
`admin/config.yml`, rulează în paralel `npx decap-server`, apoi accesează `/admin/` — CMS-ul
va folosi un buton simplu „Login" (fără Identity) și va salva direct în fișierele locale prin
git. **Recomentează `local_backend: true` înainte de a publica** — e doar pentru testare.

## Selecția articolelor recomandate pe Acasă

Câmpurile „Știri recomandate" / „Articole de istorie recomandate" din editorul paginii Acasă
sunt căsuțe de căutare care listează articolele existente după titlu — le poți selecta pe cele
dorite, în orice ordine. Lăsate goale, Acasă afișează automat cele 2 cele mai recente din
fiecare secțiune.

## Fotografii

- **Articole (Știri/Istorie)** — fiecare postare are un câmp opțional „Fotografie". Dacă lipsește,
  cardul afișează automat un fundal colorat de tip gradient (variază de la o postare la alta).
- **Fotografia principală (Acasă)** și **fotografia din Despre sat** — câmpuri de imagine în
  editorul paginii respective. Cât timp lipsesc, Acasă arată ilustrația cu dealuri, iar Despre
  sat arată un cadru punctat cu mesajul „Adaugă o fotografie din sat".

## Găzduire

Orice găzduire de site static funcționează (Netlify, GitHub Pages, Vercel etc.). Pentru panoul
de administrare cu editori non-tehnici, Netlify e cea mai simplă opțiune (Identity + Git Gateway
integrate).

## De completat

- Textele din `content/pages/about.json` (date generale, indicații de acces) și
  `content/pages/contact.json` (date primărie, email real) sunt momentan text-placeholder — de
  înlocuit cu informații reale (din panou sau direct în fișier).
- Articolele de istorie din `content/history/history.json` sunt puncte de plecare — de completat
  cu informații verificate, surse și eventual fotografii vechi.
