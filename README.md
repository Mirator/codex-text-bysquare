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

The project is ready for the default **GitHub Pages** workflow that GitHub
generates when you choose **GitHub Actions** as the deployment source. The
workflow installs dependencies, runs `npm run build`, and publishes the contents
of the `dist` directory. No custom workflow file is required in the repository.

When configuring Pages, select **Static HTML** (or the generic workflow) and use
the default build command (`npm run build`) and output directory (`dist`). The
Vite configuration uses a relative base path so the generated bundle works both
for user/organization sites and for repository project pages.
