const { Schema, model } = require("mongoose");

const companySchema = Schema({
  logo: { type: String },
  name: { type: String },
  nit: { type: String },
  address: { type: String },
  city: { type: String },
  department: { type: String },
  webPage: { type: String },
  email: { type: String },
  facebookUrl: { type: String },
  linkedinUrl: { type: String },
  userId: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  employeesId:[{ type: Schema.Types.ObjectId, ref: 'User' }],
},
{
  timestamps: true,
});

companySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Company", companySchema);
















