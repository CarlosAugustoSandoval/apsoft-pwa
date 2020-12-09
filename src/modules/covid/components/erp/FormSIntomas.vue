<template>
  <v-row>
    <v-col class="pb-0" cols="12">
      <v-card outlined tile>
        <v-card-text>
          <c-check
            v-model="losSintomas"
            label="SÍNTOMAS: Preguntar al paciente sobre los siguientes síntomas, es caso de estudio al presentar más de dos a la vez en los últimos 14 dias."
            :rules="sinSintomas ? '' : 'required'"
            name="riesgo por síntomas"
            :items="sintomas ? sintomas.filter(x => x.aplica_covid && x.solicita_fecha) : []"
            item-text="descripcion"
            item-value="id"
            :disabled="sinSintomas"
          />
          <v-checkbox
            class="mt-1 ml-2"
            v-model="sinSintomas"
            label="Ninguna de las anteriores"
            hide-details
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col class="pb-0" cols="12" v-if="losSintomas.length && !sinSintomas">
      <v-label>Fecha en la que comenzaron los síntomas</v-label>
      <c-date
        v-model="laFecha"
        rules="required"
        placeholder="Fecha síntomas"
        name="fecha síntomas"
        :max="moment().format('YYYY-MM-DD')"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FormSIntomas',
  props: {
    arraySintomas: {
      type: [Array, String, Number, Boolean],
      default: () => []
    },
    fechaSintomas: {
      type: String,
      default: null
    }
  },
  data: () => ({
    sinSintomas: false,
    losSintomas: [],
    laFecha: null
  }),
  computed: {
    ...mapGetters([
      'sintomas'
    ])
  },
  watch: {
    arraySintomas: {
      handler (val) {
        this.losSintomas = val
      },
      immediate: true
    },
    fechaSintomas: {
      handler (val) {
        this.laFecha = val
      },
      immediate: true
    },
    sinSintomas: {
      handler (val) {
        if (val) {
          this.$emit('changeSintomas', [])
          this.$emit('changeFecha', null)
        }
      },
      immediate: false
    },
    laFecha: {
      handler (val) {
        this.$emit('changeFecha', val)
      },
      immediate: false
    },
    losSintomas: {
      handler (val) {
        this.$emit('changeSintomas', val)
      },
      immediate: false
    }
  }
}
</script>

<style scoped>

</style>
