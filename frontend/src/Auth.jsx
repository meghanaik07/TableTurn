
import React, { useState } from "react";
import "./Auth.css";

function Auth({ onBack }) {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      isLogin
        ? "Login page demo completed!"
        : "Registration page demo completed!"
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>TableTurn<span>.</span></h1>
        <p className="auth-subtitle">
          Your table is waiting for you.
        </p>

        <div className="auth-tabs">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p>
          {isLogin
            ? "Login to continue your dining experience."
            : "Join TableTurn and reserve your favourite table."}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label>Full Name</label>
              <input
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label>Phone Number</label>
              <input
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </>
          )}

          <label>Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-submit">
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <button className="back-button" onClick={onBack}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Auth;
