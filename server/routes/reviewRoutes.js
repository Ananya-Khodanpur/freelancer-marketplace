const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// POST a review
router.post("/", async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET reviews for a specific gig
router.get("/gig/:gigId", async (req, res) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId }).populate("userId", "username");
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
