# Flowforge — Visual AI Workflow Builder

> Build AI automations with a drag-and-drop canvas. Powered by Groq LPU inference.

---

## Architecture

```mermaid
flowchart LR
    subgraph Web["Web (Next.js 15)"]
        UI["Canvas UI\n(xyflow)"]
        Auth["Auth\n(JWT)"]
        Dash["Dashboard"]
    end

    subgraph API["API (Fastify)"]
        Routes["Routes\nAuth / Workflows / Webhook"]
        Engine["Automation Engine\nLLM · HTTP · Condition"]
        Groq["Groq SDK"]
    end

    subgraph Data["Neon PostgreSQL"]
        Users["User"]
        Workflows["Workflow"]
        Runs["WorkflowRun"]
        Nodes["NodeExecution"]
    end

    UI -->|REST API| Routes
    Auth -->|JWT Bearer| Routes
    Routes --> Engine
    Engine --> Groq
    Engine -->|Save results| Runs
    Routes -->|CRUD| Workflows
    Workflows -->|Persist| Data
```

## How It Works

```mermaid
sequenceDiagram
    actor U as User
    U->>Web: Drag nodes onto canvas
    Web->>API: POST /workflows (save)
    API->>Neon: Persist workflow definition

    U->>Web: Click "Run"
    Web->>API: POST /workflows/:id/run
    API->>Neon: Create WorkflowRun
    API-->>Web: 202 Accepted

    Note over Engine: Async execution
    Engine->>Groq: LLM Node → Groq API
    Groq-->>Engine: Response
    Engine->>Neon: Store NodeExecution

    loop Every node
        Engine->>Engine: Traverse graph\ntopological sort
    end

    Engine->>Neon: Update WorkflowRun status\nCOMPLETED/FAILED
```

## Node Types

```mermaid
flowchart TB
    subgraph Nodes
        LLM["🤖 LLM Node\n- Model selection\n- Prompt + System prompt\n- Groq-powered"]
        HTTP["🌐 HTTP Node\n- GET/POST/PUT/DELETE\n- URL + Headers + Body\n- {{context}} interpolation"]
        COND["🔀 Condition Node\n- Field + Operator + Value\n- if/else branching\n- true/false paths"]
    end

    LLM --> COND
    HTTP --> COND
    COND --> LLM
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 · xyflow · TailwindCSS |
| Backend | Fastify · TypeScript |
| Database | Neon PostgreSQL (Prisma) |
| AI Inference | Groq SDK |
| Auth | JWT (email/password) |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/flowforge.git
cd flowforge

# API setup
cd api
npm install
npx prisma generate
npx prisma db push
cp .env.example .env  # fill in credentials
npm run dev           # starts on :3001

# Web setup (new terminal)
cd ../web
npm install
npm run dev           # starts on :3000
```

## Environment Variables

```bash
# api/.env
DATABASE_URL="postgresql://..."
GROQ_API_KEY="gsk_..."
JWT_SECRET="your-32-char-secret"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/signup` | Create account |
| POST | `/auth/login` | Get JWT token |
| GET | `/workflows` | List user's workflows |
| POST | `/workflows` | Create workflow |
| GET | `/workflows/:id` | Get workflow |
| PUT | `/workflows/:id` | Update workflow |
| DELETE | `/workflows/:id` | Delete workflow |
| POST | `/workflows/:id/run` | Trigger manual run |
| GET | `/workflows/:id/runs` | List workflow runs |
| POST | `/webhook/:workflowPath` | Trigger via webhook |

## Workflow Execution Flow

```mermaid
flowchart TD
    A["Trigger\nManual / Webhook"] --> B["Create WorkflowRun\nstatus=RUNNING"]
    B --> C["Find start nodes\n(no incoming edges)"]
    C --> D["Execute nodes\ntopological order"]
    D --> E{"Node type?"}
    E -->|"llm"| F["Call Groq API"]
    E -->|"http"| G["HTTP request\n{{context}} interpolation"]
    E -->|"condition"| H["Evaluate condition\ntrue/false"]
    F --> I["Store NodeExecution"]
    G --> I
    H --> I
    I --> J{"More nodes?"}
    J -->|Yes| D
    J -->|No| K["Update WorkflowRun\nstatus=COMPLETED"]
    D -->|Error| L["Update WorkflowRun\nstatus=FAILED"]
```

## Roadmap

- [ ] Inngest integration for durable async execution
- [ ] Schedule trigger (cron-based)
- [ ] Stripe per-seat billing
- [ ] Team management
- [ ] Slack/Email integrations