import Suscriptor from "../models/Suscriptor.js";
import Pagos from "../models/Pagos.js";

let hoy = new Date();

const pagarSuscripcion = async (req, res) => {
  const pago = new Pagos(req.body);

  pago.creador = req.usuario._id;
  pago.suscriptorPagador = req.body.suscriptorPagador;

  const suscriptor = await Suscriptor.findById(pago.suscriptorPagador);

  pago.suscriptorPagadorNombre = suscriptor.nombre;

  console.log(req.body.metodoPago);
  // 1° Pago Suscripcion
  const montoPagoSuscripcion = req.body.montoPagoSuscripcion;
  const fechaPagoSuscripcion = new Date(req.body.fechaPagoSuscripcion);
  // const fechaPagoSuscripcion = req.body.fechaPagoSuscripcion;
  const notasPagoSuscripcion = req.body.notas;
  const metodoPago = req.body.metodoPago;

  // // 2° Nueva Fecha Vencimiento
  const nuevaFechaVencimientoSuscripcion = new Date(
    req.body.nuevaFechaVencimientoSuscripcion
  );

  suscriptor.fechas.fechaVencimientoSuscripcion =
    nuevaFechaVencimientoSuscripcion;

  // pago.pagoUnico = req.body.pagoUnico; // Guardar cualquier contenido.
  pago.pagoUnico = {
    montoPagoSuscripcion,
    fechaPagoSuscripcion,
    notasPagoSuscripcion,
    metodoPago,
  };

  if (suscriptor.fechas.fechaVencimientoSuscripcion < hoy) {
    suscriptor.estado = "Deudor";
    console.log("Cambio a Deudor");
  } else if (suscriptor.fechas.fechaVencimientoSuscripcion >= hoy) {
    suscriptor.estado = "Activo";
    console.log("Cambio a Activo");
  }

  try {
    const nuevoPagoGuardado = await pago.save();
    const nuevaFechaVencimientoGuardada = await suscriptor.save();
    suscriptor.pagos = suscriptor.pagos.concat(nuevoPagoGuardado._id);
    await suscriptor.save();

    res.json(pago);
    console.log(`Nuevo pago $ ${montoPagoSuscripcion}`);
  } catch (error) {
    console.log(error);
  }
};

const EditarPagoSuscripcion = async (req, res) => {
  // 1° Editar el contenido de la nota
  const { id } = req.params;
  const { montoPagoSuscripcion, fechaPagoSuscripcion, notas, metodoPago } =
    req.body;

  const pago = await Pagos.findById(id);

  // // 1° Verificar si es el creador de este pago
  if (!pago) {
    const error = new Error("Ningun pago se ha encontrado");
    console.log(error);
    return res.status(404).json({ msg: error.message });
  }

  if (pago.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permiso para editar a este pago");
    console.log(error);
    return res.status(401).json({ msg: error.message });
  }
  // // 2° Editar y guardar.
  // try {
  //   const result = await Pagos.findByIdAndUpdate(
  //     { _id: id },
  //     {
  //       montoPagoSuscripcion: montoPagoSuscripcion,
  //       fechaPagoSuscripcion: fechaPagoSuscripcion,
  //       notas: notas,
  //       metodoPago: metodoPago,
  //     }
  //   );
  //   const resultEditado = await result.save();
  //   console.log(resultEditado);
  //   res.json(resultEditado);
  // } catch (error) {
  //   console.log(error);
  // }
  // console.log(result);

  pago.pagoUnico.montoPagoSuscripcion = montoPagoSuscripcion;
  pago.pagoUnico.fechaPagoSuscripcion = fechaPagoSuscripcion;
  pago.pagoUnico.notas = notas;
  pago.pagoUnico.metodoPago = metodoPago;

  try {
    const pagoEditado = await pago.save();
    console.log(pagoEditado);
    res.json(pagoEditado);
  } catch (error) {
    console.log(error);
  }
};

const DeletePagoSuscripcion = async (req, res) => {
  const { id } = req.params;
  const pago = await Pagos.findById(id).where("creador").equals(req.usuario);
  const suscriptor = await Suscriptor.findById(pago.suscriptorPagador);

  if (!pago) {
    const error = new Error("Ningun pago se ha encontrado");
    console.log(error);
    return res.status(404).json({ msg: error.message });
  }

  if (pago.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permiso para eliminarr a este pago");
    console.log(error);
    return res.status(401).json({ msg: error.message });
  }

  //  Eliminar desde el suscriptor.
  const eliminarElemento = suscriptor.pagos.indexOf(pago._id);
  if (eliminarElemento > -1) {
    let elementoEliminado = suscriptor.pagos.splice(eliminarElemento, 1);
    console.log("Elemento Eliminado:" + elementoEliminado);
    let newArr = suscriptor.pagos;
    const guardarNuevoArr = await Suscriptor.updateOne(
      { _id: suscriptor },
      { $set: { pagos: newArr } }
    );
    console.log(`El nuevo arr de pagos es: ${newArr}`);
  }

  try {
    const pagoEliminado = await Pagos.deleteOne({ _id: pago._id });
    res.json({
      msg: `El pago id: ${pago._id}, monto:  ${pago.pagoUnico.montoPagoSuscripcion} fecha: ${pago.pagoUnico.fechaPagoSuscripcion}  fue eliminado`,
      // msg: `El pago: ${pago.pagoUnico.fechaPagoSuscripcion}, del suscriptor: ${pago.suscriptorPagador} por $ ${pago.pagoUnico.montoPagoSuscripcion} Eliminado`,
    });
    console.log(
      `El pago id: ${pago._id}, monto:  ${pago.pagoUnico.montoPagoSuscripcion} fecha: ${pago.pagoUnico.fechaPagoSuscripcion}  fue eliminado`
    );
    // ${pago.pagoUnico.fechaPagoSuscripcion}, del suscriptor: ${pago.suscriptorPagador} por $ ${pago.pagoUnico.montoPagoSuscripcion} Eliminado`
    // );
    res.json({ msg: pagoEliminado });
    console.log(pagoEliminado);
  } catch (error) {
    console.log(error);
  }
};

const GetPagoSuscripcionId = async (req, res) => {
  const { id } = req.params;
  const pago = await Pagos.findById(id).where("creador").equals(req.usuario);

  console.log(pago);
  if (!pago) {
    const error = new Error("Ningun pago se ha encontrado");
    console.log(error);
    res.json("Problema de existencia");
    return res.status(404).json({ msg: error.message });
  }

  if (pago.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permiso para ver a este pago");
    console.log(error);
    return res.status(401).json({ msg: error.message });
  }

  try {
    res.json(pago);
  } catch (error) {
    console.log(error);
  }
};

const GetPagosSuscripcionAllBySuscriptor = async (req, res) => {
  const pagos = await Pagos.find({
    $and: [
      { creador: req.usuario },
      { suscriptorPagador: req.params.suscriptorId },
    ],
  });

  if (!pagos) {
    const error = new Error("Ningun pago se ha encontrado");
    console.log(error);
    return res.status(404).json({ msg: error.message });
  }

  try {
    res.json(pagos);
  } catch (error) {
    console.log(error);
  }
};

const GetPagosSuscripcionAll = async (req, res) => {
  const { id } = req.params;
  let { page = 1, size = 2 } = req.query;

  console.log(page, size);
  try {
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 2;
    }
  } catch (error) {
    console.log(error);
  }

  const limit = Number(size);
  let skip = (page - 1) * size;

  // sortParams = { fechaPagoSuscripcion: "descending" };
  const pagos = await Pagos.find()
    .where("creador")
    .equals(req.usuario)
    .select("pagoUnico suscriptorPagador _id suscriptorPagadorNombre")
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: "descending" });

  console.log("size: " + size + "page: " + page);

  try {
    res.json(pagos);
    // console.log(pagos);
  } catch (error) {
    console.log(error);
  }
};

export {
  pagarSuscripcion,
  EditarPagoSuscripcion,
  DeletePagoSuscripcion,
  GetPagoSuscripcionId,
  GetPagosSuscripcionAllBySuscriptor,
  GetPagosSuscripcionAll,
};
