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

The static assets in the `dist` folder can be deployed to GitHub Pages. The Vite
configuration uses `/codex-text-bysquare/` as the base path so the bundle works
when published from this repository.
