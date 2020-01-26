const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const formidableMiddleware = require('express-formidable');
const mongoose = require('mongoose');

const user = require('./routes/user');
const offer = require('./routes/offer');

const app = express();
app.use(formidableMiddleware());
app.use(cors());

const config = dotenv.config().parsed;

mongoose.connect(config.MONGODB_URI, {
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

app.listen(config.PORT, () => {
  console.log('Server Started');
});
