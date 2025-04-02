const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los detalles de pedidos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT dp.DetalleID, dp.PedidoID, dp.ProductoID, p.Nombre AS NombreProducto, 
             dp.Cantidad, dp.PrecioUnitario, dp.Subtotal
      FROM Detalle_Pedido dp
      JOIN Productos p ON dp.ProductoID = p.ProductoID
    `);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener detalles de pedidos:', error);
    res.status(500).json({ error: 'Error al obtener detalles de pedidos' });
  }
});

// Obtener detalles de un pedido específico con nombres de productos
router.get('/pedido/:pedidoId', async (req, res) => {
  const { pedidoId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT dp.DetalleID, dp.PedidoID, dp.ProductoID, p.Nombre AS NombreProducto, 
             dp.Cantidad, dp.PrecioUnitario, dp.Subtotal
      FROM Detalle_Pedido dp
      JOIN Productos p ON dp.ProductoID = p.ProductoID
      WHERE dp.PedidoID = ?
    `, [pedidoId]);

    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener detalles del pedido:', error);
    res.status(500).json({ error: 'Error al obtener detalles del pedido' });
  }
});

// Crear un nuevo detalle de pedido
router.post('/', async (req, res) => {
  const { PedidoID, ProductoID, Cantidad, PrecioUnitario, Subtotal } = req.body;
  try {
    const [result] = await db.query(`
      INSERT INTO Detalle_Pedido (PedidoID, ProductoID, Cantidad, PrecioUnitario, Subtotal) 
      VALUES (?, ?, ?, ?, ?)
    `, [PedidoID, ProductoID, Cantidad, PrecioUnitario, Subtotal]);

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('❌ Error al crear el detalle del pedido:', error);
    res.status(500).json({ error: 'Error al crear el detalle del pedido' });
  }
});

// Actualizar un detalle de pedido
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { PedidoID, ProductoID, Cantidad, PrecioUnitario, Subtotal } = req.body;
  try {
    await db.query(`
      UPDATE Detalle_Pedido 
      SET PedidoID = ?, ProductoID = ?, Cantidad = ?, PrecioUnitario = ?, Subtotal = ? 
      WHERE DetalleID = ?
    `, [PedidoID, ProductoID, Cantidad, PrecioUnitario, Subtotal, id]);

    res.json({ message: '✅ Detalle de pedido actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar el detalle del pedido:', error);
    res.status(500).json({ error: 'Error al actualizar el detalle del pedido' });
  }
});

// Eliminar un detalle de pedido
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Detalle_Pedido WHERE DetalleID = ?', [id]);
    res.json({ message: '🗑️ Detalle de pedido eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar el detalle del pedido:', error);
    res.status(500).json({ error: 'Error al eliminar el detalle del pedido' });
  }
});

module.exports = router;
