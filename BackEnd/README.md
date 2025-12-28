# Backend - Proyecto Banco ISTLC

Este backend implementa la lógica y API REST para un sistema bancario con autenticación, registro de usuarios, operaciones de cajero (depósito, retiro), transferencias y consulta de historial.

## Tecnologías principales
- Node.js
- Express
- MongoDB (Mongoose)
- bcrypt (hash de contraseñas)
- node-fetch (peticiones internas)

## Endpoints principales

### Autenticación y usuarios
- `POST /api/v1/login` — Login de usuario (requiere email y password)
- `POST /api/v1/register` — Registro de nuevo cliente

### Cajero
- `POST /api/v1/transacciones/cajero-deposito` — Depósito por cajero
- `POST /api/v1/transacciones/cajero-retiro` — Retiro por cajero (valida usuario y saldo)

### Transacciones
- `POST /api/v1/transacciones` — Procesa depósito, retiro o transferencia
- `GET /api/v1/transacciones/historial/:id_cliente` — Historial de transacciones
- `GET /api/v1/transacciones/saldo/:id_cliente` — Consulta de saldo

## Instalación y ejecución

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Configura la conexión a MongoDB en `config/database.js`.
3. Inicia el servidor:
   ```bash
   npm run server
   ```

## Notas
- El backend escucha por defecto en el puerto 2025.
- Asegúrate de tener MongoDB corriendo.
- Las contraseñas se almacenan encriptadas.

---

Desarrollado por ISTLC. Para dudas o soporte, contacta al equipo técnico.
