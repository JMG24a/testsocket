const { Schema, model, models } = require('mongoose');

const vehicleSchema = new Schema({
  userOwnerId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  vehicle: {
    name: String,
    plate: String,
    brand: String,
    line: String,
    color: String,
    model: String,
    fuelType: String,
    serviceType: String,
    vehicleArmor: String,
    noChasis: String,
    noMotor: String,
    vim: String,
    noImport: String,
    importDate: String,
  },
});

vehicleSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Vehicle = models.Vehicle || model('Vehicle', vehicleSchema);

module.exports = Vehicle;
