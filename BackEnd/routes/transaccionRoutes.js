
import express from "express";
import { procesarTransaccion, consultarSaldo, obtenerHistorialTransacciones, obtenerInfoCompletaCliente, cajeroDeposito, cajeroRetiro } from "../controllers/ControladorTransaccion.js";
import { logger } from "../middlewares/middlewares.js";
const router = express.Router();


// Middleware para logging en cada ruta
router.use((req, res, next) => {
	logger(req.originalUrl);
	next();
});

// POST /api/transacciones/cajero-deposito
router.post("/cajero-deposito", cajeroDeposito);

// POST /api/transacciones/cajero-retiro
router.post("/cajero-retiro", cajeroRetiro);

// GET /api/transacciones/historial/:id_cliente
router.get("/historial/:id_cliente", obtenerHistorialTransacciones);

// GET /api/transacciones/info/:id_cliente
router.get("/info/:id_cliente", obtenerInfoCompletaCliente);

// POST /api/transacciones
router.post("/", procesarTransaccion);

// GET /api/transacciones/saldo/:id_cliente
router.get("/saldo/:id_cliente", consultarSaldo);

export default router;
