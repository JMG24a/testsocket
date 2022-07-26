const { Schema, model } = require('mongoose');

const MailingListSchema = Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  Subscribed: {
    type: String,
  },
});

MailingListSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model('MailingList', MailingListSchema);
