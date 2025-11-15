# Marq Parking Automation

Autofill Marq visitor parking registration using a Safari bookmarklet. We use Playwright to capture/validate selectors, then generate a one-tap bookmarklet you can save in Safari.

## Prerequisites
- Node.js 18+
- npm

## Setup
```bash
cd "Marq Parking Automation"
npm install
```

## Configure
Set the registration URL and form values in `.env.local` (created from example):
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```
MARQ_URL=https://example.com/visitors/
PROPERTY_VALUE=PRP-XXXX
APARTMENT=000
PLATE=WJT6309
MAKE=BMW
MODEL=M4
COLOR=Gray
STATE_LABEL=Texas
```

## Capture & Validate Selectors (Playwright)
Run the spec to navigate and verify elements exist. It also writes selectors to `selectors-marq.json`.
```bash
npm run test
```
Headed/debug modes:
```bash
npm run test:headed
npm run test:debug
```

## Generate Bookmarklet
Generate a minified bookmarklet using your `.env.local` values and `selectors-marq.json`:
```bash
npm run build:bookmarklet
```
The bookmarklet is written to `dist/bookmarklet.txt`. Copy its single line into a Safari bookmark URL.

## Notes
- If the site changes, re-run the test to refresh selectors and regenerate the bookmarklet.
- The bookmarklet runs entirely in-page and auto-submits at the end.
