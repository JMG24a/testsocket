const { Schema, model } = require("mongoose");

const companyAccountSchema = Schema({
  idCompany: { type: Schema.Types.ObjectId, ref: 'Company' },
  idUser: { type: Schema.Types.ObjectId, ref: 'User' },
  contactId: [{ type: Schema.Types.ObjectId, ref: 'Relation' }],
  priority: {type: String, enum: ['Vendedor', 'Cliente', 'partner']},
  type: {type: String, enum: ['Vendedor', 'Cliente', 'partner']},
  accountName: {type: String},
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
  state: {type: String},
  nit: {type: String},
  stage: {type: String},
  phone: {type: String},
  mobile: {type: String}
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





