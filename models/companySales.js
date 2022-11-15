const { Schema, model } = require("mongoose");

const companySaleSchema = Schema({
  idCompany: { type: Schema.Types.ObjectId, ref: 'Company' },
  contact: { type: Schema.Types.ObjectId, ref: 'Relation'},
  products: { type: Schema.Types.ObjectId, ref: 'companyProduct'},
  date: {type: String},
  paymentMethod: {type: String},
  seller: {type: String},
  observations: {type: String},
  subTotal: {type: String},
  valueIva: {type: String},
  sendValue: {type: String},
  total: {type: String},
},
{
  timestamps: true,
});

companySaleSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("companySales", companySaleSchema);





