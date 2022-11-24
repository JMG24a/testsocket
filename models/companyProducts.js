const { Schema, model } = require("mongoose");

const companyProductSchema = Schema({
  idCompany: { type: Schema.Types.ObjectId, ref: 'Company' },
  name: {type: String},
  description: {type: String},
  price: {type: String},
  image: {type: String}
},
{
  timestamps: true,
});

companyProductSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("CompanyProduct", companyProductSchema);





