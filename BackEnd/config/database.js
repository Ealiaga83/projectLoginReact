import mongoose from "mongoose";

export const conectarABaseDeDatos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔥 Conexión a MongoDB con éxito!");
  } catch (error) {
    console.error("⛔️ Error de conexión a MongoDB: ", error.message);
  }
};
