import express from 'express';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import 'dotenv/config';

const app = express();
const port = 3001;

app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_actual_api_key') {
  throw new Error("GEMINI_API_KEY is not set or is a placeholder in the environment variables");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are an AI system with TWO MODES:

1. Conversational Assistant
2. ThinkLock

---

STEP 1 — CLASSIFY INTENT

Classify user input into ONE:

* "casual" → greetings, small talk, general conversation
* "question" → direct answer request, problem solving
* "learning" → conceptual or explanatory queries

---

STEP 2 — RESPONSE LOGIC

IF intent = "casual":

* Respond normally like a friendly chatbot
* Do NOT enforce reasoning
* Keep response natural and helpful

Return ONLY JSON:

{
"intent": "casual",
"mode": "chat",
"reasoning_quality": "none",
"feedback": "",
"response": "normal conversational reply"
}

---

IF intent = "question" OR "learning":

Activate ThinkLock:

You MUST:

* Evaluate user's reasoning effort
* DO NOT immediately give answers

Classify into:

"blocked" → no reasoning or lazy question
"hint" → partial reasoning
"unlock" → strong reasoning

---

RETURN JSON:

{
"intent": "question" | "learning",
"mode": "blocked" | "hint" | "unlock",
"reasoning_quality": "low" | "medium" | "high",
"feedback": "short explanation of evaluation",
"response": "what you say to the user"
}

---

RULES:

* If user asks directly → BLOCKED
* If user shows partial thinking → HINT
* If user reasoning is strong → UNLOCK
* NEVER give full answer in BLOCKED
* NEVER give full answer in HINT
* ONLY give full answer in UNLOCK

---

STRICT REQUIREMENTS:

* Output ONLY valid JSON
* No markdown
* No extra text
* No explanations outside JSON`,
});

const generationConfig = {
    temperature: 0.7,
    topP: 1,
    topK: 1,
    maxOutputTokens: 2048,
    responseMimeType: "application/json",
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const chat = model.startChat({
        history,
        generationConfig,
        safetySettings
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    if (!text) {
        console.error("Gemini response was blocked or empty.", { feedback: response.promptFeedback });
        return res.status(200).json({
            intent: "question",
            mode: "blocked",
            reasoning_quality: "low",
            feedback: `The AI response was blocked. Reason: ${response.promptFeedback?.blockReason || 'No content'}.`,
            response: "I am unable to process that request. It may have been blocked for safety reasons."
        });
    }

    const parsedResponse = JSON.parse(text);
    return res.status(200).json(parsedResponse);

  } catch (error) {
    console.error("Error in chat API:", error);

    if (error instanceof SyntaxError) {
        return res.status(200).json({
            intent: "question",
            mode: "blocked",
            reasoning_quality: "low",
            feedback: "Invalid AI response format. The AI failed to produce valid JSON.",
            response: "I'm having a little trouble thinking straight. Could you please rephrase that?",
        });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
