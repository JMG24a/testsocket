const { Schema, model, models } = require('mongoose');

const requestListSchema = new Schema({
  title: { type: String },
  description: { type: String },
  idUser: { type: Schema.Types.ObjectId, ref: 'User' },
});

requestListSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const RequestList = models.RequestList || model('requestList', requestListSchema);

module.exports = RequestList;
