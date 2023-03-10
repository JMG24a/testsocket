const { Schema, model, models } = require("mongoose");

const productSchema = new Schema({
  name           : { type: String },
  priceLabel     : { type: String },
  description    : { type: String },
  benefits       : [String],
  availablePromos: [{ type: Schema.Types.ObjectId, ref: 'Promotion' }],
  paymentMethods: [{
    name :      {type: String},
    price:      {type: Number},
    time :      {type: String},
    priceLabel: {type: String},
    description: {type: String},
    discount: {type: Number}
  }],
}, {
  timestamps: true
});

productSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Product = models.Product || model("Product", productSchema);

module.exports = Product;
