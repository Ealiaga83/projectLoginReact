import mongoose from 'mongoose';

const transaccionSchema = new mongoose.Schema({
  id_transaccion: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    index: true,
    unique: true
  },
  id_cliente: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Usuario'
  },
  saldoDisponible: {
    type: Number,
    required: true
  },
  saldoAnterior: {
    type: Number,
    required: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  fechaModificacion: {
    type: Date,
    default: Date.now
  },
  valorRetirado: {
    type: Number,
    default: null
  },
  fechaRetiro: {
    type: Date,
    default: null
  }
});

export default mongoose.model('Transaccion', transaccionSchema);