const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los tipos de transporte
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Tipo_Transporte');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tipos de transporte:', error);
    res.status(500).json({ error: 'Error al obtener tipos de transporte' });
  }
});
// routes/tipos-transporte.js
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT TipoTransporteID, Tipo FROM tipo_transporte');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tipos de transporte:', error);
    res.status(500).json({ error: 'Error al obtener tipos de transporte' });
  }
});

// Crear un nuevo tipo de transporte
router.post('/', async (req, res) => {
  const { Tipo } = req.body;
  try {
    const [result] = await db.query('INSERT INTO Tipo_Transporte (Tipo) VALUES (?)', [Tipo]);
    res.status(201).json({ id: result.insertId, Tipo });
  } catch (error) {
    console.error('Error al crear tipo de transporte:', error);
    res.status(500).json({ error: 'Error al crear tipo de transporte' });
  }
});

// Actualizar tipo de transporte
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Tipo } = req.body;
  try {
    await db.query('UPDATE Tipo_Transporte SET Tipo = ? WHERE TipoTransporteID = ?', [Tipo, id]);
    res.json({ message: 'Tipo de transporte actualizado' });
  } catch (error) {
    console.error('Error al actualizar tipo de transporte:', error);
    res.status(500).json({ error: 'Error al actualizar tipo de transporte' });
  }
});

// Eliminar tipo de transporte
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Tipo_Transporte WHERE TipoTransporteID = ?', [id]);
    res.json({ message: 'Tipo de transporte eliminado' });
  } catch (error) {
    console.error('Error al eliminar tipo de transporte:', error);
    res.status(500).json({ error: 'Error al eliminar tipo de transporte' });
  }
});

module.exports = router;
