const Car = require('../models/Car');
const Image = require('../models/Image');

exports.addCar = async (req, res) => {
    try {
        let imageId = null;
        if (req.body.image) {
            const image = new Image({
                filename: req.body.filename,
                contentType: req.body.contentType,
                imageBase64: req.body.image
            });
            const savedImage = await image.save();
            imageId = savedImage._id;
        }

        const car = new Car({
            ...req.body,
            imageId: imageId
        });

        await car.save();
        res.json(car);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCars = async (req, res) => {
    try {
        const cars = await Car.find().populate('imageId');
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateCar = async (req, res) => {
    try {
        let imageId = req.body.imageId;
        if (req.body.image && req.body.filename && req.body.contentType) {
            const image = new Image({
                filename: req.body.filename,
                contentType: req.body.contentType,
                imageBase64: req.body.image
            });
            const savedImage = await image.save();
            imageId = savedImage._id;

            const car = await Car.findById(req.params.id);
            if (car.imageId) {
                await Image.findByIdAndDelete(car.imageId);
            }
        } else {
            const car = await Car.findById(req.params.id);
            imageId = car.imageId;
        }

        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                imageId: imageId
            },
            { new: true }
        );

        res.json(updatedCar);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (car.imageId) {
            await Image.findByIdAndDelete(car.imageId);
        }
        res.json({ message: 'Car deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).populate('imageId');
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json(car);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

