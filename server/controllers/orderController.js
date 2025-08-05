const Order = require("../models/Order");
const Gig = require("../models/Gig");

exports.createOrder = async (req, res) => {
  try {
    const gig = await Gig.findById(req.body.gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    const newOrder = new Order({
      gigId: gig._id,
      buyerId: req.user.id,
      sellerId: gig.createdBy,
      price: gig.price,
    });
    await newOrder.save();
    res.status(201).json({ message: "Order created", order: newOrder });
  } catch (err) {
    console.error("Order creation error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ buyerId: req.user.id }, { sellerId: req.user.id }],
    }).populate("gigId buyerId", "title username");
    res.status(200).json(orders);
  } catch (err) {
    console.error("Order fetch error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
