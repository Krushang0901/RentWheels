const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    plate: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    bodyType: { type: String, required: true },
    engineType: { type: String, required: true },
    transmission: { type: String, required: true },
    availability: { type: String, required: true },
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    mileage: { type: Number, required: true },      
    description: { type: String, required: true },
});

module.exports = mongoose.model('Car', CarSchema);
