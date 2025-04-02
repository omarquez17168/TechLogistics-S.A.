import React, { useEffect, useState } from 'react';
import api from '../api/ApiClient';
import { Table, Button, Container, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Transportistas = () => {
  const [transportistas, setTransportistas] = useState([]);
  const [tiposTransporte, setTiposTransporte] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: '',
    telefono: '',
    email: '',
    tipoTransporteId: ''
  });
  const [modoEdicion, setModoEdicion] = useState(null); // ID en edición
  const [editData, setEditData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchTransportistas();
    fetchTiposTransporte();
  }, []);

  const fetchTransportistas = async () => {
    try {
      const res = await api.get('/transportistas');
      setTransportistas(res.data);
    } catch (error) {
      console.error('Error al obtener transportistas', error);
    }
  };

  const fetchTiposTransporte = async () => {
    try {
      const res = await api.get('/tipos-transporte');
      setTiposTransporte(res.data);
    } catch (error) {
      console.error('Error al obtener tipos de transporte', error);
    }
  };

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transportistas', {
        Nombre: nuevo.nombre,
        Telefono: nuevo.telefono,
        Email: nuevo.email,
        TipoTransporteID: nuevo.tipoTransporteId
      });
      setNuevo({ nombre: '', telefono: '', email: '', tipoTransporteId: '' });
      fetchTransportistas();
      alert('✅ Transportista agregado correctamente');
    } catch (error) {
      console.error('❌ Error al agregar transportista:', error);
      alert('Error al agregar transportista');
    }
  };

  const eliminarTransportista = async (id) => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar este transportista?')) {
      try {
        await api.delete(`/transportistas/${id}`);
        fetchTransportistas();
        alert('🗑 Transportista eliminado');
      } catch (error) {
        console.error('Error al eliminar transportista', error);
        alert('❌ No se pudo eliminar el transportista');
      }
    }
  };

  const handleEditClick = (t) => {
    setModoEdicion(t.TransportistaID);
    setEditData({
      nombre: t.Nombre,
      telefono: t.Telefono,
      email: t.Email,
      tipoTransporteId: tiposTransporte.find(tt => tt.Tipo === t.Tipo)?.TipoTransporteID || ''
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const guardarEdicion = async (id) => {
    try {
      await api.put(`/transportistas/${id}`, {
        Nombre: editData.nombre,
        Telefono: editData.telefono,
        Email: editData.email,
        TipoTransporteID: editData.tipoTransporteId
      });
      setModoEdicion(null);
      fetchTransportistas();
    } catch (error) {
      console.error('Error al actualizar transportista', error);
      alert('❌ No se pudo actualizar');
    }
  };

  return (
    <Container className="mt-4">
      <h2>🚛 Transportistas</h2>

      {/* Formulario agregar */}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
          <Col md={2}>
            <Form.Control
              type="text"
              placeholder="Nombre"
              name="nombre"
              value={nuevo.nombre}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="text"
              placeholder="Teléfono"
              name="telefono"
              value={nuevo.telefono}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              value={nuevo.email}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Select
              name="tipoTransporteId"
              value={nuevo.tipoTransporteId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar Tipo</option>
              {tiposTransporte.map((tipo) => (
                <option key={tipo.TipoTransporteID} value={tipo.TipoTransporteID}>
                  {tipo.Tipo}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button variant="success" type="submit" className="w-100">
              ➕ Agregar
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Tabla transportistas */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Tipo de Transporte</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transportistas.map((t) => (
            <tr key={t.TransportistaID}>
              <td>{t.TransportistaID}</td>
              {modoEdicion === t.TransportistaID ? (
                <>
                  <td><Form.Control name="nombre" value={editData.nombre} onChange={handleEditChange} /></td>
                  <td><Form.Control name="telefono" value={editData.telefono} onChange={handleEditChange} /></td>
                  <td><Form.Control name="email" value={editData.email} onChange={handleEditChange} /></td>
                  <td>
                    <Form.Select name="tipoTransporteId" value={editData.tipoTransporteId} onChange={handleEditChange}>
                      <option value="">Seleccionar</option>
                      {tiposTransporte.map((tt) => (
                        <option key={tt.TipoTransporteID} value={tt.TipoTransporteID}>{tt.Tipo}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Button variant="success" className="m-1" onClick={() => guardarEdicion(t.TransportistaID)}>💾 Guardar</Button>
                    <Button variant="secondary" className="m-1" onClick={() => setModoEdicion(null)}>❌ Cancelar</Button>
                  </td>
                </>
              ) : (
                <>
                  <td>{t.Nombre}</td>
                  <td>{t.Telefono}</td>
                  <td>{t.Email}</td>
                  <td>{t.Tipo}</td>
                  <td>
                    <Button variant="warning" className="m-1" onClick={() => handleEditClick(t)}>✏️ Editar</Button>
                    <Button variant="danger" className="m-1" onClick={() => eliminarTransportista(t.TransportistaID)}>🗑 Eliminar</Button>
                  </td>
                </>
              )}
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

export default Transportistas;
