import userModel from "./user.model";
import answerModel from "./answer.model";
import commentModel from "./comment";
import commentSurvey from "./commentSurvey";
import commentMeta from "./commentMeta";

class Model {
  constructor() {
    this.User = userModel
    this.Answer = answerModel;
    this.Comment = commentModel
    this.CommentSurvey = commentSurvey
    this.CommentMeta = commentMeta
  }
}
export default new Model();
