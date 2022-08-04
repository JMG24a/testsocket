const { Schema, model } = require("mongoose");

const relationSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  specification: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  fechaCreacion: {
    type: Date,
  },
});

relationSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Relation", relationSchema);