import React, { useEffect, useState } from 'react';
import api from '../api/ApiClient';
import { Table, Button, Container, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Rutas = () => {
  const [rutas, setRutas] = useState([]);
  const [nuevaRuta, setNuevaRuta] = useState({
    origen: '',
    destino: '',
    distancia: ''
  });
  const [modoEdicion, setModoEdicion] = useState(null); // RutaID
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchRutas();
  }, []);

  const fetchRutas = async () => {
    try {
      const res = await api.get('/rutas');
      setRutas(res.data);
    } catch (error) {
      console.error('Error al obtener rutas', error);
      alert('Error al cargar rutas');
    }
  };

  const handleChange = (e) => {
    setNuevaRuta({ ...nuevaRuta, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rutas', {
        Origen: nuevaRuta.origen,
        Destino: nuevaRuta.destino,
        Distancia: nuevaRuta.distancia
      });
      setNuevaRuta({ origen: '', destino: '', distancia: '' });
      fetchRutas();
      alert('✅ Ruta agregada correctamente');
    } catch (error) {
      console.error('❌ Error al agregar ruta:', error);
      alert('Error al agregar ruta');
    }
  };

  const eliminarRuta = async (id) => {
    if (window.confirm('⚠️ ¿Seguro que deseas eliminar esta ruta?')) {
      try {
        await api.delete(`/rutas/${id}`);
        fetchRutas();
        alert('🗑 Ruta eliminada');
      } catch (error) {
        console.error('Error al eliminar ruta', error);
        alert('❌ No se pudo eliminar la ruta');
      }
    }
  };

  const handleEditClick = (ruta) => {
    setModoEdicion(ruta.RutaID);
    setEditData({
      origen: ruta.Origen,
      destino: ruta.Destino,
      distancia: ruta.Distancia
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const guardarEdicion = async (id) => {
    try {
      await api.put(`/rutas/${id}`, {
        Origen: editData.origen,
        Destino: editData.destino,
        Distancia: editData.distancia
      });
      setModoEdicion(null);
      fetchRutas();
    } catch (error) {
      console.error('Error al actualizar ruta', error);
      alert('❌ No se pudo actualizar');
    }
  };

  return (
    <Container className="mt-4">
      <h2>🗺 Rutas</h2>

      {/* Formulario agregar */}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Origen"
              name="origen"
              value={nuevaRuta.origen}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Destino"
              name="destino"
              value={nuevaRuta.destino}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Distancia (km)"
              name="distancia"
              value={nuevaRuta.distancia}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={2}>
            <Button variant="success" type="submit" className="w-100">
              ➕ Agregar
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Tabla rutas */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Distancia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rutas.map((r) => (
            <tr key={r.RutaID}>
              <td>{r.RutaID}</td>
              {modoEdicion === r.RutaID ? (
                <>
                  <td><Form.Control name="origen" value={editData.origen} onChange={handleEditChange} /></td>
                  <td><Form.Control name="destino" value={editData.destino} onChange={handleEditChange} /></td>
                  <td><Form.Control name="distancia" value={editData.distancia} onChange={handleEditChange} /></td>
                  <td>
                    <Button variant="success" className="m-1" onClick={() => guardarEdicion(r.RutaID)}>💾 Guardar</Button>
                    <Button variant="secondary" className="m-1" onClick={() => setModoEdicion(null)}>❌ Cancelar</Button>
                  </td>
                </>
              ) : (
                <>
                  <td>{r.Origen}</td>
                  <td>{r.Destino}</td>
                  <td>{r.Distancia}</td>
                  <td>
                    <Button variant="warning" className="m-1" onClick={() => handleEditClick(r)}>✏️ Editar</Button>
                    <Button variant="danger" className="m-1" onClick={() => eliminarRuta(r.RutaID)}>🗑 Eliminar</Button>
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

export default Rutas;