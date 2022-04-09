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
    
    <div class="mt-3">
      <h3 class="title text-center">Instruction</h3><!-- intro-->
      <div class="intro-desc"> 
        In this survey, you will have 50 questions that need to be completed. We have prepared 5 examples of questions, please follow these examples to take your survey.
      </div>

      <div class="wrap-images mt-5">
        <div class="image-item">
          <button
            class="zoom-in"
            @click="zoom(0)"
          >
            Click to zoom-in
          </button>
          <div class="shadow" />
          <img
            src="@/assets/images/question1.png"
            style="width:100%; min-height: 250px; max-height:300px"
          ></div>

        <div class="image-item">
          <button
            class="zoom-in"
            @click="zoom(1)"
          >
            Click to zoom-in
          </button>
          <div class="shadow" />
          <img
            src="@/assets/images/question2.png"
            style="width:100%; min-height: 250px; max-height:300px"
          ></div>

        <div class="image-item">
          <button
            class="zoom-in"
            @click="zoom(2)"
          >
            Click to zoom-in
          </button>
          <div class="shadow" />
          <img
            src="@/assets/images/question3.png"
            style="width:100%; min-height: 250px; max-height:300px"
          ></div>

        <div class="image-item">
          <button
            class="zoom-in"
            @click="zoom(3)"
          >
            Click to zoom-in
          </button>
          <div class="shadow" />
          <img
            src="@/assets/images/question4.png"
            style="width:100%; min-height: 250px; max-height:300px"
          ></div>


        <div class="image-item">
          <button
            class="zoom-in"
            @click="zoom(4)"
          >
            Click to zoom-in
          </button>
          <div class="shadow" />
          <img
            src="@/assets/images/question6.png"
            style="width:100%; min-height: 250px; max-height:300px"
          ></div>
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
      this.$router.push('/questions')
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