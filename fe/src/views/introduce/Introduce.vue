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
          We are developing a tool for automatic analysis of comments provided by users on target apps. At this purpose, we need to collect human understanding of comments to be then matched with our analysis. The aim of this survey is indeed to collect your evaluation on a limited set of comments (i.e., 50). In particular, we focus on comments that could be in some how related to security/privacy features of apps.
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