const mongoose = require("mongoose");

const waitlistSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["Waiting", "Notified", "Seated", "Cancelled"],
      default: "Waiting"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Waitlist", waitlistSchema);