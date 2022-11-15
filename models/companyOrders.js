const { Schema, model } = require("mongoose");

const companyOrderSchema = Schema({
  date: {type: String},
  contact: { type: Schema.Types.ObjectId, ref: 'Relation' },
  idCompany: { type: Schema.Types.ObjectId, ref: 'Company' },
  status: { type: String },
  importation: { type: String },
  shippingDate: { type: String },
  DateOfReceipt: { type: String },
  observations: { type: String }
},
{
  timestamps: true,
});

companyOrderSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("companyOrder", companyOrderSchema);





