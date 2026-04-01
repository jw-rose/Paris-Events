# Paris-Events

A vanilla JavaScript app that fetches and displays upcoming events and activities in Paris using the official Paris Open Data API. Users can search through activities and save their favourites.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Vanilla JavaScript (ES6+) |
| Markup | HTML5 (`<template>` element) |
| Styling | CSS3 |
| Data | [Paris Open Data API](https://opendata.paris.fr) |

No frameworks, no dependencies, no build step.

---

## Features

- Fetches 20 live activities from the Paris Open Data API
- Search by event type or street address (accent-insensitive)
- "No results" message when search returns nothing
- Expand / collapse full activity description per card
- Favourite / unfavourite any activity with a heart button
- Cards built from a `<template>` element for clean DOM cloning

---

## Project Structure

```
/
├── index.html       # HTML structure + <template> for activity cards
├── style.css        # Styling
└── app.js           # All JavaScript logic (fetch, search, DOM manipulation)
```

---

## How It Works

### Data fetching

On load, the app calls the Paris Open Data API:

```
GET https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=20
```

Each result is used to clone and populate an HTML `<template>`, which is then appended to the card container.

### Search

The search input listens for `input` events and filters cards in real time. It normalises accented characters (e.g. `é → e`) so searches work regardless of diacritics. Cards that don't match are hidden with a `.hide` CSS class.

### Favourites

Each card has a heart button (♡ / ♥) that toggles an `.active` class and switches between a filled and outline heart icon.

---

## Getting Started

No installation needed. Just open `index.html` in your browser:

```bash
open index.html
```

Or serve it locally with VS Code Live Server, or any static file server:

```bash
npx serve .
```

---

## API Reference

**Paris Open Data — Que faire à Paris ?**
`https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records`

Key fields used:

| Field | Description |
|---|---|
| `title` | Activity title |
| `qfap_tags` | Event type / category tags |
| `address_street` | Street address |
| `cover_url` | Cover image URL |
| `lead_text` | Short description |
| `description` | Full description |

---

## License

MIT
