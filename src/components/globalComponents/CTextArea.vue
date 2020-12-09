<template>
  <ValidationProvider :name="name" :rules="rules" v-slot="{ errors }">
    <v-textarea
      :class="upperCase ? 'c-upper-case' : lowerCase ? 'c-lower-case' : null"
      v-model="model"
      :label="label"
      :placeholder="placeholder"
      outlined
      :dense="dense"
      :disabled="disabled"
      :readonly="readonly"
      :error-messages="errors && !disabled ? errors : null"
      :clearable="clearable"
      :counter="counter"
      :auto-grow="autoGrow"
      :rows="rows"
      @focus="changeCase"
      @blur="changeCase"
      :hide-details="hideDetails"
    ></v-textarea>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'CTextArea',
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    rows: {
      type: [String, Number],
      default: 3
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
    rules: {
      type: String,
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    hideDetails: {
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
    },
    autoGrow: {
      type: Boolean,
      default: true
    },
    upperCase: {
      type: Boolean,
      default: false
    },
    lowerCase: {
      type: Boolean,
      default: false
    },
    counter: {
      type: Number,
      default: null
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
  },
  methods: {
    changeCase () {
      if (this.model && (this.upperCase || this.lowerCase)) {
        this.model = this.upperCase ? this.model.toUpperCase() : this.model.toLowerCase()
      }
    }
  }
}
</script>

<style>
.c-upper-case input {
  text-transform: uppercase !important;
}

.c-lower-case input {
  text-transform: lowercase !important;
}
</style>
