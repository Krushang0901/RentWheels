import React, { useState, useEffect } from 'react';
import './Admin.css';

function Admin() {
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState('add'); // 'add' or 'update'
    const [currentCar, setCurrentCar] = useState(null);
    const [image, setImage] = useState(null);
    const [cars, setCars] = useState([]);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await fetch('https://rentwheels.onrender.com/api/cars/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCars(data);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    const handleAddCarClick = () => {
        setCurrentCar(null);
        setFormMode('add');
        setShowForm(true);
    };

    const handleUpdateCarClick = (car) => {
        setCurrentCar(car);
        setFormMode('update');
        setShowForm(true);
    };

    const handleDeleteCarClick = async (carId) => {
        try {
            const response = await fetch(`https://rentwheels.onrender.com/api/cars/delete-car/${carId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchCars();
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setCurrentCar(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage({
                filename: file.name,
                contentType: file.type,
                imageBase64: reader.result.split(',')[1]
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const carData = Object.fromEntries(formData.entries());
        if (image) {
            carData.image = image.imageBase64;
            carData.filename = image.filename;
            carData.contentType = image.contentType;
        } else if (currentCar && currentCar.imageId) {
            carData.imageId = currentCar.imageId._id;
        }

        const url = formMode === 'add' ? 'https://rentwheels.onrender.com/api/cars/add-car' : `https://rentwheels.onrender.com/api/cars/update-car/${currentCar._id}`;
        const method = formMode === 'add' ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carData)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Success:', data);
            fetchCars();
            handleCloseForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div>
            <div className="header">
                <h1>All Cars</h1>
                <button className="add-car-btn" onClick={handleAddCarClick}>
                    Add Car
                </button>
            </div>
            <div className="car-list">
                {cars.map((car, index) => (
                    <div className="car-card" key={index}>
                        {car.imageId && (
                            <img src={`data:${car.imageId.contentType};base64,${car.imageId.imageBase64}`} alt={`${car.make} ${car.model}`} />
                        )}
                        <div className="car-details">
                            <div className='car-name'>
                                <div>
                                    <h2>{car.model}</h2>
                                    <p>{car.make}</p>
                                </div>
                                <div>
                                    <p>{car.year}</p>
                                    <p className={car.availability === 'available' ? 'available' : 'not-available'}>
                                        {car.availability}
                                    </p>
                                </div>
                            </div>
                            <div className='car-button'>
                                <button className="update-car-btn" onClick={() => handleUpdateCarClick(car)}>Update Car</button>
                                <button className="delete-car-btn" onClick={() => handleDeleteCarClick(car._id)}>Delete Car</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showForm && (
                <div className="form-overlay">
                    <div className="form-container">
                        <p>{formMode === 'add' ? 'Add Car' : 'Update Car'}</p>
                        <button className="close-btn" onClick={handleCloseForm}>×</button>
                        <form className='admin-car' onSubmit={handleSubmit}>
                            <div className='form-field'>
                                <label htmlFor="car-make">Make:</label>
                                <input type="text" id="car-make" name="make" defaultValue={currentCar ? currentCar.make : ''} required />
                                <label htmlFor="car-model">Model:</label>
                                <input type="text" id="car-model" name="model" defaultValue={currentCar ? currentCar.model : ''} required />
                            </div>
                            <label htmlFor="car-plate">Car Plate Number:</label>
                            <input type="text" id="car-plate" name="plate" defaultValue={currentCar ? currentCar.plate : ''} required />
                            <label htmlFor="car-year">Year:</label>
                            <input type="number" id="car-year" name="year" defaultValue={currentCar ? currentCar.year : ''} required />
                            <label htmlFor="car-price">Price:</label>
                            <input type="number" id="car-price" name="price" defaultValue={currentCar ? currentCar.price : ''} required />
                            <label htmlFor="car-body-type">Body Type:</label>
                            <select id="car-body-type" name="bodyType" defaultValue={currentCar ? currentCar.bodyType : ''} required>
                                <option value="">Select a Body Type</option>
                                <option value="sedan">Sedan</option>
                                <option value="suv">SUV</option>
                                <option value="truck">Truck</option>
                                <option value="coupe">Coupe</option>
                            </select>
                            <label htmlFor="car-engine-type">Engine Type:</label>
                            <select id="car-engine-type" name="engineType" defaultValue={currentCar ? currentCar.engineType : ''} required>
                                <option value="">Select an Engine Type</option>
                                <option value="gasoline">Gasoline</option>
                                <option value="diesel">Diesel</option>
                                <option value="electric">Electric</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                            <label htmlFor="car-transmission">Transmission:</label>
                            <select id="car-transmission" name="transmission" defaultValue={currentCar ? currentCar.transmission : ''} required>
                                <option value="">Select a Transmission</option>
                                <option value="manual">Manual</option>
                                <option value="automatic">Automatic</option>
                            </select>
                            <label htmlFor="car-availability">Availability:</label>
                            <select id="car-availability" name="availability" defaultValue={currentCar ? currentCar.availability : ''} required>
                                <option value="">Select Availability</option>
                                <option value="available">Available</option>
                                <option value="not-available">Not Available</option>
                            </select>
                            <label htmlFor="car-mileage">Mileage / Liter:</label>
                            <input type="number" id="car-mileage" name="mileage" defaultValue={currentCar ? currentCar.mileage : ''} required />
                            <label htmlFor="car-description">Description:</label>
                            <textarea id="car-description" name="description" defaultValue={currentCar ? currentCar.description : ''} required />
                            <label htmlFor="car-image">Upload Image:</label>
                            <input type="file" id="car-image" name="image" accept="image/*" onChange={handleImageChange} />
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;
