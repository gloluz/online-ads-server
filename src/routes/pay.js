const express = require('express');
const formidableMiddleware = require('express-formidable');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(formidable());

app.post('/pay', async (req, res) => {
  try {
    console.log(req.fields);
    res.json('OK');
  } catch (error) {
    return { message: error.message };
  }
});
