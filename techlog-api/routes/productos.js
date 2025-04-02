// routes/productos.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Productos');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// POST: Agregar un nuevo producto
router.post('/', async (req, res) => {
  const { Nombre, Descripcion, Precio } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Productos (Nombre, Descripcion, Precio) VALUES (?, ?, ?)',
      [Nombre, Descripcion, Precio]
    );
    res.status(201).json({ id: result.insertId, Nombre, Descripcion, Precio });
  } catch (error) {
    console.error('Error al crear producto:', error.message);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT: Actualizar un producto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Nombre, Descripcion, Precio } = req.body;
  try {
    await db.query(
      'UPDATE Productos SET Nombre = ?, Descripcion = ?, Precio = ? WHERE ProductoID = ?',
      [Nombre, Descripcion, Precio, id]
    );
    res.json({ id, Nombre, Descripcion, Precio });
  } catch (error) {
    console.error('Error al actualizar producto:', error.message);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE: Eliminar un producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Productos WHERE ProductoID = ?', [id]);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
