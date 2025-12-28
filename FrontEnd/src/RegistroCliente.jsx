import React, { useState } from "react";
import { registerCliente } from "./services/apiService";
import { useNavigate } from "react-router-dom";
import "./style/registroCliente.css";

function RegistroCliente() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    cedula: "",
    rol: "usuario",
  });
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    if (!form.cedula || !form.email) {
      setMensaje("La cédula y el correo son obligatorios.");
      return;
    }
    try {
      const data = await registerCliente(form);
      if (data.ok !== false) {
        setMensaje("Registro exitoso. Ahora puedes iniciar sesión.");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMensaje(data.message || "Error al registrar cliente.");
      }
    } catch {
      setMensaje("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="registro-bg">
      <div className="registro-card">
        <h2>Registro de Nuevo Cliente</h2>
        <form onSubmit={handleSubmit} className="registro-form">
          <label>Nombre:</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Nombre"
          />
          <label>Apellido:</label>
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            required
            placeholder="Apellido"
          />
          <label>Cédula:</label>
          <input
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
            required
            placeholder="Cédula"
          />
          <label>Correo electrónico:</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Correo"
          />
          <label>Contraseña:</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Contraseña"
          />
          <button type="submit">Registrar</button>
        </form>
        {mensaje && <div className="registro-mensaje">{mensaje}</div>}
        <button onClick={() => navigate("/")}>Volver al Login</button>
      </div>
    </div>
  );
}

export default RegistroCliente;
