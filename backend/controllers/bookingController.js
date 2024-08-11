const Booking = require('../models/Booking');
const Car = require('../models/Car');
const dotenv = require('dotenv');

dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createBooking = async (req, res) => {
  const { carId, userId, bookingDate, returnDate, totalPrice } = req.body;

  try {
    const newBooking = new Booking({
      car: carId,
      user: userId,
      bookingDate,
      returnDate,
      totalPrice,
    });

    await newBooking.save();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Convert to integer cents
      currency: 'usd',
      metadata: { bookingId: newBooking._id.toString() },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

exports.checkPaymentStatus = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const bookingId = paymentIntent.metadata.bookingId;
      const booking = await Booking.findById(bookingId);
      booking.status = 'confirmed';
      await booking.save();

      // Update car availability status
      const car = await Car.findById(booking.car);
      car.availability = 'not-available';
      await car.save();

      res.status(200).json({ success: true, message: 'Payment successful, booking confirmed and car status updated' });
    } else {
      res.status(200).json({ success: false, message: 'Payment not successful' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate('car').populate('user');
    if (!bookings) {
      return res.status(404).json({ success: false, message: 'No bookings found for this user' });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'car',
        populate: {
          path: 'imageId',
          model: 'Image'
        }
      })
      .populate('user')
      .populate('reviews.user');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

exports.addReview = async (req, res) => {
  const { userId, bookingId, review } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.reviews.push({ user: userId, review });
    await booking.save();

    res.status(200).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};
