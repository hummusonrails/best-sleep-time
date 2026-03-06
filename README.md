<p align="center">
  <img src=".github/banner.svg" alt="Best Sleep Time" width="100%">
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-FFEEC8.svg?style=flat-square&labelColor=1E1E1C" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/Next.js-16-FFEEC8.svg?style=flat-square&labelColor=1E1E1C" alt="Next.js 16">
  <img src="https://img.shields.io/badge/TypeScript-5-FFEEC8.svg?style=flat-square&labelColor=1E1E1C" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Tailwind-v4-FFEEC8.svg?style=flat-square&labelColor=1E1E1C" alt="Tailwind v4">
</p>

<p align="center">
  <strong>Real-time rocket alert analysis to help Israelis decide when it's safe to sleep.</strong>
  <br>
  <a href="https://bestsleepingtime.com">Live Site</a> · <a href="#quick-start">Quick Start</a> · <a href="https://github.com/hummusonrails/best-sleep-time/issues">Report a Bug</a>
</p>

---

During active conflict, Israelis need to assess how safe it is to sleep — whether it's a quick nap where you're harder to wake, or a full night where you need to know how prepared to be. This app analyzes live alert data from Pikud HaOref to give a clear safety recommendation based on your sleep type, duration, and location.

## What It Does

- **Two sleep modes** — Nap (15–90 min) tells you whether to nap now or wait; Night Sleep is a confidence check telling you how prepared to be (sleep soundly, keep shoes nearby, or sleep near shelter)
- **Scores safety in real time** using a weighted algorithm (time since last alert, average gaps, frequency trends, alert density)
- **Filters by location** with 16 predefined regions and a searchable database of 1,362 cities in both Hebrew and English
- **Adapts to your sleep** — pick nap or night, adjust the duration slider, and set your wake-up time buffer (time to wake from sleep and reach a safe room)
- **Visualizes the last 24 hours** of alert activity in an hourly timeline chart
- **Supports Hebrew and English** with full RTL layout, persisted in localStorage
- **Installable as a PWA** — add to your home screen for one-tap access
- **Auto-refreshes every 30 seconds** so the recommendation stays current

## Quick Start

```bash
git clone https://github.com/hummusonrails/best-sleep-time.git
cd best-sleep-time
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

| Layer          | Tool                    | Notes                                        |
| :------------- | :---------------------- | :------------------------------------------- |
| Framework      | Next.js 16 (App Router) | Server-side API route for alert data caching  |
| Language       | TypeScript              | Strict types throughout                      |
| Styling        | Tailwind CSS v4         | Dark editorial theme with corner bracket frames |
| Charts         | Recharts                | 24h alert timeline bar chart                 |
| Data source    | Tzeva Adom API          | `api.tzevaadom.co.il` — no geo-restriction   |
| City names     | pikud-haoref-api        | 1,362 Hebrew↔English city mappings           |
| Analytics      | GoatCounter             | Privacy-friendly, no-cookie tracking         |
| Deployment     | Vercel                  | Zero-config deployment                       |

<details>
<summary><strong>Prerequisites</strong></summary>

- [Node.js](https://nodejs.org/) 18+
- npm

</details>

## Project Structure

```
best-sleep-time/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Main page — fetches alerts, manages state
│   ├── globals.css             # Tailwind theme, bracket frames, slider
│   ├── opengraph-image.tsx     # Dynamic OG image generation
│   └── api/
│       ├── alerts/route.ts     # Proxies Tzeva Adom API with 30s cache
│       └── safety-check/route.ts # Safety check endpoint
├── components/
│   ├── NapSettings.tsx         # Nap/Night toggle + duration + wake-up sliders
│   ├── LocationSelector.tsx    # Region buttons + bilingual city search
│   └── ServiceWorkerRegistration.tsx # PWA service worker
├── lib/
│   ├── types.ts                # SleepType ("nap" | "night")
│   ├── safety.ts               # Safety scoring algorithm (two modes)
│   ├── i18n.ts                 # EN/HE translations
│   ├── alertsCache.ts          # Alert data caching
│   ├── rateLimit.ts            # Sliding-window rate limiter
│   └── cityNames.ts            # 1,362 Hebrew↔English city mappings
├── middleware.ts                # Rate limiting on API routes
└── public/
    ├── sw.js                   # Service worker with nap reminders
    └── manifest.json           # PWA manifest
```

## Safety Algorithm

The base score (0–100) is a weighted combination of four signals:

| Signal                  | Weight | Safer when…              |
| :---------------------- | :----- | :----------------------- |
| Time since last alert   | 40%    | Longer gap               |
| Average gap (6h window) | 25%    | Larger average           |
| Frequency trend         | 20%    | Decreasing               |
| 24h alert count         | 15%    | Fewer alerts             |

The score is then interpreted differently depending on the sleep mode:

**Nap mode** — Can you nap now, or should you wait?

| Verdict       | Condition                                              |
| :------------ | :----------------------------------------------------- |
| **Safe**      | Score > 75 and last alert > 2.5× your sleep duration   |
| **Risky**     | Between safe and dangerous thresholds                  |
| **Dangerous** | Score < 50 or last alert within your sleep duration     |

**Night mode** — How prepared should you be?

| Verdict                   | Condition                                                              |
| :------------------------ | :--------------------------------------------------------------------- |
| **Quiet Night Expected**  | Score > 80, last alert > 2h ago, avg gap > 90min, ≤ 5 alerts in 24h   |
| **Keep Shoes Nearby**     | Between quiet and shelter thresholds                                   |
| **Sleep Near Shelter**    | Score < 40, or recent alert (< 30min) with high frequency (> 8 in 24h) |

## Contributing

Found a bug or have a suggestion? [Open an issue](https://github.com/hummusonrails/best-sleep-time/issues) or submit a PR.

## License

[MIT](LICENSE) — Ben Greenberg

---

<p align="center">
  Made by <a href="https://www.hummusonrails.com/">Ben Greenberg</a> · <a href="https://buymeacoffee.com/bengreenberg">Buy me a coffee</a>
</p>
