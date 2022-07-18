const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  fechaCreacion: {
    type: String,
  },
  correo: {
    type: String,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
  nombre: {
    type: String,
  },
  primerApellido: {
    type: String,
  },
  segundoApellido: {
    type: String,
  },
  telefono: {
    type: String,
  },
  celular: {
    type: String,
  },
  imagen: {
    type: String,
  },
  direccion: {
    type: String,
  },
  formulariosDiligenciados: {
    type: String,
  },
  vehiculos: {
    type: String,
  },
  propiedades: {
    type: String,
  },
  personasAdicionales: {
    type: String,
  },
});

UserSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("User", UserSchema);
