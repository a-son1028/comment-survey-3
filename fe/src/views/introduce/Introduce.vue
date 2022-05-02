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
          We are developing a tool for automatic analysis of comments provided by users on mobile apps. To evaluate this tool, we need to collect your evaluation on a limited set of comments (i.e., 50). In particular, we focus on comments that could be somehow related to security and privacy features of the target apps. Among these features, we are interested to detect comments on app's data collection, data sharing, and required permissions.
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