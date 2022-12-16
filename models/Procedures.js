const { Schema, model } = require("mongoose");

const propertySchema = Schema({
  idUsers       : [{ type: Schema.Types.ObjectId, ref: 'User' }],
  idForm        : { type: Schema.Types.ObjectId, ref: 'Form' },
  title         : { type: String, required: true },
  owner         : { type: String, required: true },
  reminder      : { type: Boolean },
  formCost      : { type: String },
  formValid     : { type: Boolean},
  compete       : { type: Boolean, required: true},
  comments      : { type: String },
  stages        : {},
  expirationDate: { type: Date },
  dueDate       : { type: Date },
  requiredForms : [{
    name    : { type: String },
    fileName: { type: String }
  }]
},
{
  timestamps: true,
}
);

propertySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Procedures", propertySchema);
