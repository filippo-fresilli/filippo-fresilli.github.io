# ciaobricks — landing page

Static landing page for **ciaobricks**, a native iOS app that turns photos
into brick mosaics. No build step, no dependencies — just HTML, CSS and a
little vanilla JS.

## Files

```
index.html        # the page
style.css         # styles
main.js           # mosaic animation + waitlist form handler
assets/favicon.svg
```

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy on GitHub Pages

This folder is meant to live at the **root** of the public
`ciaobricks-landing` repo. Once the files are there:

1. **Settings → Pages**
2. **Source:** `Deploy from a branch`
3. **Branch:** `main` · **Folder:** `/ (root)`
4. Save. Your site goes live at `https://<user>.github.io/ciaobricks-landing/`.

## Custom domain

When you buy the domain:

1. Add a file named `CNAME` at the repo root containing only your domain, e.g.
   ```
   ciaobricks.com
   ```
2. **Settings → Pages → Custom domain:** enter the same domain (this also
   creates/updates the `CNAME` file).
3. At your domain registrar, add the DNS records:
   - **Apex (`ciaobricks.com`)** — four `A` records:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (and optionally the matching `AAAA` records for IPv6).
   - **`www`** — a `CNAME` record pointing to `<user>.github.io`.
4. Back in **Settings → Pages**, enable **Enforce HTTPS** once the certificate
   is issued (can take a few minutes).

## Waitlist form

The form in `index.html` currently has `action="#"`, so submissions are
acknowledged client-side only. To actually collect emails, point the form at a
real endpoint (e.g. [Formspree](https://formspree.io), Mailchimp, Buttondown):

```html
<form action="https://formspree.io/f/yourid" method="POST" ...>
```
