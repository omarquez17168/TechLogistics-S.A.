import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1>📦 TechLog - Gestión de Pedidos</h1>
      <p>Selecciona una opción:</p>

      <div className="d-flex flex-column align-items-center">
        <Button className="m-2 w-50" onClick={() => navigate('/clientes')}>👤 Clientes</Button>
        <Button className="m-2 w-50" onClick={() => navigate('/productos')}>📦 Productos</Button>
        <Button className="m-2 w-50" onClick={() => navigate('/pedidos')}>🛒 Pedidos</Button>
        <Button className="m-2 w-50" onClick={() => navigate('/transportistas')}>🚚 Transportistas</Button>
        <Button className="m-2 w-50" onClick={() => navigate('/envios')}>📍 Envíos</Button>
        <Button className="m-2 w-50" onClick={() => navigate('/rutas')}>🚚 Rutas</Button>
      </div>
    </Container>
  );
};

export default Home;
