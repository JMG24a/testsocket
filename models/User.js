const { Schema, model, models } = require("mongoose");

const userSchema = new Schema({
  email           : { type: String, required: true, unique: true },
  password        : { type: String, required: true },
  name            : { type: String, required: true },
  fistLastName    : { type: String, required: true },
  secondLastName  : { type: String, required: true },
  taxId           : { type: String },
  cityDocument    : { type: String },
  phone           : { type: String },
  mobile          : { type: String },
  ocupation       : { type: String, },
  profilePicture  : { type: String },
  customerType    : { type: String, enum: ["persona", "empresa"]},
  address: [{
    id               : String,
    name             : String,
    address          : String,
    addressComplement: String,
    city             : String,
    country          : String,
    state            : String,
  }],
  propertiesOwned: [{
    id               : String,
    name             : String,
    address          : String,
    addressComplement: String,
    city             : String,
    country          : String,
    state            : String,
    noCatastro       : String,
  }],
  vehiclesOwned: [{ type: Schema.Types.ObjectId, ref: "Vehicle" }],
  pastForms: [{
    id                   : String,
    date                 : String,
    idForm               : { type: Schema.Types.ObjectId, ref: "Form"},
    name                 : String,
    contractDate         : String,
    contractAmmount      : Number,
    contractPaymentMethod: String,
    contractFine         : String,
    contractVehicle      : String,
    contractExpenseFrom  : String,
    city                 : String,
  }],
  familyMembers: [{
    id            : String,
    name          : String,
    firstLastName : String,
    secondLastName: String,
    taxId         : String,
    phone         : String,
    mobile        : String,
  }],
  purchases: [{
    id             : String,
    date           : String,
    dueDate        : String,
    plan           : { type: Schema.Types.ObjectId, ref: "Product" },
    avalilableForms: [{ type: Schema.Types.ObjectId, ref: "Form" }],
    ammount        : String,
    paymentMethod  : String,
    cuponCode      : String,
    discount       : String,
    invoice        : String,
  }],
  favoriteForms   : [{ type: Schema.Types.ObjectId, ref: "Form" }],
  profileLicense  : { type: Schema.Types.ObjectId, ref: "Product" },
  availableForms  : [{ type: Schema.Types.ObjectId, ref: "Form" }],
  mailingList     : { type: Boolean, default: false },
  marketingSurvey : { type: Schema.Types.ObjectId, ref: "MarketingSurvey" },
  token           : { type: String, },
});

userSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const User = models.User || model("User", userSchema);

module.exports = User;