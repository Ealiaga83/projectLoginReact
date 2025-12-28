import React, { useState } from "react";
import { cajeroDeposito, cajeroRetiro } from "./services/apiService";
import { useNavigate } from "react-router-dom";
import "./style/cajero.css";

function Cajero() {
  const [opcion, setOpcion] = useState(null);
  const [monto, setMonto] = useState("");
  const [cedula, setCedula] = useState("");
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleOperacion = (tipo) => {
    setOpcion(tipo);
    setMonto("");
    setCedula("");
    setUsuario("");
    setClave("");
    setMensaje("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    if (!monto || isNaN(monto) || Number(monto) <= 0) {
      setMensaje("Por favor ingresa un monto válido.");
      return;
    }

    if (opcion === "deposito") {
      if (!cedula) {
        setMensaje("Debes ingresar la cédula.");
        return;
      }
      try {
        const data = await cajeroDeposito(cedula, monto);
        if (data.ok !== false) {
          setMensaje(data.message || "Depósito realizado correctamente.");
        } else {
          setMensaje(data.message || "Error al realizar el depósito.");
        }
      } catch {
        setMensaje("Error de conexión con el servidor.");
      }
    } else if (opcion === "retiro") {
      if (!usuario || !clave) {
        setMensaje("Debes ingresar usuario y clave.");
        return;
      }
      try {
        const data = await cajeroRetiro(usuario, clave, monto); // usuario es el correo
        if (data.ok !== false) {
          setMensaje(data.message || "Retiro realizado correctamente.");
        } else {
          setMensaje(data.message || "Error al realizar el retiro.");
        }
      } catch {
        setMensaje("Error de conexión con el servidor.");
      }
    }

    setMonto("");
    setCedula("");
    setUsuario("");
    setClave("");
  };

  return (
    <div className="cajero-bg">
      <div className="cajero-card">
        <h2 className="cajero-title">Cajero Automático</h2>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
          alt="ATM"
          className="cajero-img"
        />

        <div className="cajero-options">
          <button
            onClick={() => handleOperacion("deposito")}
            className={`cajero-btn ${opcion === "deposito" ? "active" : ""}`}
          >
            Depósito
          </button>
          <button
            onClick={() => handleOperacion("retiro")}
            className={`cajero-btn ${opcion === "retiro" ? "active" : ""}`}
          >
            Retiro
          </button>
        </div>

        {opcion && (
          <form onSubmit={handleSubmit} className="cajero-form">
            {opcion === "deposito" && (
              <>
                <label>Cédula:</label>
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  required
                  placeholder="Ingrese su cédula"
                />
              </>
            )}
            {opcion === "retiro" && (
              <>
                <label>Usuario:</label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                  placeholder="Ingrese su usuario"
                />
                <label>Clave:</label>
                <input
                  type="password"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  required
                  placeholder="Ingrese su clave"
                />
              </>
            )}
            <label>
              {opcion === "deposito"
                ? "Monto a depositar:"
                : "Monto a retirar:"}
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
              placeholder="$0.00"
            />
            <button type="submit" className="cajero-btn-submit">
              {opcion === "deposito" ? "Depositar" : "Retirar"}
            </button>
          </form>
        )}

        {mensaje && <div className="cajero-message">{mensaje}</div>}

        <button onClick={() => navigate("/")} className="cajero-btn-back">
          Volver al Login
        </button>
      </div>
    </div>
  );
}

export default Cajero;
