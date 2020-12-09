<template>
  <ValidationProvider :name="name" :rules="rules" v-slot="{ errors }">
    <v-radio-group class="ma-0" v-if="label">
      <label
        class="mb-1 v-messages__message"
        style="width: 100% !important; line-height: inherit !important; text-align: justify !important;"
      >
        {{ label }}
      </label>
    </v-radio-group>
    <template v-for="(check, indexCheck) in items">
      <v-checkbox
        :key="`check${indexCheck}`"
        class="ml-2 mt-0 mb-3"
        v-model="model"
        :true-value="trueValue"
        :false-value="falseValue"
        :value="check[itemValue] || check"
        :label="check[itemText] || check"
        :disabled="disabled"
        :readonly="readonly"
        :error="!!errors.length"
        hide-details
        @change="$emit('change')"
      ></v-checkbox>
    </template>
    <div class="v-messages theme--light error--text" role="alert" v-if="errors.length && !disabled">
      <div class="v-messages__wrapper">
        <div class="v-messages__message">
          {{ errors[0] }}
        </div>
      </div>
    </div>
    <v-divider class="mt-1 mb-0" v-if="divider"></v-divider>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'CCheck',
  props: {
    value: {
      type: [Number, String, Object, Array],
      default: null
    },
    label: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default: () => []
    },
    trueValue: {
      type: [String, Number],
      default: 1
    },
    falseValue: {
      type: [String, Number],
      default: 0
    },
    itemValue: {
      type: String,
      default: null
    },
    itemText: {
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
    disabled: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    divider: {
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
