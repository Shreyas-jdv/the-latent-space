# The Latent Space

**The Latent Space** is a personal AI knowledge journal by Shreyas Sanjay Jadhav. It documents ideas, experiments, projects, and notes across artificial intelligence, machine learning, large language models, and agentic systems.

## Overview

The site uses a responsive design with a graphite, off-white, and orange visual identity.

### Features

- Responsive navigation with Explore, About, and Topics links.
- Homepage hero section with calls to action.
- Three-column author section: heading, author introduction, and portrait.
- Journal articles displayed as responsive cards.
- Each article card supports a domain category, optional subdomain, title, thumbnail, and destination link.
- Responsive layouts for tablet and mobile screens.
- Subtle hover effects and typography styling.

## Suggested project structure

```text
the-latent-space/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── Profile.png
│   ├── pumpkin-logo.png
│   └── thumbnails/
├── articles/
├── README.md
└── LICENSE
```

This is a suggested structure. Keep the paths in your HTML consistent with your actual folders and filenames.

## Check out the website here

[The Latent Space ](https://shreyas-jdv.github.io/the-latent-space/).

## Adding a journal card

Add another card inside the `.blog-grid` element in `index.html`:

```html
<a href="articles/your-article.html" class="blog-card">
  <div class="blog-thumbnail">
    <img src="assets/thumbnails/your-thumbnail.png"
         alt="A concise description of the article image">
    <span class="blog-category">DOMAIN CATEGORY</span>
  </div>

  <div class="blog-card-content">
    <span class="blog-subdomain">Optional subdomain</span>
    <h3>Your article title</h3>
    <p class="blog-read-more">Read article <span>↗</span></p>
  </div>
</a>
```

Update the link, image path, category, optional subdomain, and title. Remove the `.blog-subdomain` element when an article does not need a subdomain. Ensure the destination page exists.

## Updating the author portrait

The About section references the portrait as follows:

```html
<img src="assets/Profile.png"
     alt="Portrait of Shreyas Jadhav"
     class="author-photo">
```

Replace `assets/Profile.png` with your own image path. The `.author-photo` styling uses `object-fit: cover` to fit the image into its frame.

## Customisation

- **Colours:** The current palette uses graphite (`#292B2E`), orange (`#F47735`), and off-white (`#F7F7F5`).
- **Typography:** The design uses Space Grotesk for prominent headings. Make sure the font is loaded if you retain it.
- **Navigation:** Update header links to match the sections and pages in your site.
- **Article cards:** Duplicate or remove `.blog-card` elements as the journal grows.
- **Images:** Store thumbnails in `assets/thumbnails/`, or adjust the paths to match your own structure.

## Deployment

This is a static HTML, CSS, and JavaScript project. It can be hosted on GitHub Pages, Netlify, Vercel, or another static hosting service. Follow the provider's deployment instructions and select the folder containing `index.html` as the published directory.

## Accessibility checklist

- Use meaningful `alt` text for informative images.
- Keep heading levels in a logical order.
- Use descriptive link text and valid destination paths.
- Check text contrast when changing colours.
- Test navigation and cards with a keyboard and on mobile devices.

## License

The source code in this repository is licensed under the MIT License. See [LICENSE](LICENSE) for the full terms.

Unless otherwise stated, personal branding, photographs, logos, article text, and other original editorial assets are not automatically included in the software license. Obtain permission before reusing those materials.
