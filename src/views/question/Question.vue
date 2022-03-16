<template>
  <div>
    <h5
      class="text-center"
      style="text-transform: capitalize;"
    > <span class="pagingInfo"> <span style="color: #FF9800; font-size: 30px">1</span> / 50</span></h5>
    <h3
      class="text-center"
      style="text-transform: capitalize;"
    >Security And Privacy Comments Survey</h3>

    <div>The app requires all of permissions</div>

    <div id="questions">

      <!-- question 1 -->
      <div class="mt-2">
        <div class="ml-3">1. Does this comment include the information related to security and privacy issues?</div>
        <UIRadioGroup
          v-model="question1"
          name="question1"
          :options="question1Options"
        />

        <!-- if yes -->
        <div
          v-if="question1 === 1"
          class="if-yes"
        >
          Please select the related content to the text:
          <div class="anwsers">
            <label class="container-checkbox">security
              <input
                class="type-question"
                type="checkbox"
              >
              <span class="checkmark" />
            </label>

            <label class="container-checkbox">permission
              <input
                class="type-question"
                type="checkbox"
              >
              <span class="checkmark" />
            </label>
          </div>
          
        </div>

        <div 
          v-if="question1 === 0"
          class="if-no "
        >
          Please enter the reason:
          <div class="anwsers">
            <textarea
              id=""
              name="reason"
              cols="30"
              rows="5"
              style="width: 100%"
            />
          </div>
        </div>
          
      </div>

          
      <div v-if="question1 === 1">
        <!-- question 2 -->
        <div
          class="mt-2"
        >
          <div class="ml-3">2. What is the sentiment of the security and privacy-related comments?</div>
          <UIRadioGroup
            v-model="question2"
            name="question2"
            :options="question2Options"
          />
        </div>

        <!-- question 3 -->
        <div class="mt-2">
          <div class="ml-3">3. Does this comment mention the required permission?</div>
          <UIRadioGroup
            v-model="question3"
            name="question3"
            :options="question3Options"
          />

          <!-- if 3 yes -->
          <div v-if="question3 === 1">
            <div class="ml-3">3.1. Does this comment mention the required permission?</div>
            <UIRadioGroup
              v-model="question31"
              name="question31"
              :options="question3Options"
            />

            <!-- if 3.1 yes -->
            <div
              v-if="question31 === 1"
              class="if-yes"
            >
              Please select the related content to the text:
              <div class="anwsers">
                <label class="container-checkbox">camera
                  <input
                    class="type-question"
                    type="checkbox"
                  >
                  <span class="checkmark" />
                </label>

                <label class="container-checkbox">notification
                  <input
                    class="type-question"
                    type="checkbox"
                  >
                  <span class="checkmark" />
                </label>
              </div>
          
            </div>

            <!-- if 3.1 no -->
            <div 
              v-if="question31 === 0"
              class="if-no "
            >
              Please enter the reason:
              <div class="anwsers">
                <textarea
                  id=""
                  name="reason"
                  cols="30"
                  rows="5"
                  style="width: 100%"
                />
              </div>
            </div> 
          
          </div>
          
          <!-- if 3 no -->
          <div 
            v-if="question3 === 0"
            class="if-no "
          >
            Please enter the reason:
            <div class="anwsers">
              <textarea
                id=""
                name="reason"
                cols="30"
                rows="5"
                style="width: 100%"
              />
            </div>
          </div> 
        </div>
      </div>
      

    </div>


    <UINextButton />
  </div>
</template>


<script>
import UINextButton from '@/components/UINextButton.vue'
import UIRadioGroup from '@/components/UIRadioGroup.vue'

const question1Options = [{label: 'Yes', value: 1}, {label: 'No', value: 0}, {label: 'Maybe', value: 2}]
const question2Options = [{label: 'Positive', value: 1}, {label: 'Negative', value: 0}, {label: 'Neutral', value: 2}]
const question3Options = [{label: 'Yes', value: 1}, {label: 'No', value: 0}]
export default {
  components: {
    UINextButton,
    UIRadioGroup
  },
  data: () => ({
   question1: null,
   question2: null,
   question3: null,
   question31: null,
   question1Options,
   question2Options,
   question3Options
  }),
  watch: {
    question1(data) {
      console.log(data)
    }
  },
  mounted() {
  },
  methods: {
    next() {
      this.$router.push('/questions')
    }
  }
};
</script>