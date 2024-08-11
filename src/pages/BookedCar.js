import React, { useState, useEffect } from 'react';

function BookedCar() {
    const [bookings, setBookings] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch('https://rentwheels.onrender.com/api/booking/getAllBookings');
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const pastBookings = bookings.filter(booking => new Date(booking.returnDate) < currentDate);
    const futureBookings = bookings.filter(booking => new Date(booking.returnDate) >= currentDate);

    const renderTable = (bookings, title) => (
        <div className="w-full my-4">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Car</th>
                                <th className="py-2 px-4 border-b">Plate</th>
                                <th className="py-2 px-4 border-b">Booking Date</th>
                                <th className="py-2 px-4 border-b">Return Date</th>
                                <th className="py-2 px-4 border-b">Booking Status</th>
                                <th className="py-2 px-4 border-b">User</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b">
                                        {booking.car.imageId && (
                                            <img 
                                                src={`data:${booking.car.imageId.contentType};base64,${booking.car.imageId.imageBase64}`} 
                                                alt={`${booking.car.make} ${booking.car.model}`} 
                                                className="w-16 h-16 object-cover"
                                            />
                                        )}
                                        <div>{booking.car.make} {booking.car.model}</div>
                                    </td>
                                    <td className="py-2 px-4 border-b">{booking.car.plate}</td>
                                    <td className="py-2 px-4 border-b">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b">{new Date(booking.returnDate).toLocaleDateString()}</td>
                                    <th className="py-2 px-4 border-b">{booking.status}</th>
                                    <td className="py-2 px-4 border-b">{booking.user.firstName} {booking.user.lastName}</td>
                                    <td className="py-2 px-4 border-b">{booking.user.email}</td>
                                    <td className="py-2 px-4 border-b">{booking.user.phoneNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No {title.toLowerCase()}.</p>
            )}
        </div>
    );

    return (
        <div>
            {renderTable(pastBookings, 'Past Bookings')}
            {renderTable(futureBookings, 'Future Bookings')}
        </div>
    );
}

export default BookedCar;
