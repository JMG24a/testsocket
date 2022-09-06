const { Schema, model, models } = require('mongoose');

const formCategorySchema = new Schema({
    name: { type: String, unique: true }
});

formCategorySchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const FormCategory = models.FormCategory || model('FormCategory', formCategorySchema);

module.exports = FormCategory;