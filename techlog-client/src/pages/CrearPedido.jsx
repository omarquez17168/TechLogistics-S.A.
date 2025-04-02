import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import api from '../api/ApiClient';
import { useNavigate } from 'react-router-dom';

const CrearPedido = () => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState({
    clienteId: '',
    fechaPedido: '',
    estado: 'Pendiente',
    detalles: []
  });
  const [productoSeleccionado, setProductoSeleccionado] = useState({ productoId: '', cantidad: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const resClientes = await api.get('/clientes');
      setClientes(resClientes.data);
      const resProductos = await api.get('/productos');
      setProductos(resProductos.data);
    };
    fetchData();
  }, []);

  const agregarProducto = () => {
    const existe = pedido.detalles.find(p => p.productoId === parseInt(productoSeleccionado.productoId));
    if (existe) {
      alert('❗ Este producto ya fue agregado');
      return;
    }

    const producto = productos.find(p => p.ProductoID === parseInt(productoSeleccionado.productoId));
    if (producto) {
      setPedido(prev => ({
        ...prev,
        detalles: [
          ...prev.detalles,
          {
            productoId: producto.ProductoID,
            nombre: producto.Nombre,
            cantidad: productoSeleccionado.cantidad,
            precioUnitario: producto.Precio,
            subtotal: producto.Precio * productoSeleccionado.cantidad
          }
        ]
      }));

      // Limpiar campos
      setProductoSeleccionado({ productoId: '', cantidad: 1 });
    }
  };

  const eliminarProducto = (id) => {
    setPedido(prev => ({
      ...prev,
      detalles: prev.detalles.filter(p => p.productoId !== id)
    }));
  };

  const calcularTotal = () => {
    return pedido.detalles.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pedido.detalles.length === 0) {
      alert('❗ Agrega al menos un producto al pedido');
      return;
    }

    const data = {
      clienteId: pedido.clienteId,
      fechaPedido: pedido.fechaPedido,
      estado: pedido.estado,
      total: calcularTotal(),
      detalles: pedido.detalles.map(p => ({
        productoId: p.productoId,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario,
        subtotal: p.subtotal
      }))
    };

    try {
      await api.post('/pedidos', data);
      alert('✅ Pedido creado con éxito');
      navigate('/pedidos');
    } catch (error) {
      console.error('❌ Error al crear el pedido', error);
      alert('❌ No se pudo crear el pedido');
    }
  };

  return (
    <Container className="mt-4">
      <h2>📝 Crear Pedido</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                value={pedido.clienteId}
                onChange={e => setPedido({ ...pedido, clienteId: e.target.value })}
                required
              >
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
              <Form.Control
                type="date"
                value={pedido.fechaPedido}
                onChange={e => setPedido({ ...pedido, fechaPedido: e.target.value })}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <hr />
        <h5>Productos</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Select
              value={productoSeleccionado.productoId}
              onChange={e =>
                setProductoSeleccionado({ ...productoSeleccionado, productoId: e.target.value })
              }
            >
              <option value="">Seleccionar producto</option>
              {productos.map(producto => (
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
              onChange={e =>
                setProductoSeleccionado({
                  ...productoSeleccionado,
                  cantidad: parseInt(e.target.value)
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
            {pedido.detalles.map((item, index) => (
              <tr key={index}>
                <td>{item.nombre}</td>
                <td>{item.cantidad}</td>
                <td>${Number(item.precioUnitario).toFixed(2)}</td>
                <td>${Number(item.subtotal).toFixed(2)}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => eliminarProducto(item.productoId)}>
                    🗑
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h5>💰 Total: ${calcularTotal().toFixed(2)}</h5>
        <Button type="submit" variant="primary" className="mt-3">
          ✅ Crear Pedido
        </Button>
      </Form>
    </Container>
  );
};

export default CrearPedido;
