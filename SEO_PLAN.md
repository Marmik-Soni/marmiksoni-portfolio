# Open Graph (OG) Setup Plan

Yes, that is an **Open Graph (OG)** link preview. It relies on HTML meta tags placed inside the `<head>` element of your website so platforms like WhatsApp, Slack, LinkedIn, Twitter/X, and Facebook can fetch the title, description, and preview card image.

---

### PNG vs. SVG for Open Graph Images

**Use PNG or JPG/JPEG. Do NOT use SVG.**

Most scrapers (including WhatsApp, iMessage, Facebook, and Twitter) **do not support SVG** for Open Graph preview images. If you use SVG, the preview image will fail to render or fall back to a blank card.

* **Recommended Image Specs:**
* **File format:** `.png` or `.jpg`
* **Dimensions:** `1200 x 630` pixels (standard 1.91:1 aspect ratio for modern large preview cards)
* **File size:** Keep it under **300 KB** (WhatsApp in particular will discard images that take too long to fetch or exceed ~300KB–1MB limits).

---

### How to Make it Work Everywhere

Add the following Open Graph and Twitter Card `<meta>` tags inside the `<head>` section of your HTML page:

```html
<!-- Primary Meta Tags -->
<title>Zajno Digital Studio | Web Design, Branding, 3D, Animation & Webflow Development Services</title>
<meta name="title" content="Zajno Digital Studio | Web Design, Branding, 3D, Animation & Webflow Development Services" />
<meta name="description" content="We are making award-winning immersive websites and apps with cool custom graphics, photos, videos, and animations. Let's Collaborate!" />

<!-- Open Graph / Facebook / WhatsApp / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://zajno.com/" />
<meta property="og:title" content="Zajno Digital Studio | Web Design, Branding, 3D, Animation & Webflow Development Services" />
<meta property="og:description" content="We are making award-winning immersive websites and apps with cool custom graphics, photos, videos, and animations. Let's Collaborate!" />
<meta property="og:image" content="https://zajno.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://zajno.com/" />
<meta name="twitter:title" content="Zajno Digital Studio | Web Design, Branding, 3D, Animation & Webflow Development Services" />
<meta name="twitter:description" content="We are making award-winning immersive websites and apps with cool custom graphics, photos, videos, and animations. Let's Collaborate!" />
<meta name="twitter:image" content="https://zajno.com/og-image.png" />
```

---

### Checklist for Maximum Compatibility

1. **Absolute URLs:** Always use absolute URLs (`https://yourdomain.com/og-image.png`) for `og:image` and `og:url`. Relative paths like `/og-image.png` will fail on many platforms.
2. **HTTPS:** Make sure the image URL is served over `https://`.
3. **No Auth/Blocking:** Ensure the image file is publicly accessible and not behind password protection, hotlink protection, or a strict `robots.txt` rule blocking scrapers.
4. **Caching & Testing:** Social platforms cache link previews heavily. If you change your metadata or image, use official debuggers to force scrapers to refresh their cache:
* **Facebook / WhatsApp Sharing Debugger:** `https://developers.facebook.com/tools/debug/`
* **LinkedIn Post Inspector:** `https://www.linkedin.com/post-inspector/`
* **Twitter Card Validator / Preview:** Test by drafting a tweet or using platform tools.
