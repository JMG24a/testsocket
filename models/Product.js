const { Schema, model, models } = require('mongoose');

const productSchema = new Schema({
  name: { type: String },
  updatedDate: { type: String },
  priceList: { type: Number },
  description: [String],
  availablePromos: { type: String },
});

productSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Product = models.Product || model('Product', productSchema);

module.exports = Product;
