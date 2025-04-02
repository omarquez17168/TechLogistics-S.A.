import React, { useEffect, useState } from 'react';
import api from '../api/ApiClient';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const EditarPedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState({
    clienteId: '',
    fechaPedido: '',
    estado: 'Pendiente',
    detalles: []
  });
  const [productoSeleccionado, setProductoSeleccionado] = useState({ productoId: '', cantidad: 1 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`🔄 Cargando datos para el pedido ID: ${id}`);

        const resClientes = await api.get('/clientes');
        setClientes(resClientes.data);

        const resProductos = await api.get('/productos');
        setProductos(resProductos.data);

        const resPedido = await api.get(`/pedidos/${id}`);
        console.log('📌 Pedido recibido:', resPedido.data);

        const resDetalles = await api.get(`/detalle_pedido/pedido/${id}`);
        console.log('📌 Detalles recibidos:', resDetalles.data);

        setPedido({
            clienteId: resPedido.data.ClienteID || '',
            fechaPedido: resPedido.data.FechaPedido ? resPedido.data.FechaPedido.split('T')[0] : '',
            estado: resPedido.data.Estado || 'Pendiente',            
            detalles: Array.isArray(resDetalles.data) ? resDetalles.data : []  // Asegurar que sea un array
          });
          
      } catch (error) {
        console.error('❌ Error al obtener datos del pedido:', error);
      }
    };

    fetchData();
  }, [id]);

  const agregarProducto = () => {
    const producto = productos.find(p => p.ProductoID === parseInt(productoSeleccionado.productoId));

    if (!producto) {
      alert('❌ Selecciona un producto válido');
      return;
    }

    const existe = pedido.detalles.find(d => d.ProductoID === producto.ProductoID);
    if (existe) {
      alert('❗ Este producto ya está en el pedido. Puedes actualizar su cantidad.');
      return;
    }

    setPedido({
      ...pedido,
      detalles: [
        ...pedido.detalles,
        {
          ProductoID: producto.ProductoID,
          Nombre: producto.Nombre,
          Cantidad: productoSeleccionado.cantidad,
          PrecioUnitario: producto.Precio,
          Subtotal: producto.Precio * productoSeleccionado.cantidad
        }
      ]
    });
    setProductoSeleccionado({ productoId: '', cantidad: 1 });
  };

  const actualizarCantidad = (productoId, cantidad) => {
    setPedido({
      ...pedido,
      detalles: pedido.detalles.map(detalle =>
        detalle.ProductoID === productoId
          ? { ...detalle, Cantidad: cantidad, Subtotal: detalle.PrecioUnitario * cantidad }
          : detalle
      )
    });
  };

  const eliminarProducto = (productoId) => {
    setPedido({
      ...pedido,
      detalles: pedido.detalles.filter(detalle => detalle.ProductoID !== productoId)
    });
  };

  const calcularTotal = () => {
    if (!pedido || !Array.isArray(pedido.detalles) || pedido.detalles.length === 0) {
      return 0; // Si no hay detalles, el total es 0
    }
  
    return pedido.detalles.reduce((sum, item) => {
      const subtotal = parseFloat(item.Subtotal);
      return sum + (isNaN(subtotal) ? 0 : subtotal); // Si subtotal no es un número, usa 0
    }, 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        clienteId: pedido.clienteId,
        fechaPedido: pedido.fechaPedido,
        estado: pedido.estado,
        total: calcularTotal(),
        detalles: pedido.detalles.map(d => ({
          productoId: d.ProductoID,
          cantidad: d.Cantidad,
          precioUnitario: d.PrecioUnitario,
          subtotal: d.Subtotal
        }))
      };

      await api.put(`/pedidos/${id}`, data);
      alert('✅ Pedido actualizado correctamente');
      navigate('/pedidos');
    } catch (error) {
      console.error('❌ Error al actualizar el pedido', error);
      alert('❌ No se pudo actualizar el pedido');
    }
  };

  return (
    <Container className="mt-4">
      <h2>✏️ Editar Pedido</h2>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Cliente</Form.Label>
              <Form.Select value={pedido.clienteId} disabled>
                <option value="">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.ClienteID} value={cliente.ClienteID}>
                    {cliente.Nombre} {cliente.Apellido}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Fecha del Pedido</Form.Label>
              <Form.Control type="date" value={pedido.fechaPedido} disabled />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mt-3">
          <Form.Label>Estado del Pedido</Form.Label>
          <Form.Select value={pedido.estado} onChange={e => setPedido({ ...pedido, estado: e.target.value })}>
            <option value="Pendiente">Pendiente</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </Form.Select>
        </Form.Group>

        <hr />
        <h5>📦 Productos en el Pedido</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Select
              value={productoSeleccionado.productoId}
              onChange={(e) =>
                setProductoSeleccionado({ ...productoSeleccionado, productoId: e.target.value })
              }
            >
              <option value="">Seleccionar producto</option>
              {productos.map((producto) => (
                <option key={producto.ProductoID} value={producto.ProductoID}>
                  {producto.Nombre} - ${Number(producto.Precio).toFixed(2)}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              min={1}
              value={productoSeleccionado.cantidad}
              onChange={(e) =>
                setProductoSeleccionado({
                  ...productoSeleccionado,
                  cantidad: parseInt(e.target.value),
                })
              }
            />
          </Col>
          <Col md={3}>
            <Button variant="success" onClick={agregarProducto}>
              ➕ Agregar
            </Button>
          </Col>
        </Row>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {pedido.detalles.length > 0 ? (
              pedido.detalles.map((item, index) => (
                <tr key={index}>
                  <td>{item.NombreProducto}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min={1}
                      value={item.Cantidad}
                      onChange={e => actualizarCantidad(item.ProductoID, parseInt(e.target.value))}
                    />
                  </td>
                  <td>${Number(item.PrecioUnitario).toFixed(2)}</td>
                  <td>${Number(item.Subtotal).toFixed(2)}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => eliminarProducto(item.ProductoID)}>🗑</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">No hay productos en este pedido</td>
              </tr>
            )}
          </tbody>
        </Table>

        <h5>💰 Total: ${Number(calcularTotal()).toFixed(2)}</h5>

        <Button type="submit" variant="primary" className="mt-3">✅ Guardar Cambios</Button>
        <Button variant="secondary" className="mt-3 ms-3" onClick={() => navigate('/pedidos')}>🔙 Cancelar</Button>
      </Form>
    </Container>
  );
};

export default EditarPedido;
