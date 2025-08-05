const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdBy: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, 
  },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Gig", gigSchema);