
import React from "react";
import "./MyBooking.css";

function MyBookings({ booking, onBack, onCancel }) {
  return (
    <div className="my-bookings-page">
      <div className="my-bookings-card">
        <h1>My Bookings</h1>
        <p className="my-bookings-subtitle">
          View and manage your restaurant reservations.
        </p>

        {booking ? (
          <div className="reservation-card">
            <h2>Reservation Details</h2>

            <p><strong>Name:</strong> {booking.name}</p>
            <p><strong>Phone:</strong> {booking.phone}</p>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Time:</strong> {booking.time}</p>
            <p><strong>Guests:</strong> {booking.guests}</p>
            <p><strong>Special Requests:</strong> {booking.requests || "None"}</p>

            <span className="booking-status">Demo Booking</span>

            <button
              className="cancel-booking-button"
              onClick={onCancel}
            >
              Cancel Booking
            </button>
          </div>
        ) : (
          <div className="no-bookings">
            <h2>No Bookings Yet</h2>
            <p>You haven't made any reservations yet.</p>
          </div>
        )}

        <button className="back-home-button" onClick={onBack}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default MyBookings;
