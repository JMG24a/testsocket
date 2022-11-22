const { Schema, model } = require("mongoose");

const companyQuotationSchema = Schema({
  idCompany: { type: Schema.Types.ObjectId, ref: 'Company' },
  contact: { type: Schema.Types.ObjectId, ref: 'CompanyAccounts'},
  products: [{
    name: {type: String},
    price: {type: String},
    description: {type: String},
    unity: {type: Number}
  }],
  date: {type: String},
  paymentMethod: {type: String},
  seller: {type: String},
  observations: {type: String},
  subTotal: {type: String},
  valueIva: {type: String},
  shippingValue: {type: String},
  quotationNumber: {type: String},
  total: {type: String},
},
{
  timestamps: true,
});

companyQuotationSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("companyQuotation", companyQuotationSchema);





