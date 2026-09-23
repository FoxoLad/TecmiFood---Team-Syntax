const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

//Generar un número de orden único de 4 dígitos
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

//1.- Crear nuevo pedido (POST /api/orders)
router.post("/", async (req, res) => {
  try {
    const { items, totalAmount, customerName } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "El pedido no tiene productos" });
    }

    const orderNumber = await generateOrderNumber();

    const newOrder = new Order({
      orderNumber,
      customerName: customerName || "Cliente",
      items,
      totalAmount,
      status: "Pendiente",
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
    //Retornar las órdenes por fecha de creación (más recientes primero)
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las órdenes" });
  }
});

//3.- Obtener una orden específica (GET /api/orders/:id)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.id });
    if (!order) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la orden" });
  }
});

//4.- Actualizar estado de un pedido (PATCH /api/orders/:id/status)
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

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el estado" });
  }
});

//5.- Obtener estadísticas de ventas (GET /api/orders/stats)
router.get("/metrics/stats", async (req, res) => {
  try {
    //Calcular ventas del día, semana y mes, y también totales
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

    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;
    let allTimeTotal = 0;

    deliveredOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const amount = order.totalAmount;

      allTimeTotal += amount;

      if (orderDate >= startOfMonth) {
        monthTotal += amount;
      }

      if (orderDate >= startOfWeek) {
        weekTotal += amount;
      }

      if (orderDate >= startOfDay) {
        todayTotal += amount;
      }
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

module.exports = router;
