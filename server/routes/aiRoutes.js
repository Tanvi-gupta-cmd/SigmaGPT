const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/chat", async (req, res) => {
  try {
    const { message, mode = "chat" } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const systemPrompt = `
You are SigmaGPT, a helpful AI assistant.

Current mode: ${mode}

Help the user clearly and accurately.

If the mode is code, focus on writing production-ready code.
If the mode is debug, focus on finding and fixing errors.
If the mode is explain, explain concepts simply.
If the mode is optimize, improve the given solution.
If the mode is write, create polished professional content.
`;

    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "AI API key is not configured.",
      });
    }

    const response = await fetch(
      process.env.AI_API_BASE_URL || "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("AI API error:", data);

      return res.status(502).json({
        success: false,
        message: "AI provider request failed.",
      });
    }

    const reply =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message
        ? data.choices[0].message.content
        : null;

    if (!reply) {
      return res.status(502).json({
        success: false,
        message: "AI returned an empty response.",
      });
    }

    return res.json({
      success: true,
      reply: reply,
    });
  } catch (error) {
    console.error("AI chat error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not connect to the AI provider.",
    });
  }
});

module.exports = router;