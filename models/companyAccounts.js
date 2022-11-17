const { Schema, model } = require("mongoose");

const companyAccountSchema = Schema({
  idCompany: { type: Schema.Types.ObjectId, ref: 'Company' },
  contactId: { type: Schema.Types.ObjectId, ref: 'Relation' },
  accountName: {type: String},
  type: {type: String, enum: ['Vendedor', 'Cliente', 'partner']},
  priority: {type: String, enum: ['Vendedor', 'Cliente', 'partner']},
  category: {type: String},
  subCategory: {type: String},
  email: {type: String},
  accountValue: {type: String},
  website: {type: String},
  commentaries: {type: String},
  source: {type: String},
  city: {type: String},
  address: {type: String},
  country: {type: String},
  nit: {type: String},
  stage: {type: String}
},
{
  timestamps: true,
});

companyAccountSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("CompanyAccounts", companyAccountSchema);




