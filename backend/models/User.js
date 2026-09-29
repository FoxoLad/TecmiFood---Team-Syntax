const mongoose = require("mongoose");

// Cliente de la app. clientId es único (por ejemplo #000042) y viaja en cada pedido como "Usuario #000042".
const UserSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
