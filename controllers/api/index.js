const router = require('express').Router();
const userRoutes = require('./userRoutes');
const listingRoutes = require('./listingRoutes');
const singleListingRoutes = require('./singleListingRoutes');

router.use('/users', userRoutes);
router.use('/listings', listingRoutes);
router.use('/listing', singleListingRoutes);

module.exports = router;
