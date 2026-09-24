require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("./models/Product");

//Este archivo solo es para subir todo lo del json a la base de datos de golpe sin estar escribiendo
//uno por uno en caso de que se eliminen por alguna razon en la base de datos MongoDB.

//Correr node seed.js para subir todo a la base de datos desde el products.json en la terminal desde la carpeta backend
//cd backend
//node seed.js

const dataPath = path.join(__dirname, "../src/data/products.json");
const productsJson = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

async function seedDatabase() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado exitosamente a MongoDB");

    console.log("Limpiando productos anteriores...");
    await Product.deleteMany({});

    console.log("Subiendo productos nuevos...");

    const formattedProducts = productsJson.map((prod) => ({
      id: prod.id,
      businessId: prod.businessId,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      modifications: prod.modifications || [],
      image: prod.image || "",
      category: prod.category,
      subcategory: prod.subcategory || "",
      inStock: prod.status === "active",
    }));

    await Product.insertMany(formattedProducts);

    console.log(
      `Se han subido y estructurado ${formattedProducts.length} productos a MongoDB.`,
    );
    process.exit();
  } catch (error) {
    console.error("Error al subir los datos:", error);
    process.exit(1);
  }
}

seedDatabase();
