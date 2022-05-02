<template>
  <div>
    <UILoader v-if="isLoading || !question" />

    <div v-if="question">
      <h5
        class="text-center"
        style="text-transform: capitalize;"
      > <span class="pagingInfo"> <span style="color: #FF9800; font-size: 30px">{{ questionId }}</span> / {{ 100 }}</span></h5>
      <h3
        class="text-center"
        style="text-transform: capitalize;"
      >Security And Privacy Comments Evaluation</h3>

      <div
        class="mt-4 comment-content"
        style="font-size: 21px"
      ><b>Comment:</b> {{ question.comment }}</div>

      <form
        method="POST"
        @submit="next"
      >
        <div id="questions">
          <!-- question 1 -->
          <div class="mt-2">
            <div
              class="ml-3"
              style="font-size: 21px"
            ><b>The above comment discusses:</b></div>
            
            <div
              v-if="question.securityStructure.length"
              class="ml-3"
            >
              Some positive/negative aspects of <b>security mechanisms</b> adopted the target app. namely:<br>
              <div class="ml-10">
                <div
                  v-for="(item, index) in question.securityStructure"
                  :key="index"
                  style="text-transform: capitalize;"
                >
                  + {{ item.dependentGloss }} {{ item.governorGloss }}
                </div>  
              </div>
              <br>
            </div>


            <div 
              v-if="question.privacyStructure.length"
              class="ml-3"
            >
              Some positive/negative aspects of the <b>privacy management</b> adopted the target app. namely:<br>
              <div class="ml-10">
                <div
                  v-for="(item, index) in question.privacyStructure"
                  :key="index"
                  style="text-transform: capitalize;"
                >
                  + {{ item.dependentGloss }} {{ item.governorGloss }}
                </div>  
              </div>
              <br>
            </div>


            <div 
              v-if="question.permissionStructure && question.permissionStructure.length"
              class="ml-3"
            >
              The <b>permissions</b> used by the target app. namely:<br>
              <div class="ml-10">
                <div
                  v-for="(item, index) in question.permissionStructure"
                  :key="index"
                  style="text-transform: capitalize;"
                >
                  + {{ item.dependentGloss }} {{ item.governorGloss }}
                </div>  
              </div>
              <br>
            </div>

            <div
              v-if="question.collectionStructure && question.collectionStructure.length"
              class="ml-3"
            >
              The <b>data collection procedure</b> adopted by the target app<span>, namely:</span><br>
              <div
                class="ml-10"
              >
                <div
                  v-for="(item, index) in question.collectionStructure"
                  :key="index"
                  style="text-transform: capitalize;"
                >
                  + {{ item.dependentGloss }} {{ item.governorGloss }}
                </div>
              </div>
              <br>
            </div>

            <div
              v-if="question.sharingStructure && question.sharingStructure.length"
              class="ml-3"
            >
              The <b>data sharing procedure</b> adopted by the target app<span>, namely:</span><br>
              <div
                class="ml-10"
              >
                <div
                  v-for="(item, index) in question.sharingStructure"
                  :key="index"
                  style="text-transform: capitalize;"
                >
                  + {{ item.dependentGloss }} {{ item.governorGloss }}
                </div>
              </div>
              <br>
            </div>

            <div>
              <div>Do you agree with comment's analysis provided above?</div>

              <UIRadioGroup
                v-model="question1.value"
                name="question1"
                :options="questionOptions"
              />

              <div
                v-if="question1.value == 0"
              >

                <!-- 1.1 -->
                <div
                  v-if="question.securityStructureWithKeywords.length"
                  class="ml-3 mt-3"
                >
                  Some positive/negative aspects of <b>security mechanisms</b> adopted the target app.
                  <UIRadioGroup
                    v-model="question11.value"
                    name="question11"
                    :options="question1Options"
                  />
                  <div
                    v-if="question11.value == 1"
                  >
                    <div>Can you provide the correct answer?</div>
                    <UITextarea
                      v-model="question11.reason"
                    />
                  </div>
                </div>
                
                <!-- 1.2 -->
                <div
                  v-if="question.privacyStructureWithKeyWords.length"
                  class="ml-3 mt-3"
                >
                  Some positive/negative aspects of the <b>privacy management</b> adopted the target app.
                  <UIRadioGroup
                    v-model="question12.value"
                    name="question12"
                    :options="question1Options"
                  />
                  <div
                    v-if="question12.value == 1"
                  >
                    <div>Can you provide the correct answer?</div>
                    <UITextarea
                      v-model="question12.reason"
                    />
                  </div>
                </div>

                <!-- 1.3 -->
                <div
                  v-if="question.permissionStructureWithKeyWords.length"
                  class="ml-3 mt-3"
                >
                  The <b>permissions</b> used by the target app.
                  <UIRadioGroup
                    v-model="question13.value"
                    name="question13"
                    :options="question1Options"
                  />
                  <div
                    v-if="question13.value == 1"
                  >
                    <div>Can you provide the correct answer?</div>
                    <UITextarea
                      v-model="question13.reason"
                    />
                  </div>
                </div>

                <!-- 1.4 -->
                <div
                  v-if="question.collectionDataTypes"
                  class="ml-3 mt-3"
                >
                  The <b>data collection procedure</b> adopted by the target app.
                  <UIRadioGroup
                    v-model="question14.value"
                    name="question14"
                    :options="question1Options"
                  />
                  <div
                    v-if="question14.value == 1"
                  >
                    <div>Can you provide the correct answer?</div>
                    <UITextarea
                      v-model="question14.reason"
                    />
                    
                  </div>
                </div>

                <!-- 1.5 -->
                <div
                  v-if="question.sharingStructure"
                  class="ml-3 mt-3"
                >
                  The <b>data sharing procedure</b> adopted by the target app.
                  <UIRadioGroup
                    v-model="question15.value"
                    name="question15"
                    :options="question1Options"
                  />
                  <div
                    v-if="question15.value == 1"
                  >
                    <div>Can you provide the correct answer?</div>
                    <UITextarea
                      v-model="question15.reason"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
        <div style="position: relative">
          <UINextButton />

          <div
            v-show="questionId > 1"
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
import UIRadioGroup from '@/components/UIRadioGroup.vue'
import UITextarea from '@/components/UITextarea.vue'
import { GET_QUESTIONS, GET_ANSWER, STORE_ANSWER } from '@/store/modules/question/action.type.js'
import { GET_USER_INFO } from '@/store/modules/user/action.type.js'

const questionOptions = [{label: 'Yes', value: 1}, {label: 'Partially', value: 2}, {label: 'No', value: 0} ]
const question1Options = [{label: 'Yes', value: 1}, {label: 'No', value: 0} ]

export default {
  components: {
    UINextButton,
    UILoader,
    UIRadioGroup,
    UITextarea,
  },
  data: () => ({
    isLoading: true,
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
      question: 'getQuestion',
      questionAnswered: 'getQuestionAnswered',
      questionId: 'getQuestionId',
      userInfo: 'getUserInfo',
      answer: 'getAnswer'
    })
  },
  watch: {
   questionAnswered(questionAnswered) {
      if(!questionAnswered) return

      questionAnswered.responses.forEach(response => {
        Object.entries(response).map(([key, value])=> {
          this[response.name][key] = value
        })
      })
    },
    userInfo(userInfo) {
      if(!userInfo.isInstruction) this.$router.push('/')
    }
  },
  mounted() {
    Promise.all([
      this.$store.dispatch(GET_QUESTIONS),
      this.$store.dispatch(GET_ANSWER),
      this.$store.dispatch(GET_USER_INFO),
    ]).then(() => this.isLoading = false)

  },
  methods: {
    clearFormData() {
      this.question1.value=null
      this.question1.comment1=''
    },
    next(e) {
      e.preventDefault();
      this.isLoading = true
      const data = {
        commentId: this.question.commentId,
        stt: this.question.stt,
        responses: [this.question1, this.question11, this.question12, this.question13, this.question14, this.question15]
      }
      this.$store.dispatch(STORE_ANSWER, data)
      .then(() => {

        if(this.questionId == 100) {
          this.$router.push('/success')
        } else {
          this.$store.commit('setQuestionId', this.questionId + 1)
        }
        
        this.isLoading = false

        this.clearFormData()
      })
    },

    back() {
      this.$store.commit('setQuestionId', this.questionId - 1)
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