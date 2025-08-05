// server/routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.post("/", async (req, res) => {
  try {
    const newMsg = new Message(req.body);
    const saved = await newMsg.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.params.userId }, { receiver: req.params.userId }],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
