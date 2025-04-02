import React, { useEffect, useState } from 'react';
import api from '../api/ApiClient';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CrearEnvio = () => {
  const [pedidos, setPedidos] = useState([]);
  const [transportistas, setTransportistas] = useState([]);
  const [rutas, setRutas] = useState([]);

  // Obtener fecha actual en formato YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [nuevoEnvio, setNuevoEnvio] = useState({
    pedidoId: '',
    transportistaId: '',
    rutaId: '',
    fechaEnvio: getTodayDate()
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const pedidosRes = await api.get('/pedidos');
      const transportistasRes = await api.get('/transportistas');
      const rutasRes = await api.get('/rutas');

      setPedidos(pedidosRes.data);
      setTransportistas(transportistasRes.data);
      setRutas(rutasRes.data);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setNuevoEnvio({ ...nuevoEnvio, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      PedidoID: nuevoEnvio.pedidoId,
      TransportistaID: nuevoEnvio.transportistaId,
      RutaID: nuevoEnvio.rutaId,
      FechaEnvio: nuevoEnvio.fechaEnvio,
      EstadoEnvio: 'Preparando'
    };

    try {
      await api.post('/envios', payload);
      alert('✅ Envío creado correctamente');
      navigate('/envios');
    } catch (error) {
      console.error('❌ Error al crear envío:', error);
      alert('Error al crear el envío');
    }
  };

  return (
    <Container className="mt-4">
      <h3>📦 Crear Nuevo Envío</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Pedido</Form.Label>
          <Form.Select name="pedidoId" value={nuevoEnvio.pedidoId} onChange={handleChange} required>
              <option value="">Seleccionar Pedido</option>{pedidos.filter((p) => p.Estado !== 'Entregado').map((p) => (<option key={p.PedidoID} value={p.PedidoID}>#{p.PedidoID} - {p.NombreCliente} ({p.Estado}) - ${Number(p.Total).toFixed(2)} </option>))  }
          </Form.Select>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Transportista</Form.Label>
          <Form.Select name="transportistaId" value={nuevoEnvio.transportistaId} onChange={handleChange} required>
            <option value="">Seleccionar Transportista</option>
            {transportistas.map((t) => (
              <option key={t.TransportistaID} value={t.TransportistaID}>
                {t.Nombre} ({t.Tipo})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Ruta</Form.Label>
          <Form.Select name="rutaId" value={nuevoEnvio.rutaId} onChange={handleChange} required>
            <option value="">Seleccionar Ruta</option>
            {rutas.map((r) => (
              <option key={r.RutaID} value={r.RutaID}>
                {r.Origen} → {r.Destino}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Fecha del Envío</Form.Label>
          <Form.Control
            type="date"
            name="fechaEnvio"
            value={nuevoEnvio.fechaEnvio}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <br></br>
        <div className="text-center mb-3">
        <Button className="me-2" variant="primary" type="submit">Crear Envío</Button>        
        <Button variant="secondary" onClick={() => navigate('/envios')}>🏠 Volver al Envios</Button>
        </div>        
      </Form>
    </Container>
  );
};

export default CrearEnvio;
