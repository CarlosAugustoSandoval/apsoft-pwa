<template>
  <ValidationProvider :name="name" :rules="rules" v-slot="{ errors }">
    <v-radio-group
      v-model="model"
      :column="column"
      outlined
      :dense="dense"
      :disabled="disabled"
      :readonly="readonly"
      class="ma-0"
      :label="!column ? label : ''"
      hide-details
      :error="!!errors.length"
    >
      <label
        v-if="column"
        class="mb-1 v-messages__message"
        style="width: 100% !important; line-height: inherit !important; text-align: justify !important;"
      >
        {{ label }}
      </label>
      <template v-for="(radio, indexRadio) in items">
        <v-radio
          :key="`radio${indexRadio}`"
          class="ml-2"
          :class="classitempb"
          :value="radio[itemValue]"
        >
          <template v-slot:label>
            <div>
              {{ radio[itemText] }}
              <v-btn v-if="radio.help" icon dark color="blue" small @click.stop="$emit('click:help', radio)">
                <v-icon color="primary">mdi-help-circle</v-icon>
              </v-btn>
            </div>
          </template>
        </v-radio>
      </template>
      <v-divider class="mt-1 mb-0" v-if="divider"></v-divider>
    </v-radio-group>
    <div class="v-messages theme--light error--text" role="alert" v-if="errors.length">
      <div class="v-messages__wrapper">
        <div class="v-messages__message">
          {{ errors[0] }}
        </div>
      </div>
    </div>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'CRadio',
  props: {
    value: {
      type: [Number, String, Object, Array],
      default: null
    },
    label: {
      type: String,
      default: null
    },
    classitempb: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => []
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
      default: true
    },
    column: {
      type: Boolean,
      default: true
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
