import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_YourPublishableKeyHere'); // frontend key

const Checkout = () => {
  const handleClick = async () => {
    const stripe = await stripePromise;

    const res = await fetch('http://localhost:5000/api/payment/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    const result = await stripe.redirectToCheckout({ sessionId: data.id });

    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <div>
      <h2>Buy Service</h2>
      <button onClick={handleClick}>Pay $20</button>
    </div>
  );
};

export default Checkout;
