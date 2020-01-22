const express = require('express');
const Offer = require('../models/Offers');
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();

// Post Offer:
router.post('/offer/publish', isAuthenticated, async (req, res) => {
  try {
    const newOffer = new Offer({
      title: req.fields.title,
      description: req.fields.description,
      price: req.fields.price,
      created: new Date(),
      creator: req.user,
    });

    await newOffer.save();

    return res.json({
      _id: newOffer._id,
      title: req.fields.title,
      description: req.fields.description,
      price: req.fields.price,
      created: newOffer.created,
      creator: {
        account: {
          username: newOffer.creator.account.username,
        },
        _id: newOffer.creator._id,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
