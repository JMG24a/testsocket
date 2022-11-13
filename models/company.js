const { Schema, model } = require("mongoose");

const companySchema = Schema({
  name: { type: String },
  email: { type: String },
  nit: { type: String },
  logo: { type: String },
  mobile: { type: String },
  userId: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  employeesId:[{ type: Schema.Types.ObjectId, ref: 'User' }],
  socialNetworks:{
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
  paymentMethod: ["100% anticipado", "50% anticipao y 50% contraentrega", "Credito 15 dias", "Credito 30 dias"],
  corporativeColors: {
    primary: {type: String },
    secondary: {type: String },
  },
  templates: {
    quotation: {type: String },
    invoice: {type: String}
  },
  workOrders:[{
    date: {type: String},
    contact: { type: Schema.Types.ObjectId, ref: 'Relation'},
    status: {type: String},
    importation: {type: String},
    shippingDate: {type: String},
    DateOfReceipt: {type: String},
    observations: {type: String}
  }],
  sales: [{
    date: {type: String},
    contact: { type: Schema.Types.ObjectId, ref: 'Relation'},
    paymentMethod: {type: String},
    seller: {type: String},
    products: [],
    observations: {type: String},
    subTotal: {type: String},
    valueIva: {type: String},
    sendValue: {type: String},
    total: {type: String},
  }],
  quotations: [{
    date: {type: String},
    contact: { type: Schema.Types.ObjectId, ref: 'Relation'},
    paymentMethod: {type: String},
    seller: {type: String},
    products: [],
    observations: {type: String},
    subTotal: {type: String},
    valueIva: {type: String},
    sendValue: {type: String},
    total: {type: String},
  }],
  products: [{
    name: {type: String},
    description: {type: String},
    price: {type: String},
    image: {type: String}
  }]
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















