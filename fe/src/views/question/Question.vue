<template>
  <div>
    <UILoader v-if="isLoading || !question" />
    <form
      method="POST"
      @submit="next"
    >
      <div
        v-if="question"
      >
        <h5
          class="text-center"
          style="text-transform: capitalize;"
        > <span class="pagingInfo"> <span style="color: #FF9800; font-size: 30px">1</span> / {{ 20 }}</span></h5>
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
        <hr>
        <div style="font-size: 21px"><b>Our analysis:</b></div>
        <div v-if="question.permissions && question.permissions.length">
          <b style="text-decoration: underline;">Permissions:</b> 
          <div>+ Permissions: <span
            v-for="(permission, index) in question.permissions"
            :key="index"
          >{{ permission }}{{ index === question.permissions.length - 1 ? "." : ", " }}</span></div> 
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

        <div
          class="mt-2"
        >
          <b style="text-decoration: underline;">Security and privacy assessment:</b> 
          <div>{{ question.distanceLevel }}</div>
        </div>
        


     
        <hr>
        <div>
          <b style="text-decoration: underline;font-size: 21px">Android user comments:</b> 
          <div v-if="comments && comments.length">
            <!-- Comment -->
          

            <div
              v-for="(comment, index) in comments"
              :key="index"
            >
              <div>
                <b-popover
                  :target="'privacy-popover' + index"
                  triggers="hover"
                  placement="right"
                > 
                  According to our analysis based on the app features and its data collection/sharing behaviors, the security and privacy assessment of the app is <b>{{ comment.sentimentLevel }}</b>
                </b-popover>

                <b-popover
                  :target="'security-popover' + index"
                  triggers="hover"
                  placement="right"
                > 
                  According to our analysis based on the app features and its data collection/sharing behaviors, the security and privacy assessment of the app is <b>{{ comment.sentimentLevel }}</b>
                </b-popover>

                <b-popover
                  :target="'permission-popover' + index"
                  triggers="hover"
                  placement="right"
                >
                  According to our analysis based on the static analysis, the app requires 
                  <span
                    v-for="(sentence, index1) in comment.permissions"
                    :key="index1"
                  ><b>{{ sentence }}</b>{{ index1 === comment.permissions.length - 1 ? "." : ", " }}
                  </span>
                </b-popover>
        

                <b-popover
                  :target="'data-collection-item-popover' + index"
                  triggers="hover"
                  placement="right"
                >
                  According to our analysis based on the static analysis, the app collects
                  <span
                    v-for="(sentence, index1) in comment.dataItems"
                    :key="index1"
                  ><b>{{ sentence }}</b>{{ index1 === comment.dataItems.length - 1 ? "." : ", " }}
                  </span>
                </b-popover>

                <b-popover
                  :target="'data-collection-item-popover-2' + index"
                  triggers="hover"
                  placement="right"
                >
                  According to our analysis based on the static analysis, the app collects
                  <span
                    v-for="(sentence, index1) in comment.dataItems"
                    :key="index1"
                  ><b>{{ sentence }}</b>{{ index1 === comment.dataItems.length - 1 ? "." : ", " }}
                  </span>
                </b-popover>

                <b-popover
                  :target="'purpose-popover' + index"
                  triggers="hover"
                  placement="right"
                >
                  According to our analysis based on the app privacy policy, the app collects user data for <span
                    v-for="(sentence, index1) in comment.purposes"
                    :key="index1"
                  ><b>{{ sentence }}</b>{{ index1 === comment.purposes.length - 1 ? "." : ", " }}
                  </span>
                </b-popover>

                <b-popover
                  :target="'purpose-popover-2' + index"
                  triggers="hover"
                  placement="right"
                >
                  According to our analysis based on the app privacy policy, the app collects user data for <span
                    v-for="(sentence, index1) in comment.purposes"
                    :key="index1"
                  ><b>{{ sentence }}</b>{{ index1 === comment.purposes.length - 1 ? "." : ", " }}
                  </span>
                </b-popover>
        
                <b-popover
                  :target="'third-party-popover' + index"
                  triggers="hover"
                  placement="right"
                >
                  According to our analysis based on the app privacy policy, the app share user data with <span
                    v-for="(sentence, index1) in comment.thirdParties"
                    :key="index1"
                  ><b>{{ sentence }}</b>{{ index1 === comment.thirdParties.length - 1 ? "." : ", " }}
                  </span></b-popover>

       
              </div>
              <div class="content-question">
                <div style="font-family: American-Typewriter-Regular;font-size: 18px"><b>Comment {{ index + 1 }}: </b>{{ comment.comment }}</div>
            
                <div class="mt-3 mb-2">Based on the analysis, we extract from the comments some security- and privacy-related features including privacy, permission, data collection.</div>
                <!-- security -->
                <ul
                  v-if="comment.isShowSecurityRail3"
                  style="list-style-type:disc"
                >
                  <li
                    class="ml-3"
                  >
                    Security 
                    <ul
                      class="ml-10"
                      style="list-style-type:circle"
                    >
                      <li
                        v-for="(sentence, index1) in comment.securitySentences"
                        :key="index1"
                        style="text-transform: capitalize;"
                      >
                        ...“{{ sentence }}”...
                      </li>   
                      <li><span 
                        :id="'security-popover' + index"
                      >Result: {{ (comment.sentiment * 100) }}% correct</span>
                      </li>
                    </ul>
                    <br>
                  </li>
                </ul>

                <!-- privacy -->
                <ul
                  v-if="comment.isShowPrivacyRail3"
                  style="list-style-type:disc"
                >
                  <li
                    class="ml-3"
                  >
                    Privacy 
                    <ul
                      class="ml-10"
                      style="list-style-type:circle"
                    >
                  
                      <li
                        v-for="(sentence, index1) in comment.privacySentences"
                        :key="index1"
                        style="text-transform: capitalize;"
                      >
                        ...“{{ sentence }}”...
                      </li> 
                  
                      <li><span 
                        :id="'privacy-popover' + index"
                      >Result: {{ (comment.sentiment * 100) }}% correct</span>
                      </li>
                    </ul>
                    <br>
                  </li>
                </ul>

                <!-- permission -->
                <ul
                  v-if="comment.isShowPermissionRail3 && comment.permissions.length"
                  style="list-style-type:disc"
                >
                  <li
                    class="ml-3"
                  >
                    Permission 
                    <ul
                      class="ml-10"
                      style="list-style-type:circle"
                    >
                      <li
                        v-for="(sentence, index1) in comment.permissions"
                        :key="index1"
                        style="text-transform: capitalize;"
                      >
                        ...“{{ sentence }}”...
                      </li> 
                      <li><span 
                        :id="'permission-popover' + index"
                      >Result: {{ (comment.permissionResult.$numberDecimal * 100).toFixed(0) }}% correct</span>
                      </li>
                    </ul>
                    <br>
                  </li>
                </ul>

                <ul
                  v-if="comment.isShowDataCollectionRail3"
                  style="list-style-type:disc"
                >
                  <li
                    class="ml-3"
                  >
                    Data collection  
                    <ul
                      class="ml-10"
                      style="list-style-type:circle"
                    >
                      <div v-if="comment.dataItems && comment.dataItems.length">
                        <li
                          style="text-transform: capitalize;"
                        >
                          Data Item:
                          <span
                            v-for="(sentence, index1) in comment.dataItems"
                            :key="index1"
                          >{{ sentence }}{{ index1 === comment.dataItems.length - 1 ? "." : ", " }}</span>
                        </li>  
                        <li><span :id="'data-collection-item-popover-2' + index">Result: {{ (comment.dataTypeResult.$numberDecimal * 100).toFixed(0) }}% correct</span></li>

                        <br>
                      </div>
                      
                      <div
                        v-if="comment.purposes && comment.purposes.length"
                      >
                        <li
                          style="text-transform: capitalize;"
                        >
                          Purpose:
                          <span
                            v-for="(sentence, index1) in comment.purposes"
                            :key="index1"
                          >{{ sentence }}{{ index1 === comment.purposes.length - 1 ? "." : ", " }}</span>
                    
                        </li>  
                        <li><span :id="'purpose-popover-2' + index">Result: {{ (comment.purposeResult.$numberDecimal * 100).toFixed(0) }}% correct</span></li>
                        <br>
                      </div>
                    </ul>
                  </li>
                </ul>

                <ul
                  v-if="comment.isShowDataCollectionRail3"
                  style="list-style-type:disc"
                >
                  <li
                    class="ml-3"
                  >
                    Data sharing  
                    <ul
                      class="ml-10"
                      style="list-style-type:circle"
                    >

                      <div v-if="comment.dataItems && comment.dataItems.length">
                        <li
                          style="text-transform: capitalize;"
                        >
                          Data Item:
                          <span
                            v-for="(sentence, index1) in comment.dataItems"
                            :key="index1"
                          >{{ sentence }}{{ index1 === comment.dataItems.length - 1 ? "." : ", " }}</span>
                        </li>  
                        <li><span :id="'data-collection-item-popover-2' + index">Result: {{ (comment.dataTypeResult.$numberDecimal * 100).toFixed(0) }}% correct</span></li>

                        <br>
                      </div>

                      <div
                        v-if="comment.purposes && comment.purposes.length"
                      >
                        <li
                          style="text-transform: capitalize;"
                        >
                          Purpose:
                          <span
                            v-for="(sentence, index1) in comment.purposes"
                            :key="index1"
                          >{{ sentence }}{{ index1 === comment.purposes.length - 1 ? "." : ", " }}</span>
                    
                        </li>  
                        <li><span :id="'purpose-popover-2' + index">Result: {{ (comment.purposeResult.$numberDecimal * 100).toFixed(0) }}% correct</span></li>
                        <br>
                      </div>

                      <div v-if="comment.thirdParties && comment.thirdParties.length">
                        <li
                          style="text-transform: capitalize;"
                        > 
                          Third party:
                          <span
                            v-for="(sentence, index1) in comment.thirdParties"
                      
                            :key="index1"
                          >{{ sentence }}{{ index1 === comment.thirdParties.length - 1 ? "." : ", " }}</span>
                        </li>  
                        <li><span 
                          :id="'third-party-popover' + index"
                        >Result: {{ (comment.thirdPartyResult.$numberDecimal * 100).toFixed(0) }}% correct</span></li>
                      </div>
                     
                    </ul>
                    <br>
                  </li>
                </ul>
              </div>

              <div
                v-if="commentQuestions[index]"
                class="question"
              >
                <div>
                  <div>Do you agree with comment's validation provided above?</div>

                  <UIRadioGroup
                    v-model="commentQuestions[index].value"
                    :name="commentQuestions[index].name"
                    :options="questionOptions"
                  />
            
                  <div
                    v-if="commentQuestions[index].value === 2 || commentQuestions[index].value === 0"
                  >
                    <div class="mb-1"><b>Can you provide the part of the comment justifying your decision?</b></div>

                    <!-- Security -->
                    <div
                      v-if="comment.isShowSecurityRail3"
                      style="margin-left: 10px; margin-bottom: 10px"
                    >
                      <label
                        style="margin-bottom: 0px"
                        class="container-checkbox"
                      >Security
                        <input
                          v-if="commentQuestions[index].value === 2"
                          v-model="question12.value"
                          class="type-question"
                          type="checkbox"
                        >
                        <span
                          v-if="commentQuestions[index].value === 2"
                          class="checkmark"
                        />
                      </label>
                      <div style="margin-left: 35px">
                        <div>Invading Of Security</div>
                        Result: {{ (comment.sentiment.$numberDecimal * 100).toFixed(0) }}% correct

                        <div v-if="question12.value || question1.value === 0">
                          <div>Can you provide the related content from the comment?</div>
                          <div style="margin-left: 10px">Result: <input type="text"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Privacy -->
                    <div
                      v-if="comment.isShowPrivacyRail3"
                      style="margin-left: 10px; margin-bottom: 10px"
                    >
                      <label
                        style="margin-bottom: 0px"
                        class="container-checkbox"
                      >Privacy
                        <input
                          v-if="question1.value === 2"
                          v-model="question12.value"
                          class="type-question"
                          type="checkbox"
                        >
                        <span
                          v-if="question1.value === 2"
                          class="checkmark"
                        />
                      </label>
                      <div style="margin-left: 35px">
                        <div>Invading Of Privacy</div>
                        Result: {{ (comment.sentiment.$numberDecimal * 100).toFixed(0) }}% correct

                        <div v-if="question12.value || question1.value === 0">
                          <div>Can you provide the related content from the comment?</div>
                          <div style="margin-left: 10px">Result: <input type="text"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Permission -->
                    <div
                      v-if="comment.isShowPermissionRail3"
                      style="margin-left: 10px; margin-bottom: 10px"
                    >
                      <label
                        style="margin-bottom: 0px"
                        class="container-checkbox"
                      >Permission
                        <input
                          v-if="question1.value === 2"
                          v-model="question13.value"
                          class="type-question"
                          type="checkbox"
                        >
                        <span
                          v-if="question1.value === 2"
                          class="checkmark"
                        />
                      </label>
                      <div style="margin-left: 35px">
                        <div>Update: emailed support/developers and asked why they needed the location permission</div>
                        Result: {{ (comment.permissionResult.$numberDecimal * 100).toFixed(0) }}% correct

                        <div v-if="question13.value || question1.value === 0">
                          <div>Can you provide the related content from the comment?</div>
                          <div style="margin-left: 10px">Result: <input type="text"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Data collection -->
                    <div
                      v-if="comment.isShowDataCollectionRail3"
                      style="margin-left: 10px; margin-bottom: 10px"
                    >
                      <label
                        style="margin-bottom: 0px"
                        class="container-checkbox"
                      >Data collection
                        <input
                          v-if="question1.value === 2"
                          v-model="question14.value"
                          class="type-question"
                          type="checkbox"
                        >
                        <span
                          v-if="question1.value === 2"
                          class="checkmark"
                        />
                      </label>
                      <div style="margin-left: 35px">
                        Result: 50% correct

                        <div v-if="question14.value || question1.value === 0">
                          <div>Can you provide the related content from the comment?</div>
                          <div style="margin-left: 10px">Result: <input type="text"></div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

   
     
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
</template>


<script>
import { mapGetters } from 'vuex';
import UINextButton from '@/components/UINextButton.vue'
import UILoader from '@/components/UILoader.vue'
import UIRadioGroup from '@/components/UIRadioGroup.vue'
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
    UIRadioGroup,
    // UITextarea,
  },
  data: () => ({
    isLoading: true,
    question: null,
    questionOptions,
    question1Options,
    commentQuestions: {},
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
    },
    comments(comments) {

      this.commentQuestions = comments.reduce((acc, _, index) => {
        acc[index] = {
          name: `question${index}`,
          value: null,
        }

        return acc
      }, {})
    },
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