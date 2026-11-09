
import { useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    requests: "",
  });

  const [booking, setBooking] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setBooking({ ...form });

    console.log("Reservation:", form);
  };

  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">
        <a href="#home" className="logo">
          Table<span>Turn.</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#gallery">Gallery</a>
          <a href="#booking" className="nav-button">
            Book a Table
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <p className="hero-label">
          AN EXPERIENCE WORTH SAVOURING
        </p>

        <h1>
          Where Every Meal
          <br />
          Becomes a Memory
        </h1>

        <p className="hero-description">
          Discover exceptional dining, beautiful moments
          and unforgettable flavours.
        </p>

        <a href="#booking" className="hero-button">
          Reserve Your Table
        </a>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900"
            alt="Elegant restaurant dining"
          />
        </div>

        <div className="about-content">
          <p className="section-label">WELCOME TO TABLETURN</p>

          <h2>
            Dining is more than food.
            It's an experience.
          </h2>

          <p>
            At TableTurn, we believe every great moment
            deserves a beautiful table. Enjoy a welcoming
            atmosphere, memorable dining and effortless
            reservations.
          </p>

          <a href="#booking" className="text-link">
            Experience TableTurn →
          </a>
        </div>
      </section>

      {/* Reservation Section */}
      <section className="booking-section" id="booking">
        <div className="section-heading">
          <p className="section-label">YOUR TABLE AWAITS</p>
          <h2>Reserve Your Experience</h2>
          <p>
            Complete your details and book your perfect table.
          </p>
        </div>

        <div className="booking-card">
          {booking ? (
            <div className="confirmation">
              <div className="confirmation-icon">✓</div>

              <h2>Thank You, {booking.name}!</h2>

              <p>
                Your reservation details have been received.
              </p>

              <div className="booking-details">
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Guests:</strong> {booking.guests}</p>
                <p><strong>Phone:</strong> {booking.phone}</p>
              </div>

              <p className="demo-note">
                Demo confirmation — your booking is not yet
                stored in a database.
              </p>

              <button onClick={() => setBooking(null)}>
                Make Another Reservation
              </button>
            </div>
          ) : (
            <>
              <h3>Booking Details</h3>
              <p className="subtitle">
                Fill in the details below to reserve your table.
              </p>

              <form onSubmit={handleSubmit}>
                <label>Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

                <label>Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                />

                <div className="form-row">
                  <div>
                    <label>Reservation Date</label>
                    <input
                      type="date"
                      name="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={form.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label>Reservation Time</label>
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <label>Number of Guests</label>
                <select
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>

                <label>Special Requests</label>
                <textarea
                  name="requests"
                  value={form.requests}
                  onChange={handleChange}
                  placeholder="Any special requirements?"
                />

                <button type="submit">
                  Confirm Reservation →
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section">
        <p className="section-label">THE TABLETURN EXPERIENCE</p>
        <h2>Why Choose TableTurn?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <span>✦</span>
            <h3>Easy Reservations</h3>
            <p>Book your table in just a few simple steps.</p>
          </div>

          <div className="feature-card">
            <span>♛</span>
            <h3>Elegant Dining</h3>
            <p>Enjoy a welcoming and memorable atmosphere.</p>
          </div>

          <div className="feature-card">
            <span>♡</span>
            <h3>Special Moments</h3>
            <p>Make every celebration and gathering special.</p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery-section" id="gallery">
        <p className="section-label">A GLIMPSE OF OUR EXPERIENCE</p>
        <h2>Moments Around the Table</h2>

        <div className="gallery-grid">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700"
            alt="Restaurant interior"
          />

          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?w=700"
            alt="Beautifully presented food"
          />

          <img
            src="https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?w=700"
            alt="Restaurant dining experience"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <h2>TableTurn.</h2>
        <p>Every table tells a story.</p>
        <p>© 2026 TableTurn. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default App;
