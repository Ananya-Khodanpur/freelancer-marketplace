const Gig = require("../models/Gig");

const createGig = async (req, res) => {
  try {
    const newGig = new Gig({
      userId: req.user.id,
      createdBy: req.user.id, // Ensure createdBy is set to the user creating the gig
      title: req.body.title,
      desc: req.body.desc,
      price: req.body.price,
      category: req.body.category,
      images: req.body.images,
    });

    await newGig.save();
    res.status(201).json({ message: "Gig created", gig: newGig });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// READ
const getGigs = async (req, res) => {
  try {
    const { search, category, min, max, sortBy } = req.query;

    let filter = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }

    const sortOption = {};
    if (sortBy === 'priceAsc') sortOption.price = 1;
    if (sortBy === 'priceDesc') sortOption.price = -1;

    const gigs = await Gig.find(filter).sort(sortOption);

    res.status(200).json(gigs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE
const updateGig = async (req, res) => {
  try {
    const gigId = req.params.id;
    const updateFields = req.body;

    console.log("Gig ID:", gigId);  // 🔍 log gig ID
    console.log("Update Fields:", updateFields);  // 🔍 log update fields
    const updatedGig = await Gig.findByIdAndUpdate(
      gigId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedGig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.status(200).json(updatedGig);
  } catch (err) {
    console.log("Update Error:", err.message);  // 🔍 log error
    res.status(500).json({ message: "Failed to update gig", error: err.message });
  }
};

// Delete Gig
const deleteGig = async (req, res) => {
  try {
    const gigId = req.params.id;

    const deletedGig = await Gig.findByIdAndDelete(gigId);

    if (!deletedGig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.status(200).json({ message: "Gig deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete gig", error: err.message });
  }
};

// ✅ Export all functions
module.exports = {
  createGig,
  getGigs,
  updateGig,
  deleteGig,
};