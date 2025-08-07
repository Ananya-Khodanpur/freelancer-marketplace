const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: [true, "Gig ID is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Optional: prevent duplicate reviews from the same user for the same gig
reviewSchema.index({ userId: 1, gigId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
