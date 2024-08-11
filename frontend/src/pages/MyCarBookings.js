import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MyCarBookings.css';
import { downloadInvoice } from './InvoiceGenerator';

const MyCarBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [reviewTexts, setReviewTexts] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/booking/user/${user.id}`);
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleReviewChange = (e, bookingId) => {
    setReviewTexts({ ...reviewTexts, [bookingId]: e.target.value });
  };

  const submitReview = async (bookingId) => {
    const reviewText = reviewTexts[bookingId];
    if (reviewText) {
      try {
        const response = await fetch('http://localhost:5000/api/booking/add-review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            bookingId,
            review: reviewText,
          }),
        });

        if (response.ok) {
          toast.success('Review submitted successfully');
          setReviewTexts({ ...reviewTexts, [bookingId]: '' }); // Clear the review text after submission

          // Close the text box
          setReviewTexts(prevState => {
            const newState = { ...prevState };
            delete newState[bookingId];
            return newState;
          });

          // Optionally fetch the updated bookings to reflect the new review
          // const updatedResponse = await fetch(`http://localhost:5000/api/booking/user/${user.id}`);
          // const updatedData = await updatedResponse.json();
          // setBookings(updatedData);
        } else {
          throw new Error('Failed to submit review');
        }
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    } else {
      toast.error('Please enter a review before submitting');
    }
  };

  const cancelReview = (bookingId) => {
    setReviewTexts(prevState => {
      const newState = { ...prevState };
      delete newState[bookingId];
      return newState;
    });
  };

  if (!user) {
    return <div>Please log in to view your bookings.</div>;
  }

  if (!bookings.length) {
    return <div>No bookings found.</div>;
  }

  return (
    <section className="container mx-auto p-3">
      <ToastContainer />
      <div className="hidden md:block shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">Image</th>
                <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">Car</th>
                <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">Booking Date</th>
                <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">Return Date</th>
                <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">Total Price</th>
                <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">Status</th>
                <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">Invoice</th>
                <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">Review</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td className="py-4 px-6 border-b border-gray-200"><CarImage imageId={booking.car.imageId} /></td>
                  <td className="py-4 px-6 border-b border-gray-200">{booking.car.make} {booking.car.model}</td>
                  <td className="py-4 px-6 border-b border-gray-200">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="py-4 px-6 border-b border-gray-200">{new Date(booking.returnDate).toLocaleDateString()}</td>
                  <td className="py-4 px-6 border-b border-gray-200">${booking.totalPrice}</td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <span className={`py-1 px-2 rounded-full text-xs ${booking.status === 'confirmed' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <button className="bg-dark-500 text-black py-1 px-2 rounded-full text-xs " onClick={() => downloadInvoice(booking)}>Download Invoice</button>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <button className="bg-gray-500 text-white py-1 px-2 rounded-full text-xs hover:bg-gray-600" onClick={() => setReviewTexts({ ...reviewTexts, [booking._id]: reviewTexts[booking._id] || '' })}>
                      Give Review
                    </button>
                    {reviewTexts[booking._id] !== undefined && (
                      <div className="mt-2">
                        <textarea
                          className="w-full p-2 border rounded-md"
                          value={reviewTexts[booking._id]}
                          onChange={(e) => handleReviewChange(e, booking._id)}
                          placeholder="Write your review here"
                        />
                        <button className="bg-green-500 text-white py-1 px-2 rounded-full text-xs hover:bg-green-600 mt-1" onClick={() => submitReview(booking._id)}>Submit Review</button>
                        <button className="bg-red-500 text-white py-1 px-2 rounded-full text-xs hover:bg-red-600 mt-1" onClick={() => cancelReview(booking._id)}>Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="block md:hidden mx-4 md:mx-10">
        {bookings.map(booking => (
          <div key={booking._id} className="shadow-lg rounded-lg overflow-hidden mb-4">
            <div className="bg-white p-3">
              <div className="flex items-center">
                <CarImage imageId={booking.car.imageId} />
                <div className="ml-4">
                  <h2 className="text-lg font-bold">{booking.car.make} {booking.car.model}</h2>
                  <p className="text-gray-600">Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                  <p className="text-gray-600">Return Date: {new Date(booking.returnDate).toLocaleDateString()}</p>
                  <p className="text-gray-600">Total Price: ${booking.totalPrice}</p>
                  <p className="text-gray-600">
                    <span className={`py-1 px-2 rounded-full text-xs ${booking.status === 'confirmed' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {booking.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <button className="bg-blue-500 text-white py-1 px-2 rounded-full text-xs hover:bg-blue-600" onClick={() => downloadInvoice(booking)}>Download Invoice</button>
                <button className="bg-gray-500 text-white py-1 px-2 rounded-full text-xs hover:bg-gray-600" onClick={() => setReviewTexts({ ...reviewTexts, [booking._id]: reviewTexts[booking._id] || '' })}>
                  Give Review
                </button>
              </div>
              {reviewTexts[booking._id] !== undefined && (
                <div className="mt-2">
                  <textarea
                    className="w-full p-2 border rounded-md"
                    value={reviewTexts[booking._id]}
                    onChange={(e) => handleReviewChange(e, booking._id)}
                    placeholder="Write your review here"
                  />
                  <button className="bg-green-500 text-white py-1 px-2 rounded-full text-xs hover:bg-green-600 mt-1" onClick={() => submitReview(booking._id)}>Submit Review</button>
                  <button className="bg-red-500 text-white py-1 px-2 rounded-full text-xs hover:bg-red-600 mt-1" onClick={() => cancelReview(booking._id)}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CarImage = ({ imageId }) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/images/${imageId}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    if (imageId) {
      fetchImage();
    }
  }, [imageId]);

  if (!imageSrc) {
    return <div>Loading image...</div>;
  }

  return <img className="w-24 h-24 object-cover" src={imageSrc} alt="Car" />;
};

export default MyCarBookings;
