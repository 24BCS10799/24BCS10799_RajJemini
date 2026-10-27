const express = require("express");
const mongoose = require("mongoose");
const Registration = require("../models/Registration");

const router = express.Router();

function sendError(res, error) {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "This email is already registered for the event"
    });
  }

  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  if (error.name === "CastError" || error.name === "BSONError") {
    return res.status(400).json({
      success: false,
      message: "Invalid registration ID format"
    });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}

function validObjectId(id) {
  return mongoose.isValidObjectId(id);
}

// POST /api/registrations — create a registration
router.post("/", async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: registration
    });
  } catch (error) {
    return sendError(res, error);
  }
});

// GET /api/registrations — list all, optionally filter by eventType/status
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.eventType) filter.eventType = req.query.eventType;
    if (req.query.status) filter.status = req.query.status;

    const registrations = await Registration.find(filter).sort({ registrationDate: -1 });
    return res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    return sendError(res, error);
  }
});

// GET /api/registrations/:id — retrieve one
router.get("/:id", async (req, res) => {
  if (!validObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration ID format"
    });
  }

  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }

    return res.status(200).json({ success: true, data: registration });
  } catch (error) {
    return sendError(res, error);
  }
});

// PUT /api/registrations/:id — replace/update supplied fields with validation
router.put("/:id", async (req, res) => {
  if (!validObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration ID format"
    });
  }

  try {
    const existing = await Registration.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }

    // Merge the update with existing values so cross-field rules still run.
    const candidate = new Registration({
      ...existing.toObject(),
      ...req.body,
      _id: existing._id,
      registrationDate: req.body.registrationDate ?? existing.registrationDate
    });

    // A PUT update must validate all fields and event-specific business rules.
    await candidate.validate();

    // Save only the supplied mutable fields after successful validation.
    const allowedFields = [
      "studentName",
      "collegeEmail",
      "rollNumber",
      "eventType",
      "teamSize",
      "ticketPrice",
      "discountCode",
      "status",
      "registrationDate"
    ];

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        existing.set(field, candidate.get(field));
      }
    }

    // finalAmount is computed, not accepted from client input.
    existing.finalAmount = candidate.finalAmount;
    await existing.save();

    return res.status(200).json({
      success: true,
      message: "Registration updated successfully",
      data: existing
    });
  } catch (error) {
    return sendError(res, error);
  }
});

// DELETE /api/registrations/:id — delete registration record
router.delete("/:id", async (req, res) => {
  if (!validObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration ID format"
    });
  }

  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registration deleted successfully",
      data: registration
    });
  } catch (error) {
    return sendError(res, error);
  }
});

module.exports = router;
