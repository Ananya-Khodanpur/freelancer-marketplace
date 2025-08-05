require('dotenv').config();
const express = require('express');
const router = express.Router();
const {handleStripeWebhook} = require('../controllers/paymentController');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//console.log(process.env.STRIPE_SECRET_KEY); // Debugging line to check if the key is loaded correctly
//const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { gigId, sellerId, buyerId, price } = req.body;
  try {
    //console.log(stripe);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Freelancer Service',
            },
            unit_amount: price, // $20.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
      client_reference_id: buyerId, // for saving in webhook
      metadata: {
        gigId,
        sellerId
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;
