const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String, default: "" },
  modifications: { type: [String], default: [] },
  notes: { type: String, default: "" },
});

//Esquema principal de una orden
const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: Number, required: true, unique: true },
    customerName: { type: String, default: "Cliente" },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "Pendiente",
        "En preparación",
        "Terminado",
        "Entregado",
        "Cancelado",
      ],
      default: "Pendiente",
    },
  },
  { timestamps: true }, //Guardar la fecha de creación y modificación
);

module.exports = mongoose.model("Order", OrderSchema);
