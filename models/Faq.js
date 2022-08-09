const { Schema, model, models } = require('mongoose');

const faqListSchema = new Schema({
  title: { type: String },
  text: { type: String },
  keywords: { type: String },
});

faqListSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const FaqList = models.FaqList || model('FaqList', faqListSchema);

module.exports = FaqList;
