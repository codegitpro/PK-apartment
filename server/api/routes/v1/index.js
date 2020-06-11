const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const apartmentRoutes = require('./apartment.route');

const router = express.Router();

router.use('/', authRoutes);
router.use('/users', userRoutes);
router.use('/apartments', apartmentRoutes);

module.exports = router;
