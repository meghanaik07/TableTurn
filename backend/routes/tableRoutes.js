
const express = require("express");
const router = express.Router();
const Table = require("../models/Table");

router.post("/", async (req, res) => {
  try {
    const { tableNumber, capacity, status } = req.body;

    const table = await Table.create({
      tableNumber,
      capacity,
      status
    });

    res.status(201).json(table);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({ error: "Table not found" });
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
      return res.status(404).json({ error: "Table not found" });
    }

    res.json({ message: "Table deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
