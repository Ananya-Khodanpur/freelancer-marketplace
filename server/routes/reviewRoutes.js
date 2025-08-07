const express = require("express");
const router = express.Router();
const { createReview, getReviewsByGig } = require("../controllers/reviewController");

// Routes
router.post("/", createReview); // used in form submit
router.get("/gig/:gigId", getReviewsByGig); // used in useEffect

module.exports = router;
