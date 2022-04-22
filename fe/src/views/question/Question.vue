<template>
  <div>
    <UILoader v-if="isLoading" />

    <div>
      <h5
        class="text-center"
        style="text-transform: capitalize;"
      > <span class="pagingInfo"> <span style="color: #FF9800; font-size: 30px">{{ 1 }}</span> / {{ 100 }}</span></h5>
      <h3
        class="text-center"
        style="text-transform: capitalize;"
      >Security And Privacy Comments Evaluation</h3>

      <div
        class="mt-4 comment-content"
        style="font-size: 21px"
      ><b>Comment:</b> Do not use this app, it is full of scammers. All they want you to do is take their word for how great the room is send you some generic pictures and ask for your security deposit without getting to see the room. To contact anybody with any ads you have to do the paid subscription. Roomster will be very happy to charge your card every week but even if you uninstall the app they will continue to charge your card. you have to cancel the subscription through Google.</div>

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
            ><b>The comment discusses about:</b></div>
            
            <div class="ml-3">
              Security sentiment: an opinion of the user based on a feeling about the security issues of the apps.<br>
              <div class="ml-10">
                <b>No</b><br>
                + Related content:</div>
              <br>
            </div>

            <div class="ml-3">
              Privacy sentiment: an opinion of the user based on a feeling about the privacy issues of the apps.<br>
              <div class="ml-10">
                <b>No</b><br>
                + Related content:</div>
              <br>
            </div>
            
            <div class="ml-3">
              Permission: <b>No</b><br>
              <div class="ml-10">+ Name of permission:</div>
              <br>
            </div>

            <div class="ml-3">
              Data collection: <b>Yes</b><br>
              <div class="ml-10">+ Personal data: Yours card</div>
              <div class="ml-10">+ Purpose: Payment</div>
              <br>
            </div>

            <div class="ml-3">
              Data sharing: <b>Yes</b><br>
              <div class="ml-10">+ Personal data: Yours card</div>
              <div class="ml-10">+ Purpose: Payment</div>
              <div class="ml-10">+ Third party: Google</div>
              <br>
            </div>

            <div>
              <div>Is the result of our analysis similar to what you get from this comments?</div>

              <UIRadioGroup
                v-model="question1"
                name="question1"
                :options="questionOptions"
              />

              <div
                v-if="question1 == 0"
              >
                <div>Can you provide the correct answer?</div>
                <UITextarea
                  v-model="content"
                />
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

const questionOptions = [{label: 'Yes', value: 1}, {label: 'Partially', value: 2}, {label: 'No', value: 0} ]
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
    question1: '',
    content: '',
  }),
  computed: {
    ...mapGetters({
      
    })
  },
  watch: {
    
  },
  mounted() {
    // Promise.all([
    //   this.$store.dispatch(GET_QUESTIONS),
    //   this.$store.dispatch(GET_ANSWER),
    //   this.$store.dispatch(GET_USER_INFO),
    // ]).then(() => this.isLoading = false)
    this.isLoading = false
  },
  methods: {
    clearFormData() {
      
    },
    next(e) {
      e.preventDefault();
      this.$store.commit('setQuestionId', this.questionId  + 1)
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