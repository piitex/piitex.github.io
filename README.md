# RenGL website

A small static site for RenGL and the products built with it. Five pages, no build step, no dependencies.

```
index.html      home: hero, showcase tabs, links to the other pages, get started
features.html   the nine feature areas
editor.html     the RenGL Editor: what it does, screenshots, how to run it
code.html       detailed Java examples, in the same order as the features
products.html   OpenZip, CCA, SketchGL, Phorg
css/style.css   all the styling (colors are variables at the top)
js/layout.js    the top bar and footer, shared by every page
js/main.js      tabs, copy buttons, code colouring, scroll animations, mobile menu
assets/img/     screenshots and animations
```

## Preview

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8080
```

then visit http://localhost:8080.

## Editing

- **Menu links and footer:** edit the lists at the top of `js/layout.js`. They change on every page at once.
- **A product:** in `products.html`, each product is one `<article class="product">` block.
  - **Download link:** replace `<span class="soon">…</span>` with `<a class="link" href="YOUR-URL">Download ↗</a>`.
  - **Screenshot:** each card has a `<div class="shot"><img …></div>` at the top. Replace the file in `assets/img/`
    (16:9 works best, about 1400 px wide) or point `src` at a new one.
- **A feature:** in `features.html`, each area is one `<section class="feature">` block. The pills under "Key classes"
  are plain `<code>` tags.
- **A code example:** in `code.html`, copy an existing `<div class="code reveal">` block and replace the code. Plain Java
  between the `<code>` tags is coloured automatically. The `id` on `<code>` must match the `data-copy` on its Copy
  button. Use `language-json` instead of `language-java` for JSON. Inside code, write `<` as `&lt;` and `&` as `&amp;`
  (so `List<String>` becomes `List&lt;String&gt;`).
- **Colors:** change the `--purple`, `--pink`, `--cyan` variables at the top of `css/style.css`.

The Java examples on `code.html` were compiled against the engine's source when the page was written. If the engine's
API changes, re-check them against its documentation.

## Publishing

Any static host works: GitHub Pages (push this folder and enable Pages), Netlify or Cloudflare Pages (drag and drop the folder).
