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
          <div>The main purpose of this survey is that we want to validate the security- and privacy-related comments. We will design and develop a tool to validate these comments automatically. In particular, we will compare the comment’s content with the actual behavior of the apps (i.e., data collection, data sharing, permission, third party, etc).</div>
          <br>
          <div>In this survey, we want to collect and analyse the security- and privacy-related comments. The participant will answer the question of 50 comments.</div>
        </div>
      </div>
    </div>
        
    <UINextButton @next="next" />
  </div>
</template>

<script>
import UINextButton from '@/components/UINextButton.vue'
export default {
  components: {
    UINextButton
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