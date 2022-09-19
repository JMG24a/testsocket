const { Schema, model, models } = require('mongoose');

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  emailVerify: {type: Boolean, default: false},
  password: { type: String, required: true },
  name: { type: String, required: true },
  fistLastName: { type: String, required: false },
  secondLastName: { type: String, required: false },
  taxId: { type: String },
  taxIdType: { type: String },
  cityDocument: { type: String },
  phone: { type: String },
  mobile: { type: String },
  ocupation: { type: String },
  profilePicture: { type: String },
  idType: { type: String },
  customerType: { type: String, enum: ['persona', 'empresa'] },
  plan: {
    planInfo: { type: Schema.Types.ObjectId, ref: 'Product' },
    expireDate: { type: String },
  },
  address: [
    {
      id: String,
      name: String,
      address: String,
      addressComplement: String,
      city: String,
      country: String,
      state: String,
    },
  ],
  propertiesOwned: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  vehiclesOwned: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
  familyMembers: [{ type: Schema.Types.ObjectId, ref: 'Relation' }],
  purchases: [
    {
      id: String,
      date: String,
      dueDate: String,
      plan: { type: Schema.Types.ObjectId, ref: 'Product' },
      avalilableForms: [{ type: Schema.Types.ObjectId, ref: 'Form' }],
      ammount: String,
      paymentMethod: String,
      cuponCode: String,
      discount: String,
      invoice: String,
    },
  ],
  favoriteForms: [{ type: Schema.Types.ObjectId, ref: 'Form' }],
  profileLicense: { type: Schema.Types.ObjectId, ref: 'Product' },
  availableForms: [{ type: Schema.Types.ObjectId, ref: 'Form' }],
  mailingList: { type: Boolean, default: false },
  marketingSurvey: { type: Schema.Types.ObjectId, ref: 'MarketingSurvey' },
  token: { type: String },
  alertPermission: [String],
  lastLoginDate: { type: String },
  documents: {
    idCard: String,
    signature: String,
    passport: String,
    RegIdCard: String,
    FileImage: String,
    cv: String
  }
});

userSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const User = models.User || model('User', userSchema);

module.exports = User;
