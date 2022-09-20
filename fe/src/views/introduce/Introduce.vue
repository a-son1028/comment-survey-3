<template>
  <div>
    <!-- ============= Short desc ============-->
    <div
      id="short-desc"
      class="mt-4"
    >
      <h3 class="title text-center">Project description</h3><!-- intro-->
      <div class="intro mt-3">
        <div class="intro-title text-underline font-weight-bold">Description:</div>
        <div class="intro-desc">
          We are developing a tool for the automatic analysis of comments provided by users on mobile apps. We need to collect your evaluation on a limited set of comments for 5 apps to evaluate this tool. In particular, we focus on comments that could be somehow related to the security and privacy features of the target apps. We are interested in detecting comments on the app's data collection, data sharing, and required permissions among these features.
        </div>
      </div>
    </div>
    <UINextButton @next="next" />
  </div>
</template>

<script>
import UINextButton from '@/components/UINextButton.vue'
import { UPDATE_INSTRUCTION } from '@/store/modules/user/action.type.js'

export default {
  components: {
    UINextButton
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    next() {
      this.$store.dispatch(UPDATE_INSTRUCTION)
        .then(() => {
          this.$router.push('/questions')
        })
    },
  }
};
</script>