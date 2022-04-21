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
          We are developing a tool for automatic analysis of comments provided by users on target apps. For this purpose, we need to collect human understanding of comments to be then matched with our analysis. The aim of this survey is indeed to collect your evaluation on a limited set of security & privacy-related comments (i.e., 100). In particular, we focus on comments that could be somehow regarding the data collection, data sharing, and needed permissions.
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
  data() {
    return {
      imgPaths: [
        require('@/assets/images/question1.png'),
        require('@/assets/images/question2.png'),
        require('@/assets/images/question3.png'),
        require('@/assets/images/question4.png'),
        require('@/assets/images/question6.png'),
      ], 
    }
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
    zoom(index) {
      window.open(this.imgPaths[index]);
    }
  }
};
</script>
<style>
.wrap-images{
  display: flex;
}
.image-item {
 margin: 0 15px; 
 position: relative;
}

.image-item:hover::after {
  content: "";
  position: absolute;
  background-color: black;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  opacity: 0.3;
}

.zoom-in{ 
  position: relative;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  cursor: pointer;
  z-index: 100;
}
</style>