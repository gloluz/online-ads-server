const express = require('express');
const Offer = require('../models/Offers');
const isAuthenticated = require('../middleware/isAuthenticated');
const createFilters = require('../services/createOfferFilters');
const formidableMiddleware = require('express-formidable');
const cloudinary = require('cloudinary');

const router = express.Router();
const server = express();
server.use(formidableMiddleware());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Post Offer:
router.post('/offer/publish', isAuthenticated, async (req, res) => {
  try {
    const files = Object.keys(req.files);

    if (files.length) {
      const pictures = [];

      files.forEach(key => {
        cloudinary.uploader.upload(req.files[key].path, async (result, error) => {
          if (!error) {
            pictures.push(result.secure_url);
          } else {
            return res.status(500).json({ message: "Erreur dans l'import des fichiers" });
          }

          if (pictures.length === files.length) {
            // tous les uploads sont terminés, on peut donc envoyer la réponse au client

            req.user.account.nbOffers = req.user.account.nbOffers + 1;
            await req.user.save();

            const newOffer = new Offer({
              title: req.fields.title,
              description: req.fields.description,
              price: req.fields.price,
              creator: req.user,
              pictures,
            });

            await newOffer.save();

            return res.json({
              _id: newOffer._id,
              title: req.fields.title,
              description: req.fields.description,
              price: req.fields.price,
              created: newOffer.created,
              creator: {
                account: newOffer.creator.account,
                _id: newOffer.creator._id,
              },
              pictures,
            });
          }
        });
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Read:
router.get('/offer/with-count', async (req, res) => {
  try {
    const filters = createFilters(req);
    const search = Offer.find(filters).populate({ path: 'creator', select: 'account' });

    if (req.query.sort === 'price-asc') {
      search.sort({ price: 1 });
    } else if (req.query.sort === 'price-desc') {
      search.sort({ price: -1 });
    }

    if (req.query.sort === 'date-asc') {
      search.sort({ date: 1 });
    } else if (req.query.sort === 'date-desc') {
      search.sort({ date: -1 });
    }

    if (req.query.page) {
      const page = req.query.page;
      const limit = 4;

      search.limit(limit).skip(limit * (page - 1));
    }
    const offers = await search;

    return res.json({
      count: offers.length,
      offers: offers,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Read by Id:
router.get('/offer/:id', async (req, res) => {
  try {
    const offers = await Offer.findById(req.params.id).populate({ path: 'creator', select: 'account' });

    return res.json(offers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
