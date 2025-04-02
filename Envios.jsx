import React, { useEffect, useState } from 'react';
import api from '../api/ApiClient';
import { Table, Container, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const estados = ['Preparando', 'Enviado', 'Entregado', 'Retrasado'];

const getEstadoIcon = (estado) => {
  switch (estado) {
    case 'Pendiente': return '🔧';
    case 'Enviado': return '🚚';
    case 'Entregado': return '✅';
    case 'Retrasado': return '⚠️';
    default: return '';
  }
};

const Envios = () => {
  const [envios, setEnvios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnvios();
  }, []);

  const fetchEnvios = async () => {
    try {
      const res = await api.get('/envios');
      setEnvios(res.data);
    } catch (error) {
      console.error('Error al obtener envíos', error);
    }
  };

  const handleEstadoChange = async (envio, nuevoEstado) => {
    try {
      const updatedEnvio = {
        PedidoID: envio.PedidoID,
        TransportistaID: envio.TransportistaID,
        RutaID: envio.RutaID,
        FechaEnvio: new Date(envio.FechaEnvio).toISOString().slice(0, 19).replace('T', ' '),
        FechaActualizacionEstado: new Date(envio.FechaActualizacionEstado).toISOString().slice(0, 19).replace('T', ' '),
        EstadoEnvio: nuevoEstado
      };
  
      // Actualiza el envío
      await api.put(`/envios/${envio.EnvioID}`, updatedEnvio);
  
      // Actualiza la tabla pedidos
      await api.put(`/pedidos/${envio.PedidoID}/estado`, { estado: nuevoEstado });
  
      // Actualiza localmente
      setEnvios((prev) =>
        prev.map((e) =>
          e.EnvioID === envio.EnvioID ? { ...e, EstadoEnvio: nuevoEstado } : e
        )
      );      
    } catch (error) {
      console.error('Error al actualizar estado del envío:', error);
      alert('❌ Error al actualizar el estado');
    }
  };
  
  
  

  return (
    <Container className="mt-4">
      <h2>📦 Envíos</h2>

      <div className="text-center mb-3">
        <Button className="me-2" onClick={() => navigate('/crearenvio')}>
          ➕ Agregar Envío
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')}>🏠 Volver al Menú</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Pedido</th>            
            <th>Transportista</th>
            <th>Tipo de Transporte</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Fecha Envío</th>
            <th>Fecha Actualizacion</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {envios.map((envio) => (
            <tr key={envio.EnvioID}>
              <td>{envio.EnvioID}</td>
              <td>{envio.PedidoID}</td>
              <td>{envio.NombreTransportista}</td>
              <td>{envio.TipoTransporte}</td>
              <td>{envio.Origen}</td>
              <td>{envio.Destino}</td>
              <td>{new Date(envio.FechaEnvio).toLocaleDateString()}</td>
              <td>{envio.FechaActualizacionEstado ? new Date(envio.FechaActualizacionEstado).toLocaleDateString(): ''}</td>
              <td>
              <Form.Select
                value={envio.EstadoEnvio}
                onChange={(e) => handleEstadoChange(envio, e.target.value)}
                style={{ minWidth: '150px' }}
                disabled={envio.EstadoEnvio === 'Entregado'} // ✅ aquí se desactiva
              >
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {getEstadoIcon(estado)} {estado}
                    </option>
                  ))}
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Envios;
