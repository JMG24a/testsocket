const { Schema, model, models } = require('mongoose');

const articleSchema = new Schema(
  {
    author: { type: String },
    cover: { type: String },
    title: { type: String },
    tag: { type: String },
    blocks: { type: String },
    auxImage: { type: String },
  },
  {
    timestamps: true,
  }
);

articleSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Article = models.Article || model('Article', articleSchema);

module.exports = Article;
