const { Schema, model } = require("mongoose");

const companyOrderSchema = Schema({
  idCompany: { type: Schema.Types.ObjectId, ref: 'Company' },
  contact: { type: Schema.Types.ObjectId, ref: 'CompanyAccounts' },
  accountName: {type: String},
  accountPhone: {type: String},
  orderWorkNumber: {type: String},
  date: {type: String},
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

module.exports = model("CompanyOrder", companyOrderSchema);





