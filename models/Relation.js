const { Schema, model } = require("mongoose");

const relationSchema = Schema({
  name: { type: String, required: true },
  firstLastName: { type: String, required: false },
  email: { type: String, required: false },
  secondLastName: { type: String, required: false },
  taxId: { type: String },
  phone: { type: String },
  mobile: { type: String },
  address: {type: String},
  city: {type: String},
  department: {type: String},
  country: {type: String},
  tag: {type: String, default: "Cliente" },
  userId:[{ type: Schema.Types.ObjectId, ref: 'User' }],
},
{
  timestamps: true,
});

relationSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Relation", relationSchema);
