const { Schema, model, models } = require('mongoose');

const supportTicketSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String },
  subject: { type: String },
  problem: { type: String },
  issueDate: { type: String },
  answerDate: { type: String },
  attachmentURL: { type: String },
});

supportTicketSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const SupportTicket =
  models.SupportTicket || model('SupportTicket', supportTicketSchema);

module.exports = SupportTicket;
