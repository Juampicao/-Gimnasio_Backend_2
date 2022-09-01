import Ejercicio from "../models/Ejercicio.js";

const CreateEjercicio = async (req, res) => {
  const ejercicio = new Ejercicio(req.body);

  const { nombreEjercicio, explicacion } = req.body;
  ejercicio.creador = req.usuario;
  ejercicio.nombre = nombreEjercicio;
  ejercicio.explicacion = explicacion;

  try {
    const ejericicoGuardado = await ejercicio.save();
    res.json({ ejercicio });
    console.log(ejercicio);
  } catch (error) {
    console.log(error);
  }
};
const GetEjercicioID = async (req, res) => {
  const ejercicios = await Ejercicio.find()
    .where("creador")
    .equals(req.usuario);

  try {
    res.json({ ejercicios });
    console.log(ejercicios);
  } catch (error) {
    console.log(error);
  }
};
const GetEjerciciosAll = async (req, res) => {};
const EditarEjercicio = async (req, res) => {};
const EliminarEjercicio = async (req, res) => {};

export { CreateEjercicio, GetEjercicioID };
