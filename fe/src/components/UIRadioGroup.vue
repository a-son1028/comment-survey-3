<template>
  <div
    class="anwsers mt-2"
    style="display: flex;"
  >
    <label
      v-for="option in options"
      :key="option.value"
      class="container-radio"
      style="margin-right: 25px"
    >{{ option.label }}
      <input
        :name="name"
        class="type-question"
        type="radio"
        v-bind="{
          ...(required === 'true' && {required: true}),
          ...(value == option.value && { checked: true})
        }"

        @change="$emit('input', option.value)"
      ><span class="checkmark" />
    </label>
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
    value: {
      type: [Number, String],
      default: null
    },
    required: {
      type: String,
      default: "true"
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
