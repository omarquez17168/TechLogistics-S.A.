const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los envíos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.EnvioID,
        e.PedidoID,
        e.FechaEnvio,
        e.FechaActualizacionEstado,
        e.EstadoEnvio,
        t.Nombre AS NombreTransportista,
        tt.Tipo AS TipoTransporte,
        r.Origen,
        r.Destino
      FROM envios e
      LEFT JOIN transportistas t ON e.TransportistaID = t.TransportistaID
      LEFT JOIN tipo_transporte tt ON t.TipoTransporteID = tt.TipoTransporteID
      LEFT JOIN rutas r ON e.RutaID = r.RutaID
      ORDER BY e.FechaEnvio DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener envíos:', error);
    res.status(500).json({ error: 'Error al obtener envíos' });
  }
});


// Crear un nuevo envío
router.post('/', async (req, res) => {
  const { PedidoID, TransportistaID, RutaID, FechaEnvio } = req.body;

  try {
    const estadoEnvio = 'Enviado'; // Usamos el valor correcto

    // Insertar en tabla envios
    const [result] = await db.query(
      `INSERT INTO Envios (PedidoID, TransportistaID, RutaID, FechaEnvio, EstadoEnvio)
       VALUES (?, ?, ?, ?, ?)`,
      [PedidoID, TransportistaID, RutaID, FechaEnvio, estadoEnvio]
    );

    // Actualizar el estado del pedido a 'Enviado'
    await db.query(
      `UPDATE pedidos SET Estado = ? WHERE PedidoID = ?`,
      [estadoEnvio, PedidoID]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error al crear el envío:', error);
    res.status(500).json({ error: 'Error al crear el envío' });
  }
});



// Actualizar un envío (solo actualizar campos proporcionados)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { PedidoID, TransportistaID, RutaID, FechaEnvio,FechaActualizacionEstado, EstadoEnvio } = req.body;

  try {
    // Obtener los datos actuales del envío
    const [rows] = await db.query(`SELECT * FROM Envios WHERE EnvioID = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Envío no encontrado' });
    }

    const envioActual = rows[0];

    // Usar los valores del body si existen, si no, dejar los actuales
    const nuevoPedidoID = PedidoID ?? envioActual.PedidoID;
    const nuevoTransportistaID = TransportistaID ?? envioActual.TransportistaID;
    const nuevoRutaID = RutaID ?? envioActual.RutaID;
    const nuevaFechaEnvio = FechaEnvio ?? envioActual.FechaEnvio;
    const nuevaFechaActualizacionEstado = FechaActualizacionEstado ?? envioActual.FechaActualizacionEstado;
    const nuevoEstadoEnvio = EstadoEnvio ?? envioActual.EstadoEnvio;

    // Actualizar el envío con todos los campos completos
    await db.query(
      `UPDATE Envios
       SET PedidoID = ?, TransportistaID = ?, RutaID = ?, FechaEnvio = ?, FechaActualizacionEstado = NOW(), EstadoEnvio = ?
       WHERE EnvioID = ?`,
      [nuevoPedidoID, nuevoTransportistaID, nuevoRutaID, nuevaFechaEnvio, nuevoEstadoEnvio, id]
    );
    

    // También actualizamos el estado en la tabla pedidos
    if (EstadoEnvio) {
      await db.query(`UPDATE pedidos SET Estado = ? WHERE PedidoID = ?`, [EstadoEnvio, nuevoPedidoID]);
    }

    res.json({ message: '✅ Envío actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar el envío:', error);
    res.status(500).json({ error: 'Error al actualizar el envío' });
  }
});

// Eliminar un envío
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Envios WHERE EnvioID = ?', [id]);
    res.json({ message: 'Envío eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el envío' });
  }
});

module.exports = router;
