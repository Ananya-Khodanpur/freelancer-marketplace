const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Order = require("../models/Order");

// Create Stripe checkout session via authenticated user
router.post("/create-checkout-session", verifyToken, async (req, res) => {
  // Controller handles checkout & webhook
  const { gigId, price } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "Freelancer Service" },
          unit_amount: price,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: req.body.success_url, // frontend-provided
      cancel_url: req.body.cancel_url,
      client_reference_id: req.user.id,
      metadata: { gigId },
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get current user's orders
router.get("/myorders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ buyerId: req.user.id }, { sellerId: req.user.id }],
    }).populate("gigId buyerId", "title username");
    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed fetching orders:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
