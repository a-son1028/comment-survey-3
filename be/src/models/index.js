import userModel from "./user.model";
import answerModel from "./answer.model";
import commentModel from "./comment";
import commentSurvey from "./commentSurvey";
class Model {
  constructor() {
    this.User = userModel
    this.Answer = answerModel;
    this.Comment = commentModel
    this.CommentSurvey = commentSurvey
  }
}
export default new Model();
