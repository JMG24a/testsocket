const { Schema, models, model } = require('mongoose');

const invoiceSchema = new Schema({
  userId     : { type: Schema.Types.ObjectId, ref: 'User' },
  formId     : { type: Schema.Types.ObjectId, ref: 'Form' },
  plan       : { type: Schema.Types.ObjectId, ref: 'Product' },
  invoiceInfo: {
    name : { type: String },
    taxId: { type: String }
  },
  status: { type: String, enum: ['pending', 'paid', 'canceled'], default: 'pending' },
  paymentMethod: { type: String },
  subtotal: { type: String },
  tax     : { type: String },
  total   : { type: String },
  discount: { type: String },
  formSelectPaymentMethod: { type: String },
},
{
  timestamps: true,
}
);

invoiceSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Invoice = models.Invoice || model('Invoice', invoiceSchema);

module.exports = Invoice;
