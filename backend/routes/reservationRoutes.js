const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const Waitlist = require("../models/Waitlist");
const Table = require("../models/Table");

router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({
      createdAt: -1
    });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      restaurant,
      date,
      time,
      guests,
      requests
    } = req.body;

    if (!name || !phone || !restaurant || !date || !time || !guests) {
      return res.status(400).json({
        error: "Please provide all required booking details."
      });
    }

    const tables = await Table.find({
      capacity: { $gte: Number(guests) }
    }).sort({ capacity: 1 });

    const existingReservations = await Reservation.find({
      date,
      restaurant,
      status: { $nin: ["Cancelled", "Completed"] }
    });

    const bookedTables = existingReservations.map(
      (reservation) => reservation.tableNumber
    );

    const availableTable = tables.find(
      (table) => !bookedTables.includes(table.tableNumber)
    );

    if (availableTable) {
      const reservation = await Reservation.create({
        name,
        phone,
        restaurant,
        date,
        time,
        guests: Number(guests),
        special_requests: requests || "",
        tableNumber: availableTable.tableNumber,
        status: "Confirmed"
      });

      return res.status(201).json({
        outcome: "confirmed",
        reservation
      });
    }

    const waitlistEntry = await Waitlist.create({
      name,
      phone,
      date,
      time,
      guests: Number(guests),
      special_requests: requests || ""
    });

    res.status(201).json({
      outcome: "waitlist",
      waitlist: waitlistEntry
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id/cancel", async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({
        error: "Reservation not found."
      });
    }

    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;