# PAY by Square QR generator

This project provides a single-page application that encodes the provided payment
information into a PAY by Square QR code. The page now runs as a plain
browser-ready ES module without any bundlers or build tooling.

## Usage

1. Open `index.html` in any modern browser.
2. Click **Vygenerovat nový QR kód** to create a fresh payment message and QR.

The page fetches the [`bysquare`](https://www.npmjs.com/package/bysquare) and
[`qrcode`](https://www.npmjs.com/package/qrcode) modules directly from a CDN at
runtime, keeping the repository lightweight.
