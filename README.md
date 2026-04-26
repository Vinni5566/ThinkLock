# 🛡️ ThinkLock | Reclaiming Human Intelligence

![ThinkLock Banner](https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=2000&auto=format&fit=crop)

## 1. Project Overview
*   **Project Title:** **ThinkLock**
*   **Tagline:** Enforced Reasoning in the Age of Instant Automation.
*   **One-Line Description:** A cognitive-first intelligence platform that **blocks instant AI answers**, forcing users to demonstrate active reasoning before unlocking insights.

## 2. Problem Statement
*   **Current State of AI Usage:** Users treat AI as a "knowledge bypass," leading to **instant gratification** without comprehension.
*   **Core Problem:** The "Copy-Paste" loop is causing **cognitive atrophy**, where the ability to reason from first principles is being automated away.
*   **Impact:** Growing **AI dependency**, shallow thinking patterns, and a loss of fundamental problem-solving skills in the modern workforce.

## 3. Solution Overview
*   **What is ThinkLock:** A **security-gate for thought**. It acts as a middleware between human curiosity and AI knowledge.
*   **Core Idea:** **Enforced Thinking Layer**. You don't get the answer because you asked; you get it because you **proved you thought about it**.
*   **High-Level Workflow:** User Question → **Cognitive Challenge** → User Reasoning → **AI Validation** → Answer Unlock.

## 4. Key Features
*   🧠 **Thinking Graph:** Visualizes your logical progression and connection between concepts.
*   📊 **Cognitive Scoring:** Real-time metrics on your **depth of thought** and logic quality.
*   🛡️ **Anti-Gaming AI:** Detects if you are trying to "trick" the system or copy-pasting from elsewhere.
*   ⚙️ **Adaptive Enforcement:** Increases challenge difficulty if it detects **lazy thinking** patterns.
*   ⏪ **Reasoning Replay:** Review your own thought process to identify logical fallacies.
*   📈 **Dependency Tracker:** Measures how much you rely on AI vs. your own brain over time.
*   🖥️ **Analytics Dashboard:** A premium command center for your **cognitive growth** metrics.

## 5. System Architecture
*   **Architecture Diagram:** Uses a **Micro-Orchestration** pattern between the Frontend, Node.js Backend, and AI Service.
*   **Data Flow:** `User Request` → `Zod Validation` → `Gemini Reasoning Audit` → `MongoDB State Save` → `n8n Intelligence Loop`.
*   **Component Overview:** Modular architecture with strict separation between **Persistence**, **Orchestration**, and **Validation**.

## 6. Tech Stack
*   **Frontend:** **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Shadcn UI**, **Framer Motion**.
*   **Backend:** **Node.js**, **Express**, **Winston** (Logging).
*   **Database:** **MongoDB Atlas** (using Mongoose).
*   **AI Layer:** **Google Gemini 3 Flash** & **Pro** (via Generative AI SDK).
*   **Workflow Automation:** **n8n Cloud** (for async behavioral analysis).
*   **DevOps / Deployment:** **Vercel** (Frontend), **Render** (Backend).

## 7. Project Structure
*   **Repo Layout:** Logical split between `frontend` (root) and `backend/` directory.
*   **Frontend Structure:** `/src/components` (UI), `/src/pages` (Views), `/src/store` (State).
*   **Backend Structure:** `/src/services` (Logic), `/src/controllers` (API), `/src/models` (Data).
*   **Key Modules:** **AI Service** (Core intelligence), **Outbox Worker** (Reliable event delivery).

## 8. Core Backend Design
*   **Service Layer:** Business logic is **completely decoupled** from API routes.
*   **Controller Layer:** Handles HTTP concerns and delegates to services.
*   **Middleware Layer:** Includes **Rate Limiting**, **Auth Guards**, and **Security Headers**.
*   **Validation Layer:** Powered by **Zod** for strict runtime type checking.
*   **Error Handling:** Centralized **Global Error Handler** with specialized `AppError` classes.

## 9. AI Pipeline Design
*   **Prompting Strategy:** Uses **System Instructions** to enforce a "Strict Tutor" persona.
*   **JSON Mode:** All AI responses are forced into **Structured JSON** for programmatic parsing.
*   **Response Validation:** Backend audits AI scores to ensure they are within **logical bounds**.
*   **Failover Strategy:** Automatic switch from **Flash** to **Pro** if reasoning quality drops.
*   **Retry Mechanism:** Exponential backoff for **429 (Rate Limit)** errors.

## 10. Data Models
*   **User:** Identity and **Cognitive Profile** settings.
*   **Session:** Tracks a specific reasoning journey.
*   **Message:** Stores content, **AI-Audit results**, and logic flags.
*   **Cognitive Metrics:** Aggregated data points for **reasoning depth**.
*   **Event:** Durable records for **Outbox processing**.

## 11. Thinking Graph Design
*   **Node Types:** `Premise`, `Inference`, `Conclusion`, `Fallacy`.
*   **Edge Relationships:** `Supports`, `Contradicts`, `Derives From`.
*   **Graph Construction:** Built dynamically as the user adds **Reasoning Nodes**.
*   **Storage Strategy:** Adjacency list stored in **MongoDB** for fast traversal.

## 12. Anti-Gaming System
*   **Detection Logic:** Analyzes **Response Latency**, **Semantic Overlap**, and **Prompt Injection** attempts.
*   **Escalation:** `Warning` → `Locked Session` → `Cognitive Reset`.
*   **Edge Cases:** Handles "Short but Brilliant" answers vs. "Long and Wordy" filler.

## 13. Dependency Tracking System
*   **Metrics:** **AI-to-Human Ratio**, **Hint Reliance**, **Time-to-Reason**.
*   **Scoring:** Weighted average that favors **independent conclusions**.
*   **Trends:** Weekly reports on whether your **reasoning muscle** is growing or atrophying.

## 14. Cognitive Scoring System
*   **Parameters:** **Logical Consistency**, **Depth of Inquiry**, **First Principles Application**.
*   **Weighting:** **Depth** is weighted 2x higher than **Speed**.
*   **Interpretation:** Scores are mapped to tiers: `Observer`, `Thinker`, `Architect`, `Mastermind`.

## 15. n8n Integration
*   **Dispatching:** Backend pushes events to an **Event Outbox**.
*   **Webhook:** n8n listens via **Secure Webhooks** for behavioral signals.
*   **Async Processing:** n8n handles heavy **Trend Analysis** without blocking the user.
*   **Feedback Loop:** n8n updates the **User Classification** in MongoDB via API.

## 16. API Design
*   **Overview:** **RESTful API** with clear resource-based routing.
*   **Authentication:** **JWT-based** stateless authentication.
*   **Core Endpoints:** `POST /api/chat/send`, `GET /api/chat/profile/:id`.
*   **Idempotency:** Supports `Idempotency-Key` headers for **fault-tolerant** retries.

## 17. Validation & Error Handling
*   **Strategy:** **Fail-Fast** at the edge using Zod schemas.
*   **AI Validation:** Recursive checking of AI-generated JSON.
*   **Classification:** `OperationalError` (User fault) vs. `ProgrammingError` (System fault).

## 18. Logging & Observability
*   **Strategy:** **Winston** structured logging in JSON format.
*   **Structure:** `timestamp`, `level`, `correlationId`, `message`, `metadata`.
*   **Monitoring:** Health check endpoints for **Render/Vercel** uptime monitoring.

## 19. Rate Limiting & Security
*   **Rate Limiting:** IP-based limits to prevent **AI Token Abuse**.
*   **API Security:** **Helmet.js** for secure headers and **CORS** strict allow-listing.
*   **Secrets:** Managed via **Environment Variables** (never committed to Git).

## 20. Performance & Scalability
*   **Transaction Strategy:** Mongoose **Atomic Sessions** for data integrity.
*   **Async Processing:** AI calls happen **outside** DB transactions to prevent locks.
*   **Scaling:** Stateless design allows for **horizontal scaling** across multiple instances.

## 21. Testing Strategy
*   **Automated Tests:** **Vitest** for unit tests, **Playwright** for E2E flows.
*   **Manual Testing:** Dedicated scripts in `backend/scratch/` for **pipeline verification**.
*   **Edge Case Coverage:** Tests for **AI Hallucinations** and **Network Failure** scenarios.

## 22. Deployment
*   **Environment Setup:** Requires **production-ready** MongoDB Atlas cluster.
*   **Backend Deployment (Render):** Deployed as a Node.js Web Service with a `start` script.
*   **Frontend Deployment (Vercel):** Connected via GitHub for automatic CI/CD.
*   **Environment Variables:** Strictly managed via platform dashboards.

## 23. Configuration
*   **Required Environment Variables:** `MONGO_URI`, `GEMINI_API_KEY`, `N8N_API_KEY`, `VITE_API_BASE_URL`.
*   **Optional Configurations:** `LOG_LEVEL`, `MAX_AI_RETRIES`, `CIRCUIT_BREAKER_THRESHOLD`.

## 24. Usage Guide
*   **How to Use the App:** Sign up, enter the **Reasoning Lab**, and submit your thoughts.
*   **Example Flow:** User asks question → AI poses challenge → User reasons → AI unlocks answer.
*   **Screens / UI Overview:** **Dashboard**, **Reasoning Lab**, **Analytics**, and **Settings**.

## 25. Screenshots / Demo
*   **UI Screenshots:** (Add screenshots here)
*   **Demo GIF / Video:** (Add video link here)
*   **Sample Outputs:** High-depth reasoning vs. lazy thinking examples.

## 26. Limitations
*   **Current Constraints:** AI latency and free-tier **cold starts**.
*   **Known Issues:** Minor rendering delays on complex graphs.
*   **Trade-offs:** Speed is sacrificed for **reasoning depth**.

## 27. Future Improvements
*   **Planned Features:** **Offline Mode**, **Team Mode**, and **Mobile App**.
*   **Scalability Enhancements:** Redis caching for reasoning nodes.
*   **AI Improvements:** Fine-tuned models for specific technical domains.

## 28. Contribution Guide
*   **How to Contribute:** Fork the repo, create a branch, and submit a PR.
*   **Coding Standards:** Follow **Airbnb Style Guide** and strict **TypeScript** typing.
*   **PR Guidelines:** Descriptive titles and passing CI tests required.

## 29. License
*   **License Type:** **MIT License**.

## 30. Acknowledgements
*   **Tools / APIs Used:** **Google Gemini**, **n8n.io**, **Lucide Icons**.
*   **Inspirations:** Socratic method and cognitive psychology.

## 31. Contact / Maintainers
*   **Author Info:** **Vinni Kapoor**
*   **Contact Details:** [GitHub](https://github.com/Vinni5566)