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

### How to Make it Work in Next.js (App Router)

In Next.js, instead of manually adding `<meta>` tags to your HTML, you define a `metadata` object in your `src/app/layout.tsx` or `src/app/page.tsx` file. Next.js automatically generates the correct HTML tags for you.

Here is the setup for your portfolio:

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marmik Soni | Web Designer & Developer',
  description: 'Designing and building digital products end-to-end that work for users and business goals.',
  
  // Open Graph / Facebook / WhatsApp / LinkedIn
  openGraph: {
    type: 'website',
    url: 'https://marmiksoni.co/',
    title: 'Marmik Soni | Web Designer & Developer',
    description: 'Designing and building digital products end-to-end that work for users and business goals.',
    siteName: 'Marmik Soni Portfolio',
    images: [{
      url: 'https://marmiksoni.co/og-image.png', // Must be an absolute URL
      width: 1200,
      height: 630,
      alt: 'Marmik Soni Portfolio Preview',
    }],
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: 'Marmik Soni | Web Designer & Developer',
    description: 'Designing and building digital products end-to-end that work for users and business goals.',
    images: ['https://marmiksoni.co/og-image.png'], // Must be an absolute URL
  },
};
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
