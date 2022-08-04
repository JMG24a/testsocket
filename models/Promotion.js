const { Schema, model, models } = require("mongoose");

const promotionSchema = new Schema({
    issueDate   : { type: String },
    expiringDate: { type: String },
    couponCode  : { type: String },
    discount    : { type: Number },
    description : { type: String }
});

promotionSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Promotion = models.Promotion || model("Promotion", promotionSchema);

module.exports = Promotion;