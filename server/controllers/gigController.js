const Gig = require("../models/Gig");

// CREATE
const createGig = async (req, res) => {
  try {
    const newGig = new Gig({
      userId: req.user.id,
      createdBy: req.user.id,
      title: req.body.title,
      desc: req.body.desc,
      price: req.body.price,
      category: req.body.category,
      images: req.body.images, // already secure_url array from frontend
    });

    await newGig.save();
    res.status(201).json({ message: "Gig created successfully!", gig: newGig });
  } catch (error) {
    console.error("Gig creation failed:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET all gigs (with optional filters)
const getGigs = async (req, res) => {
  try {
    const { search, category, min, max, sortBy, myGigs } = req.query;

    let filter = {};

    // for freelancer dashboard
    if (myGigs === "true") {
      if (req.user.role !== "freelancer") {
        return res.status(403).json({ message: "Only freelancers can view their own gigs" });
      }
      filter.userId = req.user.id;
    }

    // public filters
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }

    let sort = {};
    if (sortBy === "priceAsc") sort.price = 1;
    if (sortBy === "priceDesc") sort.price = -1;

    const gigs = await Gig.find(filter).sort(sort);

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// UPDATE
const updateGig = async (req, res) => {
  try {
    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedGig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    res.status(200).json({ message: "Gig updated successfully", gig: updatedGig });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE

const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // make sure gig has userId set
    if (!gig.userId) {
      return res
        .status(400)
        .json({ message: "This gig has no owner assigned, cannot delete." });
    }

    // check user role
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can delete gigs." });
    }

    // verify ownership
    if (gig.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this gig." });
    }

    await gig.deleteOne();

    res.status(200).json({ message: "Gig deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createGig,
  getGigs,
  updateGig,
  deleteGig,
};
