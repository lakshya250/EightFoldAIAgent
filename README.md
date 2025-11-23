# AIAgent – Company Research Assistant

An intelligent agent built with **Next.js**, **TypeScript**, and **Google Gemini** that helps users research companies and generate strategic account plans.

---

## 📦 Table of Contents
- [Getting Started](#getting-started)
- [Architecture Overview](#architecture-overview)
- [Design Decisions](#design-decisions)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Getting Started
### Prerequisites
- **Node.js** (v20 or later) and **npm**
- A **Google Gemini API key** (free tier works fine)

### Clone the repository
```bash
git clone https://github.com/lakshya250/EightFoldAIAgent.git
cd EightFoldAIAgent
```

### Install dependencies
```bash
npm install
```

### Configure environment variables
Create a `.env.local` file at the project root (it is ignored by Git) with the following content:
```dotenv
GEMINI_API_KEY=your-gemini-api-key-here
```

### Run the development server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🏗️ Architecture Overview
```mermaid
graph TD
    subgraph Frontend
        Page[Page.tsx]
        Chat[ChatInterface]
        Plan[AccountPlanViewer]
    end
    
    subgraph Backend
        RouteChat[/api/chat]
        RouteResearch[/api/research]
        Agent[Agent (src/lib/agent.ts)]
    end
    
    subgraph Gemini[Google Gemini API]
        Gemini
    end

    %% Define the flow/architecture links
    Chat --> RouteChat
    Chat --> RouteResearch
    RouteChat --> Agent
    RouteResearch --> Agent
    Agent --> Gemini
    Gemini --> Agent
```

**Key layers**
- **UI Layer** – Next.js app router (`src/app/*`) renders the split‑screen UI (chat on the left, plan on the right).
- **API Layer** – Server‑side routes (`src/app/api/*`) proxy requests to the Gemini SDK, keeping the API key secret.
- **Agent Layer** – `src/lib/agent.ts` contains the core logic: `processChat` for generic conversation and `performResearch` for the structured research workflow.
- **Gemini Integration** – Uses `@google/generative-ai` (Google Generative AI SDK) to call the `gemini-2.5-flash` model.

---

## 🛠️ Design Decisions
| Area | Decision | Rationale |
|------|----------|-----------|
| **Framework** | Next.js (App Router) | Provides server‑side rendering, API routes, and built‑in CSS support without extra boilerplate. |
| **Styling** | Tailwind CSS (via utility classes) | Enables rapid, responsive UI tweaks (e.g., widening the chat sidebar, adjusting bubble widths). |
| **AI Integration** | Server‑side proxy (`/api/*`) | Keeps `GEMINI_API_KEY` out of the client bundle, protecting credentials. |
| **Intent Detection** | Simple keyword matching (`research`, `analyze`, `account plan`) | Lightweight, fast, and sufficient for the MVP. Can be upgraded to function calling later. |
| **Prompt Engineering** | Structured JSON output enforced in `performResearch` | Guarantees the UI can render a deterministic account‑plan schema. |
| **State Management** | React `useState` in `page.tsx` | No need for global stores; the app is small and state is confined to the page component. |
| **UI Layout** | Split view with a fixed‑width chat panel (450 px) and flexible plan panel | Gives the user a clear “copilot” experience and avoids the previous overly‑horizontal layout. |
| **Error Handling** | Centralised try/catch in `agent.ts` with user‑friendly fallback messages | Improves resilience when the Gemini service is unavailable. |
| **Version Control** | `.gitignore` excludes `node_modules`, `.next`, `out`, and all `.env*` files | Prevents accidental leakage of secrets and large build artifacts. |

---

## 📂 Project Structure
```
AIAgent/
├─ .gitignore          # ignores node_modules, .env*, build folders
├─ README.md           # <-- you are here!
├─ package.json
├─ tsconfig.json
├─ next.config.ts
├─ src/
│   ├─ app/
│   │   ├─ api/
│   │   │   ├─ chat/route.ts
│   │   │   └─ research/route.ts
│   │   ├─ layout.tsx
│   │   └─ page.tsx
│   ├─ components/
│   │   ├─ ChatInterface.tsx
│   │   └─ AccountPlanViewer.tsx
│   ├─ lib/
│   │   └─ agent.ts   # Gemini wrapper & business logic
│   └─ types/
│       └─ index.ts   # Message, AccountPlan, ChatResponse typings
└─ public/            # static assets (icons, images)
```

---

## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Install dependencies and run the dev server.
4. Make your changes, ensure they pass `npm run lint` (if configured).
5. Open a Pull Request describing the change.

---

## 📄 License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.
