const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.post('/add-car', carController.addCar);
router.get('/', carController.getCars);
router.put('/update-car/:id', carController.updateCar);
router.delete('/delete-car/:id', carController.deleteCar);
router.get('/:id', carController.getCarById);

module.exports = router;
