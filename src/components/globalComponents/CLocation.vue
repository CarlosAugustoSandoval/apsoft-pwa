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
    >
      <template v-slot:append>
        <v-fade-transition leave-absolute>
          <v-progress-circular
            v-if="loadingLocation"
            size="24"
            color="info"
            indeterminate
          ></v-progress-circular>
          <v-icon v-else color="indigo" @click.stop="getLocation">mdi-map-marker-right</v-icon>
        </v-fade-transition>
      </template>
    </v-text-field>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'CLocation',
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
      default: false
    }
  },
  data: () => ({
    model: null,
    loadingLocation: false
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
    getLocation () {
      if (navigator.geolocation) {
        this.loadingLocation = true
        navigator.geolocation.getCurrentPosition(objPosition => {
          setTimeout(() => {
            this.model = `${objPosition.coords.latitude}, ${objPosition.coords.longitude}`
            this.loadingLocation = false
          }, 1000)
        }, objPositionError => {
          let message = ''
          switch (objPositionError.code) {
            case objPositionError.PERMISSION_DENIED:
              message = 'No se ha permitido el acceso a la posición del usuario.'
              break
            case objPositionError.POSITION_UNAVAILABLE:
              message = 'No se ha podido acceder a la información de su posición.'
              break
            case objPositionError.TIMEOUT:
              message = 'El servicio ha tardado demasiado tiempo en responder.'
              break
            default:
              message = 'Error desconocido.'
          }
          setTimeout(() => {
            this.$store.commit('SET_SNACKBAR', { color: 'error', message: message })
            this.loadingLocation = false
          }, 1000)
        }, {
          maximumAge: 75000,
          timeout: 15000
        })
      } else {
        this.$store.commit('SET_SNACKBAR', {
          color: 'warning',
          message: 'Su navegador no soporta la API de geolocalización.'
        })
      }
    }
  }
}
</script>

<style>

</style>
