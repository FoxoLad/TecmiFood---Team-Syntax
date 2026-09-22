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

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: Number, required: true, unique: true },
    customerName: { type: String, default: "Cliente" }, //En el futuro se ligará a un usuario
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pendiente", "Preparando", "Listo", "Entregado", "Cancelado"],
      default: "Pendiente",
    },
  },
  { timestamps: true }, //Agrega createdAt y updatedAt automáticamente
);

module.exports = mongoose.model("Order", OrderSchema);
