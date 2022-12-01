const { Schema, model } = require("mongoose");

const companySaleSchema = Schema({
  idCompany: { type: Schema.Types.ObjectId, ref: 'Company' },
  contact: { type: Schema.Types.ObjectId, ref: 'CompanyAccounts'},
  products: [{
    name: {type: String},
    price: {type: String},
    description: {type: String},
    unity: {type: Number}
  }],
  saleNumber: {type: String},
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

module.exports = model("CompanySales", companySaleSchema);





