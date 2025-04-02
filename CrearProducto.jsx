import React, { useState } from 'react';
import api from '../api/ApiClient';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CrearProducto = () => {
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    Nombre: '',
    Descripcion: '',
    Precio: ''
  });

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!producto.Nombre || !producto.Precio) {
      alert('⚠️ El nombre y precio son obligatorios');
      return;
    }

    try {
      await api.post('/productos', {
        Nombre: producto.Nombre,
        Descripcion: producto.Descripcion,
        Precio: parseFloat(producto.Precio)
      });

      alert('✅ Producto creado correctamente');
      navigate('/productos');
    } catch (error) {
      console.error('❌ Error al crear producto:', error);
      alert('❌ No se pudo crear el producto');
    }
  };

  return (
    <Container className="mt-4">
      <h3>🆕 Agregar Producto</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="Nombre"
            value={producto.Nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            name="Descripcion"
            value={producto.Descripcion}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="Precio"
            value={producto.Precio}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary">Guardar Producto</Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate('/productos')}>
          Cancelar
        </Button>
      </Form>
    </Container>
  );
};

export default CrearProducto;
