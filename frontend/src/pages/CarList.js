import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CarList.css'; // Ensure this path is correct
import { TransmissionIcon, MileageIcon } from './Icons';

const CarList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCarSearch, setSelectedCarSearch] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [mileageTo, setMileageTo] = useState('');
  const [year, setYear] = useState('');
  const [isSearchNotAvailable, setIsSearchNotAvailable] = useState(false);
  const [isFilterNotAvailable, setIsFilterNotAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('https://rentwheels.onrender.com/api/cars/');
        const data = await response.json();
        setCars(data);
        setFilteredCars(data); // Set initial filtered cars
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleCarDetailsClick = (car) => {
    setSelectedCar(car);
  };

  const handleCloseDetails = () => {
    setSelectedCar(null);
  };

  useEffect(() => {
    if (inputValue) {
      const filteredSuggestions = cars
        .map(car => car.make + ' ' + car.model)
        .filter(carName => carName.toLowerCase().includes(inputValue.toLowerCase()));
      setSuggestions(filteredSuggestions);

      // Check if car is available in search
      setIsSearchNotAvailable(filteredSuggestions.length === 0);
    } else {
      setSuggestions([]);
      setIsSearchNotAvailable(false);
      setFilteredCars(cars); // Reset the filtered cars when input is cleared
    }
  }, [inputValue, cars]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedCarSearch(suggestion);
    setInputValue(suggestion);
    setSuggestions([]);

    // Filter cars based on selected suggestion
    const filtered = cars.filter(car => (car.make + ' ' + car.model).toLowerCase() === suggestion.toLowerCase());
    setFilteredCars(filtered);
    console.log('Selected Car:', suggestion);
  };

  const handleFilterChange = () => {
    let filtered = cars;

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      filtered = filtered.filter(car => {
        const carPrice = Number(car.price);
        return carPrice >= minPrice && (maxPrice ? carPrice <= maxPrice : true);
      });
    }

    if (mileageTo) {
      filtered = filtered.filter(car => Number(car.mileage) <= Number(mileageTo));
    }

    if (year) {
      filtered = filtered.filter(car => car.year === Number(year));
    }

    setFilteredCars(filtered);
    setIsFilterNotAvailable(filtered.length === 0);
  };

  useEffect(() => {
    if (!isLoading) {
      handleFilterChange();
    }
  }, [priceRange, mileageTo, year]);

  const handleBookCarClick = (carId) => {
    navigate(`/booking/${carId}`);
  };
  return (

    <div >
      <div className="custom-card bg-white p-6 rounded-xl shadow-xl">
        <label
          className="mx-auto w-full max-w-2xl flex flex-col md:flex-row items-center justify-center px-4 rounded-2xl gap-3"
          htmlFor="search-bar"
        >
          <input
            id="search-bar"
            placeholder="Enter car name"
            className="px-6 py-2 w-full rounded-md flex-1 outline-none bg-gray-50 border border-gray-300 focus:border-indigo-500"
            value={inputValue}
            onChange={handleInputChange}
          />
        </label>
        {suggestions.length > 0 && (
          <ul className="bg-white border border-gray-300 rounded-md mt-1 max-w-2xl mx-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        {isSearchNotAvailable && <p className="text-red-500 text-center mt-2">Item not available</p>}
        <div className="p-6 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col">
            <label htmlFor="price" className="text-sm font-medium text-gray-700">Price / 1 hour</label>
            <select
              id="price"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">Select Price Range</option>
              <option value="0-50">$0 - $50</option>
              <option value="51-100">$51 - $100</option>
              <option value="101-150">$101 - $150</option>
              <option value="151-200">$151 - $200</option>
              <option value="201+">$201+</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="mileage-to" className="text-sm font-medium text-gray-700">Car mileage / km</label>
            <input
              type="text"
              id="mileage-to"
              placeholder="Mileage"
              className="mt-1 block w-full pl-3 pr-2 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50"
              value={mileageTo}
              onChange={(e) => setMileageTo(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="year" className="text-sm font-medium text-gray-700">Year</label>
            <select
              id="year"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
              <option value="2016">2016</option>
              <option value="2015">2015</option>
            </select>
          </div>

          <div className="flex space-x-2 col-span-1 md:col-span-3 justify-center md:justify-end mt-4">
            <button
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-black transition-colors"
              onClick={() => {
                setPriceRange('');
                setMileageTo('');
                setYear('');
                setFilteredCars(cars);
                setIsFilterNotAvailable(false);
              }}
            >
              Reset results
            </button>
          </div>
        </div>
      </div>

      {isFilterNotAvailable && !isLoading ? (
        <p className="text-red-500 text-center mt-2">Car not available</p>
      ) : (
        <div className="custom-card car-list-user">
          {filteredCars.map((car, index) => (
            <div className="car-user-card" key={index}>
              {car.imageId && (
                <img
                  src={`data:${car.imageId.contentType};base64,${car.imageId.imageBase64}`}
                  alt={`${car.make} ${car.model}`}
                />
              )}
              <div className="car-details">
                <div className="car-name">
                  <div>
                    <h2 className="text-lg font-medium">{car.model}</h2>
                    <p className="text-gray-500">{car.make}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{car.year}</p>
                    <p className={`text-sm font-medium ${car.availability === 'available' ? 'text-green-500' : 'text-red-500'}`}>
                      {car.availability}
                    </p>
                  </div>
                </div>

                <div className='price'>
                  <p> ${car.price} / hour</p>
                </div>

                <div className="car-button flex space-x-2">
                  <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={() => handleCarDetailsClick(car)}>Car Details</button>
                  <button
                    className={`bg-black text-white py-2 px-4 rounded-md ${car.availability !== 'available' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'}`}
                    onClick={() => handleBookCarClick(car._id)}
                    disabled={car.availability !== 'available'}
                  >
                    Book Now
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCar && (
        <div className="form-overlay">
          <div className="form-container">
            <h2 className="font-medium">Car Details</h2>
            <button className="close-btn" onClick={handleCloseDetails}>×</button>
            {selectedCar.imageId && (
              <img
                src={`data:${selectedCar.imageId.contentType};base64,${selectedCar.imageId.imageBase64}`}
                alt={`${selectedCar.make} ${selectedCar.model}`}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}
            <div className='name-year'>
              <h2 className="font-medium">{selectedCar.make} {selectedCar.model}</h2>
              <p><strong>Year:</strong> {selectedCar.year}</p>
            </div>

            <div className='milage-transmission'>
              <p className="flex items-center"><MileageIcon className="mr-2" />  {selectedCar.mileage} km</p>
              <p className="flex items-center"><TransmissionIcon className="mr-2" />  {selectedCar.transmission}</p>
            </div>

            <div className='price-available'>
              <p><strong>Price:</strong> ${selectedCar.price} / hour</p>
              <p><strong>Availability:</strong> <span className={selectedCar.availability === 'available' ? 'text-green-500' : 'text-red-500'}>{selectedCar.availability}</span></p>
            </div>
            <div className='description-car'>

              <p><strong>Description:</strong> {selectedCar.description}</p>

            </div>
            <div className='rent-button'>
              <button
                className={`bg-black text-white py-2 px-4 rounded-md ${selectedCar.availability !== 'available' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'}`}
                onClick={() => handleBookCarClick(selectedCar._id)}
                disabled={selectedCar.availability !== 'available'}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default CarList;
