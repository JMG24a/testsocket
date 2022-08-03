const { Schema, model } = require("mongoose");

const formSchema = Schema({
  form_id      : { type: String, required: true, },
  title        : { type: String, required: true, },
  type         : { type: String, required: true, },
  content      : { type: String, required: true, },
  relations    : [{ type: Schema.ObjectId, ref: 'Form' }],
  forms        : { type: String, required: true, },
  fechaCreacion: { type: Date, }
});

formSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Form = mongoose.models.Form || model("Form", formSchema);

module.exports = Form;
