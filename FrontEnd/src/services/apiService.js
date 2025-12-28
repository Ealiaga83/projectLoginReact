// OBTENER TRANSACCIONES INFO (historial extendido)
export async function getTransaccionesInfo(id_cliente) {
  const res = await fetch(`${API_URL}/transacciones/info/${id_cliente}`);
  return res.json();
}
// src/services/apiService.js

const API_URL = import.meta.env.VITE_API_URL;

// LOGIN
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

// REGISTRO
export async function registerCliente(form) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
  });
  return res.json();
}

// DEPOSITO CAJERO
export async function cajeroDeposito(cedula, monto) {
  const res = await fetch(`${API_URL}/transacciones/cajero-deposito`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cedula, monto: Number(monto) })
  });
  return res.json();
}

// RETIRO CAJERO (requiere validación previa de login)
export async function cajeroRetiro(correo, clave, monto) {
  // Llama directamente al endpoint de cajero-retiro con los campos correctos
  const retiroRes = await fetch(`${API_URL}/transacciones/cajero-retiro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, clave, monto: Number(monto) })
  });
  return retiroRes.json();
}

// TRANSFERENCIA
export async function transferir(id_cliente, monto, cedula_destino) {
  const res = await fetch(`${API_URL}/transacciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_cliente,
      monto: Number(monto),
      tipo: "transferir",
      cedula_destino
    })
  });
  return res.json();
}

// OBTENER DATOS DE USUARIO POR EMAIL
export async function getUsuarioByEmail(email) {
  const res = await fetch(`${API_URL}/usuarios/email/${email}`);
  return res.json();
}

// OBTENER SALDO
export async function getSaldo(id_cliente) {
  const res = await fetch(`${API_URL}/transacciones/saldo/${id_cliente}`);
  return res.json();
}

// OBTENER TRANSACCIONES
export async function getTransacciones(id_cliente) {
  const res = await fetch(`${API_URL}/transacciones/${id_cliente}`);
  return res.json();
}
