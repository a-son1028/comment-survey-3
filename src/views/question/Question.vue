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

    <div class="mt-3"><b>Comment:</b> I don't understand why this app requires the all permission to add or modify calendar events ...</div>

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
          Please copy the related content to the text:
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

        <div 
          v-if="question1 === 0 || question1 === 2"
          class="if-no"
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
            <div class="ml-3">3.1. Does this comment mention the specific permission name?</div>
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

                <label class="container-checkbox">calendar
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
        </div>


        <!-- question 4 -->
        <div class="mt-2">
          <div class="ml-3">4. Does this comment mention the collected data item?</div>
          <UIRadioGroup
            v-model="question4"
            name="question4"
            :options="question4Options"
          />

          <!-- if 4 yes -->
          <div v-if="question4 === 1">
            <div class="ml-3">4.1. Does this comment mention the purpose of the data collection?</div>
            <UIRadioGroup
              v-model="question41"
              name="question41"
              :options="question4Options"
            />

            <!-- if 4.1 yes -->
            <div
              v-if="question41 === 1"
              class="if-yes"
            >
              Please select the related content to the text:
              <div class="anwsers">
                <label class="container-checkbox">tracking
                  <input
                    class="type-question"
                    type="checkbox"
                  >
                  <span class="checkmark" />
                </label>

                <label class="container-checkbox">analysis
                  <input
                    class="type-question"
                    type="checkbox"
                  >
                  <span class="checkmark" />
                </label>
              </div>
          
            </div>

            <!-- if 4.1 no -->
            <div 
              v-if="question41 === 0"
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

        <!-- question 5 -->
        <div class="mt-2">
          <div class="ml-3">5. Does this comment mention the shared data item?</div>
          <UIRadioGroup
            v-model="question5"
            name="question5"
            :options="question5Options"
          />

          <!-- if 5 yes -->
          <div v-if="question5 === 1">
            <div class="ml-3">5.1. Does this comment mention the purpose of data sharing?</div>
            <UIRadioGroup
              v-model="question51"
              name="question51"
              :options="question5Options"
            />

            <!-- if 5.1 yes -->
            <div
              v-if="question51 === 1"
              class="if-yes"
            >
              Please select the related content to the text:
              <div class="anwsers">
                <label class="container-checkbox">metrics
                  <input
                    class="type-question"
                    type="checkbox"
                  >
                  <span class="checkmark" />
                </label>

                <label class="container-checkbox">tranning
                  <input
                    class="type-question"
                    type="checkbox"
                  >
                  <span class="checkmark" />
                </label>

                <label class="container-checkbox">discovery
                  <input
                    class="type-question"
                    type="checkbox"
                  >
                  <span class="checkmark" />
                </label>
                
              </div>
          
            </div>

            <!-- if 5.1 no -->
            <div 
              v-if="question51 === 0"
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


        <!-- question 6 -->
        <div class="mt-2">
          <div class="ml-3">6. Does this comment mention the third party name?</div>
          <UIRadioGroup
            v-model="question6"
            name="question6"
            :options="question6Options"
          />

          <!-- if yes -->
          <div
            v-if="question6 === 1"
            class="if-yes"
          >
            Please copy the related content to the text:
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

        <!-- question 7 -->
        <div class="mt-2">
          <div class="ml-3">7. Does this comment mention the privacy assessment (e.g., the privacy is good)?</div>
          <UIRadioGroup
            v-model="question7"
            name="question7"
            :options="question7Options"
          />

          <!-- if yes -->
          <div
            v-if="question7 === 1"
            class="if-yes"
          >
            Please copy the related content to the text:
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
const question4Options = question3Options
const question5Options = question3Options
const question6Options = question1Options
const question7Options = question1Options

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
   question4: null,
   question41: null,
   question5: null,
   question51: null,
   question6: null,
   question7: null,
   question1Options,
   question2Options,
   question3Options,
   question4Options,
   question5Options,
   question6Options,
   question7Options
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