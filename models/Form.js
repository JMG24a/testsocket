const { Schema, model, models } = require('mongoose');

const formSchema = new Schema(
  {
    appAvailable: { type: Boolean },
    webAvailable: { type: Boolean },
    title: { type: String },
    description: { type: String },
    abstract: { type: String },
    image: { type: String },
    keywords: { type: String },
    webPostOwner: { type: String },
    slug: { type: String },
    tag: { type: String },
    type: { type: String, enum: ['tramite', 'formato'] },
    requiredForms: [String],
    webContentPost: { type: String },
    formData: [
      {
        stepName: { type: String },
        completed: { type: Boolean },
        globalAlert: { type: String },
        formDiagram: {
          title: { type: String },
          background: { type: String },
          formMaxWidth: { type: String },
          showSwitch: { type: Boolean },
          switchLabel: { type: String },
          description: { type: String },
          alert: { type: String },
          interestLinks: [
            {
              name: { type: String },
              link: { type: String },
            },
          ],
          nodes: [
            {
              inputSize: { type: String },
              labelName: { type: String },
              name: { type: String },
              tooltip: { type: String },
              input: {
                type: { type: String },
                options: [String],
                isRequired: Boolean,
              }
            },
          ],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

formSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Form = models.Form || model('Form', formSchema);

module.exports = Form;
