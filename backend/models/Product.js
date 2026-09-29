const mongoose = require("mongoose");

// Producto del menú. id es el identificador de la app (BT-... o BS-...), distinto del _id de Mongo.
// inStock en false significa agotado y el cliente deja de poder pedirlo.
const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    businessId: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    modifications: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],
    image: { type: String, default: "" },
    category: { type: String, required: true },
    subcategory: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
