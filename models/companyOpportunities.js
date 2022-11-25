const { Schema, model } = require("mongoose");

const companyOpportunitySchema = Schema({
  contactId: [{ type: Schema.Types.ObjectId, ref: 'CompanyAccounts' }],
  dealName: { type: String },
  dealValue: { type: String },
  closeProbability: { type: String },
  expiredCloseDate: { type: String },
  dealCreateDate: { type: String },
  notes: { type: String },
  stage: { type: String },
  priority: { type: String },
  forecastValue: { type: String },
  actualDealValue: { type: String },
  dealLength: { type: String },
},
{
  timestamps: true,
});

companyOpportunitySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("CompanyOpportunity", companyOpportunitySchema);
