const csv = require("csvtojson");
require("dotenv")
require("../configs/mongoose.config")
import Models from "../models";
import _ from "lodash";

main()
async function main() {
    // await initCommentCollection()
    await initCommentSurveyCollection()

    resetCommentSurveyCollection()
}

async function resetCommentSurveyCollection() {
     await Models.CommentSurvey.updateMany({}, { isDone: false, isSelected: false })
}
async function initCommentSurveyCollection() {
     await Models.CommentSurvey.deleteMany()
    const comments = await Models.Comment.find()

    const commentChunks = _.chunk(comments, 100);

    await Promise.all(
        commentChunks.map(comments => {
            comments = comments.map((comment, stt) => {
                comment = comment.toJSON()
                comment.stt = stt + 1;
                return comment
            })
            if(comments.length < 50) return
            return Models.CommentSurvey.create({comments})
        })
    )
}
async function initCommentCollection() {
    const data = await csv({
        noheader: true,
        output: "csv",
    }).fromFile("/Users/a1234/Downloads/comments-apps-by-keywords.csv");
    data.shift()

    await Models.Comment.deleteMany()
    await Promise.all(data.map(([commentId, userName, comment, appName, rating, thumbsUp]) => Models.Comment.create({ commentId, userName, comment, appName, rating, thumbsUp })))
}