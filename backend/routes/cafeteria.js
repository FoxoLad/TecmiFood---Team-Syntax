const express = require("express");
const Cafeteria = require("../models/Cafeteria");

const router = express.Router();
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

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

function publicStatus(status) {
  return {
    isOpen: status.isOpen,
    opensAt: status.opensAt,
    closesAt: status.closesAt,
  };
}

// Endpoint to get ALL statuses or a specific one
router.get("/", async (req, res) => {
  try {
    const busters = await getStatus("busters");
    const beesweet = await getStatus("beesweet");
    res.json({
      busters: publicStatus(busters),
      beesweet: publicStatus(beesweet)
    });
  } catch (error) {
    console.error("Error al leer el estado de las cafeterías:", error);
    res.status(500).json({ error: "No se pudo leer el estado de las cafeterías" });
  }
});

router.patch("/:key", async (req, res) => {
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

    const status = await Cafeteria.findOneAndUpdate({ key: req.params.key }, update, {
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
