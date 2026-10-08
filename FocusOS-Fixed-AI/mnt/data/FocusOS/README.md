# FocusOS — Smart Student Productivity OS

A frontend-first college-level JavaScript laboratory project that behaves like a small productivity SaaS for students. It manages tasks, subjects, schedules, focus sessions, deadlines, analytics, themes and persistent local data without a backend.

## Objective

Build one coherent application that demonstrates practical modern JavaScript: modules, DOM manipulation, state management, array methods, classes/objects where useful, LocalStorage, JSON, timers, asynchronous APIs, browser notifications, date logic, validation and data-driven UI.

## Features

- Dashboard with productivity score and live KPIs
- Task CRUD, search, filter and sort
- Subject management and completion statistics
- Daily planner with chronological schedule
- Pomodoro-style Focus Mode with Focus / Short Break / Long Break
- Analytics using Chart.js
- Interactive month calendar and deadlines
- Light/dark theme persisted in LocalStorage
- Browser notifications with in-app toast fallback
- Demo dataset and reset/clear controls
- Responsive desktop/tablet/mobile layout
- Accessible labels, buttons and semantic sections

## Technologies

- HTML5
- CSS3
- Modern JavaScript ES6+
- Chart.js (analytics)
- GSAP (selective UI animation)
- Lucide static icon font
- LocalStorage / JSON / Notification API

## Folder Structure

```text
FocusOS/
├── index.html
├── README.md
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── themes.css
├── js/
│   ├── app.js
│   ├── state.js
│   ├── storage.js
│   ├── tasks.js
│   ├── subjects.js
│   ├── planner.js
│   ├── focus.js
│   ├── analytics.js
│   ├── notifications.js
│   ├── ui.js
│   └── utils.js
└── assets/
```

## How to Run

Because ES modules are used, run the project through a local HTTP server instead of opening `index.html` directly.

### VS Code Live Server

1. Open the `FocusOS` folder in VS Code.
2. Install/use the Live Server extension.
3. Right-click `index.html` → **Open with Live Server**.
4. The app will open in the browser.

### Python

From the FocusOS directory:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

## JavaScript Concept Mapping

| Concept | Where it is used |
|---|---|
| Variables/constants | All modules |
| Functions / arrow functions | State, CRUD, UI helpers |
| Objects | Tasks, subjects, schedules, settings |
| map/filter/reduce/find/sort | Task filtering, analytics, subject statistics, schedule sorting |
| Destructuring | Event and state handling |
| Spread/rest | Immutable state updates and utility callbacks |
| Template literals | Dynamic UI rendering |
| ES6 modules | Every JS responsibility is split into modules |
| DOM manipulation | `app.js`, modal/forms, toasts, charts |
| Event listeners | Navigation, forms, timer controls, filters |
| Event delegation | Global click handler |
| JSON | LocalStorage persistence |
| LocalStorage | `storage.js` |
| setInterval | Focus timer and live focus view |
| Promises | Browser Notification permission and async flow |
| async/await | Notification request flow |
| try/catch | Storage and notification error handling |
| Fetch API | Intentionally not forced: this app has no backend/API requirement; the asynchronous browser Notification API provides a meaningful async boundary |
| Date API | Deadlines, calendar, schedule and weekly analytics |
| Debouncing | Task search |

## Productivity Score

The score is intentionally explainable rather than pretending to be an AI prediction:

```text
40% Task completion
25% Focus time (capped at 5 hours)
20% Deadline performance
15% Study consistency (active focus days)
```

Each component is normalized to 0–1 and combined into a percentage in `analytics.js`.

## Async Data Layer Note

The project is deliberately backend-free. Instead of making a meaningless fake HTTP request, it uses the asynchronous Notification permission API and promise-based browser behavior as a real async operation. This keeps the project honest while demonstrating `Promise`, `async/await`, loading/error thinking and `try/catch`. If your lab specifically requires `fetch()`, a small optional JSON endpoint can be added later without changing the architecture.

## Future Scope

- Optional service-worker offline support
- Import/export state as JSON files
- Optional real calendar API integration
- IndexedDB for larger datasets
- PWA installability
- Backend sync and authentication if the project is expanded beyond the lab

## Deployment

This is a static frontend. Deploy the folder to GitHub Pages, Netlify or Vercel static hosting. Keep relative paths unchanged. The CDN dependencies are loaded from public CDNs.

## Viva Summary

FocusOS is a modular JavaScript productivity application. The central state is stored in `state.js`, persisted by `storage.js`, and rendered by `app.js` and `ui.js`. User actions update state, save it to LocalStorage and re-render the relevant UI. Tasks use array filtering/sorting and event delegation. Focus Mode uses `setInterval()` for countdown state and browser notification promises for asynchronous completion alerts. Analytics derives values from the same state and feeds Chart.js, so charts are data-driven rather than hardcoded.

## FocusOS AI Coach

FocusOS now includes a real AI-powered coaching layer using the OpenAI Responses API through a server/serverless endpoint. The browser sends only FocusOS productivity context to `/api/ai`; the provider key stays on the server in `AI_API_KEY`. OpenAI's current Responses API is the recommended API for new integrations. citeturn0search0

AI actions:
- **What should I do now?** — recommends one concrete next action from the user's actual workload.
- **Generate Today's Plan** — creates realistic study blocks from pending tasks and planner commitments.
- **Break Down Task** — converts a selected task into concrete subtasks that can be added to the existing Tasks system.
- **Analyze My Week** — reviews stored focus/task activity and returns evidence-based coaching.

### Local AI setup

1. Copy `.env.example` to `.env`.
2. Set `AI_API_KEY` to your server-side API key.
3. Optionally set `OPENAI_MODEL` (the default is `gpt-6-luna`).
4. Run:

```bash
npm start
```

The app runs at `http://localhost:5500`. Without a key, the rest of FocusOS still works and AI actions show a configuration error instead of breaking the application.

### Vercel deployment

Deploy the repository to Vercel and add `AI_API_KEY` and optionally `OPENAI_MODEL` in the project's Environment Variables. The `api/ai.js` serverless function then handles `/api/ai`. Never place the key in `js/` or `index.html`.

GitHub Pages can still host the static frontend, but it cannot safely host the secret server function itself; use Vercel (or another server/serverless host) for `/api/ai` and point the frontend endpoint at that service if the frontend and API are deployed separately.

## Focus Mode stability fix

The original Focus Mode had a global one-second render loop in `app.js`. Because `render()` replaced `#appView` with `innerHTML` every second, the timer view, buttons and GSAP entrance animations were repeatedly recreated, producing visible flickering.

The timer now owns one `setInterval()` in `js/focus.js`. Each tick dispatches a small custom event and `app.js` updates only the countdown, progress bar, mode label and start/pause button. Navigation therefore does not create another timer, and returning to Focus Mode reads the current centralized state.
