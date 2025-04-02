// routes/clientes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos los clientes
router.get('/', async (req, res) => {
  try {
    const [clientes] = await db.query('SELECT * FROM Clientes');
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// POST nuevo cliente
router.post('/', async (req, res) => {
  const { Nombre, Apellido, Direccion, Telefono, Email } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO Clientes (Nombre, Apellido, Direccion, Telefono, Email) VALUES (?, ?, ?, ?, ?)',
      [Nombre, Apellido, Direccion, Telefono, Email]
    );
    res.status(201).json({ message: 'Cliente creado', id: result[0].insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// PUT actualizar cliente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Nombre, Apellido, Direccion, Telefono, Email } = req.body;

  try {
    await db.query(
      'UPDATE Clientes SET Nombre = ?, Apellido = ?, Direccion = ?, Telefono = ?, Email = ? WHERE ClienteID = ?',
      [Nombre, Apellido, Direccion, Telefono, Email, id]
    );
    res.json({ message: 'Cliente actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

// DELETE eliminar cliente
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM Clientes WHERE ClienteID = ?', [id]);
    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

module.exports = router;
