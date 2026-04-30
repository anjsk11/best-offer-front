# AGENTS.md

## Project Context

This repository is the frontend for `Best Offer`, a rare-item auction platform.

- Frontend stack: Vite, React, TypeScript
- UI icon package: `lucide-react`
- Backend stack: Spring Boot server deployed on AWS EC2
- Backend public API base: `http://43.201.197.227:8080`
- Swagger/OpenAPI source used during setup:
  - PDF: `c:\Users\jaewon\Desktop\best offer\Swagger UI.pdf`
  - Live docs endpoint confirmed: `http://43.201.197.227:8080/v3/api-docs`

The workspace originally started empty. The current app was scaffolded with Vite React TS and then replaced with a real auction UI.

## Important Development Notes

The backend does not currently send `Access-Control-Allow-Origin` for browser requests from `localhost:5173`. Because of that, local development must use the Vite proxy instead of calling the EC2 API directly from the browser.

Current local behavior:

- `src/api.ts` defaults `VITE_API_BASE_URL` to an empty string.
- App requests go to same-origin paths like `/api/v1/auctions`.
- `vite.config.ts` proxies `/api` to `http://43.201.197.227:8080`.

Do not change the default API base URL back to the EC2 URL for local development unless the backend CORS policy is fixed. For static deployments without a proxy, set `VITE_API_BASE_URL=http://43.201.197.227:8080` or configure a reverse proxy.

## API Endpoints In Use

Based on Springdoc/OpenAPI:

- `POST /api/v1/users/signup`
  - Body: `{ email, password, nickname }`
  - Response: string
- `POST /api/v1/users/login`
  - Body: `{ email, password }`
  - Response: string
- `GET /api/v1/auctions?page=&size=&sort=`
  - Response: paged `AuctionListResponse`
- `POST /api/v1/auctions`
  - Body: `{ title, description, startPrice, endTime }`
  - Response: string
- `GET /api/v1/auctions/{auctionId}`
  - Response: `AuctionDetailResponse`
- `PUT /api/v1/auctions/{auctionId}`
  - Body: `{ title, description }`
  - Response: string
- `DELETE /api/v1/auctions/{auctionId}`
  - Response: string
- `GET /api/v1/auctions/{auctionId}/bids?page=&size=&sort=`
  - Response: paged `BidHistoryResponse`
- `POST /api/v1/auctions/{auctionId}/bids`
  - Body: `{ bidPrice, bidderId }`
  - Response: string

Known enum:

- `AuctionStatus`: `ON_SALE`, `COMPLETED`, `DELETED`

## Implemented Features

`src/App.tsx` is intentionally kept small. It owns only top-level tab state, global notices, and page composition. Do not put feature workflows back into `App.tsx`.

Current structure:

- `src/api.ts`: backend API client and API response types
- `src/components`: app shell pieces such as header and notice banner
- `src/features/home`: home page and main banner
- `src/features/auctions`: auction list/detail/create/bid workflow
- `src/features/account`: signup/login workflow
- `src/constants`: domain display constants and empty page values
- `src/utils`: formatting, form defaults, and notice helpers
- `src/types`: shared UI types

Implemented screens and flows:

- Home page
  - main banner only appears on the home tab
  - banner text: `당신의 가격을 만나는 곳, Best Offer`
  - banner sub text: `지금 입찰하거나 직접 물건을 올려, 가장 합리적인 가격을 찾으세요.`
  - do not expose the Spring API URL in the banner
  - do not render an image in the banner
- Auction exploration page
  - paged auction list
  - auction detail panel
  - bid history
  - refresh button
  - previous/next pagination
- Auction creation page
  - title, description, start price, end time
- Auction edit/delete inside detail view
  - update title and description
  - delete selected auction
- Bidding form
  - bid price
  - bidder ID
- Account page
  - signup request
  - login request
  - login response is stored in `localStorage` under `best-offer-session`

API client file: `src/api.ts`

Styling:

- `src/index.css`
- `src/App.css`
- Design is intentionally auction-house/workspace style, not a marketing landing page.

## Commands

Use `npm.cmd` in PowerShell if plain `npm` is blocked by execution policy.

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev -- --host 0.0.0.0
```

Local URL:

```text
http://localhost:5173/
```

Validation:

```bash
npm run lint
npm run build
```

Both lint and production build were passing after the CORS proxy fix.

## Current Verified Backend Behavior

This endpoint returned JSON through the Vite proxy:

```text
http://localhost:5173/api/v1/auctions?page=0&size=8&sort=endTime,asc
```

Direct backend request also returned JSON from PowerShell:

```text
http://43.201.197.227:8080/api/v1/auctions?page=0&size=8&sort=endTime,asc
```

At the time of setup, backend test data contained one auction. Korean text looked mojibake in PowerShell output, but the response shape was valid.

## GitHub Setup Notes

The project folder was not a Git repository when checked. To publish:

```bash
git init
git add .
git commit -m "Initial Best Offer frontend"
git branch -M main
git remote add origin https://github.com/<username>/best-offer-front.git
git push -u origin main
```

Before pushing, run:

```bash
npm run lint
npm run build
git status
```

## Do Not Forget

- Keep `node_modules`, `dist`, and log files out of Git. `.gitignore` already covers them.
- Keep local API calls same-origin through `/api` unless backend CORS is configured.
- Restart the Vite dev server after changing `vite.config.ts`.
- If production hosting is added later, solve API routing explicitly with one of:
  - backend CORS config,
  - frontend host reverse proxy,
  - same-origin deployment,
  - environment-specific `VITE_API_BASE_URL`.

## Documentation Maintenance

When developing this project, update documentation together with code whenever a change affects future work.

- Update `AGENTS.md` for decisions or facts the next agent must remember:
  - API changes
  - environment setup changes
  - CORS/proxy/deployment decisions
  - known backend behavior
  - workarounds
  - pitfalls discovered during implementation
  - commands or verification steps that matter for future development
- Update `README.md` for collaborator-facing project information:
  - install and run instructions
  - public feature descriptions
  - configuration needed to use the app
  - build, lint, and deployment guidance

Do not treat documentation as a separate optional cleanup step. If a code change creates a new fact future developers need, document it in the same task.

## Commit Convention

Use one of these exact commit type prefixes:

- `Feat`: new feature
- `Fix`: bug fix
- `Docs`: documentation changes such as README or wiki
- `Style`: formatting-only changes with no logic change
- `Refactor`: code refactoring
- `Test`: test additions or test updates
- `Chore`: build tasks, package manager settings, dependency/config maintenance

Format commit messages as:

```text
Type: short imperative summary
```

Examples:

```text
Refactor: split auction workflow components
Docs: document local API proxy setup
Fix: route auction requests through Vite proxy
```
