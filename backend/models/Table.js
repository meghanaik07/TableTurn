
const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: true,
      trim: true
    },
    restaurant: {
      type: String,
      required: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ["Available", "Reserved", "Occupied"],
      default: "Available"
    }
  },
  { timestamps: true }
);

tableSchema.index({ restaurant: 1, tableNumber: 1 }, { unique: true });

module.exports = mongoose.model("Table", tableSchema);
