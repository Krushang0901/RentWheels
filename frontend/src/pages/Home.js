import React, { useEffect, useState } from 'react';
import './Home.css';

const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('https://rentwheels.onrender.com/api/cars/');
        const data = await response.json();
        setCars(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    fetch('https://rentwheels.onrender.com/api/booking/getAllBookings')
      .then((response) => response.json())
      .then((data) => {
        const allReviews = data.flatMap(booking =>
          booking.reviews.map(review => ({
            user: review.user.username,
            review: review.review,
          }))
        );
        setReviews(allReviews);
      })
      .catch((error) => console.error('Error fetching reviews:', error));
  }, []);

  return (
    <div className="homepage">
      <section className="banner">
        <div className="overlay"></div>
        <img src='./banner.jpeg' alt="Car by the beach" />
        <div className="search-container">
          <h2>Find Your Perfect Ride</h2>
          <div className="header-content">
            <h1>Welcome to RentWheels</h1>
            <p>Your ultimate destination for affordable and reliable car rentals.</p>
            <button className='browseCar' onClick={() => window.location.href='/carList'}>Browse Cars</button>
          </div>
        </div>
      </section>

      <section className="why-choose-us">
        <h2>Why Choose Our Car Rental Service?</h2>
        <div className="features-container">
          <div className="feature">
            <img src="./time.svg" alt="Convenient Booking Icon" className="feature-icon" />
            <div className='feature-text'>
              <h3>Convenient Booking</h3>
              <p>Book your rental car online in just a few clicks.</p>
            </div>
          </div>
          <div className="feature">
            <img src="./car.svg" alt="Car Selection Icon" className="feature-icon" />
            <div className='feature-text'>
              <h3>Wide Car Selection</h3>
              <p>Choose from a variety of reliable and well-maintained vehicles.</p>
            </div>
          </div>
          <div className="feature">
            <img src="./wallet.svg" alt="Affordable Rates Icon" className="feature-icon" />
            <div className='feature-text'>
              <h3>Affordable Rates</h3>
              <p>Enjoy competitive prices and flexible rental options.</p>
            </div>
          </div>
          <div className="feature">
            <img src="./shield.svg" alt="Reliable Service Icon" className="feature-icon" />
            <div className='feature-text'>
              <h3>Reliable Service</h3>
              <p>Experience top-notch customer support and peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How RentWheels Works</h2>
        <div className="steps">
          <div className="step-image">
            <img src="./car-rent.png" alt="Step 1" />
          </div>
          <div className='steps-container'>
            <div className="step">
              <div className="step-number">1</div>
              <div className='step-text'>
                <h3>Find the Perfect Car</h3>
                <p>Enter a location and date and browse thousands of cars shared by local hosts.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className='step-text'>
                <h3>Book Your Trip</h3>
                <p>Book on our website, choose a protection plan, and say hi to your host!</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className='step-text'>
                <h3>Hit the Road</h3>
                <p>Have the car delivered or pick it up from your host. Check in with the app, grab the keys, and hit the road!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="car-models">
        <h2>Browse Our Car Models</h2>
        <div className="models-container">
          {isLoading ? (
            <p>Loading cars...</p>
          ) : (
            cars.map((car, index) => (
              <div className="model" key={index}>
                {car.imageId && (
                  <img
                    src={`data:${car.imageId.contentType};base64,${car.imageId.imageBase64}`}
                    alt={`${car.make} ${car.model}`}
                  />
                )}
                <h3>{car.model}</h3>
                <p>{car.make}</p>
                <p>{car.year}</p>
                <p>${car.price}/day</p>
                <button onClick={() => window.location.href='/cars'}>Rent Now</button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="customer-testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-container">
          {reviews.length === 0 ? (
            <p>No reviews available.</p>
          ) : (
            reviews.map((review, index) => (
              <div className="testimonial" key={index}>
                <img src="./user.svg" alt="User icon" className="testimonial-icon" />
                <div className='testimonialText'>
                <h3>{review.user}</h3>
                <p>{review.review}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
