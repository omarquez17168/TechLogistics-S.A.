import React, { useEffect, useState } from 'react';
import api from '../api/ApiClient';
import { Table, Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [productoEditado, setProductoEditado] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener productos', error);
    }
  };

  const handleEditClick = (producto) => {
    setEditandoId(producto.ProductoID);
    setProductoEditado({ ...producto });
  };

  const handleCancelEdit = () => {
    setEditandoId(null);
    setProductoEditado({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async () => {
    try {
      await api.put(`/productos/${editandoId}`, productoEditado);
      alert('✅ Producto actualizado');
      setEditandoId(null);
      fetchProductos();
    } catch (error) {
      console.error('❌ Error al actualizar producto', error);
      alert('❌ No se pudo actualizar el producto');
    }
  };
  const eliminarProducto = async (id) => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      try {
        await api.delete(`/productos/${id}`);
        alert('✅ Producto eliminado correctamente');
        setProductos(productos.filter(p => p.ProductoID !== id));
      } catch (error) {
        console.error('❌ Error al eliminar el producto:', error);
        alert('❌ No se pudo eliminar el producto. Verifica si está asociado a un pedido.');
      }
    }
  };
  return (
    <Container className="mt-4">
      <h2>📦 Productos</h2>
      <Button className="mb-3" onClick={() => navigate('/crearproducto')}>➕ Agregar Producto</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.ProductoID}>
              <td>{producto.ProductoID}</td>
              <td>
                {editandoId === producto.ProductoID ? (
                  <Form.Control
                    name="Nombre"
                    value={productoEditado.Nombre}
                    onChange={handleInputChange}
                  />
                ) : (
                  producto.Nombre
                )}
              </td>
              <td>
                {editandoId === producto.ProductoID ? (
                  <Form.Control
                    name="Descripcion"
                    value={productoEditado.Descripcion}
                    onChange={handleInputChange}
                  />
                ) : (
                  producto.Descripcion
                )}
              </td>
              <td>
                {editandoId === producto.ProductoID ? (
                  <Form.Control
                    name="Precio"
                    type="number"
                    value={productoEditado.Precio}
                    onChange={handleInputChange}
                  />
                ) : (
                  `$${producto.Precio}`
                )}
              </td>
              <td>
                {editandoId === producto.ProductoID ? (
                  <>
                    <Button variant="success" className="m-1" onClick={guardarCambios}>💾 Guardar</Button>
                    <Button variant="secondary" className="m-1" onClick={handleCancelEdit}>❌ Cancelar</Button>
                  </>
                ) : (
                  <>
                    <Button variant="warning" className="m-1" onClick={() => handleEditClick(producto)}>✏️ Editar</Button>
                    <Button variant="danger" className="m-1" onClick={() => eliminarProducto(producto.ProductoID)}>🗑 Eliminar</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="secondary" className="m-2 d-block mx-auto" onClick={() => navigate('/')}>🏠 Volver al Menú</Button>
    </Container>
  );
};

export default Productos;
