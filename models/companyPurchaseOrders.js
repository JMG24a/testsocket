const { Schema, model } = require("mongoose");

const companyOrderSchema = Schema({
  idCompany: { type: Schema.Types.ObjectId, ref: 'Company' },
  contact: { type: Schema.Types.ObjectId, ref: 'CompanyAccounts' },
  products: [{
    name: {type: String},
    price: {type: Number},
    description: {type: String},
    unity: {type: Number}
  }],
  orderNumber: {type: Number},
  accountPhone: {type: String},
  accountName: {type: String},
  status: { type: String },
  importation: { type: String },
  shippingDate: { type: String },
  DateOfReceipt: { type: String },
  observations: { type: String },
  valueIva: {type: String},
  subTotal: {type: String},
  total: {type: String},
  payment: {type: String},
  discount: {type: String},
  paymentMethod: {type: String},
  paymentConditions: {type: String},
  deliveryDate: {type: String},
  deliveryAddress: {type: String},
  guarantee: {type: String},
  policy: {type: String},
  invoiceMail: {type: String},
  authorizationBy: {type: String},
},
{
  timestamps: true,
});

companyOrderSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("companyPurchaseOrders", companyOrderSchema);
