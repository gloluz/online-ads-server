const express = require("express");
const Offer = require("../models/Offers");

const router = express.Router();

// Post Offer:
router.post("/offer/publish", async (req, res) => {
  try {
    // Récupérer le token
    // trouver l'utilisateur à partir de son token
    user;

    const newOffer = new Offer({
      title: req.fields.title,
      description: req.fields.description,
      price: req.fields.price,
      created: new Date(),
      creator: user
    });

    await newOffer.save();

    return res.json({
      ...newOffer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
