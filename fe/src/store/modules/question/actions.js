import {
  STORE_ANSWER,
  GET_QUESTIONS,
  GET_ANSWER
} from './action.type';
import api from '@/services/api'

export default {
  [STORE_ANSWER](store, question) {
    return api({
      headers: { Authorization: localStorage.token }
    }).post('/handle-questions', { question })
    .then(response => {
      store.commit('setAnswer', {
        questions: response.data
      })
    })
  },
  [GET_QUESTIONS](store) {
    return api({}).post('/questions').then(response => {
      store.commit('setQuestions', response.data)
    })
  },
  [GET_ANSWER](store) {
    return api({
      headers: { Authorization: localStorage.token }
    }).get('/answer').then(response => {
      store.commit('setAnswer', response.data)
    })
  },
};