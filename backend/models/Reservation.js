const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    restaurant: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    guests: {
      type: Number,
      required: true,
      min: 1
    },
    special_requests: {
      type: String,
      default: ""
    },
    tableNumber: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ["Confirmed", "Cancelled", "Seated", "Completed"],
      default: "Confirmed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);