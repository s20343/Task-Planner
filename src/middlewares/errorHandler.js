const Joi = require("joi");
const mongoose = require("mongoose");

module.exports = (err, req, res, next) => {
  console.error(err);

  /* ---------------- JOI VALIDATION ERRORS ---------------- */
  if (err instanceof Joi.ValidationError) {
    return res.status(400).json({
      type: "validation",
      errors: err.details.map(d => d.message)
    });
  }

  /* ---------------- MONGOOSE INVALID ID ---------------- */
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      type: "database",
      error: "Invalid ID format"
    });
  }

  /* ---------------- MONGOOSE DUPLICATE KEY ---------------- */
  if (err.code === 11000) {
    return res.status(409).json({
      type: "database",
      error: "Duplicate value detected"
    });
  }

  /* ---------------- CUSTOM APP ERRORS ---------------- */
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      type: "application",
      error: err.message
    });
  }

  /* ---------------- FALLBACK ---------------- */
  res.status(500).json({
    type: "server",
    error: "Internal server error"
  });
};
