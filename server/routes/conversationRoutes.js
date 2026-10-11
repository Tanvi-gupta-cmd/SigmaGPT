const express = require("express");

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Get all conversations
router.get("/", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      userId: req.userId,
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load conversations.",
    });
  }
});

// Create conversation
router.post("/", async (req, res) => {
  try {
    const { title, mode } = req.body;

    const conversation = await Conversation.create({
      userId: req.userId,
      title: title?.trim() || "New chat",
      mode: mode || "chat",
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create conversation.",
    });
  }
});

// Get one conversation with messages
router.get("/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
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
      conversation,
      messages,
    });
  } catch (error) {
    console.error("Get conversation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load conversation.",
    });
  }
});

// Rename conversation
router.patch("/:id", async (req, res) => {
  try {
    const { title, pinned } = req.body;

    const updates = {};

    if (typeof title === "string") {
      updates.title = title.trim() || "New chat";
    }

    if (typeof pinned === "boolean") {
      updates.pinned = pinned;
    }

    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      updates,
      {
        new: true,
      }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Update conversation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update conversation.",
    });
  }
});

// Delete conversation
router.delete("/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    await Message.deleteMany({
      conversationId: conversation._id,
      userId: req.userId,
    });

    res.json({
      success: true,
      message: "Conversation deleted.",
    });
  } catch (error) {
    console.error("Delete conversation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete conversation.",
    });
  }
});

module.exports = router;