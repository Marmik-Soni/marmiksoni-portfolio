# SEO, Search Console & Social Preview Setup

This document records the SEO, indexing, and analytics configuration for **https://marmiksoni.co**.

---

## 1. Indexing & Discovery

- **Robots file:** `/robots.txt`
  - Allows all user agents.
  - Declares the sitemap location at `https://marmiksoni.co/sitemap.xml`.
- **Sitemap:** `/sitemap.xml`
  - Points to `https://marmiksoni.co/`.
  - Priority: `1.0`, Change frequency: `monthly`.

### Google Search Console Action:
1. Log in to [Google Search Console](https://search.google.com/search-console).
2. Select the `marmiksoni.co` property.
3. Open **Sitemaps** from the left navigation.
4. Under "Add a new sitemap", type `sitemap.xml` and click **Submit**.

---

## 2. Open Graph & Social Previews

Configured inside `<head>` in `index.html`:

- **Canonical URL:** `https://marmiksoni.co/`
- **OG Type:** `website`
- **OG Image:** `https://marmiksoni.co/og-image.png` (Recommended specs: `1200 x 630` px, PNG/JPG, < 300 KB).
- **Twitter Card:** `summary_large_image`

### Testing & Debugging Previews:
- **LinkedIn Post Inspector:** `https://www.linkedin.com/post-inspector/`
- **Facebook / WhatsApp Sharing Debugger:** `https://developers.facebook.com/tools/debug/`
- **Twitter / X Card Preview:** Test via tweet compose or card validator.

---

## 3. Structured Data (JSON-LD)

Implemented via Schema.org `Person`:
- Name: Marmik Soni
- Title: Creative Developer & Designer
- URL: `https://marmiksoni.co`
- SameAs: LinkedIn, Bluesky

---

## 4. Google Analytics 4 (GA4) Integration

When your GA4 Measurement ID (`G-XXXXXXXXXX`) is ready:
1. Insert the tag into `<head>` in `index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX');
</script>
```
2. Link GA4 to Search Console:
   - Go to Google Analytics > **Admin** > **Search Console Links** > Link `marmiksoni.co`.
