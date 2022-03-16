<template>
  <div class="anwsers mt-2">
    <label
      v-for="option in options"
      :key="option.value"
      class="container-radio"
    >{{ option.label }}
      <input
        :name="name"
        class="type-question"
        type="radio"
        @change="$emit('input', option.value)"
      ><span class="checkmark" />
    </label>

    <!-- <label class="container-radio">No
      <input
        :name="name"
        class="type-question"
        type="radio"
        @change="$emit('input', 0)"
      ><span class="checkmark" />
    </label>

    <label class="container-radio">Maybe
      <input
        :name="name"
        class="type-question"
        type="radio"
        @change="$emit('input', 2)"
      ><span class="checkmark" />
    </label> -->
  </div>
</template>


<script>

export default ({
  props: {
    options: {
      type: Array,
      default: function () {
        return []
      },
    },
    name: {
      type: String,
      default: ""
    },
  },
  emits: ['input'],
  watch: {
    picked(data) {
      console.log(data)
    }
  }
})
</script>
