var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var groupSchema = new Schema(
  {
    commentId: String,
    userName: String,
    comment: String,
    appName: String,
    rating: String,
    thumbsUp: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

export default mongoose.model("comments", groupSchema);
