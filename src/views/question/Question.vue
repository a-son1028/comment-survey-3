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

    <div
      class="mt-3"
      style="font-size: 18px"
    ><b>Comment:</b> I don't understand why this app requires the all permission to add or modify calendar events ...</div>

    <div id="questions">

      <!-- question 1 -->
      <div class="mt-2">
        <div class="ml-3">1. Is this comment about the security and privacy issues of the app?</div>
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
          <div class="ml-3">2. What is the sentiment of the comment on security?</div>
          <UIRadioGroup
            v-model="question2"
            name="question2"
            :options="question2Options"
          />

          <!-- if 2 yes -->
          <div 
            v-if="question2 === 0 || question2 === 1 || question2 === 2"
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

        <!-- question 3 -->
        <div class="mt-2">
          <div class="ml-3">3. What is the sentiment of the comment on privacy?</div>
          <UIRadioGroup
            v-model="question3"
            name="question3"
            :options="question3Options"
          />

          <!-- if 3 yes -->
          <div 
            v-if="question3 === 0 || question3 === 1 || question3 === 2"
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


        <!-- question 4 -->
        <div class="mt-2">
          <div class="ml-3">4. Does this comment mention permissions required by the app?</div>
          <UIRadioGroup
            v-model="question4"
            name="question4"
            :options="question4Options"
          />

          <!-- if 4 yes -->
          <div v-if="question4 === 1">
            <div class="ml-3">4.1. Does the comment refer to any the specific permissions?</div>
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
          <div class="ml-3">5. Does this comment mention the collected data items?</div>
          <UIRadioGroup
            v-model="question5"
            name="question5"
            :options="question5Options"
          />

          <!-- if 5 yes -->
          <div v-if="question5 === 1">
            <div class="ml-3">5.1. Does it mention the purpose of data collection?</div>
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
          <div class="ml-3">6. Does this comment mention any sharing of data with third party?</div>
          <UIRadioGroup
            v-model="question6"
            name="question6"
            :options="question6Options"
          />

          <!-- if 6 yes -->
          <div
            v-if="question6 === 1"
            class="if-yes"
          >
            <div class="ml-3">6.1. Does it mention the purpose of data sharing?</div>
            <UIRadioGroup
              v-model="question61"
              name="question61"
              :options="question6Options"
            />

            <!-- if 6.1 yes -->
            <div
              v-if="question61 === 1"
              class="if-yes"
            >
              <div class="ml-3">6.2. Does the comment refer to any the specific third parties?</div>
              <UIRadioGroup
                v-model="question62"
                name="question62"
                :options="question6Options"
              />

              <!-- if yes -->
              <div
                v-if="question62 === 1"
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
        
              <!-- if 6.2 no -->
              <div 
                v-if="question62 === 0"
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


            <!-- if 6.1 no -->
            <div 
              v-if="question61 === 0"
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
      

    </div>


    <UINextButton />
  </div>
</template>


<script>
import UINextButton from '@/components/UINextButton.vue'
import UIRadioGroup from '@/components/UIRadioGroup.vue'

const question1Options = [{label: 'Yes', value: 1}, {label: 'No', value: 0}, {label: 'Maybe', value: 2}]
const question2Options = [{label: 'Positive', value: 1}, {label: 'Negative', value: 0}, {label: 'Neutral', value: 2}, {label: 'None', value: 3}]
const question3Options = question2Options
const question4Options = [{label: 'Yes', value: 1}, {label: 'No', value: 0}]
const question5Options = question4Options
const question6Options = question4Options

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
   question61: null,
   question62: null,
   question1Options,
   question2Options,
   question3Options,
   question4Options,
   question5Options,
   question6Options,
  }),
  watch: {
    question6() {
      this.question61 = null
      this.question62 = null
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