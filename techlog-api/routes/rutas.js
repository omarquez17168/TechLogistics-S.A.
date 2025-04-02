const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las rutas
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Rutas');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las rutas' });
  }
});

// Crear una nueva ruta
router.post('/', async (req, res) => {
  const { Origen, Destino, Distancia } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO Rutas (Origen, Destino, Distancia) VALUES (?, ?, ?)`,
      [Origen, Destino, Distancia]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la ruta' });
  }
});

// Actualizar una ruta
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Origen, Destino, Distancia } = req.body;
  try {
    await db.query(
      `UPDATE Rutas SET Origen = ?, Destino = ?, Distancia = ? WHERE RutaID = ?`,
      [Origen, Destino, Distancia, id]
    );
    res.json({ message: 'Ruta actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la ruta' });
  }
});

// Eliminar una ruta
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Rutas WHERE RutaID = ?', [id]);
    res.json({ message: 'Ruta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la ruta' });
  }
});

module.exports = router;
