<template>
  <div>
    <UILoader v-if="isLoading || !question" />
    <div v-if="question">
      <h5
        class="text-center"
        style="text-transform: capitalize;"
      > <span class="pagingInfo"> <span style="color: #FF9800; font-size: 30px">1</span> / {{ 50 }}</span></h5>
      <h3
        class="text-center"
        style="text-transform: capitalize;"
      >{{ question.appName }}</h3>
      <div class="text-center mt-1">{{ question.categoryName }}</div>

      <div
        class="mt-4 comment-content"
        style="font-size: 21px"
      ><b>App description:</b> 
        <!-- eslint-disable vue/no-v-html -->
        <span v-html="question.description" />
        <!--eslint-enable-->
      </div>

      <div
        class="mt-4"
      >
        <b style="text-decoration: underline;">Permissions:</b> 
        <div>+ Permissions: Permission 1, Permission 2, Permission 3, Permission 4.</div> 
      </div>

      <!-- Data collection -->
      <div
        class="mt-2"
      >
        <b style="text-decoration: underline;">Data collection:</b> 
        <div>+ Data collection items: 
          <div
            v-for="(group, index) in question.staticGroup"
            :key="index"
            style="margin-left:10px"
          >- {{ group.name }}: <span
            v-for="(api, index1) in group.apis"
            :key="index1"
          >{{ api.name }}{{ index1 === group.apis.length - 1 ? "." : ", " }}</span>
          
          </div></div> 

        <div>+ Data collection purpose: <span
          v-for="(item, index) in question.purposesHP"
          :key="index"
        >{{ item }}{{ index === question.purposesHP.length - 1 ? "." : ", " }}</span></div> 
      </div>

      <!-- Data sharing -->
      <div
        class="mt-2"
      >
        <b style="text-decoration: underline;">Data sharing:</b> 
        <div>+ Data sharing items: <div
          v-for="(group, index) in question.dynamicGroup"
          :key="index"
          style="margin-left:10px"
        >- {{ group.name }}: <span
          v-for="(api, index1) in group.apis"
          :key="index1"
        >{{ api.name }}{{ index1 === group.apis.length - 1 ? "." : ", " }}</span>
          
        </div></div> 

        <div>+ Data sharing purpose: <span
          v-for="(item, index) in question.purposesHP"
          :key="index"
        >{{ item }}{{ index === question.purposesHP.length - 1 ? "." : ", " }}</span></div> 

        <div>+ Third party: <span
          v-for="(item, index) in question.thirdPartiesHP"
          :key="index"
        >{{ item }}{{ index === question.thirdPartiesHP.length - 1 ? "." : ", " }}</span></div> 
      </div>

      <!-- Comment -->
      <div
        class="mt-2"
      >
        <b style="text-decoration: underline;">Comments:</b> 
        
        <div v-if="comments && comments.length === 0">No data</div>
        <div v-else>
          <div 
            v-for="(comment, index) in comments"
            :key="index"
          >
            + {{ comment.comment }}
          </div>
        </div>
      </div>

      <form
        method="POST"
        @submit="next"
      >
        
        <div style="position: relative">
          <UINextButton />

          <div
            class="wrap-btn-pre"
          >
            <button
              class="login100-form-btn button-pre slick-prev"
              @click.prevent="back"
            >Back</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import UINextButton from '@/components/UINextButton.vue'
import UILoader from '@/components/UILoader.vue'
// import UIRadioGroup from '@/components/UIRadioGroup.vue'
// import UITextarea from '@/components/UITextarea.vue'
import { GET_QUESTIONS, GET_COMMENTS } from '@/store/modules/question/action.type.js'
// import { GET_QUESTIONS, GET_ANSWER, STORE_ANSWER } from '@/store/modules/question/action.type.js'
// import { GET_USER_INFO } from '@/store/modules/user/action.type.js'

const questionOptions = [{label: 'Yes', value: 1}, {label: 'Partially', value: 2}, {label: 'No', value: 0} ]
const question1Options = [{label: 'Yes', value: 1}, {label: 'No', value: 0} ]

export default {
  components: {
    UINextButton,
    UILoader,
    // UIRadioGroup,
    // UITextarea,
  },
  data: () => ({
    isLoading: true,
    question: null,
    questionOptions,
    question1Options,
    question1: {
      name: 'question1',
      value: null,
    },
    question11: {
      name: 'question11',
      value: null,
      reason: ''
    },
    question12: {
      name: 'question12',
      value: null,
      reason: ''
    },
    question13: {
      name: 'question13',
      value: null,
      reason: ''
    },
    question14: {
      name: 'question14',
      value: null,
      reason: '',
      others: {}
    },
    question15: {
      name: 'question15',
      value: null,
      reason: ''
    },
  }),
  computed: {
    ...mapGetters({
      questions: 'getQuestions',
      comments: 'getComments',
      // question: 'getQuestion',
      // questionAnswered: 'getQuestionAnswered',
      // questionId: 'getQuestionId',
      // userInfo: 'getUserInfo',
      // answer: 'getAnswer'
    })
  },
  watch: {
    questions(questions) {
      this.question = questions[0];
      this.question.dynamicGroup = this.question.dynamicGroup ? JSON.parse(this.question.dynamicGroup) : []
      this.question.staticGroup = this.question.staticGroup ? JSON.parse(this.question.staticGroup) : []

      console.log(this.question.staticGroup)
      this.$store.dispatch(GET_COMMENTS, this.question.appName)
    },
    userInfo(userInfo) {
      if(!userInfo.isInstruction) this.$router.push('/')
    }
  },
  mounted() {
    Promise.all([
      this.$store.dispatch(GET_QUESTIONS),
      // this.$store.dispatch(GET_ANSWER),
      // this.$store.dispatch(GET_USER_INFO),
    ]).then(() => this.isLoading = false)

    // this.isLoading = false
  },
  methods: {
    clearFormData() {
      this.question1.value=null
      this.question1.comment1=''

      this.question11.value=null
      this.question11.reason=''

      this.question12.value=null
      this.question12.reason=''

      this.question13.value=null
      this.question13.reason=''

      this.question14.value=null
      this.question14.reason=''

      this.question15.value=null
      this.question15.reason=''
    },
    next(e) {
      e.preventDefault();
      // this.isLoading = true
      // const data = {
      //   commentId: this.question.commentId,
      //   stt: this.question.stt,
      //   responses: [this.question1, this.question11, this.question12, this.question13, this.question14, this.question15]
      // }
      // this.$store.dispatch(STORE_ANSWER, data)
      // .then(() => {

      //   if(this.questionId == 50) {
      //     this.$router.push('/success')
      //   } else {
      //     this.$store.commit('setQuestionId', this.questionId + 1)
      //   }
        
      //   this.isLoading = false

      //   this.clearFormData()
      // })
    },

    back() {
      // this.$store.commit('setQuestionId', this.questionId - 1)
    }
  }
};
</script>

<style scoped>
  .scrollable {
    overflow-y: scroll; max-height: 250px;
  }
  .ml-10 {
    margin-left: 10px;
  }
</style>