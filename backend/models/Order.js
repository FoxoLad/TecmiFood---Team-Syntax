const mongoose = require("mongoose");

// Cada renglón del pedido: qué producto, cuántos, a qué precio y con qué notas.
const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String, default: "" },
  modifications: { type: [String], default: [] },
  notes: { type: String, default: "" },
});

// Pedido completo. orderNumber es el folio que ve el cliente.
// timestamps guarda createdAt y updatedAt de forma automática.
const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: Number, required: true, unique: true },
    customerName: { type: String, default: "Cliente" },
    pushToken: { type: String, default: "" },
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

