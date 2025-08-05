const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Gig = require("../models/Gig");
const Review = require("../models/Review");

router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get("/gigs", async (req, res) => {
  const gigs = await Gig.find();
  res.json(gigs);
});

router.get("/reviews", async (req, res) => {
  const reviews = await Review.find();
  res.json(reviews);
});

module.exports = router;
