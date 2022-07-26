const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  secondLastName: {
    type: String,
  },
  phone: {
    type: String,
  },
  cellPhone: {
    type: String,
  },
  photo: {
    type: String,
  },
  address: {
    type: String,
  },
  token: {
    type: String,
  },
});

UserSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("User", UserSchema);
