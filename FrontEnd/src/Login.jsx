import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/login.css";
import { login } from "./services/apiService";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      if (!data.ok) throw new Error(data.message || "Credenciales incorrectas");
      localStorage.setItem("id_cliente", data.id);
      localStorage.setItem("email_cliente", data.email);
      onLogin && onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    setShowReset(true);
    setResetMessage(
      "Se envió un correo a su cuenta personal para el cambio de clave."
    );
  };

  return (
    <div className="login-split">
      {/* Columna izquierda */}
      <div className="login-left">
        <div className="bank-info">
          {/* Imagen de campus eliminada por solicitud del usuario */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
            alt="Banco ISTLC Logo"
            className="bank-logo"
          />
          <h1 className="bank-title">Banco ISTLC</h1>
          <p className="bank-slogan">Innovación financiera para tu futuro</p>
          <div className="atm-cta-container">
            <div className="atm-animation">
              <div className="atm-body">
                <div className="atm-screen"></div>
                <div className="atm-slot"></div>
                <div className="atm-keypad"></div>
              </div>
              <div className="atm-card"></div>
            </div>
            <button
              className="login-action-btn"
              onClick={() => navigate("/cajero")}
              type="button"
            >
              Cajero Automático
            </button>
          </div>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="login-right">
        <div className="login-card-modern">
          <h2 className="form-title">Accede a tu cuenta</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="login-form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@correo.com"
              />
            </div>
            <div className="mb-3">
              <label className="login-form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
              />
            </div>
            {error && (
              <div className="alert alert-danger login-alert">{error}</div>
            )}
            <button
              type="submit"
              className="btn login-btn w-100 mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : null}
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          {/* Botones adicionales */}
          <div className="extra-options mt-3 text-center">
            <button
              className="btn btn-outline-primary w-100 mb-2"
              type="button"
              onClick={() => navigate("/registro-cliente")}
            >
              Cliente nuevo, regístrate
            </button>
            <button
              className="btn btn-link text-decoration-none"
              onClick={handleResetPassword}
            >
              ¿Olvidaste tu clave?
            </button>
            {showReset && (
              <div className="alert alert-info mt-2">{resetMessage}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
