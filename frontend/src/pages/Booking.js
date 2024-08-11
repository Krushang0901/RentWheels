import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './booking.css'; // Ensure this path is correct
import { TransmissionIcon, MileageIcon } from './Icons';

import { useAuth } from '../components/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const stripePromise = loadStripe("pk_test_51PjnE9IxEG9ZpdXhSZ8HTKreBgKzXjrJ0pTPZTF0jIIbx4x4yPMKvoY2abCS6zslaPiyEYbTNwAutCQbk4HfyvWB00ocqPWSUu");

const CheckoutForm = ({ formData, setFormData, price, selectedCar, closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/booking/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId: selectedCar._id,
          userId: user.id,
          bookingDate: formData.bookingDate,
          returnDate: formData.returnDate,
          totalPrice: price,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const { clientSecret } = data;
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.name,
              email: formData.email,
            },
          },
        });

        if (error) {
          console.error('Payment failed:', error);
          toast.error('Payment failed. Please try again.');
        } else {
          console.log('Payment succeeded');
          // Call backend to confirm payment status and update booking
          const paymentStatusResponse = await fetch('http://localhost:5000/api/booking/check-payment-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
          });
          const paymentStatusData = await paymentStatusResponse.json();

          if (paymentStatusData.success) {
            toast.success('Payment successful! Booking confirmed.');
            closeModal();
            setTimeout(() => {
              window.location.reload();
            }, 3000); // Adjust the delay as needed
          } else {
            toast.error('Payment was not successful. Please try again.');
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <ToastContainer />
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full pl-3 pr-2 py-2 border border-gray-300 rounded-md bg-gray-50"
            required
          />
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full pl-3 pr-2 py-2 border border-gray-300 rounded-md bg-gray-50"
            required
          />
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full pl-3 pr-2 py-2 border border-gray-300 rounded-md bg-gray-50"
            required
          />
          <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full pl-3 pr-2 py-2 border border-gray-300 rounded-md bg-gray-50"
            required
          />
        </div>
        <div className="flex flex-col ">
          <label htmlFor="bookingDate" className="text-sm font-medium text-gray-700">Booking Date</label>
          <input
            type="date"
            id="bookingDate"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={e => setFormData({ ...formData, bookingDate: e.target.value })}
            className="mt-1 block w-full pl-3 pr-2 py-2 border border-gray-300 rounded-md bg-gray-50"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="bookingTime" className="text-sm font-medium text-gray-700">Booking Time</label>
          <input
            type="time"
            id="bookingTime"
            name="bookingTime"
            value={formData.bookingTime}
            onChange={e => setFormData({ ...formData, bookingTime: e.target.value })}
            className="mt-1 block w-full pl-3 pr-2 py-2 border border-gray-300 rounded-md bg-gray-50"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="returnDate" className="text-sm font-medium text-gray-700">Return Date</label>
          <input
            type="date"
            id="returnDate"
            name="returnDate"
            value={formData.returnDate}
            onChange={e => setFormData({ ...formData, returnDate: e.target.value })}
            className="mt-1 block w-full pl-3 pr-2 py-2 border border-gray-300 rounded-md bg-gray-50"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="returnTime" className="text-sm font-medium text-gray-700">Return Time</label>
          <input
            type="time"
            id="returnTime"
            name="returnTime"
            value={formData.returnTime}
            onChange={e => setFormData({ ...formData, returnTime: e.target.value })}
            className="mt-1 block w-full pl-3 pr-2 py-2 border border-gray-300 rounded-md bg-gray-50"
            required
          />
        </div>
      </div>
      <div className="mt-4">
        <p><strong>Total Price:</strong> ${price.toFixed(2)}</p>
      </div>
      <div className="mt-4">
        <CardElement />
      </div>
      <div className="mt-4">
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Proceed to Payment
        </button>
      </div>
    </form>
  );
};

const Booking = () => {
  const { id } = useParams(); // Get the car ID from the URL
  const { user, logout } = useAuth();

  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bookingDate: '',
    returnDate: '',
    bookingTime: '',
    returnTime: '',
  });
  const [price, setPrice] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cars/${id}`);
        const data = await response.json();
        setSelectedCar(data);
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };

    fetchCarDetails();
  }, [id]);

  useEffect(() => {
    const { bookingDate, returnDate, bookingTime, returnTime } = formData;
    if (bookingDate && returnDate && bookingTime && returnTime && selectedCar) {
      const start = new Date(`${bookingDate}T${bookingTime}`);
      const end = new Date(`${returnDate}T${returnTime}`);
      const hours = Math.abs(end - start) / 36e5;
      setPrice(hours * selectedCar.price);
    }
  }, [formData, selectedCar]);

  const openForm = () => setIsFormVisible(true);
  const closeForm = () => setIsFormVisible(false);

  if (!selectedCar) {
    return <div>Loading...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="bg-white pt-6">
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:px-8">
          <div className="aspect-w-3 aspect-h-4 overflow-hidden rounded-lg">
            <img src={`data:${selectedCar.imageId.contentType};base64,${selectedCar.imageId.imageBase64}`} alt={`${selectedCar.make} ${selectedCar.model}`} className="h-full w-full object-cover object-center" />
          </div>
        </div>
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{selectedCar.make} {selectedCar.model}</h1>
          </div>
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Car information</h2>
            <p className="text-3xl tracking-tight text-gray-900">${selectedCar.price} / hour</p>
            {!isFormVisible && (
              <button
                onClick={openForm}
                className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ${selectedCar.availability !== 'available' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={selectedCar.availability !== 'available'}
              >
                Proceed to Checkout
              </button>
            )}
            {isFormVisible && (
              <>
                <button onClick={closeForm} className="text-red-500 py-2 px-4 rounded-md hover:text-red-600">
                  Cancel
                </button>
                <CheckoutForm formData={formData} setFormData={setFormData} price={price} selectedCar={selectedCar} closeModal={closeForm} />
              </>
            )}
          </div>
          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            <div>
              <div className="space-y-6">
                <h3>Description</h3>
                <p className="text-base text-gray-900">{selectedCar.description}</p>
              </div>
            </div>
            <div className="mt-10">
              <div className='name-year'>
                <h2 className="font-medium">{selectedCar.make} {selectedCar.model}</h2>
                <p><strong>Year:</strong> {selectedCar.year}</p>
              </div>
              <div className='milage-transmission flex justify-between mt-4'>
                <p className="flex items-center"><span className="mr-2"><MileageIcon className="mr-2" /></span>{selectedCar.mileage} km</p>
                <p className="flex items-center"><span className="mr-2"><TransmissionIcon className="mr-2" /></span>{selectedCar.transmission}</p>
              </div>
              <div className='price-available mt-4'>
                <p><strong>Availability:</strong> <span className={selectedCar.availability === 'available' ? 'text-green-500' : 'text-red-500'}>{selectedCar.availability}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default Booking;
