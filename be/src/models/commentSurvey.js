var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var groupSchema = new Schema(
  {
    comments: [
      {
        commentId: String,
        userName: String,
        comment: String,
        appName: String,
        rating: String,
        thumbsUp: String,
        stt: Number
      }
    ],
    isDone: {
      type: Boolean,
      default: false,
    },
    isSelected:  {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

export default mongoose.model("commentSurvey", groupSchema);
