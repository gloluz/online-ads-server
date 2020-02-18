const mongoose = require('mongoose');

const Offer = mongoose.model('Offer', {
  title: {
    type: String,
    minLength: 1,
    maxLength: [50, 'Please enter less than 50 characters'],
    require: true,
  },
  description: {
    type: String,
    minLength: 1,
    maxLength: [500, 'Please enter less than 500 characters'],
    require: true,
  },
  pictures: {
    type: [String],
  },
  price: {
    type: Number,
    min: 0,
    max: [100000, 'Please enter a price less than 100000'],
  },
  created: {
    type: Date,
    default: Date.now,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = Offer;
