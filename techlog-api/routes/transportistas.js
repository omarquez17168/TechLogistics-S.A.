const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los transportistas
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT T.TransportistaID, T.Nombre, T.Telefono, T.Email, TT.Tipo FROM Transportistas as T inner join tipo_transporte as  TT on T.TipoTransporteID = TT.TipoTransporteID');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener transportistas' });
  }
});

// Obtener un transportista por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Transportistas WHERE TransportistaID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Transportista no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el transportista' });
  }
});

// Crear nuevo transportista
router.post('/', async (req, res) => {
  const { Nombre, Telefono, Email, TipoTransporteID } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Transportistas (Nombre, Telefono, Email, TipoTransporteID) VALUES (?, ?, ?, ?)',
      [Nombre, Telefono, Email, TipoTransporteID]
    );
    res.json({ success: true, TransportistaID: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el transportista' });
  }
});

// Actualizar transportista
router.put('/:id', async (req, res) => {
  const { Nombre, Telefono, Email, TipoTransporteID } = req.body;
  try {
    await db.query(
      'UPDATE Transportistas SET Nombre = ?, Telefono = ?, Email = ?, TipoTransporteID = ? WHERE TransportistaID = ?',
      [Nombre, Telefono, Email, TipoTransporteID, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el transportista' });
  }
});

// Eliminar transportista
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Transportistas WHERE TransportistaID = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el transportista' });
  }
});

module.exports = router;
