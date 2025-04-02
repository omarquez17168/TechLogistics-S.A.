const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los estados de envío
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Estados_Envio');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estados de envío' });
  }
});

// Crear un nuevo estado de envío
router.post('/', async (req, res) => {
  const { Descripción } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Estados_Envio (Descripción) VALUES (?)',
      [Descripción]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear estado de envío' });
  }
});

// Actualizar un estado de envío
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Descripción } = req.body;
  try {
    await db.query(
      'UPDATE Estados_Envio SET Descripción = ? WHERE EstadoID = ?',
      [Descripción, id]
    );
    res.json({ message: 'Estado de envío actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado de envío' });
  }
});

// Eliminar un estado de envío
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Estados_Envio WHERE EstadoID = ?', [id]);
    res.json({ message: 'Estado de envío eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar estado de envío' });
  }
});

module.exports = router;
