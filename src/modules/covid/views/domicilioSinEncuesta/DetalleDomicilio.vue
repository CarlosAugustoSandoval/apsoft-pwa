<template>
  <div class="overflow-hidden">
    <v-card>
      <v-window :value="window">
        <v-window-item :value="0">
          <detalle v-if="domicilio" :domicilio="domicilio" />
        </v-window-item>
      </v-window>
    </v-card>
    <footer-app>
      <v-btn
        v-if="domicilio && domicilio.status === 1"
        color="primary"
        dark
        absolute
        top
        right
        fab
        @click="visitarDomicilio"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-bottom-navigation
        v-model="window"
        color="primary"
      >
        <v-btn>
          <span>Detalle Domicilio</span>
          <v-icon>mdi-home-map-marker</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </footer-app>
    <registro-visita
      ref="registroVisita"
      @guardado="getdomicilio"
    />
  </div>
</template>

<script>
import RegistroVisita from '@/modules/covid/components/domicilioSinEncuesta/RegistroVisita'
import Detalle from '@/modules/covid/views/domicilioSinEncuesta/detalleDomicilio/Detalle'
export default {
  name: 'DetalleDomicilio',
  components: {
    Detalle,
    RegistroVisita
  },
  props: {
    idd: {
      type: [Number, String],
      default: null
    }
  },
  data: () => ({
    window: 0,
    loading: false,
    domicilio: null
  }),
  created () {
    this.$store.commit('SET_GOBACK', { name: 'DomicilioSinEncuesta' })
    this.$store.commit('SET_ASSIGN_DB_COMPLEMENTOS')
    this.getdomicilio()
  },
  methods: {
    async getdomicilio () {
      this.loading = true
      this.$store.dispatch('obtenerDomicilio', this.idd).then(domicilio => {
        if (domicilio) {
          this.domicilio = domicilio
        }
        this.loading = false
      })
    },
    visitarDomicilio () {
      this.$refs.registroVisita.open(this.domicilio)
    }
  }
}
</script>

<style scoped>

</style>
