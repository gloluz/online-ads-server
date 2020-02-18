const express = require('express');
const formidableMiddleware = require('express-formidable');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();
const server = express();
server.use(formidableMiddleware());

router.post('/payment', async (req, res) => {
  try {
    const stripeToken = req.fields.stripeToken;

    let { status } = await stripe.charges.create({
      amount: `${req.fields.price}` * 100,
      description: `${req.fields.title}`,
      currency: 'eur',
      source: stripeToken,
    });

    res.json({ status });
  } catch (error) {
    return { message: error.message };
  }
});

module.exports = router;
