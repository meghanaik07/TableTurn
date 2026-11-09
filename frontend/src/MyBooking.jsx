
import React from "react";
import "./MyBooking.css";

function MyBookings({ bookings = [], onBack, onCancel }) {
  return (
    <div className="my-bookings-page">
      <div className="my-bookings-card">
        <h1>My Bookings</h1>

        <p className="my-bookings-subtitle">
          View and manage your restaurant reservations.
        </p>

        <p className="booking-count">
          Total Reservations: {bookings.length}
        </p>

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <h2>No Bookings Yet</h2>
            <p>You haven't made any reservations yet.</p>
          </div>
        ) : (
          <div className="all-reservations">
            {bookings.map((booking) => (
              <div
                className="reservation-card"
                key={booking.bookingId}
              >
                <h2>Reservation Details</h2>

                <div className="reservation-info">
                  <p>
                    <strong>Booking ID:</strong>{" "}
                    {booking.bookingId}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="booking-status">
                      {booking.status || "Pending"}
                    </span>
                  </p>

                  <p><strong>Name:</strong> {booking.name}</p>
                  <p><strong>Phone:</strong> {booking.phone}</p>
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                  <p><strong>Guests:</strong> {booking.guests}</p>

                  <p>
                    <strong>Special Requests:</strong>{" "}
                    {booking.requests || "None"}
                  </p>
                </div>

                <div className="demo-booking-label">
                  Demo Booking
                </div>

                <p className="booking-disclaimer">
                  This is a demonstration reservation.
                  Final restaurant confirmation will be available
                  after backend integration.
                </p>

                <button
                  className="cancel-booking-button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to cancel this booking?"
                      )
                    ) {
                      onCancel(booking.bookingId);
                    }
                  }}
                >
                  Cancel This Booking
                </button>
              </div>
            ))}
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
