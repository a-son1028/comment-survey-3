export default {
  getQuestions(state) {
    return state.questions;
  },
  getAnswer(state) {
    return state.answer;
  },
  getQuestionAnswered(state) {
    return (state.answer.questions || []).find(item => item.id === state.questionId)
  },
  getQuestion(state) {
    return state.questions.find(item => item.id === state.questionId)
  },
  getQuestionId(state) {
    return state.questionId
  },
};
