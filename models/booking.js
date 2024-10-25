// models/booking.js

const mongoose = require('mongoose');

// Define the booking schema
const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    destination: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    num_people: { type: Number, required: true },
    other_info: { type: String, required: false }
});

// Create the booking model
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
