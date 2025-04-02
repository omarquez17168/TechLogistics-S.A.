import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/ApiClient';
import { Table, Container, Button } from 'react-bootstrap';

const DetallePedido = () => {
  const { pedidoId } = useParams();
  const [detalles, setDetalles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const res = await api.get(`/detalle_pedido/pedido/${pedidoId}`);
        setDetalles(res.data);
      } catch (error) {
        console.error('❌ Error al obtener los detalles:', error);
      }
    };
    fetchDetalles();
  }, [pedidoId]);

  return (
    <Container className="mt-4">
      <h2>📄 Detalles del Pedido #{pedidoId}</h2>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((item) => (
            <tr key={item.DetalleID}>
              <td>{item.NombreProducto}</td>
              <td>{item.Cantidad}</td>
              <td>${Number(item.PrecioUnitario).toFixed(2)}</td>
              <td>${Number(item.Subtotal).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="secondary" onClick={() => navigate('/pedidos')}>🔙 Volver</Button>
    </Container>
  );
};

export default DetallePedido;
