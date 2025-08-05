const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const newOrder = new Order({
        buyerId: session.client_reference_id,
        sellerId: session.metadata.sellerId,
        gigId: session.metadata.gigId,
        status: 'pending'
      });

      await newOrder.save();
    }

    res.status(200).send('Webhook received');
  } catch (err) {
    res.status(400).send(`Webhook error: ${err.message}`);
  }
});

module.exports = router;
