const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cafeteria = require("../models/Cafeteria");

// Crea un folio de 4 dígitos (entre 1000 y 9999) que no exista en MongoDB.
// Se llama al registrar un pedido nuevo. Si el número ya está usado, intenta otro.
const generateOrderNumber = async () => {
  let isUnique = false;
  let orderNumber;
  while (!isUnique) {
    orderNumber = Math.floor(1000 + Math.random() * 9000);
    const existing = await Order.findOne({ orderNumber });
    if (!existing) isUnique = true;
  }
  return orderNumber;
};

// Manda un aviso al celular del cliente usando el servicio de notificaciones de Expo.
// Solo actúa si el token empieza con ExponentPushToken o ExpoPushToken.
// Se usa cuando el empleado cambia el estado del pedido (en cocina, listo, entregado, cancelado).
const sendPushNotification = async (expoPushToken, title, body, data) => {
  if (
    !expoPushToken ||
    (!expoPushToken.startsWith("ExponentPushToken") &&
      !expoPushToken.startsWith("ExpoPushToken"))
  ) {
    return; // Sin token válido no hay a quién avisar.
  }

  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    data: data,
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    console.log(
      "Notificaci�n enviada a",
      expoPushToken,
      "Status:",
      response.status,
    );
  } catch (error) {
    console.error("Error al enviar notificaci�n push:", error);
  }
};

// POST /api/orders — El cliente confirma el carrito y aquí se guarda el pedido.
// Rechaza la petición si no hay productos o si Busters está cerrada.
// Responde 201 con el pedido ya guardado, incluido su número de orden.
router.post("/", async (req, res) => {
  try {
    const { items, totalAmount, customerName, pushToken } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "El pedido no tiene productos" });
    }

    const cafeteria = await Cafeteria.findOne({ key: "busters" });
    if (cafeteria && cafeteria.isOpen === false) {
      return res.status(403).json({ error: "La cafeter�a est� cerrada" });
    }

    const orderNumber = await generateOrderNumber();

    const newOrder = new Order({
      orderNumber,
      customerName: customerName || "Cliente",
      items,
      totalAmount,
      status: "Pendiente",
      pushToken: pushToken || "",
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/orders — Devuelve todos los pedidos, del más reciente al más antiguo.
// Lo usan la pantalla del cliente y la del empleado para refrescar la lista.
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las órdenes" });
  }
});

// GET /api/orders/metrics/stats — Suma las ventas de los pedidos ya entregados.
// Separa el total de hoy, de esta semana (lunes a domingo), del mes y el histórico.
router.get("/metrics/stats", async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfWeek = new Date(startOfDay);
    const dayOfWeek = startOfDay.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(startOfDay.getDate() - diff);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const deliveredOrders = await Order.find({ status: "Entregado" });

    let todayTotal = 0,
      weekTotal = 0,
      monthTotal = 0,
      allTimeTotal = 0;

    deliveredOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const amount = order.totalAmount;
      allTimeTotal += amount;
      if (orderDate >= startOfMonth) monthTotal += amount;
      if (orderDate >= startOfWeek) weekTotal += amount;
      if (orderDate >= startOfDay) todayTotal += amount;
    });

    res.json({
      today: todayTotal,
      week: weekTotal,
      month: monthTotal,
      allTime: allTimeTotal,
      totalOrders: deliveredOrders.length,
    });
  } catch (error) {
    console.error("Error obteniendo stats:", error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

// GET /api/orders/:id — Busca un solo pedido por su número de orden (no por el id de Mongo).
// Responde 404 si ese folio no existe.
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.id });
    if (!order) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la orden" });
  }
});

// PATCH /api/orders/:id/status — El empleado (o el cliente al cancelar) cambia el estado.
// Solo acepta: Pendiente, En preparación, Terminado, Entregado o Cancelado.
// Si el pedido tiene token push, avisa al celular del cliente con un texto según el estado.
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "Pendiente",
      "En preparación",
      "Terminado",
      "Entregado",
      "Cancelado",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Estado no válido" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber: req.params.id },
      { status },
      { new: true },
    );

    if (!updatedOrder)
      return res.status(404).json({ error: "Orden no encontrada" });

    // Avisa al cliente en su celular si guardamos su token al crear el pedido.
    if (updatedOrder.pushToken) {
      let title = "Actualización de Pedido";
      let body = `El estado de tu pedido #${updatedOrder.orderNumber} cambió a: ${status}`;

      if (status === "En preparación") {
        title = "¡Tu pedido está en cocina! ?????";
        body = `Tu pedido #${updatedOrder.orderNumber} esta en preparación.`;
      } else if (status === "Terminado") {
        title = "¡Pedido listo! ??";
        body = `Tu pedido #${updatedOrder.orderNumber} ya está listo, puedes recogerlo y pagar en el mostrador.`;
      } else if (status === "Entregado") {
        title = "¡Pedido entregado! ??";
        body = `Tu pedido ha sido entregado, esperamos que disfrutes tu comida.`;
      } else if (status === "Cancelado") {
        title = "Pedido Cancelado ?";
        body = `Tu pedido #${updatedOrder.orderNumber} ha sido cancelado.`;
      }

      await sendPushNotification(updatedOrder.pushToken, title, body, {
        orderNumber: updatedOrder.orderNumber,
        status,
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
    res.status(500).json({ error: "Error al actualizar el estado" });
  }
});

// DELETE /api/orders/:orderNumber — Borra un pedido de la base de datos.
// Lo usa el empleado para quitar un pedido de la lista. Responde 404 si no existe.
router.delete("/:orderNumber", async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      orderNumber: req.params.orderNumber,
    });
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json({ message: "Pedido eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el pedido" });
  }
});

module.exports = router;
