const { Schema, model } = require("mongoose");

const marketingSurveySchema = new Schema({
    state: { type: Boolean },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: String },
    answers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: { type: String },
});

marketingSurveySchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const MarketingSurvey = mongoose.models.MarketingSurvey || model("MarketingSurvey", marketingSurveySchema);

module.exports = MarketingSurvey;