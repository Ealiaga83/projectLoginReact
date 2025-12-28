import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './style/App.css';

import PaginaCliente from './PaginaCliente';
import Login from './Login';
import Cajero from './Cajero';
import RegistroCliente from './RegistroCliente';

function App() {
  const [logueado, setLogueado] = useState(!!localStorage.getItem("id_cliente"));

  const handleLogin = () => setLogueado(true);
  const handleLogout = () => setLogueado(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={logueado ? <PaginaCliente onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
        <Route path="/cajero" element={<Cajero />} />
        <Route path="/registro-cliente" element={<RegistroCliente />} />
      </Routes>
    </Router>
  );
}

export default App;
