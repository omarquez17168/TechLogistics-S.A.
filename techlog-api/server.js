const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Para usar variables del .env

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rutas
const clientesRoutes = require('./routes/clientes');
const productosRoutes = require('./routes/productos');
const pedidosRoutes = require('./routes/pedidos');
const transportistasRoutes = require('./routes/transportistas');
const enviosRoutes = require('./routes/envios');
const rutasRoutes = require('./routes/rutas');
const detallePedidoRoutes = require('./routes/detalle_pedido');
const estadosEnvioRoutes = require('./routes/estados_envio');
const tipoTransporteRoutes = require('./routes/tipoTransporte');

app.use('/api/tipos-transporte', tipoTransporteRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/transportistas', transportistasRoutes);
app.use('/api/envios', enviosRoutes);
app.use('/api/rutas', rutasRoutes);
app.use('/api/detalle_pedido', detallePedidoRoutes);
app.use('/api/estados-envio', estadosEnvioRoutes);

// Ruta de prueba de conexión a DB
const db = require('./db');

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ success: true, result: rows[0].result });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    res.status(500).json({ success: false, error: 'Fallo la conexión a la base de datos' });
  }
});

app.get('/', (req, res) => {
  res.send('🚀 API TechLog funcionando correctamente');
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
