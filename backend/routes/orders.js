const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cafeteria = require("../models/Cafeteria");

//Generar un n�mero de orden �nico de 4 d�gitos
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

//Enviar notificaci�n Push
const sendPushNotification = async (expoPushToken, title, body, data) => {
  if (
    !expoPushToken ||
    (!expoPushToken.startsWith("ExponentPushToken") &&
      !expoPushToken.startsWith("ExpoPushToken"))
  ) {
    return; //Token inv�lido o nulo
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

//1.- Crear nuevo pedido (POST /api/orders)
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

//2.- Obtener todos los pedidos (GET /api/orders)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las órdenes" });
  }
});

//3.- Estadísticas
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

//4.- Obtener una orden específica (GET /api/orders/:id)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.id });
    if (!order) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la orden" });
  }
});

//5.- Actualizar estado de un pedido (PATCH /api/orders/:id/status)
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

    //Enviar notificaci�n Push si hay token
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

// Eliminar un pedido
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
