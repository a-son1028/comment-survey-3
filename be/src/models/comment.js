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
    isAnalyzed: {
      type: Boolean,
      default: false,
    },
    isGetStructure: {
      type: Boolean,
      default: false,
    },
    securityKeyWords: Array, 
    securitySimiWords: Array, 
    securityStructure: Array,

    privacyKeyWords: Array, 
    privacySimiWords: Array, 
    privacyStructure: Array, 

    collectionKeyWords: Array, 
    collectionSimiWords: Array, 
    collectionStructure: Array, 
    

    sharingKeyWords: Array, 
    sharingSimiWords: Array, 
    sharingStructure: Array,
},
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

export default mongoose.model("comments", groupSchema);
