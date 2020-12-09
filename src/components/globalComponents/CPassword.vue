<template>
    <ValidationProvider :name="name" :vid="vid" :rules="rules" v-slot="{ errors }">
        <v-text-field
                v-model="model"
                :label="label"
                :placeholder="placeholder"
                :outlined="outlined"
                :dense="dense"
                :disabled="disabled"
                :readonly="readonly"
                :error-messages="errors"
                :clearable="clearable"
                :counter="counter"
                persistent-hint
                :hint="hint"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
        ></v-text-field>
    </ValidationProvider>
</template>

<script>
export default {
  name: 'CPassword',
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
    vid: {
      type: String,
      default: null
    },
    rules: {
      type: String,
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: true
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
      default: true
    },
    counter: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    showPassword: false,
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

<style>

</style>
