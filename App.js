//App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Productos from './pages/Productos';
import Pedidos from './pages/Pedidos';
import CrearPedido from './pages/CrearPedido';
import Transportistas from './pages/Transportistas';
import Envios from './pages/Envios';
import DetallePedido from './pages/DetallePedido';
import EditarPedido from './pages/EditarPedido';
import CrearEnvio from './pages/CrearEnvio';
import CrearCliente from './pages/CrearCliente';
import CrearProducto from './pages/CrearProducto';
import Rutas from './pages/Rutas';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/crearpedido" element={<CrearPedido />} />
        <Route path="/transportistas" element={<Transportistas />} />
        <Route path="/envios" element={<Envios />} />   
        <Route path="/crearenvio" element={<CrearEnvio />} />   
        <Route path="/detalle-pedido/:pedidoId" element={<DetallePedido />} /> 
        <Route path="/editarpedido/:id" element={<EditarPedido />} />    
        <Route path="/crearcliente" element={<CrearCliente />} />
        <Route path="/crearproducto" element={<CrearProducto />} /> 
        <Route path="/rutas" element={<Rutas />} />   
      </Routes>
    </Router>
  );
}

export default App;
