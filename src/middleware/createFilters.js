// const createFilters = (req, res, next) => {
//   try {
//     const filters = {};

//     if (req.query.priceMin) {
//       filters.price = {};
//       filters.price.$gte = req.query.priceMin;
//     }

//     if (req.query.priceMax) {
//       if (filters.price === undefined) {
//         filters.price = {};
//       }
//       filters.price.$lte = req.query.priceMax;
//     }

//     if (req.query.title) {
//       filters.title = new RegExp(req.query.title, 'i');
//     }
//     req.filters = filters;

//     return next();
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };

// module.exports = createFilters;
