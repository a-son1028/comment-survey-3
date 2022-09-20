var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var findOrCreate = require("mongoose-findorcreate");

var answerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId
    },
    isSatisfied: Schema.Types.Number,
    isHasComment: Schema.Types.Number,
    comment: Schema.Types.String,
    questions: [
      {
        appId: {
          type: Schema.Types.ObjectId,
          required: true
        },
        stt: {
          type: Number,
          required: true
        },
        time: {
          type: Number,
          required: true
        },
        responses: [
          {
            commentId: {
              type: Schema.Types.ObjectId,
              required: true
            },
            name: {
              type: String,
              required: true
            },
            value: {
              type: Number,
              required: true
            },
            subQuestions: Schema.Types.Mixed
          }
        ]
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);
answerSchema.plugin(findOrCreate);

answerSchema.virtual("user", {
  ref: "user",
  localField: "_id",
  foreignField: "userId"
});

export default mongoose.model("answerRais3_v3", answerSchema);
