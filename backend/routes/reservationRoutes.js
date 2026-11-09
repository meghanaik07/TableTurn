
const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const Waitlist = require("../models/Waitlist");
const Table = require("../models/Table");

const RESERVATION_DURATION = 60;

function hasTimeOverlap(existingTime, requestedTime) {
  const existingStart =
    Number(existingTime.split(":")[0]) * 60 +
    Number(existingTime.split(":")[1]);

  const requestedStart =
    Number(requestedTime.split(":")[0]) * 60 +
    Number(requestedTime.split(":")[1]);

  const existingEnd = existingStart + RESERVATION_DURATION;
  const requestedEnd = requestedStart + RESERVATION_DURATION;

  return existingStart < requestedEnd && existingEnd > requestedStart;
}

async function updateTableStatus(restaurant, tableNumber) {
  if (!tableNumber) {
    return;
  }

  const table = await Table.findOne({
    restaurant,
    tableNumber
  });

  if (!table) {
    return;
  }

  const activeReservations = await Reservation.find({
    restaurant,
    tableNumber,
    status: { $in: ["Confirmed", "Seated"] }
  });

  let newStatus = "Available";

  if (activeReservations.some((reservation) => reservation.status === "Seated")) {
    newStatus = "Occupied";
  } else if (activeReservations.length > 0) {
    newStatus = "Reserved";
  }

  table.status = newStatus;
  await table.save();
}

async function promoteWaitlistCustomer(cancelledReservation) {
  if (!cancelledReservation.tableNumber) {
    return null;
  }

  const table = await Table.findOne({
    restaurant: cancelledReservation.restaurant,
    tableNumber: cancelledReservation.tableNumber
  });

  if (!table) {
    return null;
  }

  const waitingCustomers = await Waitlist.find({
    restaurant: cancelledReservation.restaurant,
    date: cancelledReservation.date,
    status: "Waiting",
    guests: { $lte: table.capacity }
  }).sort({ createdAt: 1 });

  for (const customer of waitingCustomers) {
    const existingReservations = await Reservation.find({
      restaurant: cancelledReservation.restaurant,
      date: customer.date,
      tableNumber: table.tableNumber,
      status: { $nin: ["Cancelled", "Completed"] }
    });

    const isBooked = existingReservations.some((reservation) =>
      hasTimeOverlap(reservation.time, customer.time)
    );

    if (!isBooked) {
      const promotedReservation = await Reservation.create({
        name: customer.name,
        phone: customer.phone,
        restaurant: customer.restaurant,
        date: customer.date,
        time: customer.time,
        guests: customer.guests,
        special_requests: customer.special_requests,
        tableNumber: table.tableNumber,
        status: "Confirmed"
      });

      customer.status = "Notified";
      await customer.save();

      await updateTableStatus(
        cancelledReservation.restaurant,
        table.tableNumber
      );

      return {
        reservation: promotedReservation,
        waitlist: customer
      };
    }
  }

  return null;
}

router.get("/waitlist", async (req, res) => {
  try {
    const filter = {};

    if (req.query.restaurant) {
      filter.restaurant = req.query.restaurant;
    }

    if (req.query.date) {
      filter.date = req.query.date;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const waitlist = await Waitlist.find(filter).sort({
      createdAt: 1
    });

    res.json(waitlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.restaurant) {
      filter.restaurant = req.query.restaurant;
    }

    if (req.query.date) {
      filter.date = req.query.date;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const reservations = await Reservation.find(filter).sort({
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
      requests,
      special_requests
    } = req.body;

    if (!name || !phone || !restaurant || !date || !time || !guests) {
      return res.status(400).json({
        error: "Please provide all required booking details."
      });
    }

    const tables = await Table.find({
      restaurant,
      capacity: { $gte: Number(guests) }
    }).sort({ capacity: 1 });

    const existingReservations = await Reservation.find({
      date,
      restaurant,
      status: { $nin: ["Cancelled", "Completed"] }
    });

    const bookedTables = existingReservations
      .filter((reservation) =>
        hasTimeOverlap(reservation.time, time)
      )
      .map((reservation) => reservation.tableNumber);

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
        special_requests: special_requests || requests || "",
        tableNumber: availableTable.tableNumber,
        status: "Confirmed"
      });

      await updateTableStatus(restaurant, availableTable.tableNumber);

      return res.status(201).json({
        outcome: "confirmed",
        reservation
      });
    }

    const waitlistEntry = await Waitlist.create({
      name,
      phone,
      restaurant,
      date,
      time,
      guests: Number(guests),
      special_requests: special_requests || requests || ""
    });

    res.status(201).json({
      outcome: "waitlist",
      waitlist: waitlistEntry
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Confirmed",
      "Seated",
      "Completed",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid reservation status."
      });
    }

    const existingReservation = await Reservation.findById(req.params.id);

    if (!existingReservation) {
      return res.status(404).json({
        error: "Reservation not found."
      });
    }

    const wasCancelled = existingReservation.status === "Cancelled";

    existingReservation.status = status;
    await existingReservation.save();

    let promoted = null;

    if (status === "Cancelled" && !wasCancelled) {
      promoted = await promoteWaitlistCustomer(existingReservation);
    }

    await updateTableStatus(
      existingReservation.restaurant,
      existingReservation.tableNumber
    );

    res.json({
      reservation: existingReservation,
      promoted
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/waitlist/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Waiting",
      "Notified",
      "Seated",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid waitlist status."
      });
    }

    const waitlistEntry = await Waitlist.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after", runValidators: true }
    );

    if (!waitlistEntry) {
      return res.status(404).json({
        error: "Waitlist entry not found."
      });
    }

    res.json(waitlistEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/waitlist/:id/cancel", async (req, res) => {
  try {
    const waitlistEntry = await Waitlist.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { returnDocument: "after" }
    );

    if (!waitlistEntry) {
      return res.status(404).json({
        error: "Waitlist entry not found."
      });
    }

    res.json(waitlistEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id/cancel", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        error: "Reservation not found."
      });
    }

    if (reservation.status === "Cancelled") {
      return res.json({
        reservation,
        promoted: null
      });
    }

    reservation.status = "Cancelled";
    await reservation.save();

    const promoted = await promoteWaitlistCustomer(reservation);

    await updateTableStatus(
      reservation.restaurant,
      reservation.tableNumber
    );

    res.json({
      reservation,
      promoted
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
