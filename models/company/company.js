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
      country: { type: String }
    },
    ivaValue: [{
      value: { type: String, unique: true, required: true },
      checked: { type: Boolean, default: false }
    }],
    paymentMethod: [{
      value: { type: String, unique: true, required: true },
      checked: { type: Boolean, default: false }
    }],
    deliveryTime: [{
      value: { type: String, unique: true, required: true },
      checked: { type: Boolean, default: false }
    }],
    sellers: [{
      value: { type: String, unique: true ,required: true},
      checked: { type: Boolean, default: false }
    }],
    corporativeColors: {
      primary: { type: String },
      secondary: { type: String },
    },
    templates: {
      quotation: { type: String },
      invoice: { type: String },
    },
    settings:{
      orderWorksNumber :{type: String, default: "0"},
      purchasesNumber  :{type: String, default: "0"},
      quotationsNumber:{type: String, default: "0"},
      salesNumber     :{type: String, default: "0"},
    },
    observations: {type: String}
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
