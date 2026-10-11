const express = require("express");

const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// -----------------------------
// Simple local AI engine
// -----------------------------
function generateAIResponse(text, mode = "chat") {
  const prompt = text.toLowerCase();

  if (prompt.includes("recursion")) {
    return `Recursion is a programming technique where a function calls itself to solve a smaller version of the same problem.

For example:

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

The important part is the base case. Without it, the function would keep calling itself forever.

In simple words:
1. Solve a small part.
2. Call the function again with a smaller input.
3. Stop when the base case is reached.`;
  }

  if (
    prompt.includes("react") ||
    prompt.includes("dashboard") ||
    mode === "code"
  ) {
    return `Here's a clean approach for this:

1. Create reusable React components.
2. Keep application state separate from UI.
3. Use loading and error states.
4. Keep API calls inside a dedicated service layer.
5. Use responsive CSS for different screen sizes.

Example:

function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <section className="metrics">
        {/* metric cards */}
      </section>
    </main>
  );
}

For a production application, I would also add proper error handling, accessibility and performance optimization.`;
  }

  if (
    prompt.includes("debug") ||
    prompt.includes("error") ||
    mode === "debug"
  ) {
    return `Let's debug this step by step.

First, check:
• The exact error message
• The file and line number
• The input causing the problem
• Recent code changes
• Network/API requests if applicable

If you share the complete error message and the related code, I can narrow down the root cause and suggest a fix.`;
  }

  if (
    prompt.includes("email") ||
    prompt.includes("cover letter") ||
    prompt.includes("resume") ||
    mode === "write"
  ) {
    return `Subject: Update and Next Steps

Dear [Name],

I hope you are doing well.

I am writing to provide an update regarding the current progress. I appreciate your time and patience, and I am working to ensure that the final result meets the expected requirements.

I will keep you updated on the progress and share the completed work as soon as possible.

Best regards,
[Your Name]`;
  }

  if (
    prompt.includes("optimize") ||
    prompt.includes("performance") ||
    mode === "optimize"
  ) {
    return `Here are some practical optimization steps:

1. Identify the slowest part using profiling.
2. Avoid unnecessary re-renders.
3. Memoize expensive calculations when appropriate.
4. Reduce unnecessary network requests.
5. Add caching where it makes sense.
6. Optimize database queries and indexes.
7. Lazy-load large frontend resources.

The best optimization depends on where the actual bottleneck is, so measuring performance first is important.`;
  }

  if (
    prompt.includes("explain") ||
    mode === "explain"
  ) {
    return `Sure! I'll explain it in simple terms.

The easiest way to understand a complex concept is to break it into three parts:

1. What it is
2. Why it is useful
3. A practical example

Send me the specific concept, code or topic you want explained and I'll break it down step by step.`;
  }

  return `I understand your request.

You're using SigmaGPT in ${mode} mode.

I can help you break this problem down, explain the concepts involved, suggest an implementation approach, and review the result.

Since this version is running without an external AI API key, the response engine is currently local. Once you add an AI provider later, this same endpoint can be connected to a real AI model.`;
}

// -----------------------------
// Get messages
// -----------------------------
router.get("/:conversationId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      userId: req.userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
      userId: req.userId,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load messages.",
    });
  }
});

// -----------------------------
// Send message + generate AI response
// -----------------------------
// -----------------------------
// Save a single message
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const {
      conversationId,
      content,
      role = "user",
      mode = "chat",
    } = req.body;

    if (!conversationId || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "conversationId and content are required.",
      });
    }

    if (!["user", "assistant"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message role.",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    // Save only the requested message
    const savedMessage = await Message.create({
      conversationId,
      userId: req.userId,
      role,
      content: content.trim(),
      mode: mode || conversation.mode || "chat",
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    res.status(201).json({
      success: true,
      message: savedMessage,
    });
  } catch (error) {
    console.error("Save message error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save message.",
    });
  }
});

module.exports = router;