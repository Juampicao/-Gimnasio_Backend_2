import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/funciones.js";
import generarJWT from "../helpers/generarJWT.js";
import Ejercicio from "../models/Ejercicio.js";
import Suscriptor from "../models/Suscriptor.js";
import TipoSuscripcion from "../models/TipoSuscripcion.js";

const registrar = async (req, res) => {
  // Evitar registros Duplicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    const error = new Error(`Usuario Ya Registrado`);
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body); // 1 Creo un usuario.
    usuario.token = generarId();
    const usuarioAlmacenado = await usuario.save(); // 2 Aca alamcena en la base de datos.
    res.json({
      msg: "Usuario Creado Correctamente, Revisa tu email para crear tu cuenta.",
    });
  } catch (error) {
    console.log(error);
  }
  // res.json({ msg: "Creando Usuario.." });
};

// AUTENTICANDO
const autenticar = async (req, res) => {
  const { email, password } = req.body;

  // Comprobar si el usuario EXISTE
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar si el usuario CONFIMADO
  if (!usuario.confirmado) {
    const error = new Error("El usuario no ha sido confirmado");
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar PASSWORD
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
    console.log(
      ` Entrando desde...  : ${usuario.nombre} - ${usuario.email} - ${usuario.token}`
    );
  } else {
    const error = new Error("El password es incorrecto");
    console.log("El password es Incorrecto");

    return res.status(403).json({ msg: error.message });
  }
};

// Confirmar usuario mediante token. Una vez confirmado, se borra.
const confirmar = async (req, res) => {
  console.log(req.params); // Obtiene el token dinamico.
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(403).json({ msg: error.message });
  }
  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario Confirmado Correctamente" });
    console.log(usuarioConfirmar);
  } catch (error) {}
};

// Olvidar Contreña
const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();
    res.json({ msg: "Hemos enviado un email con las instrucciones" });
    console.log(usuario);
  } catch (error) {
    console.log(error);
  }
};

// Validar Token
const validarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });

  if (tokenValido) {
    res.json({ msg: "Token válido y el Usuario Existe." });
  } else {
    const error = new Error("Token no válido.");
    return res.status(404).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });

  if (usuario) {
    usuario.password = password;
    usuario.token = ``;
    try {
      await usuario.save();
      res.json({ msg: "Password Modificada correctamente." });
    } catch (error) {}
  } else {
    const error = new Error("Token no válido.");
    return res.status(404).json({ msg: error.message });
  }
};

const perfil = async (req, res) => {
  const { usuario } = req;
  console.log(`Desde usuario, El nombre es: ${usuario.nombre}`);
  res.json(usuario);
};

const postTiposSuscripcion = async (req, res) => {
  // const { usuario } = req;
  // const { nombre, valor, uid } = req.body.objeto;   // Frontend
  // const { nombre, valor, uid } = req.body; // Postman

  // const tiposSuscripcion = new TipoSuscripcion(req.body);

  // tiposSuscripcion.creador = req.usuario;
  // tiposSuscripcion.nombre = nombre;
  // tiposSuscripcion.valor = valor;

  // try {
  //   const tiposSuscripcionGuardada = await tiposSuscripcion.save();
  //   res.json({ tiposSuscripcionGuardada });
  //   console.log(tiposSuscripcionGuardada);
  // } catch (error) {
  //   console.log(error);
  // }

  // 1°  Crear en TipoSuscripcion.js
  const { usuario } = req;
  const { nombre, valor } = req.body.objeto; // Postman

  const nuevaSuscripcion = new TipoSuscripcion(req.body.objeto);

  nuevaSuscripcion.creador = usuario._id; //Desde el front
  nuevaSuscripcion.nombre = nombre;
  nuevaSuscripcion.valor = valor;

  try {
    // 2° Agregarlo al Usuario.js
    const nuevaSuscripcionGuardada = await nuevaSuscripcion.save();
    const buscarUsuario = await Usuario.findById(usuario._id);
    await buscarUsuario.tiposSuscripcion.push(nuevaSuscripcionGuardada._id);
    await buscarUsuario.save();
    await res.json({ nuevaSuscripcionGuardada });
    await console.log(nuevaSuscripcionGuardada._id);
  } catch (error) {
    console.log(error);
  }
};

const obtenerTiposSuscripcion = async (req, res) => {
  const { usuario } = req;
  const suscripciones = await Usuario.findById(usuario)
    .populate({
      path: "tiposSuscripcion._id",
      model: "TipoSuscripcion",
    })
    .where("creador")
    .equals(usuario);

  const { tiposSuscripcion: array } = suscripciones;

  let tiposSuscripcion = [];
  for (let i = 0; i < array.length; i++) {
    let result = array[i]._id;
    tiposSuscripcion.push(result);
    console.log(result);
  }
  try {
    res.json(tiposSuscripcion);
    console.log(tiposSuscripcion);
  } catch (error) {
    console.log(error);
  }
};

const editarTiposSuscripcion = async (req, res) => {
  const { nombre, valor, id } = req.body.objeto;
  console.log(nombre, valor, id);
  try {
    const id = req.body.objeto.id;
    const updates = req.body.objeto;
    const options = { new: true };

    const result = await TipoSuscripcion.findByIdAndUpdate(
      id,
      updates,
      options
    );
    res.send(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const eliminarTiposSuscripcion = async (req, res) => {
  const { usuario } = req;
  const { suscripcionAEliminarId, nuevaSuscripcionId } = req.query;

  console.log(
    "Nueva es: " + suscripcionAEliminarId + "Vieja es: " + nuevaSuscripcionId
  );

  // 1° Eliminar de TipoSuscripcion
  const tipoSuscripcion = await TipoSuscripcion.findByIdAndDelete(
    suscripcionAEliminarId
  );

  //  2° Eliminar todo lo que aparezca la ref USUARIO.
  const eliminarSuscripcion = await Usuario.updateMany(
    { _id: usuario },
    {
      $pull: {
        tiposSuscripcion: {
          _id: suscripcionAEliminarId,
        },
      },
    }
  );

  // 3° Cambiar Vieja por Nueva Suscriptor
  const CambiarViejaPorNueva = await Suscriptor.updateMany(
    {
      $and: [{ creador: usuario }, { tipoSuscripcion: suscripcionAEliminarId }],
    },
    { $set: { tipoSuscripcion: nuevaSuscripcionId } }
  );

  let respuesta = `Suscripcion Eliminada: ${tipoSuscripcion.nombre}\n eliminar red de usuario ${eliminarSuscripcion}\n Modificar suscripcion eliminada por nueva ${CambiarViejaPorNueva} `;

  try {
    res.json(respuesta);
    console.log(respuesta);
  } catch (error) {
    console.log(error);
  }
};

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  validarToken,
  nuevoPassword,
  perfil,
  postTiposSuscripcion,
  obtenerTiposSuscripcion,
  editarTiposSuscripcion,
  eliminarTiposSuscripcion,
};
