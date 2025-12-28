import React, { useEffect, useState } from "react";
import "./style/bank-dashboard.css";
import { getUsuarioByEmail, getSaldo, transferir, getTransaccionesInfo } from "./services/apiService";

export default function PaginaCliente({ onLogout }) {
  const [cliente, setCliente] = useState(null);
  const [saldo, setSaldo] = useState(null);
  const [transacciones, setTransacciones] = useState([]);
  const [loadingTransacciones, setLoadingTransacciones] = useState(false);
  const [showTransacciones, setShowTransacciones] = useState(false);
  const [errorTransacciones, setErrorTransacciones] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferMonto, setTransferMonto] = useState("");
  const [transferCedula, setTransferCedula] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState("");
  const [transferSuccess, setTransferSuccess] = useState("");

  const id_cliente = localStorage.getItem("id_cliente");

  useEffect(() => {
    if (!id_cliente) return;
    // Obtener datos del cliente
    getUsuarioByEmail(localStorage.getItem("email_cliente"))
      .then((data) => setCliente(data))
      .catch(() => setCliente(null));
    // Obtener saldo
    getSaldo(id_cliente)
      .then((data) => setSaldo(data))
      .catch(() => setSaldo(null));
  }, [id_cliente]);

  const handleLogout = () => {
    localStorage.removeItem("id_cliente");
    localStorage.removeItem("email_cliente");
    onLogout && onLogout();
  };

  // Lógica para transferencia
  const handleTransfer = async (e) => {
    e.preventDefault();
    setTransferLoading(true);
    setTransferError("");
    setTransferSuccess("");
    try {
      const data = await transferir(id_cliente, transferMonto, transferCedula);
      if (data.ok === false)
        throw new Error(data.message || "Error en la transferencia");
      setTransferSuccess(
        data.message || "Transferencia realizada correctamente"
      );
      setTransferMonto("");
      setTransferCedula("");
      // Actualizar saldo automáticamente
      getSaldo(id_cliente).then(setSaldo);
      // Actualizar historial de transacciones si está visible
      // (mantener fetch directo si no hay funcion en apiService)
      if (showTransacciones) {
        try {
          const dataHist = await getTransaccionesInfo(id_cliente);
          setTransacciones(dataHist.transacciones || []);
        } catch {
          // Error al actualizar historial, se ignora para no interrumpir el flujo
        }
      }
    } catch (err) {
      setTransferError(err.message);
    } finally {
      setTransferLoading(false);
    }
  };

  const handleVerTransacciones = async () => {
    setLoadingTransacciones(true);
    setErrorTransacciones(null);
    setShowTransacciones(true);
    try {
      const data = await getTransaccionesInfo(id_cliente);
      setTransacciones(data.transacciones || []);
    } catch (err) {
      setErrorTransacciones(err.message);
      setTransacciones([]);
    } finally {
      setLoadingTransacciones(false);
    }
  };

  if (!cliente) {
    return (
      <div className="text-center mt-5">Cargando datos del cliente...</div>
    );
  }

  return (
    <div className="cliente-bg bank-dashboard">
      <div className="row">
        {/* Columna izquierda: Datos del cliente */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
                alt="Avatar"
                className="avatar-lg mb-3"
              />
              <h4 className="fw-bold">
                {cliente.nombre} {cliente.apellido}
              </h4>
              <p className="text-muted">{cliente.email}</p>
              <p className="text-muted">ID: {cliente._id}</p>
              <button
                className="btn btn-outline-danger mt-3"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
              </button>
            </div>
          </div>

          {/* Saldo */}
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <h5 className="card-title">Saldo disponible</h5>
              {saldo ? (
                <>
                  <h3 className="text-success fw-bold">
                    ${saldo.saldoDisponible}
                  </h3>
                  <p className="text-muted">Anterior: ${saldo.saldoAnterior}</p>
                </>
              ) : (
                <p className="text-muted">No disponible</p>
              )}
              {/* Botón transferencia */}
              <button
                className="btn btn-warning mt-3 w-100"
                onClick={() => setShowTransfer((v) => !v)}
              >
                Transferencia
              </button>
              {showTransfer && (
                <form className="mt-3" onSubmit={handleTransfer}>
                  <div className="mb-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Monto a transferir"
                      value={transferMonto}
                      onChange={(e) => setTransferMonto(e.target.value)}
                      required
                      min={1}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cédula destino"
                      value={transferCedula}
                      onChange={(e) => setTransferCedula(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={transferLoading}
                  >
                    {transferLoading ? "Enviando..." : "Enviar transferencia"}
                  </button>
                  {transferError && (
                    <div className="alert alert-danger mt-2">
                      {transferError}
                    </div>
                  )}
                  {transferSuccess && (
                    <div className="alert alert-success mt-2">
                      {transferSuccess}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Dashboard de ahorro */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Meta de ahorro</h5>
              <p className="text-muted">Progreso hacia tu objetivo</p>
              <div className="progress" style={{ height: "20px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: "60%" }}
                  aria-valuenow="60"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  60%
                </div>
              </div>
              <small className="text-muted">
                Objetivo: $5000 | Actual: $3000
              </small>
            </div>
          </div>
        </div>

        {/* Columna derecha: Transacciones */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Registro de transacciones</h5>
              {!showTransacciones ? (
                <button
                  className="btn btn-primary mb-3"
                  onClick={handleVerTransacciones}
                  disabled={loadingTransacciones}
                >
                  {loadingTransacciones ? "Cargando..." : "Ver transacciones"}
                </button>
              ) : (
                <button
                  className="btn btn-secondary mb-3"
                  onClick={() => setShowTransacciones(false)}
                >
                  Ocultar transacciones
                </button>
              )}

              <div
                className={`transacciones-fade ${
                  showTransacciones ? "show" : ""
                }`}
              >
                {showTransacciones && (
                  <>
                    {errorTransacciones && (
                      <div className="alert alert-danger">
                        {errorTransacciones}
                      </div>
                    )}
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Saldo Disponible</th>
                            <th>Saldo Anterior</th>
                            <th>Valor Retirado</th>
                            <th>Fecha Registro</th>
                            <th>Fecha Modificación</th>
                            <th>Fecha Retiro</th>
                            <th>ID Transacción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transacciones.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center">
                                Sin movimientos
                              </td>
                            </tr>
                          ) : (
                            transacciones.map((t) => (
                              <tr key={t._id}>
                                <td>${t.saldoDisponible}</td>
                                <td>${t.saldoAnterior}</td>
                                <td>
                                  {t.valorRetirado !== null
                                    ? `$${t.valorRetirado}`
                                    : "-"}
                                </td>
                                <td>
                                  {new Date(t.fechaRegistro).toLocaleString()}
                                </td>
                                <td>
                                  {new Date(
                                    t.fechaModificacion
                                  ).toLocaleString()}
                                </td>
                                <td>
                                  {t.fechaRetiro
                                    ? new Date(t.fechaRetiro).toLocaleString()
                                    : "-"}
                                </td>
                                <td>{t.id_transaccion}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-4">
        <small className="text-muted">
          &copy; {new Date().getFullYear()} Proyecto Bancario
        </small>
      </div>
    </div>
  );
}
