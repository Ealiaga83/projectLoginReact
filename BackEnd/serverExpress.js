import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { conectarABaseDeDatos } from "./config/database.js";
import {
  crearUsuario,
  loginUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorEmail,
  obtenerUsuarios,
} from "./controllers/ControladorUsuario.js";
import transaccionRoutes from "./routes/transaccionRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || "1";

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(
  `/api/v${API_VERSION}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

conectarABaseDeDatos();

app.post(`/api/v${API_VERSION}/register`, crearUsuario);
app.post(`/api/v${API_VERSION}/login`, loginUsuario);

app.get(`/api/v${API_VERSION}/usuarios`, obtenerUsuarios);
app.get(`/api/v${API_VERSION}/usuarios/email/:email`, obtenerUsuarioPorEmail);
app.put(`/api/v${API_VERSION}/usuarios/:id`, actualizarUsuario);
app.delete(`/api/v${API_VERSION}/usuarios/:id`, eliminarUsuario);


// Endpoint de transacciones (depositar/retirar saldo)
app.use(`/api/v${API_VERSION}/transacciones`, transaccionRoutes);

app.get("/", (req, res) => {
  res.send("API de gestión de usuarios activa");
});

app.listen(PORT, () => {
  console.log(
    `Servidor ejecutando en puerto ${PORT} en su versión ${API_VERSION}`
  );
});
