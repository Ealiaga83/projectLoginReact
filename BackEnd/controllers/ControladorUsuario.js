import Usuario from "../models/Usuarios.js";
import bcrypt from "bcrypt";

export const crearUsuario = async (req, res) => {
  const { nombre, apellido, email, password, cedula } = req.body;
  try {
    // Buscar por email o cedula
    const existe = await Usuario.findOne({ $or: [ { email }, { cedula } ] });
    if (existe) {
      if (existe.estado === 'inactivo') {
        return res.status(400).json({ message: "Usuario registrado, acérquese al banco" });
      } else {
        return res.status(400).json({ message: "El usuario ya existe" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      cedula,
      estado: 'activo'
    });

    await nuevoUsuario.save();
    const { password: pass, ...usuarioSinPassword } = nuevoUsuario.toObject();
    res.status(201).json({ message: "Usuario creado", usuario: usuarioSinPassword });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear usuario", error: error.message });
  }
};

/*export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });
    if (usuario.password !== password)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    res.status(200).json({ message: "Login exitoso", usuario });
  } catch (error) {
    res.status(500).json({ message: "Error en login", error: error.message });
  }
};*/

export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario)
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida)
      return res.status(401).json({ ok: false, message: "Contraseña incorrecta" });

    res.status(200).json({ ok: true, id: usuario._id, email: usuario.email });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error en login", error: error.message });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ estado: 'activo' });
    res.status(200).json(usuarios);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener usuarios", error: error.message });
  }
};

/*export const actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!usuarioActualizado)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res
      .status(200)
      .json({ message: "Usuario actualizado", usuario: usuarioActualizado });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar usuario", error: error.message });
  }
};*/

export const actualizarUsuario = async (req, res) => {
  try {
    const datosActualizados = { ...req.body };

    //elimina campos vacios enviado
    Object.keys(datosActualizados).forEach((key) => {
      if (
        datosActualizados[key] === "" ||
        datosActualizados[key] === null ||
        datosActualizados[key] === undefined
      ) {
        delete datosActualizados[key];
      }
    });

    //si aactualiza la clave lo cifra
    if (datosActualizados.password) {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.password = await bcrypt.hash(
        datosActualizados.password,
        salt
      );
    }
    // en esta parte solo actualiz los campos validos
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { $set: datosActualizados },
      { new: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Usuario actualizado",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const usuarioDeshabilitado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { $set: { estado: 'inactivo' } },
      { new: true }
    );
    if (!usuarioDeshabilitado)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario deshabilitado", usuario: usuarioDeshabilitado });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al deshabilitar usuario", error: error.message });
  }
};

export const obtenerUsuarioPorEmail = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ email: req.params.email, estado: 'activo' });
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });
    // Excluir password y __v
    const { password, __v, ...usuarioSeguro } = usuario.toObject();
    res.status(200).json(usuarioSeguro);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener usuario por email",
      error: error.message,
    });
  }
};
