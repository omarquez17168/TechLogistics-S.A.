const express = require('express');
const router = express.Router();
const db = require('../db');
// Crear un nuevo pedido junto con sus detalles
router.post('/', async (req, res) => {
  const { clienteId, fechaPedido, estado, total, detalles } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insertar el pedido
    const [pedidoResult] = await connection.query(
      `INSERT INTO Pedidos (ClienteID, FechaPedido, Estado, Total)
       VALUES (?, ?, ?, ?)`,
      [clienteId, fechaPedido, estado || 'Pendiente', total]
    );

    const pedidoId = pedidoResult.insertId;

    // 2. Insertar los detalles del pedido
    for (const item of detalles) {
      await connection.query(
        `INSERT INTO Detalle_Pedido (PedidoID, ProductoID, Cantidad, PrecioUnitario, Subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [pedidoId, item.productoId, item.cantidad, item.precioUnitario, item.subtotal]
      );
    }

    await connection.commit();
    res.status(201).json({ success: true, pedidoId });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error al crear el pedido:', error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  } finally {
    connection.release();
  }
});

// Obtener todos los pedidos con nombre del cliente
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.PedidoID,
        p.FechaPedido,
        p.Estado,
        p.Total,
        c.ClienteID,
        CONCAT(c.Nombre, ' ', c.Apellido) AS NombreCliente
      FROM Pedidos p
      INNER JOIN Clientes c ON p.ClienteID = c.ClienteID
      ORDER BY p.FechaPedido DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos con cliente' });
  }
});

// Obtener un pedido por ID junto con sus detalles
router.get('/:id', async (req, res) => {
  try {
    const pedidoId = req.params.id;

    // Obtener datos del pedido
    const [pedido] = await db.query(
      `SELECT p.PedidoID, p.ClienteID, p.FechaPedido, p.Estado, p.Total, 
              CONCAT(c.Nombre, ' ', c.Apellido) AS NombreCliente
       FROM Pedidos p
       INNER JOIN Clientes c ON p.ClienteID = c.ClienteID
       WHERE p.PedidoID = ?`,
      [pedidoId]
    );

    if (pedido.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Obtener detalles del pedido
    const [detalles] = await db.query(
      `SELECT dp.DetalleID, dp.ProductoID, p.Nombre AS ProductoNombre, dp.Cantidad, dp.PrecioUnitario, dp.Subtotal
       FROM Detalle_Pedido dp
       INNER JOIN Productos p ON dp.ProductoID = p.ProductoID
       WHERE dp.PedidoID = ?`,
      [pedidoId]
    );

    res.json({ ...pedido[0], detalles });
  } catch (error) {
    console.error('❌ Error al obtener el pedido:', error);
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
});

// Actualizar un pedido junto con sus detalles
router.put('/:id', async (req, res) => {
  const { clienteId, fechaPedido, estado, total, detalles } = req.body;
  const pedidoId = req.params.id;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Actualizar pedido principal
    await connection.query(
      'UPDATE Pedidos SET ClienteID = ?, FechaPedido = ?, Estado = ?, Total = ? WHERE PedidoID = ?',
      [clienteId, fechaPedido, estado, total, pedidoId]
    );

    // 2. Eliminar los detalles antiguos del pedido
    await connection.query('DELETE FROM Detalle_Pedido WHERE PedidoID = ?', [pedidoId]);

    // 3. Insertar nuevos detalles
    for (const item of detalles) {
      await connection.query(
        `INSERT INTO Detalle_Pedido (PedidoID, ProductoID, Cantidad, PrecioUnitario, Subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [pedidoId, item.productoId, item.cantidad, item.precioUnitario, item.subtotal]
      );
    }

    await connection.commit();
    res.json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error al actualizar el pedido:', error);
    res.status(500).json({ error: 'Error al actualizar el pedido' });
  } finally {
    connection.release();
  }
});

// Eliminar un pedido y sus detalles
router.delete('/:id', async (req, res) => {
  try {
    const pedidoId = req.params.id;
    await db.query('DELETE FROM Detalle_Pedido WHERE PedidoID = ?', [pedidoId]);
    await db.query('DELETE FROM Pedidos WHERE PedidoID = ?', [pedidoId]);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error al eliminar el pedido:', error);
    res.status(500).json({ error: 'Error al eliminar el pedido' });
  }
});

router.put('/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    await db.query(`UPDATE pedidos SET Estado = ? WHERE PedidoID = ?`, [estado, id]);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error al actualizar el estado del pedido:', error);
    res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
  }
});

module.exports = router;
