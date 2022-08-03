const { Schema, model } = require("mongoose");

const productSchema = Schema({
  name           : { type: String },
  updatedDate    : { type: String },
  priceList      : { type: Number },
  description    : [String],
  availablePromos: [{ type: Schema.Types.ObjectId, ref: 'Promotion' }],
});

productSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Product = mongoose.models.Product || model("Product", productSchema);

module.exports = Product;