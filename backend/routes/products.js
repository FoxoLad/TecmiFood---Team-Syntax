const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

//Ver todos los productos
router.get("/", async (req, res) => {
  try {
    //Solo se muestran los productos que están en stock, o todos si es el admin
    const { admin } = req.query;
    let query = {};
    if (admin !== "true") {
      query.inStock = true; //Solo los productos disponibles
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Obtener producto por ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Crear un producto (Admin)
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Actualizar un producto (Editar o cambiar inStock)
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }, //Retornar el nuevo documento actualizado
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
