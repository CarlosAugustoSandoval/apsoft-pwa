<template>
  <div>
    <v-list class="py-0" v-if="nexo">
      <v-subheader>Información del Nexo</v-subheader>
      <v-list-item class="px-0">
        <v-list-item-avatar class="mr-1" color="orange">
          <v-icon dark>
            mdi-{{nexo.sexo ? nexo.sexo === 'M' ? 'face' : 'face-woman' : 'account-question'}}
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content class="px-0">
          <v-list-item-title>{{ nexo.nombres }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ [(nexo.edad ? `${nexo.edad} Año${nexo.edad === 1 ? '' : 's'}` : null), nexo.celular ? `Celular: ${nexo.celular}` : null].filter(x => x).join(', ') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0">
        <v-list-item-content class="px-0">
          <v-list-item-subtitle>Parentesco</v-list-item-subtitle>
          <v-list-item-title>{{parentescos && parentescos.length && nexo.parentesco_id ? parentescos.find(x => x.id === nexo.parentesco_id).descripcion : ''}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0">
        <v-list-item-content class="px-0">
          <v-list-item-subtitle>Ubicación</v-list-item-subtitle>
          <p class="ma-0">{{ [municipio && municipio.nombre, departamento && departamento.nombre, nexo.direccion].filter(x => x).join(', ') }}</p>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0">
        <v-list-item-content class="px-0">
          <v-list-item-subtitle>Presupuesto Comun</v-list-item-subtitle>
          <p class="ma-0 font-weight-bold" :class="`${nexo.PresupuestoComun !== null ? nexo.PresupuestoComun === 1 ? 'green' : 'orange' : 'red'}--text`">{{ nexo.PresupuestoComun !== null ? nexo.PresupuestoComun === 1 ? 'SI' : 'NO' : 'No registra' }}</p>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0">
        <v-list-item-content class="px-0">
          <v-list-item-subtitle>EPS</v-list-item-subtitle>
          <p class="ma-0">{{ epss && epss.length && nexo.eps_id ? epss.find(x => x.id === nexo.eps_id).nombre : 'No registra' }}</p>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0">
        <v-list-item-content class="px-0">
          <v-list-item-subtitle>Observaciones</v-list-item-subtitle>
          <p class="ma-0">{{ nexo.observaciones }}</p>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Detalle',
  props: {
    encuesta: {
      type: Object,
      default: null
    },
    nexo: {
      type: Object,
      default: null
    }
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters([
      'parentescos',
      'epss',
      'departamentos'
    ]),
    departamento () {
      return (this.nexo && this.departamentos && this.departamentos.length && this.nexo.departamento_id && this.departamentos.find(x => x.id === this.nexo.departamento_id)) || null
    },
    municipio () {
      return (this.nexo && this.departamento && this.departamento.municipios && this.departamento.municipios.length && this.nexo.municipio_id && this.departamento.municipios.find(x => x.id === this.nexo.municipio_id)) || null
    }
  },
  methods: {
    editarEncuesta () {
      this.$refs.registroERP.open(JSON.parse(JSON.stringify(this.encuesta)))
    },
    async getencuesta () {
      this.loading = true
      this.$store.dispatch('obtenerERP', this.idd).then(encuesta => {
        if (encuesta) {
          this.encuesta = encuesta
          this.nexo = this.encuesta.nexos[this.index]
        }
        this.loading = false
      })
    },
    crearNexo () {
      this.$refs.registroNexo.open(this.encuesta)
    }
  }
}
</script>

<style scoped>

</style>
