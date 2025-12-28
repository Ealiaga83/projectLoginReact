import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['usuario', 'admin'], default: 'usuario' },
  // saldo eliminado, solo se gestiona en transacciones
  cedula: { type: String, required: true, unique: true },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, {
  timestamps: true
});

export default mongoose.model('Usuario', UsuarioSchema);