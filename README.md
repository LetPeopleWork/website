# LetPeopleWork GmbH Website

The official website for LetPeopleWork GmbH, hosted at [https://letpeople.work](https://letpeople.work).

## About

LetPeopleWork GmbH is a consultancy focused on helping organizations improve their software delivery and team effectiveness.

## Technology Stack

This website is built with modern web technologies:

- **React** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library

## Development

### Prerequisites

- Node.js (recommended: install via [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn package manager

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/LetPeopleWork/website.git
   cd website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173` to view the site.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This website is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The site is available at [https://letpeople.work](https://letpeople.work).

## SEO Optimization

This website is optimized for search engines with the following features:

### Implemented SEO Features

- ✅ **Structured Data (JSON-LD)**: Organization, SoftwareApplication, BreadcrumbList, WebSite, and VideoObject schemas
- ✅ **Enhanced Meta Tags**: Comprehensive Open Graph and Twitter Card tags with image dimensions
- ✅ **Resource Hints**: Preconnect and DNS-prefetch for performance
- ✅ **Lazy Loading**: Images below the fold load lazily to improve Core Web Vitals
- ✅ **Image Optimization**: Width and height attributes on all images to prevent layout shift
- ✅ **Updated Sitemap**: Current lastmod dates with video sitemap support
- ✅ **Breadcrumb Navigation**: Structured data for better search result display
- ✅ **Mobile Optimization**: Theme color and apple-touch-icon support

### Pending Manual Steps

To complete the SEO optimization, you need to manually add these files to the `public/` directory:

1. **manifest.json** - Create this file with the following content:
```json
{
  "name": "LetPeopleWork - Flow Metrics & Forecasting",
  "short_name": "LetPeopleWork",
  "description": "Transform your organization with Lighthouse - the leading open-source flow metrics and forecasting tool.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1a1a1a",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/favicon.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/favicon.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["business", "productivity"]
}
```

2. **apple-touch-icon.png** - Create a 180x180px PNG icon:
   - Use your favicon.png or logo
   - Resize to 180x180 pixels
   - Save as `apple-touch-icon.png` in the `public/` directory

3. **Image Optimization** - Convert images to WebP format:
   - Use tools like [Squoosh](https://squoosh.app/) or ImageMagick
   - Convert all PNG/JPG images in `src/assets/` to WebP
   - Keep originals as fallbacks
   - Update image imports to use WebP with PNG/JPG fallbacks

### Example WebP Implementation

```tsx
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.png" alt="Description" width="800" height="600" loading="lazy" />
</picture>
```

### Google Search Console Setup

1. Verify your site ownership in [Google Search Console](https://search.google.com/search-console)
2. Submit your sitemap: `https://letpeople.work/sitemap.xml`
3. Monitor Core Web Vitals and indexing status
4. Check for mobile usability issues
5. Review rich results for structured data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

© 2025 LetPeopleWork GmbH. All rights reserved.
