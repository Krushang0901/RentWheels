const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/create-booking', bookingController.createBooking);
router.post('/check-payment-status', bookingController.checkPaymentStatus);
router.get('/user/:userId', bookingController.getUserBookings);
router.get('/getAllBookings', bookingController.getAllBookings);
router.post('/add-review', bookingController.addReview);

module.exports = router;
