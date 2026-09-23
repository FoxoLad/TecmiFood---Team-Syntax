const express = require("express");
const Cafeteria = require("../models/Cafeteria");

const router = express.Router();
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

async function getStatus() {
  return Cafeteria.findOneAndUpdate(
    { key: "busters" },
    {
      $setOnInsert: {
        key: "busters",
        isOpen: true,
        opensAt: "08:00",
        closesAt: "17:00",
      },
    },
    { new: true, upsert: true },
  );
}

function publicStatus(status) {
  return {
    isOpen: status.isOpen,
    opensAt: status.opensAt,
    closesAt: status.closesAt,
  };
}

router.get("/", async (req, res) => {
  try {
    const status = await getStatus();
    res.json(publicStatus(status));
  } catch (error) {
    console.error("Error al leer el estado de la cafetería:", error);
    res.status(500).json({ error: "No se pudo leer el estado de la cafetería" });
  }
});

router.patch("/", async (req, res) => {
  try {
    const update = {};

    if (typeof req.body.isOpen === "boolean") {
      update.isOpen = req.body.isOpen;
    }
    if (typeof req.body.opensAt === "string" && TIME_PATTERN.test(req.body.opensAt)) {
      update.opensAt = req.body.opensAt;
    }
    if (typeof req.body.closesAt === "string" && TIME_PATTERN.test(req.body.closesAt)) {
      update.closesAt = req.body.closesAt;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "No hay cambios válidos" });
    }

    const status = await Cafeteria.findOneAndUpdate({ key: "busters" }, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    res.json(publicStatus(status));
  } catch (error) {
    console.error("Error al actualizar el estado de la cafetería:", error);
    res.status(500).json({ error: "No se pudo actualizar el estado" });
  }
});

module.exports = router;
