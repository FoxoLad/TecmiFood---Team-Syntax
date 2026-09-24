const fs = require('fs');
let code = fs.readFileSync('backend/routes/orders.js', 'utf8');

const deleteEndpoint = `
// Eliminar un pedido
router.delete("/:orderNumber", async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json({ message: "Pedido eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el pedido" });
  }
});
`;

code = code.replace(/module\.exports = router;/, deleteEndpoint + '\nmodule.exports = router;');

fs.writeFileSync('backend/routes/orders.js', code);
