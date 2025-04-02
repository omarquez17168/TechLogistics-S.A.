import React, { useEffect, useState } from 'react';
import api from '../api/ApiClient';
import { Table, Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedCliente, setEditedCliente] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await api.get('/clientes');
      setClientes(res.data);
    } catch (error) {
      console.error('Error al obtener clientes', error);
    }
  };

  const eliminarCliente = async (id) => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
      try {
        await api.delete(`/clientes/${id}`);
        alert('✅ Cliente eliminado correctamente');
        setClientes((prev) => prev.filter(c => c.ClienteID !== id));
      } catch (error) {
        console.error('❌ Error al eliminar cliente:', error);
        alert('❌ No se pudo eliminar el cliente. Asegúrate de que no tenga pedidos asociados.');
      }
    }
  };

  const handleEditClick = (cliente) => {
    setEditingId(cliente.ClienteID);
    setEditedCliente({ ...cliente });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedCliente({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCliente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      await api.put(`/clientes/${id}`, editedCliente);
      setClientes((prev) =>
        prev.map((c) => (c.ClienteID === id ? { ...editedCliente, ClienteID: id } : c))
      );
      setEditingId(null);
    } catch (error) {
      console.error('❌ Error al actualizar cliente:', error);
      alert('❌ No se pudo guardar el cliente');
    }
  };

  return (
    <Container className="mt-4">
      <h2>👤 Clientes</h2>
      <Button className="mb-3" onClick={() => navigate('/crearcliente')}>➕ Agregar Cliente</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.ClienteID}>
              <td>{cliente.ClienteID}</td>
              <td>
                {editingId === cliente.ClienteID ? (
                  <Form.Control
                    name="Nombre"
                    value={editedCliente.Nombre}
                    onChange={handleInputChange}
                  />
                ) : (
                  cliente.Nombre
                )}
              </td>
              <td>
                {editingId === cliente.ClienteID ? (
                  <Form.Control
                    name="Apellido"
                    value={editedCliente.Apellido}
                    onChange={handleInputChange}
                  />
                ) : (
                  cliente.Apellido
                )}
              </td>
              <td>
                {editingId === cliente.ClienteID ? (
                  <Form.Control
                    name="Direccion"
                    value={editedCliente.Direccion}
                    onChange={handleInputChange}
                  />
                ) : (
                  cliente.Direccion
                )}
              </td>
              <td>
                {editingId === cliente.ClienteID ? (
                  <Form.Control
                    name="Telefono"
                    value={editedCliente.Telefono}
                    onChange={handleInputChange}
                  />
                ) : (
                  cliente.Telefono
                )}
              </td>
              <td>
                {editingId === cliente.ClienteID ? (
                  <Form.Control
                    name="Email"
                    value={editedCliente.Email}
                    onChange={handleInputChange}
                  />
                ) : (
                  cliente.Email
                )}
              </td>
              <td>
                {editingId === cliente.ClienteID ? (
                  <>
                    <Button variant="success" className="m-1" onClick={() => handleSave(cliente.ClienteID)}>
                      💾 Guardar
                    </Button>
                    <Button variant="secondary" className="m-1" onClick={handleCancelEdit}>
                      ❌ Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="warning" className="m-1" onClick={() => handleEditClick(cliente)}>
                      ✏️ Editar
                    </Button>
                    <Button variant="danger" className="m-1" onClick={() => eliminarCliente(cliente.ClienteID)}>
                      🗑 Eliminar
                    </Button>
                  </>
                )}
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

export default Clientes;
