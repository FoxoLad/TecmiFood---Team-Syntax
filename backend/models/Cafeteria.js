const mongoose = require("mongoose");

// Estado de una cafetería. key vale "busters" o "beesweet".
// isOpen la abre o cierra; opensAt y closesAt guardan el horario en texto "HH:MM".
const CafeteriaSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "busters" },
    isOpen: { type: Boolean, default: true },
    opensAt: { type: String, default: "08:00" },
    closesAt: { type: String, default: "17:00" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cafeteria", CafeteriaSchema);
