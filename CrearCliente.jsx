// CrearCliente.jsx
import React, { useState } from 'react';
import api from '../api/ApiClient';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CrearCliente = () => {
  const [cliente, setCliente] = useState({
    Nombre: '',
    Apellido: '',
    Direccion: '',
    Telefono: '',
    Email: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/clientes', cliente);
      alert('✅ Cliente creado correctamente');
      navigate('/clientes');
    } catch (error) {
      console.error('❌ Error al crear cliente:', error);
      alert('Error al crear cliente');
    }
  };

  return (
    <Container className="mt-4">
      <h3>➕ Crear Nuevo Cliente</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" name="Nombre" value={cliente.Nombre} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control type="text" name="Apellido" value={cliente.Apellido} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Dirección</Form.Label>
          <Form.Control type="text" name="Direccion" value={cliente.Direccion} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control type="text" name="Telefono" value={cliente.Telefono} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="Email" value={cliente.Email} onChange={handleChange} />
        </Form.Group>

        <Button type="submit" variant="primary">Guardar Cliente</Button>
        <Button className="ms-2" variant="secondary" onClick={() => navigate('/clientes')}>Cancelar</Button>
      </Form>
    </Container>
  );
};

export default CrearCliente;
