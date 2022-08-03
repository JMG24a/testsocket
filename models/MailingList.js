const { Schema, model, models } = require('mongoose');

const mailingListSchema = new Schema({
  name: { type: String, },
  email: { type: String, },
  Subscribed: { type: String, },
});

mailingListSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const MailingList = models.MailingList || model("MailingList", mailingListSchema);

module.exports = MailingList;
