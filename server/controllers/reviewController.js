const Review = require("../models/Review");

// @desc    Create a new review
// @route   POST /api/reviews
const createReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get reviews for a specific gig
// @route   GET /api/reviews/gig/:gigId
const getReviewsByGig = async (req, res) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId }).populate("userId", "username");
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createReview,
  getReviewsByGig,
};
