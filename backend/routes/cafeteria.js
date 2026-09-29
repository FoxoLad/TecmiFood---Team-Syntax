const express = require("express");
const Cafeteria = require("../models/Cafeteria");

const router = express.Router();
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

// Lee el horario de una cafetería (busters o beesweet).
// Si todavía no existe en la base, la crea abierta de 08:00 a 17:00.
async function getStatus(key) {
  return Cafeteria.findOneAndUpdate(
    { key },
    {
      $setOnInsert: {
        key,
        isOpen: true,
        opensAt: "08:00",
        closesAt: "17:00",
      },
    },
    { new: true, upsert: true },
  );
}

// Arma la respuesta que ve la app: solo si está abierta y a qué hora abre y cierra.
function publicStatus(status) {
  return {
    isOpen: status.isOpen,
    opensAt: status.opensAt,
    closesAt: status.closesAt,
  };
}

// GET /api/cafeteria — Devuelve el estado de Busters y de Bee Sweet en una sola respuesta.
router.get("/", async (req, res) => {
  try {
    const busters = await getStatus("busters");
    const beesweet = await getStatus("beesweet");
    res.json({
      busters: publicStatus(busters),
      beesweet: publicStatus(beesweet),
    });
  } catch (error) {
    console.error("Error al leer el estado de las cafeterías:", error);
    res
      .status(500)
      .json({ error: "No se pudo leer el estado de las cafeterías" });
  }
});

// PATCH /api/cafeteria/:key — El empleado abre o cierra la cafetería y cambia el horario.
// Solo guarda isOpen si es booleano y las horas si tienen formato HH:MM (00:00 a 23:59).
router.patch("/:key", async (req, res) => {
  try {
    const update = {};

    if (typeof req.body.isOpen === "boolean") {
      update.isOpen = req.body.isOpen;
    }
    if (
      typeof req.body.opensAt === "string" &&
      TIME_PATTERN.test(req.body.opensAt)
    ) {
      update.opensAt = req.body.opensAt;
    }
    if (
      typeof req.body.closesAt === "string" &&
      TIME_PATTERN.test(req.body.closesAt)
    ) {
      update.closesAt = req.body.closesAt;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "No hay cambios válidos" });
    }

    const status = await Cafeteria.findOneAndUpdate(
      { key: req.params.key },
      update,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
    res.json(publicStatus(status));
  } catch (error) {
    console.error("Error al actualizar el estado de la cafetería:", error);
    res.status(500).json({ error: "No se pudo actualizar el estado" });
  }
});

module.exports = router;
