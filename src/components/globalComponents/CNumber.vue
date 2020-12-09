<template>
  <ValidationProvider :name="name" :rules="rules" v-slot="{ errors }">
    <v-text-field
      v-model.number="model"
      type="number"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      :label="label"
      outlined
      :dense="dense"
      :disabled="disabled"
      :readonly="readonly"
      :error-messages="errors"
      :clearable="clearable"
      :suffix="suffix"
      persistent-hint
      :hint="hint"
    />
  </ValidationProvider>
</template>

<script>
export default {
  name: 'CNumber',
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    hint: {
      type: String,
      default: null
    },
    rules: {
      type: String,
      default: null
    },
    suffix: {
      type: String,
      default: null
    },
    step: {
      type: [String, Number],
      default: '0.1'
    },
    min: {
      type: [Number, String],
      default: null
    },
    max: {
      type: [Number, String],
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    model: null
  }),
  watch: {
    model: {
      handler (val) {
        this.$emit('input', (typeof val !== 'undefined') ? val : null)
      },
      immediate: false
    },
    value: {
      handler (val) {
        this.model = ((typeof val !== 'undefined') ? val : null)
      },
      immediate: true
    }
  }
}
</script>

<style scoped>

</style>
