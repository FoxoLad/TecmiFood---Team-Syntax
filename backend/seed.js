require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("./models/Product");

const dataPath = path.join(__dirname, "../data/products.json");
const productsJson = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
//EJECUTAR node seed.js cuando se actualize el products.json de data para subir todo a la vez
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
      `🎉 ¡Éxito! Se han subido y estructurado ${formattedProducts.length} productos a MongoDB.`,
    );
    process.exit();
  } catch (error) {
    console.error("❌ Error al subir los datos:", error);
    process.exit(1);
  }
}

seedDatabase();
