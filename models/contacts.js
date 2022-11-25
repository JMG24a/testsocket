const { Schema, model } = require("mongoose");

const contactsSchema = Schema({
  userId:[{ type: Schema.Types.ObjectId, ref: 'User' }],
  companyId:[{ type: Schema.Types.ObjectId, ref: 'Company' }],
  accountId: { type: Schema.Types.ObjectId, ref: 'CompanyAccounts' },
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
  priority :{type: String},
  type :{type: String},
  title	: {type: String},
  observations: {type: String},
  source: {type: String},
},
{
  timestamps: true,
});

contactsSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("contacts", contactsSchema);
