const { Schema, model, models } = require('mongoose');

const productSchema = new Schema({
  name: { type: String },
  priceList: { type: Number },
  priceLabel: { type: String },
  description: { type: String },
  benefits: [String],
  availablePromos: [{ type: Schema.Types.ObjectId, ref: 'Promotion' }],
});

productSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Product = models.Product || model('Product', productSchema);

module.exports = Product;
