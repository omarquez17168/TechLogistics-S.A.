import React, { useEffect, useState } from 'react';
import api from '../api/ApiClient';
import { Table, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const res = await api.get('/pedidos');
      setPedidos(res.data);
    } catch (error) {
      console.error('❌ Error al obtener pedidos:', error);
    }
  };

  // 🗑 Función para eliminar pedido
  const eliminarPedido = async (id) => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar este pedido? Esta acción no se puede deshacer.')) {
      try {
        await api.delete(`/pedidos/${id}`);
        alert('✅ Pedido eliminado correctamente');
        
        // Elimina el pedido de la lista sin recargar
        setPedidos(pedidos.filter(pedido => pedido.PedidoID !== id));
      } catch (error) {
        console.error('❌ Error al eliminar el pedido:', error);
        alert('❌ No se pudo eliminar el pedido. Asegúrate de que no tenga detalles asociados.');
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2>📦 Pedidos</h2>
      <Button className="mb-3" onClick={() => navigate('/crearpedido')}>
        ➕ Agregar Pedido
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.PedidoID}>
              <td>{pedido.PedidoID}</td>
              <td>{pedido.NombreCliente}</td>
              <td>{new Date(pedido.FechaPedido).toLocaleDateString()}</td>
              <td>{pedido.Estado}</td>
              <td>${Number(pedido.Total).toFixed(2)}</td>
              <td>
                <Button variant="info" className="m-1" onClick={() => navigate(`/detalle-pedido/${pedido.PedidoID}`)}>
                  📄 Ver Detalle
                </Button>
                <Button variant="warning" className="m-1" onClick={() => navigate(`/editarpedido/${pedido.PedidoID}`)}  disabled={pedido.Estado === 'Entregado'}  title={pedido.Estado === 'Entregado' ? 'Este pedido ya fue entregado' : ''}>
                  ✏️ Editar
                </Button>
                <Button variant="danger" className="m-1" onClick={() => eliminarPedido(pedido.PedidoID)} disabled={pedido.Estado === 'Entregado'} title={pedido.Estado === 'Entregado' ? 'No se puede eliminar un pedido entregado' : ''}>
                    🗑 Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="secondary" className="m-2 d-block mx-auto" onClick={() => navigate('/')}>
        🏠 Volver al Menú
      </Button>
    </Container>
  );
};

export default Pedidos;
