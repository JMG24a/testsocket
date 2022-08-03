const { Schema, model } = require("mongoose");

const vehicleSchema = new Schema({
  name        : { type: String },
  plate       : { type: String },
  brand       : { type: String },
  line        : { type: String },
  color       : { type: String },
  model       : { type: String },
  fuelType    : { type: String },
  serviceType : { type: String },
  vehicleArmor: { type: String },
  noChasis    : { type: String },
  noMotor     : { type: String },
  vim         : { type: String },
  noImport    : { type: String },
  importDate  : { type: String },
});

vehicleSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Vehicle = mongoose.models.Vehicle || model("Vehicle", vehicleSchema);

module.exports = Vehicle;