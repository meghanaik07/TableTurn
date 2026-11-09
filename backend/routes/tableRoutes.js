
const express = require("express");
const router = express.Router();
const Table = require("../models/Table");

const allowedStatuses = [
  "Available",
  "Reserved",
  "Occupied"
];

router.post("/", async (req, res) => {
  try {
    const { tableNumber, restaurant, capacity, status } = req.body;

    if (!tableNumber || !restaurant || !capacity) {
      return res.status(400).json({
        error: "Please provide table number, restaurant and capacity."
      });
    }

    const table = await Table.create({
      tableNumber,
      restaurant,
      capacity,
      status: status || "Available"
    });

    res.status(201).json(table);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.restaurant) {
      filter.restaurant = req.query.restaurant;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const tables = await Table.find(filter).sort({
      tableNumber: 1
    });

    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid table status."
      });
    }

    const table = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!table) {
      return res.status(404).json({
        error: "Table not found."
      });
    }

    res.json(table);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);

    if (!table) {
      return res.status(404).json({
        error: "Table not found."
      });
    }

    res.json({
      message: "Table deleted successfully."
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
