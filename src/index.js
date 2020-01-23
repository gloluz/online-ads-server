require('dotenv').config();
const express = require('express');
const formidableMiddleware = require('express-formidable');
const mongoose = require('mongoose');

const user = require('./routes/user');
const offer = require('./routes/offer');

const app = express();
app.use(formidableMiddleware());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.get('/', async (req, res) => {
  try {
    return res.json({ message: 'Welcome to the online ads API' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.use(user);

app.use(offer);

app.all('*', (req, res) => {
  res.json({ message: 'Page not found' });
});

app.listen(3000, () => {
  console.log('Server Started');
});
