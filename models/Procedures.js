const { Schema, model } = require("mongoose");

const propertySchema = Schema({
  title: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  compete: {
    type: Boolean,
    required: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  form: {
    type: Schema.ObjectId,
    ref: 'Form',
    required: true,
  },
  fechaCreacion: {
    type: Date,
  },
});

propertySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Procedures", propertySchema);
