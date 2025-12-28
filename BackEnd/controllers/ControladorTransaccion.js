import Transaccion from "../models/Transaccion.js";
import Usuario from "../models/Usuarios.js";
import bcrypt from "bcrypt";

// POST /transaccion
// Body: { id_cliente, monto, tipo, cedula_destino } // tipo: 'depositar', 'retirar' o 'transferir'
export const procesarTransaccion = async (req, res) => {
  try {
    console.log("Body recibido:", req.body);
    const { id_cliente, monto, tipo, cedula_destino } = req.body;
    if (
      !id_cliente ||
      !monto ||
      !["depositar", "retirar", "transferir"].includes(tipo)
    ) {
      console.log("Datos insuficientes o tipo inválido");
      return res
        .status(400)
        .json({ message: "Datos insuficientes o tipo inválido" });
    }

    // Buscar usuario
    const usuario = await Usuario.findById(id_cliente);
    console.log("Usuario encontrado:", usuario);
    if (!usuario) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (usuario.estado && usuario.estado === "inactivo") {
      return res.status(403).json({ message: "cuenta inactiva" });
    }

    // Calcular saldo actual sumando transacciones
    const transacciones = await Transaccion.find({ id_cliente });
    let saldoAnterior = 0;
    for (const t of transacciones) {
      // Si no hay tipo en la transacción, asumimos que saldoDisponible - saldoAnterior indica el movimiento
      if (t.saldoDisponible !== undefined && t.saldoAnterior !== undefined) {
        saldoAnterior = t.saldoDisponible;
      }
    }
    let saldoDisponible = saldoAnterior;
    console.log("Saldo anterior calculado:", saldoAnterior);

    if (tipo === "depositar") {
      saldoDisponible += monto;
      console.log("Depositando. Nuevo saldo:", saldoDisponible);
    } else if (tipo === "retirar") {
      if (monto > saldoAnterior) {
        console.log("Saldo insuficiente para retirar");
        return res.status(400).json({ message: "Saldo insuficiente" });
      }
      saldoDisponible -= monto;
      console.log("Retirando. Nuevo saldo:", saldoDisponible);
    } else if (tipo === "transferir") {
      // Validar cedula_destino
      if (!cedula_destino) {
        return res.status(400).json({ message: "Falta la cédula de destino" });
      }
      if (monto > saldoAnterior) {
        return res
          .status(400)
          .json({ message: "Saldo insuficiente para transferir" });
      }
      // Buscar usuario destino
      const usuarioDestino = await Usuario.findOne({
        cedula: cedula_destino,
        estado: "activo",
      });
      if (!usuarioDestino) {
        return res
          .status(404)
          .json({ message: "Usuario destino no encontrado o inactivo" });
      }
      // Restar saldo al origen
      saldoDisponible -= monto;
      // Registrar transacción de salida
      let transaccionSalida = new Transaccion({
        id_cliente,
        saldoDisponible,
        saldoAnterior,
        valorRetirado: monto,
        fechaRegistro: new Date(),
        fechaModificacion: new Date(),
        fechaRetiro: new Date(),
      });
      await transaccionSalida.save();
      // Calcular saldo destino
      const transaccionesDestino = await Transaccion.find({
        id_cliente: usuarioDestino._id,
      });
      let saldoAnteriorDestino = 0;
      for (const t of transaccionesDestino) {
        if (t.saldoDisponible !== undefined && t.saldoAnterior !== undefined) {
          saldoAnteriorDestino = t.saldoDisponible;
        }
      }
      let saldoDisponibleDestino = saldoAnteriorDestino + monto;
      // Registrar transacción de entrada
      let transaccionEntrada = new Transaccion({
        id_cliente: usuarioDestino._id,
        saldoDisponible: saldoDisponibleDestino,
        saldoAnterior: saldoAnteriorDestino,
        fechaRegistro: new Date(),
        fechaModificacion: new Date(),
      });
      await transaccionEntrada.save();
      return res.status(200).json({
        message: `Transferencia realizada a ${usuarioDestino.nombre} ${usuarioDestino.apellido}`,
        saldoAnterior,
        saldoDisponible,
        transaccionSalida,
        destino: {
          usuario: usuarioDestino,
          saldoAnterior: saldoAnteriorDestino,
          saldoDisponible: saldoDisponibleDestino,
          transaccionEntrada,
        },
      });
    }

    // Registrar transacción
    let transaccionData = {
      id_cliente,
      saldoDisponible,
      saldoAnterior,
      fechaRegistro: new Date(),
      fechaModificacion: new Date(),
    };
    if (tipo === "retirar") {
      transaccionData.valorRetirado = monto;
      transaccionData.fechaRetiro = new Date();
    }
    const transaccion = new Transaccion(transaccionData);
    await transaccion.save();
    console.log("Transacción guardada:", transaccion);

    res.status(200).json({
      message: `Transacción realizada: ${tipo}`,
      saldoAnterior,
      saldoDisponible,
      transaccion,
    });
  } catch (error) {
    console.error("Error en la transacción:", error);
    res
      .status(500)
      .json({ message: "Error en la transacción", error: error.message });
  }
};

// GET /api/v1/transacciones/info/:id_cliente
export const obtenerInfoCompletaCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    if (!id_cliente) {
      return res.status(400).json({ message: "Falta el id_cliente" });
    }
    const usuario = await Usuario.findById(id_cliente);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const transacciones = await Transaccion.find({ id_cliente }).sort({
      fechaRegistro: -1,
    });
    res.status(200).json({ usuario, transacciones });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener información del cliente",
        error: error.message,
      });
  }
};

// GET /api/v1/transacciones/saldo/:id_cliente
export const consultarSaldo = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    if (!id_cliente) {
      return res.status(400).json({ message: "Falta el id_cliente" });
    }
    const usuario = await Usuario.findById(id_cliente);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Buscar la última transacción del usuario
    const ultimaTransaccion = await Transaccion.findOne({
      id_cliente: usuario._id,
    }).sort({ fechaRegistro: -1 });
    let saldoDisponible = 0;
    let saldoAnterior = 0;
    if (ultimaTransaccion) {
      saldoDisponible = ultimaTransaccion.saldoDisponible || 0;
      saldoAnterior = ultimaTransaccion.saldoAnterior || 0;
    }
    res.status(200).json({
      id_cliente: usuario._id,
      saldoDisponible,
      saldoAnterior,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al consultar saldo", error: error.message });
  }
};

export const cajeroDeposito = async (req, res) => {
  try {
    const { cedula, monto } = req.body;
    if (!cedula || !monto || isNaN(monto) || Number(monto) <= 0) {
      return res
        .status(400)
        .json({ message: "Datos insuficientes o monto inválido" });
    }
    const usuario = await Usuario.findOne({ cedula, estado: "activo" });
    if (!usuario) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado o inactivo" });
    }
    const transacciones = await Transaccion.find({ id_cliente: usuario._id });
    let saldoAnterior = 0;
    for (const t of transacciones) {
      if (t.saldoDisponible !== undefined && t.saldoAnterior !== undefined) {
        saldoAnterior = t.saldoDisponible;
      }
    }
    let saldoDisponible = saldoAnterior + Number(monto);
    const transaccion = new Transaccion({
      id_cliente: usuario._id,
      saldoDisponible,
      saldoAnterior,
      valorDepositado: Number(monto),
      fechaRegistro: new Date(),
      fechaModificacion: new Date(),
    });
    await transaccion.save();
    res.status(200).json({
      message: `Depósito realizado a ${usuario.nombre} ${usuario.apellido}`,
      saldoAnterior,
      saldoDisponible,
      transaccion,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al realizar depósito", error: error.message });
  }
};


export const cajeroRetiro = async (req, res) => {
  try {
    const { correo, clave, monto } = req.body;
    if (!correo || !clave || !monto || isNaN(monto) || Number(monto) <= 0) {
      return res.status(400).json({ message: "Datos insuficientes o monto inválido" });
    }

    // Validar usuario y clave usando el endpoint de login
    const loginResp = await fetch("http://localhost:2025/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: correo, password: clave })
    });
    const loginData = await loginResp.json();
    if (!loginData.ok) {
      return res.status(401).json({ message: loginData.message || "Clave incorrecta" });
    }
    const id_cliente = loginData.id;

    // Realizar el retiro usando el endpoint de transacciones
    const retiroResp = await fetch("http://localhost:2025/api/v1/transacciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cliente, monto: Number(monto), tipo: "retirar" })
    });
    const retiroData = await retiroResp.json();
    if (!retiroResp.ok) {
      return res.status(retiroResp.status).json(retiroData);
    }
    return res.status(200).json(retiroData);
  } catch (error) {
    res.status(500).json({ message: "Error al realizar retiro", error: error.message });
  }
};

export const obtenerHistorialTransacciones = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    if (!id_cliente) {
      return res.status(400).json({ message: "Falta el id_cliente" });
    }
    const transacciones = await Transaccion.find({ id_cliente }).sort({ fechaRegistro: -1 });
    res.status(200).json(transacciones);
  } catch (error) {
    res.status(500).json({ message: "Error al consultar historial", error: error.message });
  }
};
