const { Schema, model, models } = require('mongoose');

const databasesSchema = new Schema(
  {
    name: { type: String },
    document: { type: String },
    surnames: {type: String},
    cellPhone: {type: String},
    phone: {type: String},
    address: {type: String},
    city: {type: String},
    department: {type: String},
    country: {type: String},
    tag: {type: String },
    userID: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
  }
);

databasesSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Databases = models.Databases || model('Databases', databasesSchema);

module.exports = Databases;
