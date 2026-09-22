const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/init", async (req, res) => {
  try {
    let success = false;
    let attempts = 0;
    let newUser;

    //Bucle para evitar colisiones si dos personas abren la app al mismo tiempo exacto
    while (!success && attempts < 5) {
      const userCount = await User.countDocuments();
      //Sumar los intentos en caso de colisión
      const nextId = String(userCount + attempts).padStart(6, "0");
      const clientId = "#" + nextId;

      try {
        newUser = new User({ clientId });
        await newUser.save();
        success = true;
      } catch (err) {
        if (err.code === 11000) {
          attempts++;
        } else {
          throw err;
        }
      }
    }

    if (!success) {
      return res.status(500).json({ error: "No se pudo generar un ID único" });
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error al inicializar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
