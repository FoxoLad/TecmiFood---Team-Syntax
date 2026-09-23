require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json()); //Allows parsing JSON bodies

//Rutas
app.use("/api/productos", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

//Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

//Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error conectando a MongoDB:", error.message);
  });
