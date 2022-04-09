<template>
  <div>
    <UILoader v-if="isLoading || !question" />

    <div v-if="question">
      <h5
        class="text-center"
        style="text-transform: capitalize;"
      > <span class="pagingInfo"> <span style="color: #FF9800; font-size: 30px">{{ questionId }}</span> / {{ questions.length }}</span></h5>
      <h3
        class="text-center"
        style="text-transform: capitalize;"
      >Security And Privacy Comments Survey</h3>

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
            <div class="ml-3">1. Is this comment about an issue related to the security and/or privacy of the app?</div>
            <UIRadioGroup
              v-model="question1.value"
              name="question1.value"
              :options="question1Options"
            />

            <!-- if yes -->
            <UITextarea
              v-if="question1.value == 1"
              v-model="question1.coppiedContent"
              label="Please select one or more label that describe the content you've inserted in the textbox:"
            />

            <!-- if-no -->
            <UITextarea
              v-if="question1.value == 0 || question1.value == 2"
              v-model="question1.reason"
              label="Please explain the reason:"
            />
          
          </div>

          
          <div v-if="question1.value == 1">
            <!-- question 2 -->
            <div
              class="mt-2"
            >
              <div class="ml-3">2. Which is the sentiment of this comment on security?</div>
              <UIRadioGroup
                v-model="question2.value"
                name="question2"
                :options="question2Options"
              />

              <!-- if 2 yes -->
              <UITextarea
                v-if="question2.value == 0 || question2.value == 1 || question2.value == 2"
                v-model="question2.coppiedContent"
                label="Please copy the related content to the textbox:"
              />
            </div>

            <!-- question 3 -->
            <div class="mt-2">
              <div class="ml-3">3. Which is the sentiment of this comment on privacy?</div>
              <UIRadioGroup
                v-model="question3.value"
                name="question3"
                :options="question3Options"
              />

              <!-- if 3 yes -->
              <UITextarea
                v-if="question3.value == 0 || question3.value == 1 || question3.value == 2"
                v-model="question3.coppiedContent"
                label="Please copy the related content to the textbox:"
              />
            </div>


            <!-- question 4 -->
            <div class="mt-2">
              <div class="ml-3">4. Does this comment mention the permissions required by the considered app?</div>
              <UIRadioGroup
                v-model="question4.value"
                name="question4"
                :options="question4Options"
              />

              <!-- if 4 yes -->
              <div v-if="question4.value == 1">
                <div class="ml-3">4.1. Does the comment refer to any specific permissions?</div>
                <UIRadioGroup
                  v-model="question41.value"
                  name="question41"
                  :options="question4Options"
                />

                <!-- if 4.1 yes -->
                <div
                  v-if="question41.value == 1"
                  class="if-yes"
                >
                  Please select the related content to the textbox:
                  <div class="anwsers">
                    <label
                      v-for="permission in PERMISSIONS"
                      :key="permission"
                      class="container-checkbox"
                    >{{ permission }}
                      <input
                        v-model="question41.selectedContent"
                        class="type-question"
                        type="checkbox"
                        :value="permission.toLowerCase()"
                      >
                      <span class="checkmark" />
                    </label>
                  </div>
          
                </div>
              </div>
            </div>

            <!-- question 5 -->
            <div class="mt-2">
              <div class="ml-3">5. Does this comment mention the data collected by the considered app?</div>
              <UIRadioGroup
                v-model="question5.value"
                name="question5"
                :options="question5Options"
              />

          
              <!-- if 5 yes -->
              <div v-if="question5.value == 1">
                <UITextarea
                  v-model="question5.coppiedContent"
                  label="Please copy the related content to the textbox:"
                />

                <div class="ml-3">5.1. Does it mention the purpose of data collection?</div>
                <UIRadioGroup
                  v-model="question51.value"
                  name="question51"
                  :options="question5Options"
                />

            
            
                <!-- if 5.1 yes -->
                <div
                  v-if="question51.value == 1"
                  class="if-yes"
                >
                  Please select one or more purposes mentioned in the text you've inserted above:
                  <div class="anwsers">
                    <label 
                      v-for="purpose in PURPOSES"
                      :key="purpose"
                      class="container-checkbox"
                    >{{ purpose }}
                      <input
                        v-model="question51.selectedContent"
                        class="type-question"
                        type="checkbox"
                        :value="purpose.toLowerCase()"
                      >
                      <span class="checkmark" />
                    </label>
                  </div>
                  <div class="">
                    <OtherOptionInput v-model="question51.others" />
                  </div>
                </div>
              </div>
            </div>


            <!-- question 6 -->
            <div class="mt-2">
              <div class="ml-3">6. Does this comment mention that the considered app shares data with a third party?</div>
              <UIRadioGroup
                v-model="question6.value"
                name="question6"
                :options="question6Options"
              />

              <!-- if 6 yes -->
              <div
                v-if="question6.value == 1"
                class="if-yes"
              >
                <UITextarea
                  v-model="question6.coppiedContent"
                  label="Please select one or more label that describe the content you've inserted in the textbox:"
                />
                <!-- "6.1 -->
                <div class="6.1">
                  <div class="ml-3">6.1. Does it mention the purpose of this data sharing?</div>
                  <UIRadioGroup
                    v-model="question61.value"
                    name="question61"
                    :options="question6Options"
                  />

                  <!-- if yes -->
                  <div
                    v-if="question61.value == 1"
                  >
                    Please select one or more purposes mentioned in the text you've inserted above:
                    <div class="anwsers">
                      <label 
                        v-for="purpose in PURPOSES"
                        :key="purpose"
                        class="container-checkbox"
                      >{{ purpose }}
                        <input
                          v-model="question61.selectedContent"
                          class="type-question"
                          type="checkbox"
                          :value="purpose.toLowerCase()"
                        >
                        <span class="checkmark" />
                      </label>
                    </div>
                    <OtherOptionInput v-model="question61.others" />
                  </div>
              
        
                  <!-- if 6.1 no -->
                  <!-- <UITextarea
                    v-if="question61.value == 0"
                    v-model="question61.reason"
                    label="Please explain the reason:"
                  /> -->
                </div>

                <!-- if 6.2 yes -->
                <div
                  class="6.2"
                >
                  <div class="ml-3">6.2. Does the comment refer to any specific third parties?</div>
                  <UIRadioGroup
                    v-model="question62.value"
                    name="question62"
                    :options="question6Options"
                  />

                  <!-- if 6.2 yes -->
                  <div
                    v-if="question62.value == 1"
                  >
                    Please select one or more third-parties mentioned in the text you've inserted above:
                    <div class="anwsers scrollable">
                      <label 
                        v-for="thirdParty in THIRD_PARTIES"
                        :key="thirdParty"
                        class="container-checkbox"
                      >{{ thirdParty }}
                        <input
                          v-model="question62.selectedContent"
                          class="type-question"
                          type="checkbox"
                          :value="thirdParty.toLowerCase()"
                        >
                        <span class="checkmark" />
                      </label>
                    </div>
                    <div class="mt-2"> 
                      <OtherOptionInput v-model="question62.others" />
                    </div>
                  </div>
        
                  <!-- if 6.2 no -->
                  <!-- <UITextarea
                    v-if="question62.value == 0"
                    v-model="question62.reason"
                    label="Please explain the reason:"
                  /> -->
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
import UIRadioGroup from '@/components/UIRadioGroup.vue'
import UITextarea from '@/components/UITextarea.vue'
import UILoader from '@/components/UILoader.vue'
import OtherOptionInput from '@/components/OtherOptionInput.vue'
import { PERMISSIONS, THIRD_PARTIES, PURPOSES } from '@/constants'
import { STORE_ANSWER, GET_QUESTIONS, GET_ANSWER } from '@/store/modules/question/action.type.js'
import { GET_USER_INFO } from '@/store/modules/user/action.type.js'

const question1Options = [{label: 'Yes', value: 1}, {label: 'No', value: 0}, {label: 'Maybe', value: 2}]
const question2Options = [{label: 'Positive', value: 1}, {label: 'Negative', value: 0}, {label: 'Neutral', value: 2}, {label: 'None', value: 3}]
const question3Options = question2Options
const question4Options = [{label: 'Yes', value: 1}, {label: 'No', value: 0}]
const question5Options = question4Options
const question6Options = question4Options

export default {
  components: {
    UINextButton,
    UIRadioGroup,
    UITextarea,
    UILoader,
    OtherOptionInput
  },
  data: () => ({
    isLoading: true,
    question1: {
      name: 'question1',
      value: null,
      coppiedContent: '',
      selectedContent: [],
      reason: '',
    },
    question2: {
      name: 'question2',
      value: null,
      coppiedContent: '',
      selectedContent: [],
      reason: '',
    },
    question3: {
      name: 'question3',
      value: null,
      coppiedContent: '',
      selectedContent: [],
      reason: '',
    },
    question4: {
      name: 'question4',
      value: null,
      coppiedContent: '',
      selectedContent: [],
      reason: '',
    },
    question41: {
      name: 'question41',
      value: null,
      coppiedContent: '',
      selectedContent: [],
      reason: '',
    },
    question5: {
      name: 'question5',
      value: null,
      coppiedContent: '',
      selectedContent: [],
      reason: '',
    },
    question51: {
      name: 'question51',
      value: null,
      coppiedContent: '',
      selectedContent: [],
      reason: '',
      others: ''
    },
    question6: {
      name: 'question6',
      value: null,
      coppiedContent: '',
      selectedContent: [],
      reason: '',
    },
    question61: {
      name: 'question61',
      value: null,
      coppiedContent: '',
      selectedContent: [],
      reason: '',
      others: ''
    },
    question62: {
      name: 'question62',
      value: null,
      coppiedContent: '',
      selectedContent: [],
      reason: '',
      others: ''
    },
    question1Options,
    question2Options,
    question3Options,
    question4Options,
    question5Options,
    question6Options,
    PERMISSIONS: PERMISSIONS,
    THIRD_PARTIES: THIRD_PARTIES,
    PURPOSES,
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
      this.question1.value = null
      this.question1.coppiedContent = ''
      this.question1.selectedContent = []
      this.question1.reason = ''

      this.question2.value = null
      this.question2.coppiedContent = ''
      this.question2.selectedContent = []
      this.question2.reason = ''

      this.question3.value = null
      this.question3.coppiedContent = ''
      this.question3.selectedContent = []
      this.question3.reason = ''

      this.question4.value = null
      this.question4.coppiedContent = ''
      this.question4.selectedContent = []
      this.question4.reason = ''

      this.question41.value = null
      this.question41.coppiedContent = ''
      this.question41.selectedContent = []
      this.question41.reason = ''

      this.question5.value = null
      this.question5.coppiedContent = ''
      this.question5.selectedContent = []
      this.question5.reason = ''

      this.question51.value = null
      this.question51.coppiedContent = ''
      this.question51.selectedContent = []
      this.question51.reason = ''
      this.question51.others = ''

      this.question6.value = null
      this.question6.coppiedContent = ''
      this.question6.selectedContent = []
      this.question6.reason = ''

      this.question61.value = null
      this.question61.coppiedContent = ''
      this.question61.selectedContent = []
      this.question61.reason = ''
      this.question61.others = ''

      this.question62.value = null
      this.question62.coppiedContent = ''
      this.question62.selectedContent = []
      this.question62.reason = ''
      this.question62.others = ''
    },
    next(e) {
      e.preventDefault();
      this.isLoading = true
      const data = {
        commentId: this.question.commentId,
        stt: this.question.stt,
        responses: [this.question1, this.question2, this.question3, this.question4, this.question41, this.question5, this.question51, this.question6, this.question61, this.question62]
      }
      this.$store.dispatch(STORE_ANSWER, data)
      .then(() => {

        if(this.questionId == 50) {
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
</style>