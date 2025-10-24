# PAY by Square QR generator

This project provides a single-page application that encodes the provided payment
information into a PAY by Square QR code. It is built with [Vite](https://vitejs.dev/)
and uses the [`bysquare`](https://www.npmjs.com/package/bysquare) package to
produce compliant QR payloads.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

GitHub Pages deployments are handled by the `Deploy to GitHub Pages` workflow in
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow
builds the site on every push to `main` and publishes the production-ready files
from the `dist` directory.

To enable automatic deployments:

1. Open the repository settings on GitHub.
2. Navigate to **Pages** and choose **GitHub Actions** as the deployment source.
3. Trigger a push to `main` (or run the workflow manually) to publish the site.

The Vite configuration uses `/codex-text-bysquare/` as the base path so the
bundle works when published from this repository.
