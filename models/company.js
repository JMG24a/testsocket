const { Schema, model } = require('mongoose');

const companySchema = Schema(
  {
    name: { type: String },
    email: { type: String },
    nit: { type: String },
    logo: { type: String },
    mobile: { type: String },
    userId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    employeesId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    employees: [{
      idEmployeeRef: { type: Schema.Types.ObjectId, ref: 'User' },
      status: { type: Boolean, default: false },
    }],
    socialNetworks: {
      webPage: { type: String },
      facebookUrl: { type: String },
      linkedinUrl: { type: String },
      instagramUrl: { type: String },
      twitterUrl: { type: String },
    },
    location: {
      address: { type: String },
      city: { type: String },
      department: { type: String },
    },
    paymentMethod: [
      '100% anticipado',
      '50% anticipao y 50% contraentrega',
      'Credito 15 dias',
      'Credito 30 dias',
    ],
    corporativeColors: {
      primary: { type: String },
      secondary: { type: String },
    },
    templates: {
      quotation: { type: String },
      invoice: { type: String },
    },
    settings: [{
      orderWorkNumber :{type: String},
      purchaseNumber  :{type: String},
      quotationsNumber:{type: String},
      SalesNumber     :{type: String},
    }]
  },
  {
    timestamps: true,
  }
);

companySchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model('Company', companySchema);
