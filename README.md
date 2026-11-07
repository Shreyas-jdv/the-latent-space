# Graphite Notes

A responsive, single-file personal blog starter with a graphite, white, charcoal, and orange visual identity.

## Preview
Open `index.html` in a modern browser. An internet connection is used for the Google Fonts; the rest of the page runs locally.

## Features
- Responsive editorial landing page and article cards
- Domain filters for Python Programming, Artificial Intelligence, and Data Science
- AI subtopic filters including ML, deep learning, GenAI, agents, LLMs, RAG, NLP, computer vision, prompt engineering, and context engineering
- Search, sorting, and owner-mode manual reordering
- Create and edit posts in the browser
- Starter articles that can be replaced with your own writing
- Newsletter form placeholder

## Owner mode
In `index.html`, change `OWNER_PIN = "change-this-pin"` to a passphrase of your choice before using the owner tools. Click **Owner** in the top navigation. In owner mode, you can add posts, edit posts, and use the up/down arrows to change their order. The posts and order are stored in this browser's local storage.

**Important:** This is a front-end prototype. A passphrase embedded in HTML is not secure, and local-storage content is only available in that browser/device. It does not publish changes to a live site or sync across devices. For a public production blog, use proper authentication and a CMS/database (for example, a small admin backend, Supabase, or a headless CMS), and connect the newsletter form to an email provider.

## Publish
You can deploy this static prototype to GitHub Pages, Netlify, or Vercel. For a real multi-device publishing workflow, connect a backend before launch.
