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
    qualification: { type: Number },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaUrl: { type: String },
    type: { type: String, enum: ['tramite', 'formato'] },
    requiredForms: [
      {
        name: { type: String },
        fileName: { type: String },
      },
    ],
    webContentPost: { type: Schema.Types.ObjectId, ref: 'Article' },
    formCategory: { type: Schema.Types.ObjectId, ref: 'FormCategory' },
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
              autocomplete: { type: String },
              name: { type: String },
              tooltip: { type: String },
              input: {
                type: { type: String },
                options: [String],
                isRequired: Boolean,
              },
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
