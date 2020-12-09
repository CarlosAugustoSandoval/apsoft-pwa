<template>
  <ValidationProvider :name="name" :rules="rules" v-slot="{ errors }">
    <v-text-field
      ref="refIdentificacion"
      v-model="model"
      :label="label"
      outlined
      :dense="dense"
      :disabled="disabled"
      :readonly="readonly"
      :error-messages="errors"
      :clearable="clearable"
      :counter="counter"
      :append-icon="model && esMovil ? 'mdi-magnify' : ''"
      @click:append="enter"
      @keyup.enter="enter"
      :loading="loading"
      :hint="model ? !esMovil ? 'Enter para verificar' : 'Touch en lupa para verificar': ''"
    ></v-text-field>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'CIdentificacion',
  props: {
    value: {
      type: String,
      default: null
    },
    label: {
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
    clearable: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: false
    },
    counter: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    model: null,
    loading: false
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
    enter () {
      if (this.model) {
        this.$emit('keyup')
        this.loading = true
        this.$store.dispatch('searchAfiliadoIdentidad', this.model)
          .then(response => {
            this.$emit('responsepersona', (typeof response !== 'undefined') ? response : null)
            this.loading = false
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
