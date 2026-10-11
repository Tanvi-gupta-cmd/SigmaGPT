const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/chat", async (req, res) => {
  try {
    const { message, mode = "chat" } = req.body;

    if (!message?.trim()) {
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

    const response = await fetch(
      "http://localhost:11434/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2:1b",
          stream: false,
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
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Ollama error:", data);

      return res.status(response.status).json({
        success: false,
        message: "Ollama AI request failed.",
      });
    }

    const reply = data?.message?.content;

    if (!reply) {
      return res.status(500).json({
        success: false,
        message: "Ollama returned an empty response.",
      });
    }

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Ollama chat error:", error);

    res.status(500).json({
      success: false,
      message:
        "Could not connect to local AI. Make sure Ollama is running.",
    });
  }
});

module.exports = router;