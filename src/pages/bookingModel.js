import React from 'react';
import './booking.css';

const BookingModel = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">x</button>
        {children}
      </div>
    </div>
  );
};

export default BookingModel;
