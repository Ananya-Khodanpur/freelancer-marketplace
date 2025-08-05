const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const mongoose = require("mongoose");

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    try {
      await Order.create({
        buyerId: mongoose.Types.ObjectId(session.client_reference_id),
        gigId: mongoose.Types.ObjectId(session.metadata.gigId),
        sellerId: mongoose.Types.ObjectId(session.metadata.sellerId),
        price: session.amount_total,
        isCompleted: false,
      });
      console.log("✅ Order saved from Stripe webhook");
    } catch (err) {
      console.error("Failed saving order in webhook:", err.message);
    }
  }

  res.status(200).send("Webhook received");
};
