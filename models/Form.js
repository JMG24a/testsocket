const { Schema, model, models } = require("mongoose");

const formSchema = new Schema({
  appAvailable  : { type: Boolean },
  webAvailable  : { type: Boolean },
  title         : { type: String },
  description   : { type: String },
  abstract      : { type: String },
  image         : { type: String },
  keywords      : { type: String },
  webPostOwner  : { type: String },
  slug          : { type: String },
  tag           : { type: String },
  type          : { type: String, enum: ["tramite", "formulario"] },
  requiredForms : [String],
  webContentPost: { type: String },
  formData: [{
    stepName   : { type: String },
    completed  : { type: Boolean },
    globalAlert: { type: String },
    formDiagram: {
      title       : { type: String },
      background  : { type: String },
      showSwitch  : { type: Boolean },
      switchLabel : { type: String },
      formMaxWidth: { type: String },
      nodes: [{
        inputSize: { type: String },
        labelName: { type: String },
        name     : { type: String },
        tooltip  : { type: String },
        input    : { type: String, required: true },
      }]
    }
  }]
});

formSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Form = models.Form || model("Form", formSchema);

module.exports = Form;
