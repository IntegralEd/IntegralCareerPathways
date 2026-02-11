# Integral Career Pathways

A career connected learning microsite focused on postsecondary advising supports, counselor training, and workforce partnerships.

## Overview

This site showcases Integral Ed's career connected learning services, including:
- Postsecondary advising supports for students
- Blended counselor training and enablement
- Mentoring and workforce organization partnerships

**Domains:**
- Primary: [integralcareerpathways.com](https://integralcareerpathways.com)
- Redirect: integralcareerpathways.org → .com

## Site Structure

```
/                   - Home page with value proposition
/approach.html      - Our approach to career connected learning
/case-studies.html  - Case study examples
/request-demo.html  - Demo request form with Web3Forms
/privacy.html       - Privacy policy
```

## Development

### Prerequisites

- Node.js (for build script)
- Python 3 (for local dev server)

### Local Development

1. **Start development server:**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:8000`

2. **Edit content:**
   - HTML pages: `/src/*.html`
   - Styles: `/src/css/styles.css`
   - JavaScript: `/src/js/main.js`

3. **Build for production:**
   ```bash
   npm run build
   ```
   Outputs to `/dist`

4. **Preview production build:**
   ```bash
   npm run preview
   ```
   Opens at `http://localhost:8080`

## Content Editing

### Page Locations

- **Home page:** `/src/index.html`
- **Approach:** `/src/approach.html`
- **Case Studies:** `/src/case-studies.html`
- **Request Demo:** `/src/request-demo.html`
- **Privacy:** `/src/privacy.html`

### Styling System

This site uses an existing CSS component system defined in `/src/css/styles.css`:

**Components:**
- `.hero` - Hero sections with centered content
- `.service-card` - Card-based content blocks
- `.process-card` - Numbered step cards
- `.btn-primary` / `.btn-secondary` - Call-to-action buttons
- `.section` / `.section-alt` - Alternating section backgrounds

**Colors:**
- Primary: `#600b68` (Integral Ed plum purple)
- Typography: Helvetica Neue

**Do not modify the core CSS system.** Use existing classes and components.

### Image Placeholders

This site uses labeled image placeholders instead of real images:

```html
<div data-image-placeholder="Label_Text_Here"></div>
```

JavaScript automatically renders these as bordered placeholder boxes with the label text.

## Web3Forms Configuration

### Access Key Configuration

The demo request form uses [Web3Forms](https://web3forms.com) for submissions.

**Current Setup:**

- Access key is configured in `/src/request-demo.html`
- The key is stored in `.env` for reference (excluded from git)
- Web3Forms access keys are designed to be used client-side and are domain-restricted

**Security Note:**

Web3Forms access keys are safe to expose in client-side code because:
- They're rate-limited by domain
- You can restrict them to specific domains in your Web3Forms dashboard
- They only allow form submissions, not account access

**To update the key:**

Edit `/src/request-demo.html` and replace the value in:
```html
<input type="hidden" name="access_key" value="YOUR_KEY_HERE">
```

### Form Fields

The request form captures:

**User-facing fields:**
- `first_name`, `last_name`
- `email`
- `organization`
- `role`
- `exploring` (select dropdown)
- `message` (optional)

**Hidden attribution fields:**
- `source_url` - Full URL where form was submitted
- `referrer` - Referring page
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`

### Attribution Tracking

Attribution data is automatically captured client-side when the page loads:

```javascript
// Captures current URL
source_url = window.location.href

// Captures referrer
referrer = document.referrer

// Parses UTM parameters from query string
utm_* = parsed from URL
```

All fields are included in the form submission to Web3Forms.

## Using UTM Parameters in Outreach

To track campaign performance, add UTM parameters to links in your outreach:

### Example URLs

**Email campaign:**
```
https://integralcareerpathways.com/?utm_source=email&utm_medium=newsletter&utm_campaign=q1_2026
```

**LinkedIn post:**
```
https://integralcareerpathways.com/?utm_source=linkedin&utm_medium=social&utm_campaign=counselor_training
```

**Partner referral:**
```
https://integralcareerpathways.com/?utm_source=partner&utm_medium=referral&utm_campaign=kipp_network
```

### UTM Parameter Guide

- `utm_source` - Where traffic came from (email, linkedin, partner)
- `utm_medium` - Channel type (newsletter, social, referral)
- `utm_campaign` - Campaign name (q1_2026, counselor_training)
- `utm_content` - Content variant (optional)
- `utm_term` - Keyword or targeting (optional)

These parameters will be captured when users submit the demo request form.

## Deployment

### Netlify Setup

1. **Connect repository** to Netlify
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Domain configuration:**
   - Add custom domains: `integralcareerpathways.com` and `integralcareerpathways.org`
   - Netlify automatically handles redirects from .org to .com (configured in `netlify.toml`)

### Environment Variables

If using Netlify environment variables for Web3Forms:

1. Add `WEB3FORMS_ACCESS_KEY` in Netlify dashboard
2. Update build script to inject into HTML during build

## SEO

### Meta Tags

Each page includes:
- Unique `<title>` and meta description
- Open Graph tags for social sharing
- Canonical URL pointing to `.com` domain

### Files

- `/src/robots.txt` - Search engine directives
- `/src/sitemap.xml` - Site structure for search engines

Update `sitemap.xml` if adding new pages.

## Project Structure

```
integralcareerpathways/
├── src/
│   ├── index.html
│   ├── approach.html
│   ├── case-studies.html
│   ├── request-demo.html
│   ├── privacy.html
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── assets/
│       └── [favicon files]
├── dist/ (generated by build)
├── build.js
├── package.json
├── netlify.toml
└── README.md
```

## Support

For questions or issues:
- **Email:** info@integral-ed.com
- **Parent organization:** [Integral Ed Services, LLC](https://www.integral-ed.com)

## License

© 2026 Integral Ed Services, LLC. All rights reserved.
