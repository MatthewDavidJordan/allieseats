# Allie's Eats

A modern food diary and restaurant review website built with Next.js, Firebase, and Tailwind CSS. Features a public-facing review site, an admin panel for managing reviews, and AI-powered integration for importing restaurant ratings from screenshots and screen recordings.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com), [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives + CVA)
- **Icons:** [Lucide React](https://lucide.dev)
- **Fonts:** DM Sans (body), Playfair Display (headings)
- **Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **File Storage:** [Firebase Storage](https://firebase.google.com/docs/storage)
- **AI:** [Google Gemini 2.5 Flash](https://ai.google.dev) via `@google/genai` SDK
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics)

## Project Structure

```
allieseats/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, analytics)
│   ├── page.tsx                # Home page (hero + latest reviews)
│   ├── globals.css             # Global styles + CSS variables
│   ├── about/                  # About page
│   ├── reviews/                # Public reviews list with filters
│   ├── review/[slug]/          # Individual review detail page
│   ├── lists/                  # Food lists (curated restaurant lists)
│   │   └── [id]/               # Individual list detail page
│   ├── admin/
│   │   └── reviews/
│   │       ├── page.tsx        # Admin reviews dashboard
│   │       └── edit/page.tsx   # Create/edit review form + Beli import
│   └── api/
│       ├── parse-beli/         # AI-powered Beli screenshot/video parser
│       └── beli-ratings/       # Bulk upload Beli ratings to Firestore
├── components/
│   ├── header.tsx              # Site navigation
│   ├── hero.tsx                # Landing page hero section
│   ├── footer.tsx              # Site footer
│   ├── review-card.tsx         # Review card (used in grids)
│   ├── review-grid.tsx         # Latest reviews grid (home page)
│   ├── reviews-content.tsx     # Reviews list with filtering/sorting
│   ├── lists-grid.tsx          # Food lists grid
│   ├── loading.tsx             # Loading skeleton
│   └── ui/                     # shadcn/ui primitives
│       ├── badge.tsx
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       └── textarea.tsx
├── lib/
│   ├── firebase.ts             # Firebase app initialization
│   ├── firebase-reviews.ts     # Review CRUD + image upload
│   ├── firebase-beli.ts        # Beli ratings pool CRUD + search/match
│   ├── review-types.ts         # Review TypeScript interface
│   ├── beli-types.ts           # BeliPlace TypeScript interface
│   ├── reviews-data.ts         # Legacy hardcoded review data
│   ├── lists-data.ts           # Food lists data
│   └── utils.ts                # Utility functions (cn)
├── public/                     # Static assets (icons, placeholders)
├── next.config.ts              # Next.js config (Firebase Storage images)
├── tsconfig.json
└── package.json
```

## Data Models

### Review

Stored in the Firestore `reviews` collection, keyed by slug.

| Field             | Type       | Description                                |
| ----------------- | ---------- | ------------------------------------------ |
| `id`              | `string`   | Firestore document ID (same as slug)       |
| `name`            | `string`   | Restaurant name                            |
| `headline`        | `string`   | Review title                               |
| `rating`          | `number`   | 0–10 scale                                 |
| `price`           | `string`   | `"$"`, `"$$"`, `"$$$"`, or `"$$$$"`        |
| `cuisine`         | `string[]` | e.g. `["Japanese", "Sushi"]`               |
| `location`        | `string[]` | e.g. `["Northeast Washington", "DC"]`      |
| `date`            | `string`   | Visit date                                 |
| `image`           | `string`   | Cover image URL (Firebase Storage)         |
| `content`         | `string[]` | Review paragraphs                          |
| `orderHighlights` | `string[]` | Dishes ordered                             |
| `slug`            | `string`   | URL-friendly ID (`{name}-{city}-{random}`) |

### BeliPlace

Stored in the Firestore `beli_ratings` collection, keyed by normalized name+city slug.

| Field       | Type       | Description                           |
| ----------- | ---------- | ------------------------------------- |
| `id`        | `string`   | Slugified `{name}-{city}`             |
| `name`      | `string`   | Restaurant name                       |
| `rating`    | `number`   | 0–10 scale                            |
| `price`     | `string`   | Dollar signs                          |
| `cuisine`   | `string[]` | Cuisine tags                          |
| `location`  | `string[]` | Location tags                         |
| `createdAt` | `string`   | ISO timestamp of last upsert          |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Firebase project](https://console.firebase.google.com) with Firestore and Storage enabled
- A [Google AI Studio](https://aistudio.google.com) API key (for Beli parsing)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

See [`.env.example`](.env.example) for the required variables. You'll need:

- **Firebase** credentials from your [Firebase Console](https://console.firebase.google.com) project settings
- **Gemini API key** from [Google AI Studio](https://aistudio.google.com/apikey) (for Beli screenshot/video parsing)

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## API Routes

### `POST /api/parse-beli`

Parses a Beli app screenshot or screen recording using Gemini AI and returns structured restaurant data. Parsed results are also automatically saved to the Beli pool in Firestore.

- **Content-Type:** `multipart/form-data`
- **Body:** Form field `image` (or `file`) containing an image (JPEG, PNG, WebP) or video (MP4, MOV, WebM)
- **Images** are sent to Gemini as inline base64
- **Videos** are uploaded via the Gemini File API (supports larger files, with automatic polling for processing completion)

**Example (curl):**

```bash
# Screenshot
curl -X POST http://localhost:3000/api/parse-beli \
  -F "image=@beli-screenshot.png"

# Video
curl -X POST http://localhost:3000/api/parse-beli \
  -F "image=@beli-recording.mp4"
```

**Response:**

```json
{
  "places": [
    {
      "name": "O-Ku",
      "rating": 10,
      "price": "$$$",
      "cuisine": ["Japanese", "Sushi"],
      "location": ["Northeast Washington", "Washington, DC"]
    }
  ]
}
```

### `POST /api/beli-ratings`

Bulk upserts restaurant ratings into the Beli pool. Duplicates are handled via deterministic key generation (normalized name + city).

- **Content-Type:** `application/json`
- **Body:** `{ "places": [...] }` or a raw JSON array

**Example (curl):**

```bash
curl -X POST http://localhost:3000/api/beli-ratings \
  -H "Content-Type: application/json" \
  -d '{
    "places": [
      {
        "name": "O-Ku",
        "rating": 10,
        "price": "$$$",
        "cuisine": ["Japanese", "Sushi"],
        "location": ["Northeast Washington", "Washington, DC"]
      }
    ]
  }'
```

## Admin Panel

Navigate to `/admin/reviews` to manage reviews.

- **Review list** — view, edit, or create reviews
- **Create/Edit form** (`/admin/reviews/edit`) — full review editor with:
  - Cover image upload (stored in Firebase Storage)
  - Tag-style inputs for cuisine, location, and order highlights
  - Multi-paragraph review content editor
  - Live preview
  - **Import from Beli** — collapsible panel to:
    - Search the saved Beli ratings pool by restaurant name
    - Upload a Beli screenshot or screen recording to parse with AI
    - Click any result to auto-fill the form (name, rating, price, cuisine, location)

## Beli Integration

The Beli integration provides two ways to import restaurant data:

1. **Beli Pool (Firestore)** — a persistent collection of restaurant ratings. Populated by:
   - Parsing screenshots/videos (results are auto-saved)
   - Bulk JSON upload via the `/api/beli-ratings` endpoint
   - Deduplication is handled by a deterministic key (`slugified-name-city`)

2. **AI Screenshot/Video Parsing** — upload a Beli app screenshot or a screen recording of scrolling through your Beli list. Gemini extracts all visible restaurants with their ratings, price levels, cuisines, and locations. For videos, it processes all frames and deduplicates entries.

## Deployment

The easiest way to deploy is with [Vercel](https://vercel.com):

1. Push the repo to GitHub
2. Import the project on Vercel
3. Add all environment variables from `.env.local` to the Vercel project settings
4. Deploy

Make sure your Firebase project's Firestore rules and Storage rules allow the necessary read/write access.

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start dev server           |
| `npm run build` | Production build           |
| `npm run start` | Start production server    |
| `npm run lint`  | Run ESLint                 |

## License

Private project.
