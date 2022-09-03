const { Schema, model } = require("mongoose");

const propertySchema = new Schema({
  customName: {type: String},
  address: {type: String},
  cadastreNumber: {type: String},
  city: {type: String },
  complement:{type: String},
  department:{type: String},
  userId:[{ type: Schema.Types.ObjectId, ref: 'User' }],
},
{
  timestamps: true,
});

propertySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Property", propertySchema);
