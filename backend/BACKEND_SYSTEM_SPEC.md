# 🛡️ Cognitive Shield: Backend Intelligence System

![Backend Architecture](file:///C:/Users/Vinni%20Kapoor/.gemini/antigravity/brain/f125716e-8201-4f3d-a206-cd85d9502770/backend_architecture_diagram_1777142156950.png)

Cognitive Shield is a high-performance, distributed backend designed to monitor, audit, and guide user learning behavior in real-time. It leverages a multi-layered AI architecture to detect "gaming" patterns and enforce cognitive growth.

---

## 🚀 1. System Architecture Deep-Dive

This backend is built for **resilient orchestration**. It treats AI as an untrusted external service and ensures 100% data integrity through advanced distributed patterns.

### 🧠 A. Real-Time AI Orchestration (Gemini 3)
The core "Brain" of the system uses a **Resilient Model Chain**:
- **Primary Model**: `gemini-3-flash-preview` (Optimized for speed and initial cognitive auditing).
- **Failover Model**: `gemini-3-pro-preview` (Used for deep reasoning backup if the primary model fails).
- **Circuit Breaker**: If the AI provider degrades (503/429 errors), a state-machine trips to `OPEN`, failing fast to protect server resources and prevent cascading delays.
- **Semantic Validation**: Beyond structural parsing, the backend validates the **logical consistency** of AI scores and flags before accepting the data.

### 📦 B. Distributed Data Consistency
- **Idempotency Layer**: Every critical request uses an `Idempotency-Key` header. Duplicate requests return cached responses, preventing double AI token usage and corrupted analytics.
- **Atomic Transactions**: We use Mongoose sessions to wrap Message creation and Analytics aggregation into a single atomic operation. AI calls are performed **outside** the transaction to prevent database locking.
- **Outbox Pattern**: Events for n8n Cloud are saved to a durable `OutboxEvent` collection within the primary transaction, ensuring **Guaranteed Delivery**.

### 📡 C. The Intelligence Loop (n8n Cloud)
The system is a **Closed Loop** between the real-time API and the async intelligence layer:
1.  **Signals Out**: Backend dispatches behavioral events (intent, reasoning, gaming risk) to n8n Cloud via the Outbox.
2.  **Long-Term Analysis**: n8n analyzes patterns across multiple sessions (e.g., "high-reliance pattern").
3.  **Intelligence Feedback**: n8n calls back to update the user's classification, which modifies future AI prompting and dashboard metrics.

---

## 📖 2. API Specification

### Global Request Headers
| Header | Value | Description |
| :--- | :--- | :--- |
| `Content-Type` | `application/json` | Required for all POST/PUT requests. |
| `Idempotency-Key` | `UUID/String` | **Recommended.** Prevents duplicate side effects from retries. |

### 💬 2.1 Chat & Message Flow
#### `POST /api/chat/send`
Processes a user message and returns an AI-guided response.

**Request Body:**
```json
{
  "sessionId": "string (optional)",
  "content": "Why is the sky blue?"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "69ed05e33a6b3f5d464061cc",
    "messages": [...],
    "sessionStats": { "reasoningScore": 45, "gamingRisk": "low" }
  }
}
```

---

### 📊 2.2 Dashboard Analytics
#### `GET /api/chat/profile/:sessionId`
Powers the **Cognitive Profile Dashboard**. Returns reasoning growth, independence scores, and trend data for charts.

#### `GET /api/chat/anti-gaming/:sessionId`
Powers the **Anti-Gaming Dashboard**. Returns real-time risk levels, warning counts, and the aggregate gaming score.

---

### 📡 2.3 Intelligence Loop (Webhooks)
#### `POST /api/chat/behavior/:sessionId`
The inbound endpoint for n8n Cloud. Allows external intelligence to update the session's behavioral classification.

---

## 🛠️ 3. Execution & Testing

### Environment Configuration (.env)
- `PORT`: Server port (default 5000).
- `MONGO_URI`: MongoDB connection string.
- `GEMINI_API_KEY`: Google AI credentials.
- `N8N_API_KEY`: n8n Cloud API key.
- `N8N_EVENTS_URL`: Your n8n Cloud webhook endpoint.

### Verification Suite
Run the professional test suite in the `/scratch` directory:
- `node scratch/test-message-flow.js`: Full pipeline test.
- `node scratch/test-distributed-system.js`: Idempotency & Outbox worker test.

---

## 📂 4. Project Structure
- `src/middlewares`: Security guards & Zod validation layers.
- `src/services`: The core business logic and AI orchestration.
- `src/utils`: Resilience tools (Circuit Breaker, Retry Utility).
- `src/models`: Database schemas for Sessions, Messages, and the Durable Outbox.
- `src/controllers`: API endpoints connecting the UI to the Logic.
