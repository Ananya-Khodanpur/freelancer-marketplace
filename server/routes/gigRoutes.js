const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken"); // ✅ Import here
const upload = require("../middleware/upload"); // ✅ Import upload middleware
const Gig = require("../models/Gig"); // ✅ Import Gig model
// ✅ Debugging line

const {
  createGig,
  getGigs,
  updateGig,
  deleteGig,
} = require("../controllers/gigController");


// add this before the existing router.get("/:id") or getGigs
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const gigs = await Gig.find({ userId: req.params.sellerId });
    res.status(200).json(gigs);
  } catch (err) {
    console.error("Error fetching seller gigs:", err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post("/create", verifyToken, createGig); // ✅ Middleware used here
router.get("/", getGigs);
router.put("/:id", verifyToken, updateGig);
router.delete("/:id", verifyToken, deleteGig);

router.get("/:id", async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.status(200).json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;