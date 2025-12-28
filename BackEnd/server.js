import express from "express";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import transaccionRoutes from "./routes/transaccionRoutes.js";
import { conectarDB } from "./config/database.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

conectarDB();
app.use(express.json());


app.use("/api/v1/transacciones", transaccionRoutes);
app.use("/api/usuarios", usuarioRoutes);

app.get("/", (req, res) => {
  res.send("API de gestión de usuarios activa");
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutando en puerto ${PORT}`);
});
